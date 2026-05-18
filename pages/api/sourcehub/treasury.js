import { callService } from '../../../lib/serviceConnector';
import { logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await callService('sourceHub', '/api/admin/treasury');
    if (!result.ok) return res.status(result.status || 502).json({ error: result.error || 'SourceHub unavailable' });
    return res.json({ success: true, ...result.data });
  }

  if (req.method === 'POST') {
    const { action, supplier_id, amount, reason } = req.body;
    if (!action) return res.status(400).json({ error: 'action required' });

    const result = await callService('sourceHub', `/api/admin/treasury/${action}`, {
      method: 'POST',
      body: { supplier_id, amount, reason },
    });

    if (!result.ok) return res.status(result.status || 502).json({ error: result.error || 'Action failed' });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({
      adminId,
      action: `SOURCEHUB_TREASURY_${action.toUpperCase()}`,
      entityType: 'treasury',
      entityId: supplier_id || 'platform',
      details: { action, amount, reason },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true, ...result.data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
