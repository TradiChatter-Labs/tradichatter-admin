import { getSubscriptions, updateSubscription, logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { status, page = 1, limit = 50 } = req.query;
    const { data, total, error } = await getSubscriptions({ status, page: Number(page), limit: Number(limit) });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, subscriptions: data, total });
  }

  if (req.method === 'PATCH') {
    const { id, status, reason } = req.body;
    if (!id || !status) return res.status(400).json({ error: 'id and status required' });

    const updates = { status, updated_at: new Date().toISOString() };
    if (reason) updates.admin_notes = reason;
    if (status === 'active') updates.reactivated_at = new Date().toISOString();

    const { data, error } = await updateSubscription(id, updates);
    if (error) return res.status(500).json({ error: error.message });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({
      adminId,
      action: `SUBSCRIPTION_${status.toUpperCase()}`,
      entityType: 'subscription',
      entityId: id,
      details: { status, reason },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true, subscription: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
