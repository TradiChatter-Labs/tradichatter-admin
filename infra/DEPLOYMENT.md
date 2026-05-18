# TradiChatter Admin — Deployment Guide

## Architecture

```
Internet → CloudFront (optional) → ALB (HTTPS + WAF) → ECS Fargate → Next.js Container
                                                                          ↓
                                                              Supabase (shared DB)
                                                              Rust Backend (:8080)
                                                              AI Agent Service (:8100)
                                                              Voice Translation (:8200)
                                                              SourceHub (:8300)
                                                              AVS Engine (:8400)
```

**Isolation**: Separate VPC (10.10.0.0/16), separate ECS cluster, separate security groups. No peering with app VPCs.

## Prerequisites

- AWS CLI v2 configured with admin access
- Docker installed
- Domain `admin.tradichatter.com` in Route53
- All 5 microservices already deployed and accessible

## Deployment Steps

### 1. Create AWS Infrastructure (one-time)

```bash
cd infra/
chmod +x setup-aws.sh
./setup-aws.sh
```

This creates: VPC, subnets, ALB, ECS cluster, ECR repo, IAM roles, Secrets Manager entries, CloudWatch log group.

### 2. Set Up Domain + SSL + WAF

```bash
# Edit setup-domain.sh and set HOSTED_ZONE_ID
chmod +x setup-domain.sh
./setup-domain.sh
```

If the ACM certificate needs DNS validation, add the CNAME record and re-run.

### 3. Populate Secrets

```bash
chmod +x populate-secrets.sh
./populate-secrets.sh
```

You'll be prompted for each secret value (Supabase keys, service URLs, API keys).

### 4. Run Database Migration

Execute `database/002_admin_foundation.sql` on your Supabase project (SQL Editor).

### 5. First Deploy

```bash
chmod +x deploy.sh
./deploy.sh v1.0.0
```

Or push to `main` branch and GitHub Actions will auto-deploy.

### 6. Set Up Alarms

```bash
chmod +x setup-alarms.sh
./setup-alarms.sh
```

Subscribe your email to the SNS topic for alerts.

### 7. Verify

```bash
curl https://admin.tradichatter.com/api/system/health
```

## CI/CD (Automatic)

Every push to `main` that changes files in `tradichatter-admin/` triggers:

1. Build Docker image
2. Push to ECR
3. Update ECS task definition
4. Deploy to ECS service
5. Wait for stability

### GitHub Secrets Required

| Secret | Value |
|--------|-------|
| `AWS_ACCESS_KEY_ID` | IAM user with ECR + ECS deploy permissions |
| `AWS_SECRET_ACCESS_KEY` | Corresponding secret key |

## Manual Deploy

```bash
cd infra/
./deploy.sh          # deploys :latest
./deploy.sh v1.2.3   # deploys with specific tag
```

## Monitoring

- **CloudWatch Logs**: `/ecs/tradichatter-admin`
- **Alarms**: CPU >80%, Memory >85%, 5xx >10, Unhealthy targets, Zero tasks
- **Health endpoint**: `GET /api/system/health`

## Rollback

```bash
# Deploy previous image tag
aws ecs update-service \
  --cluster tradichatter-admin-cluster \
  --service tradichatter-admin-service \
  --task-definition tradichatter-admin:<previous-revision> \
  --region eu-west-1
```

## Cost Estimate

| Resource | Monthly Cost |
|----------|-------------|
| ECS Fargate (0.5 vCPU, 1GB, 1 task) | ~$15 |
| ALB | ~$16 + $0.008/LCU-hour |
| ECR (10 images) | ~$1 |
| CloudWatch Logs (30 day) | ~$2 |
| WAF | ~$5 + $0.60/million requests |
| Route53 | $0.50/zone |
| **Total** | **~$40/month** |

Use [AWS Pricing Calculator](https://calculator.aws) for exact estimates.

## Security

- HTTPS only (TLS 1.3, HTTP redirects to HTTPS)
- WAF with rate limiting (300 req/5min per IP)
- AWS Managed Rules (Common + SQLi)
- All secrets in Secrets Manager (never in env files or code)
- IAM least-privilege (task role can only write logs + send SES)
- Admin JWT auth on all pages
- Full audit trail on every admin action
