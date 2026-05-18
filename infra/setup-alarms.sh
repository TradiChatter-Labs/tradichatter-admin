#!/bin/bash
# ─── CloudWatch Alarms for Admin Portal ───────────────────────────────────────
# Creates alarms that notify via SNS when things go wrong.
# ──────────────────────────────────────────────────────────────────────────────

set -e

REGION="eu-west-1"
PROJECT="tradichatter-admin"
SNS_TOPIC_ARN="arn:aws:sns:$REGION:$(aws sts get-caller-identity --query Account --output text):tradichatter-admin-alerts"

# Create SNS topic
aws sns create-topic --name "tradichatter-admin-alerts" --region $REGION 2>/dev/null || true
echo "  ✅ SNS Topic created"
echo "  → Subscribe your email: aws sns subscribe --topic-arn $SNS_TOPIC_ARN --protocol email --notification-endpoint your@email.com"

# ─── ECS CPU Alarm ────────────────────────────────────────────────────────────
aws cloudwatch put-metric-alarm \
  --alarm-name "$PROJECT-high-cpu" \
  --alarm-description "Admin portal CPU > 80% for 5 minutes" \
  --namespace "AWS/ECS" \
  --metric-name CPUUtilization \
  --dimensions Name=ClusterName,Value=$PROJECT-cluster Name=ServiceName,Value=$PROJECT-service \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions $SNS_TOPIC_ARN \
  --region $REGION

echo "  ✅ CPU alarm created (>80%)"

# ─── ECS Memory Alarm ─────────────────────────────────────────────────────────
aws cloudwatch put-metric-alarm \
  --alarm-name "$PROJECT-high-memory" \
  --alarm-description "Admin portal memory > 85% for 5 minutes" \
  --namespace "AWS/ECS" \
  --metric-name MemoryUtilization \
  --dimensions Name=ClusterName,Value=$PROJECT-cluster Name=ServiceName,Value=$PROJECT-service \
  --statistic Average \
  --period 300 \
  --threshold 85 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions $SNS_TOPIC_ARN \
  --region $REGION

echo "  ✅ Memory alarm created (>85%)"

# ─── ALB 5xx Errors ──────────────────────────────────────────────────────────
ALB_SUFFIX=$(aws elbv2 describe-load-balancers --names "$PROJECT-alb" \
  --query 'LoadBalancers[0].LoadBalancerArn' --output text | sed 's/.*loadbalancer\///')

aws cloudwatch put-metric-alarm \
  --alarm-name "$PROJECT-5xx-errors" \
  --alarm-description "Admin portal 5xx errors > 10 in 5 minutes" \
  --namespace "AWS/ApplicationELB" \
  --metric-name HTTPCode_Target_5XX_Count \
  --dimensions Name=LoadBalancer,Value=$ALB_SUFFIX \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions $SNS_TOPIC_ARN \
  --treat-missing-data notBreaching \
  --region $REGION

echo "  ✅ 5xx alarm created (>10 errors)"

# ─── Unhealthy Targets ────────────────────────────────────────────────────────
TG_SUFFIX=$(aws elbv2 describe-target-groups --names "$PROJECT-tg" \
  --query 'TargetGroups[0].TargetGroupArn' --output text | sed 's/.*://')

aws cloudwatch put-metric-alarm \
  --alarm-name "$PROJECT-unhealthy-targets" \
  --alarm-description "Admin portal has unhealthy targets" \
  --namespace "AWS/ApplicationELB" \
  --metric-name UnHealthyHostCount \
  --dimensions Name=TargetGroup,Value=targetgroup/$PROJECT-tg/$TG_SUFFIX Name=LoadBalancer,Value=$ALB_SUFFIX \
  --statistic Maximum \
  --period 60 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --evaluation-periods 3 \
  --alarm-actions $SNS_TOPIC_ARN \
  --region $REGION

echo "  ✅ Unhealthy targets alarm created"

# ─── Service Running Count ────────────────────────────────────────────────────
aws cloudwatch put-metric-alarm \
  --alarm-name "$PROJECT-no-running-tasks" \
  --alarm-description "Admin portal has 0 running tasks" \
  --namespace "AWS/ECS" \
  --metric-name RunningTaskCount \
  --dimensions Name=ClusterName,Value=$PROJECT-cluster Name=ServiceName,Value=$PROJECT-service \
  --statistic Minimum \
  --period 60 \
  --threshold 1 \
  --comparison-operator LessThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions $SNS_TOPIC_ARN \
  --region $REGION

echo "  ✅ Zero tasks alarm created"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ All alarms created"
echo "  Subscribe to alerts: aws sns subscribe --topic-arn $SNS_TOPIC_ARN --protocol email --notification-endpoint <your-email>"
echo "═══════════════════════════════════════════════════════════"
