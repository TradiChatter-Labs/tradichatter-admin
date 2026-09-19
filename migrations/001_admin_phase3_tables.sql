-- Admin Portal Phase 3 Migration
-- Tables: reviews, user_suspensions, business_members, data_export_requests
-- Run in Supabase SQL Editor

-- ── reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id),
  customer_id   UUID NOT NULL,
  customer_name TEXT NOT NULL DEFAULT 'Customer',
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  reported      BOOLEAN DEFAULT false,
  report_reason TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_service_role" ON reviews FOR ALL USING (true);

-- ── user_suspensions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_suspensions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  username    TEXT,
  type        TEXT NOT NULL DEFAULT 'warning', -- warning, suspension, ban
  reason      TEXT NOT NULL,
  notes       TEXT,
  duration    TEXT, -- '7 days', 'permanent', etc
  start_date  TIMESTAMPTZ DEFAULT now(),
  end_date    TIMESTAMPTZ,
  status      TEXT NOT NULL DEFAULT 'active', -- active, lifted, expired
  admin_id    TEXT,
  lifted_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_suspensions_user_id ON user_suspensions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_suspensions_status ON user_suspensions(status);
ALTER TABLE user_suspensions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_suspensions_service_role" ON user_suspensions FOR ALL USING (true);

-- ── business_members ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  user_id     UUID,
  email       TEXT NOT NULL,
  name        TEXT,
  role        TEXT NOT NULL DEFAULT 'staff', -- owner, admin, manager, staff
  status      TEXT NOT NULL DEFAULT 'pending', -- pending, active, removed
  invited_by  UUID,
  joined_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_members_business_id ON business_members(business_id);
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "business_members_service_role" ON business_members FOR ALL USING (true);

-- ── data_export_requests ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS data_export_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL,
  email         TEXT NOT NULL,
  request_type  TEXT NOT NULL DEFAULT 'full_export', -- full_export, profile_data, messages, transactions
  status        TEXT NOT NULL DEFAULT 'processing', -- processing, completed, failed
  download_url  TEXT,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "data_export_requests_service_role" ON data_export_requests FOR ALL USING (true);

SELECT 'Admin Portal Phase 3 migration complete' AS status;
