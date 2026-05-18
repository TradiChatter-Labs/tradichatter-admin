import { callService } from '../../../lib/serviceConnector';
import { logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, status } = req.query;
    const params = new URLSearchParams({ page, limit });
    if (status) params.set('status', status);

    const result = await callService('sourceHub', `/api/admin/disputes?${params}`);
    if (!result.ok) return res.status(result.status || 502).json({ error: result.error || 'SourceHub unavailable' });
    return res.json({ success: true, ...result.data });
  }

  if (req.method === 'POST') {
    const { dispute_id, resolution, winner, reason, refund_amount } = req.body;
    if (!dispute_id || !resolution) return res.status(400).json({ error: 'dispute_id and resolution required' });

    const result = await callService('sourceHub', `/api/admin/disputes/${dispute_id}/resolve`, {
      method: 'POST',
      body: { resolution, winner, reason, refund_amount },
    });

    if (!result.ok) return res.status(result.status || 502).json({ error: result.error || 'Resolution failed' });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({
      adminId,
      action: 'SOURCEHUB_DISPUTE_RESOLVED',
      entityType: 'dispute',
      entityId: dispute_id,
      details: { resolution, winner, reason, refund_amount },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true, ...result.data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
