import { grantSubscription, logAdminAction } from '../../../lib/supabaseAdmin';

const VALID_PLANS = ['business', 'premium'];
const MIN_DAYS = 1;
const MAX_DAYS = 365;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessId, businessName, plan, durationDays, reason } = req.body;

  // Validate all required fields
  if (!businessId) return res.status(400).json({ error: 'businessId is required' });
  if (!VALID_PLANS.includes(plan)) return res.status(400).json({ error: 'plan must be business or premium' });
  if (!durationDays || isNaN(Number(durationDays))) return res.status(400).json({ error: 'durationDays must be a number' });
  if (Number(durationDays) < MIN_DAYS || Number(durationDays) > MAX_DAYS) {
    return res.status(400).json({ error: `durationDays must be between ${MIN_DAYS} and ${MAX_DAYS}` });
  }
  if (!reason || reason.trim().length < 3) return res.status(400).json({ error: 'reason is required (min 3 characters)' });

  const adminId = req.headers['x-admin-id'] || 'unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  const { data, error, expiresAt } = await grantSubscription(
    businessId,
    plan,
    Number(durationDays),
    adminId,
    reason.trim()
  );

  if (error) {
    console.error('grantSubscription error:', error);
    return res.status(500).json({ error: error.message });
  }

  // Audit log — every grant is permanently recorded
  await logAdminAction({
    adminId,
    action: 'SUBSCRIPTION_GRANT',
    entityType: 'business',
    entityId: businessId,
    details: {
      businessName: businessName || businessId,
      plan,
      durationDays: Number(durationDays),
      expiresAt,
      reason: reason.trim(),
    },
    ip,
  });

  return res.status(200).json({
    success: true,
    plan,
    durationDays: Number(durationDays),
    expiresAt,
    business: data,
  });
}
