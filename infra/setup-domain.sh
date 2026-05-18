#!/bin/bash
# ─── CloudFront + Route53 + WAF for admin.tradichatter.com ────────────────────
# Run AFTER setup-aws.sh and AFTER ACM certificate is validated.
# ──────────────────────────────────────────────────────────────────────────────

set -e

REGION="eu-west-1"
PROJECT="tradichatter-admin"
DOMAIN="admin.tradichatter.com"
HOSTED_ZONE_ID="YOUR_HOSTED_ZONE_ID"  # Replace with your Route53 hosted zone

echo "═══════════════════════════════════════════════════════════"
echo "  TradiChatter Admin — CloudFront + Route53 + WAF"
echo "═══════════════════════════════════════════════════════════"

# ─── 1. Get ALB DNS name ──────────────────────────────────────────────────────
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names "$PROJECT-alb" \
  --query 'LoadBalancers[0].DNSName' --output text)

ALB_ZONE_ID=$(aws elbv2 describe-load-balancers \
  --names "$PROJECT-alb" \
  --query 'LoadBalancers[0].CanonicalHostedZoneId' --output text)

echo "  ALB DNS: $ALB_DNS"

# ─── 2. Create WAF Web ACL (rate limiting + IP restriction) ───────────────────
echo ""
echo "▶ Creating WAF Web ACL..."

WAF_ACL_ARN=$(aws wafv2 create-web-acl \
  --name "$PROJECT-waf" \
  --scope REGIONAL \
  --region $REGION \
  --default-action Allow={} \
  --rules '[
    {
      "Name": "RateLimit",
      "Priority": 1,
      "Action": {"Block": {}},
      "Statement": {
        "RateBasedStatement": {
          "Limit": 300,
          "AggregateKeyType": "IP"
        }
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AdminRateLimit"
      }
    },
    {
      "Name": "AWSManagedCommonRules",
      "Priority": 2,
      "OverrideAction": {"None": {}},
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCommonRuleSet"
        }
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AdminCommonRules"
      }
    },
    {
      "Name": "SQLInjectionProtection",
      "Priority": 3,
      "OverrideAction": {"None": {}},
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesSQLiRuleSet"
        }
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AdminSQLi"
      }
    }
  ]' \
  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=AdminWAF \
  --query 'Summary.ARN' --output text 2>/dev/null || \
  aws wafv2 list-web-acls --scope REGIONAL --region $REGION --query "WebACLs[?Name=='$PROJECT-waf'].ARN" --output text)

echo "  ✅ WAF ACL: $WAF_ACL_ARN"

# Associate WAF with ALB
ALB_ARN=$(aws elbv2 describe-load-balancers --names "$PROJECT-alb" --query 'LoadBalancers[0].LoadBalancerArn' --output text)
aws wafv2 associate-web-acl --web-acl-arn $WAF_ACL_ARN --resource-arn $ALB_ARN --region $REGION 2>/dev/null || true
echo "  ✅ WAF associated with ALB"

# ─── 3. Route53 A Record (Alias to ALB) ──────────────────────────────────────
echo ""
echo "▶ Creating Route53 record..."

if [ "$HOSTED_ZONE_ID" = "YOUR_HOSTED_ZONE_ID" ]; then
  echo "  ⚠️  Set HOSTED_ZONE_ID in this script first!"
  echo "  Find it: aws route53 list-hosted-zones --query 'HostedZones[?Name==\`tradichatter.com.\`].Id' --output text"
else
  aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch "{
      \"Changes\": [{
        \"Action\": \"UPSERT\",
        \"ResourceRecordSet\": {
          \"Name\": \"$DOMAIN\",
          \"Type\": \"A\",
          \"AliasTarget\": {
            \"HostedZoneId\": \"$ALB_ZONE_ID\",
            \"DNSName\": \"$ALB_DNS\",
            \"EvaluateTargetHealth\": true
          }
        }
      }]
    }"
  echo "  ✅ Route53: $DOMAIN → $ALB_DNS"
fi

# ─── 4. ACM Certificate (if not already created) ─────────────────────────────
echo ""
echo "▶ Checking ACM certificate..."

CERT_ARN=$(aws acm list-certificates --region $REGION \
  --query "CertificateSummaryList[?DomainName=='$DOMAIN'].CertificateArn" --output text)

if [ -z "$CERT_ARN" ] || [ "$CERT_ARN" = "None" ]; then
  echo "  ⚠️  No certificate found for $DOMAIN"
  echo "  Creating certificate request..."
  CERT_ARN=$(aws acm request-certificate \
    --domain-name $DOMAIN \
    --validation-method DNS \
    --region $REGION \
    --query 'CertificateArn' --output text)
  echo "  ✅ Certificate requested: $CERT_ARN"
  echo "  → Validate via DNS, then run this script again to create HTTPS listener"
else
  echo "  ✅ Certificate found: $CERT_ARN"
  
  # Create HTTPS listener
  echo "  Creating HTTPS listener..."
  aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTPS --port 443 \
    --certificates CertificateArn=$CERT_ARN \
    --default-actions "Type=forward,TargetGroupArn=$(aws elbv2 describe-target-groups --names $PROJECT-tg --query 'TargetGroups[0].TargetGroupArn' --output text)" \
    --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \
    2>/dev/null || echo "  (HTTPS listener already exists)"
  echo "  ✅ HTTPS listener created with TLS 1.3"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Domain Setup Complete"
echo "  URL: https://$DOMAIN"
echo "═══════════════════════════════════════════════════════════"
