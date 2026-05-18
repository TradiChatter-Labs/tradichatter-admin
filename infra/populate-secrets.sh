#!/bin/bash
# ─── Populate Secrets Manager with real values ────────────────────────────────
# Run this after setup-aws.sh to fill in actual secret values.
# Usage: ./populate-secrets.sh
# ──────────────────────────────────────────────────────────────────────────────

set -e

REGION="eu-west-1"
PROJECT="tradichatter-admin"

echo "═══════════════════════════════════════════════════════════"
echo "  TradiChatter Admin — Populate Secrets"
echo "═══════════════════════════════════════════════════════════"
echo ""

update_secret() {
  local name=$1
  local prompt=$2
  local current=$(aws secretsmanager get-secret-value --secret-id "$PROJECT/$name" --query SecretString --output text 2>/dev/null || echo "NOT_SET")
  
  if [ "$current" = "REPLACE_ME" ] || [ "$current" = "NOT_SET" ]; then
    echo ""
    read -p "  $prompt: " value
    if [ -n "$value" ]; then
      aws secretsmanager update-secret --secret-id "$PROJECT/$name" --secret-string "$value" --region $REGION
      echo "  ✅ $name updated"
    else
      echo "  ⏭️  Skipped $name"
    fi
  else
    echo "  ✓ $name already set"
  fi
}

update_secret "supabase-url" "Supabase URL (e.g. https://xxx.supabase.co)"
update_secret "supabase-service-key" "Supabase Service Role Key"
update_secret "jwt-secret" "Admin JWT Secret (32+ chars)"
update_secret "rust-backend-url" "Rust Backend URL (e.g. https://api.tradichatter.com)"
update_secret "rust-service-token" "Rust Backend API Key"
update_secret "ai-agent-url" "AI Agent Service URL (e.g. http://ai-agent-alb.internal:8100)"
update_secret "ai-agent-key" "AI Agent Service API Key"
update_secret "voice-url" "Voice Translation URL (e.g. http://voice-alb.internal:8200)"
update_secret "voice-key" "Voice Translation API Key"
update_secret "sourcehub-url" "SourceHub URL (e.g. http://sourcehub-alb.internal:8300)"
update_secret "sourcehub-key" "SourceHub API Key"
update_secret "avs-url" "AVS Engine URL (e.g. http://avs-alb.internal:8400)"
update_secret "avs-key" "AVS Engine API Key"
update_secret "flutterwave-key" "Flutterwave Secret Key"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Secrets populated. Redeploy ECS to pick up changes:"
echo "  aws ecs update-service --cluster $PROJECT-cluster --service $PROJECT-service --force-new-deployment"
echo "═══════════════════════════════════════════════════════════"
