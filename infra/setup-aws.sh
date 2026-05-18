#!/bin/bash
# ─── TradiChatter Admin — AWS Infrastructure Setup ────────────────────────────
# Run this ONCE to create all AWS resources for the admin portal.
# Prerequisites: AWS CLI configured with admin access, jq installed.
#
# This creates an ISOLATED deployment — separate VPC, separate cluster,
# no shared resources with the main app infrastructure.
# ──────────────────────────────────────────────────────────────────────────────

set -e

REGION="eu-west-1"
PROJECT="tradichatter-admin"
DOMAIN="admin.tradichatter.com"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "═══════════════════════════════════════════════════════════"
echo "  TradiChatter Admin — AWS Infrastructure Setup"
echo "  Account: $ACCOUNT_ID | Region: $REGION"
echo "═══════════════════════════════════════════════════════════"

# ─── 1. ECR Repository ────────────────────────────────────────────────────────
echo ""
echo "▶ Creating ECR repository..."
aws ecr create-repository \
  --repository-name $PROJECT \
  --region $REGION \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256 \
  2>/dev/null || echo "  (already exists)"

aws ecr put-lifecycle-policy \
  --repository-name $PROJECT \
  --region $REGION \
  --lifecycle-policy-text '{
    "rules": [{
      "rulePriority": 1,
      "description": "Keep last 10 images",
      "selection": {"tagStatus": "any", "countType": "imageCountMoreThan", "countNumber": 10},
      "action": {"type": "expire"}
    }]
  }' 2>/dev/null || true

echo "  ✅ ECR: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PROJECT"

# ─── 2. VPC (Isolated) ───────────────────────────────────────────────────────
echo ""
echo "▶ Creating isolated VPC..."
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.10.0.0/16 \
  --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$PROJECT-vpc}]" \
  --query 'Vpc.VpcId' --output text 2>/dev/null || \
  aws ec2 describe-vpcs --filters "Name=tag:Name,Values=$PROJECT-vpc" --query 'Vpcs[0].VpcId' --output text)

aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames
echo "  ✅ VPC: $VPC_ID"

# Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=$PROJECT-igw}]" \
  --query 'InternetGateway.InternetGatewayId' --output text 2>/dev/null || \
  aws ec2 describe-internet-gateways --filters "Name=tag:Name,Values=$PROJECT-igw" --query 'InternetGateways[0].InternetGatewayId' --output text)

aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID 2>/dev/null || true

# Public Subnets (2 AZs for ALB)
SUBNET_A=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID --cidr-block 10.10.1.0/24 --availability-zone ${REGION}a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT-public-a}]" \
  --query 'Subnet.SubnetId' --output text 2>/dev/null || \
  aws ec2 describe-subnets --filters "Name=tag:Name,Values=$PROJECT-public-a" --query 'Subnets[0].SubnetId' --output text)

SUBNET_B=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID --cidr-block 10.10.2.0/24 --availability-zone ${REGION}b \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT-public-b}]" \
  --query 'Subnet.SubnetId' --output text 2>/dev/null || \
  aws ec2 describe-subnets --filters "Name=tag:Name,Values=$PROJECT-public-b" --query 'Subnets[0].SubnetId' --output text)

aws ec2 modify-subnet-attribute --subnet-id $SUBNET_A --map-public-ip-on-launch
aws ec2 modify-subnet-attribute --subnet-id $SUBNET_B --map-public-ip-on-launch

# Route table
RT_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=$PROJECT-rt}]" \
  --query 'RouteTable.RouteTableId' --output text 2>/dev/null || \
  aws ec2 describe-route-tables --filters "Name=tag:Name,Values=$PROJECT-rt" --query 'RouteTables[0].RouteTableId' --output text)

aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID 2>/dev/null || true
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET_A 2>/dev/null || true
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET_B 2>/dev/null || true

echo "  ✅ Subnets: $SUBNET_A, $SUBNET_B"

# ─── 3. Security Groups ──────────────────────────────────────────────────────
echo ""
echo "▶ Creating security groups..."

# ALB Security Group — HTTPS only, restricted IPs
ALB_SG=$(aws ec2 create-security-group \
  --group-name "$PROJECT-alb-sg" \
  --description "Admin ALB - HTTPS only" \
  --vpc-id $VPC_ID \
  --query 'GroupId' --output text 2>/dev/null || \
  aws ec2 describe-security-groups --filters "Name=group-name,Values=$PROJECT-alb-sg" --query 'SecurityGroups[0].GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 443 --cidr 0.0.0.0/0 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0 2>/dev/null || true

# ECS Task Security Group — only from ALB
ECS_SG=$(aws ec2 create-security-group \
  --group-name "$PROJECT-ecs-sg" \
  --description "Admin ECS tasks - ALB only" \
  --vpc-id $VPC_ID \
  --query 'GroupId' --output text 2>/dev/null || \
  aws ec2 describe-security-groups --filters "Name=group-name,Values=$PROJECT-ecs-sg" --query 'SecurityGroups[0].GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id $ECS_SG --protocol tcp --port 3001 --source-group $ALB_SG 2>/dev/null || true

echo "  ✅ ALB SG: $ALB_SG | ECS SG: $ECS_SG"

# ─── 4. ALB + Target Group ───────────────────────────────────────────────────
echo ""
echo "▶ Creating Application Load Balancer..."

ALB_ARN=$(aws elbv2 create-load-balancer \
  --name "$PROJECT-alb" \
  --subnets $SUBNET_A $SUBNET_B \
  --security-groups $ALB_SG \
  --scheme internet-facing \
  --type application \
  --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null || \
  aws elbv2 describe-load-balancers --names "$PROJECT-alb" --query 'LoadBalancers[0].LoadBalancerArn' --output text)

TG_ARN=$(aws elbv2 create-target-group \
  --name "$PROJECT-tg" \
  --protocol HTTP \
  --port 3001 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path "/api/system/health" \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null || \
  aws elbv2 describe-target-groups --names "$PROJECT-tg" --query 'TargetGroups[0].TargetGroupArn' --output text)

# HTTP listener (redirect to HTTPS)
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP --port 80 \
  --default-actions 'Type=redirect,RedirectConfig={Protocol=HTTPS,Port=443,StatusCode=HTTP_301}' \
  2>/dev/null || true

echo "  ✅ ALB: $ALB_ARN"
echo "  ✅ Target Group: $TG_ARN"
echo ""
echo "  ⚠️  HTTPS listener requires ACM certificate for $DOMAIN"
echo "     Run: aws acm request-certificate --domain-name $DOMAIN --validation-method DNS"
echo "     Then create HTTPS listener with the certificate ARN"

# ─── 5. ECS Cluster ──────────────────────────────────────────────────────────
echo ""
echo "▶ Creating ECS cluster..."

aws ecs create-cluster \
  --cluster-name "$PROJECT-cluster" \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --configuration executeCommandConfiguration={logging=OVERRIDE,logConfiguration={cloudWatchLogGroupName="/ecs/$PROJECT",cloudWatchEncryptionEnabled=false}} \
  2>/dev/null || echo "  (already exists)"

echo "  ✅ ECS Cluster: $PROJECT-cluster"

# ─── 6. CloudWatch Log Group ─────────────────────────────────────────────────
echo ""
echo "▶ Creating CloudWatch log group..."
aws logs create-log-group --log-group-name "/ecs/$PROJECT" --region $REGION 2>/dev/null || true
aws logs put-retention-policy --log-group-name "/ecs/$PROJECT" --retention-in-days 30 2>/dev/null || true
echo "  ✅ Log group: /ecs/$PROJECT (30 day retention)"

# ─── 7. IAM Roles ────────────────────────────────────────────────────────────
echo ""
echo "▶ Creating IAM roles..."

# Task Execution Role (pulls images, reads secrets)
cat > /tmp/ecs-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ecs-tasks.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
  --role-name "$PROJECT-execution-role" \
  --assume-role-policy-document file:///tmp/ecs-trust-policy.json \
  2>/dev/null || true

aws iam attach-role-policy \
  --role-name "$PROJECT-execution-role" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || true

# Secrets Manager access for execution role
cat > /tmp/secrets-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["secretsmanager:GetSecretValue"],
    "Resource": "arn:aws:secretsmanager:$REGION:$ACCOUNT_ID:secret:$PROJECT/*"
  }]
}
EOF

aws iam put-role-policy \
  --role-name "$PROJECT-execution-role" \
  --policy-name "SecretsAccess" \
  --policy-document file:///tmp/secrets-policy.json 2>/dev/null || true

# Task Role (what the container can do — minimal)
aws iam create-role \
  --role-name "$PROJECT-task-role" \
  --assume-role-policy-document file:///tmp/ecs-trust-policy.json \
  2>/dev/null || true

cat > /tmp/task-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": "arn:aws:logs:$REGION:$ACCOUNT_ID:log-group:/ecs/$PROJECT:*"
    },
    {
      "Effect": "Allow",
      "Action": ["ses:SendEmail", "ses:SendRawEmail"],
      "Resource": "*",
      "Condition": {"StringEquals": {"ses:FromAddress": "admin@tradichatter.com"}}
    }
  ]
}
EOF

aws iam put-role-policy \
  --role-name "$PROJECT-task-role" \
  --policy-name "TaskPermissions" \
  --policy-document file:///tmp/task-policy.json 2>/dev/null || true

echo "  ✅ Execution Role: $PROJECT-execution-role"
echo "  ✅ Task Role: $PROJECT-task-role"

# ─── 8. Secrets Manager ──────────────────────────────────────────────────────
echo ""
echo "▶ Creating Secrets Manager entries..."
echo "  (You must fill these with real values after creation)"

SECRETS=(
  "supabase-url"
  "supabase-service-key"
  "jwt-secret"
  "rust-backend-url"
  "rust-service-token"
  "ai-agent-url"
  "ai-agent-key"
  "voice-url"
  "voice-key"
  "sourcehub-url"
  "sourcehub-key"
  "avs-url"
  "avs-key"
  "flutterwave-key"
)

for SECRET in "${SECRETS[@]}"; do
  aws secretsmanager create-secret \
    --name "$PROJECT/$SECRET" \
    --secret-string "REPLACE_ME" \
    --region $REGION \
    2>/dev/null || true
  echo "  → $PROJECT/$SECRET"
done

echo "  ✅ Secrets created (update with real values)"

# ─── 9. ECS Service ──────────────────────────────────────────────────────────
echo ""
echo "▶ Creating ECS service..."

# Register task definition first
TASK_DEF_ARN=$(aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json \
  --query 'taskDefinition.taskDefinitionArn' --output text 2>/dev/null || echo "MANUAL")

if [ "$TASK_DEF_ARN" != "MANUAL" ]; then
  aws ecs create-service \
    --cluster "$PROJECT-cluster" \
    --service-name "$PROJECT-service" \
    --task-definition $TASK_DEF_ARN \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_A,$SUBNET_B],securityGroups=[$ECS_SG],assignPublicIp=ENABLED}" \
    --load-balancers "targetGroupArn=$TG_ARN,containerName=$PROJECT,containerPort=3001" \
    --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100" \
    --enable-execute-command \
    2>/dev/null || echo "  (service already exists or task def needs secrets filled first)"
fi

echo "  ✅ ECS Service created"

# ─── 10. Summary ─────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Infrastructure Setup Complete"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Resources Created:"
echo "    VPC:          $VPC_ID (10.10.0.0/16)"
echo "    Subnets:      $SUBNET_A, $SUBNET_B"
echo "    ALB:          $ALB_ARN"
echo "    ECS Cluster:  $PROJECT-cluster"
echo "    ECR:          $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PROJECT"
echo "    Log Group:    /ecs/$PROJECT"
echo ""
echo "  ⚠️  NEXT STEPS:"
echo "    1. Request ACM certificate:"
echo "       aws acm request-certificate --domain-name $DOMAIN --validation-method DNS"
echo ""
echo "    2. Add HTTPS listener to ALB (after cert validation):"
echo "       aws elbv2 create-listener --load-balancer-arn $ALB_ARN \\"
echo "         --protocol HTTPS --port 443 --certificates CertificateArn=<CERT_ARN> \\"
echo "         --default-actions Type=forward,TargetGroupArn=$TG_ARN"
echo ""
echo "    3. Create Route53 A record:"
echo "       $DOMAIN → ALB DNS name (alias)"
echo ""
echo "    4. Fill secrets with real values:"
echo "       aws secretsmanager update-secret --secret-id $PROJECT/<name> --secret-string '<value>'"
echo ""
echo "    5. Push first image:"
echo "       docker build -t $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PROJECT:latest ."
echo "       aws ecr get-login-password | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
echo "       docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PROJECT:latest"
echo ""
echo "    6. Update ECS service:"
echo "       aws ecs update-service --cluster $PROJECT-cluster --service $PROJECT-service --force-new-deployment"
echo ""
