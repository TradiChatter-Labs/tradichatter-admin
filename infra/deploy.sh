#!/bin/bash
# ─── Quick Deploy — Build and push to ECS manually ───────────────────────────
# Usage: ./deploy.sh [tag]
# ──────────────────────────────────────────────────────────────────────────────

set -e

REGION="eu-west-1"
PROJECT="tradichatter-admin"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PROJECT"
TAG=${1:-latest}

echo "═══════════════════════════════════════════════════════════"
echo "  Deploying $PROJECT:$TAG"
echo "═══════════════════════════════════════════════════════════"

# 1. Login to ECR
echo "▶ Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI

# 2. Build
echo "▶ Building Docker image..."
docker build -t $ECR_URI:$TAG -t $ECR_URI:latest .

# 3. Push
echo "▶ Pushing to ECR..."
docker push $ECR_URI:$TAG
docker push $ECR_URI:latest

# 4. Force new deployment
echo "▶ Deploying to ECS..."
aws ecs update-service \
  --cluster "$PROJECT-cluster" \
  --service "$PROJECT-service" \
  --force-new-deployment \
  --region $REGION

# 5. Wait for stability
echo "▶ Waiting for service stability..."
aws ecs wait services-stable \
  --cluster "$PROJECT-cluster" \
  --services "$PROJECT-service" \
  --region $REGION

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Deployed $PROJECT:$TAG successfully"
echo "  URL: https://admin.tradichatter.com"
echo "═══════════════════════════════════════════════════════════"
