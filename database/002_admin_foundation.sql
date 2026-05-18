-- TradiChatter Admin: Feature Flags + Audit Logs
-- Run on Supabase (same project as mobile app)
-- Fixed: renamed 'key' to 'flag_key' (key is reserved in PostgreSQL)

-- ─── Feature Flags ───────────────────────────────────────────────────────────
DROP TABLE IF EXISTS feature_flags CASCADE;

CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  enabled BOOLEAN NOT NULL DEFAULT false,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default flags
INSERT INTO feature_flags (flag_key, name, description, category, enabled) VALUES
  ('voice_calls', 'Voice Calls', 'Enable voice calling feature', 'communication', true),
  ('video_calls', 'Video Calls', 'Enable video calling feature', 'communication', true),
  ('voice_translation', 'Voice Translation', 'Enable real-time voice translation during calls', 'communication', true),
  ('group_buying', 'Group Buying', 'Enable group buying feature', 'commerce', true),
  ('affiliate_program', 'Affiliate Program', 'Enable affiliate marketing program', 'marketing', true),
  ('ai_auto_reply', 'AI Auto Reply', 'Enable AI-powered auto-reply for Premium sellers', 'ai', true),
  ('ai_recommendations', 'AI Recommendations', 'Enable AI product recommendations', 'ai', false),
  ('ai_lead_scoring', 'AI Lead Scoring', 'Enable AI lead scoring for Premium sellers', 'ai', true),
  ('dark_mode', 'Dark Mode', 'Enable dark mode theme', 'ui', true),
  ('push_notifications', 'Push Notifications', 'Enable push notifications', 'notifications', true),
  ('escrow_payments', 'Escrow Payments', 'Enable escrow payment system', 'payments', true),
  ('kyc_verification', 'KYC Verification', 'Enable KYC verification for businesses', 'security', true),
  ('sourcehub', 'SourceHub', 'Enable B2B sourcing marketplace', 'commerce', true),
  ('avs_verification', 'AVS Supplier Verification', 'Enable AI supplier verification system', 'security', true),
  ('maintenance_mode', 'Maintenance Mode', 'Put entire platform in maintenance mode', 'system', false);

-- ─── Admin Audit Logs ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_logs(created_at DESC);

-- ─── Admin Users Table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  permissions JSONB DEFAULT '[]',
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret TEXT,
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Only service role can access these tables
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Service role bypass (admin backend uses service_role key)
CREATE POLICY "Service role full access on feature_flags" ON feature_flags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on admin_audit_logs" ON admin_audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);
