-- 003: Admin subscription grant tracking columns
-- Adds traceability for admin-granted subscriptions on the businesses table

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS admin_granted_by TEXT,
  ADD COLUMN IF NOT EXISTS admin_granted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_grant_reason TEXT;

-- Index for auditing all admin-granted subscriptions
CREATE INDEX IF NOT EXISTS idx_businesses_admin_granted_by ON businesses(admin_granted_by)
  WHERE admin_granted_by IS NOT NULL;

COMMENT ON COLUMN businesses.admin_granted_by IS 'Admin user ID who granted this subscription manually';
COMMENT ON COLUMN businesses.admin_granted_at IS 'Timestamp when admin granted this subscription';
COMMENT ON COLUMN businesses.admin_grant_reason IS 'Reason provided by admin when granting subscription';
