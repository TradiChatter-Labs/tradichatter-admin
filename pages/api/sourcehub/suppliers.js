import { getSourceHubSuppliers, callService } from '../../../lib/serviceConnector';
import { logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, status, search } = req.query;
    const params = new URLSearchParams({ page, limit });
    if (status) params.set('status', status);
    if (search) params.set('search', search);

    const result = await callService('sourceHub', `/api/admin/suppliers?${params}`);
    if (!result.ok) return res.status(result.status || 502).json({ error: result.error || 'SourceHub unavailable' });
    return res.json({ success: true, ...result.data });
  }

  if (req.method === 'PATCH') {
    const { supplier_id, action, reason } = req.body;
    if (!supplier_id || !action) return res.status(400).json({ error: 'supplier_id and action required' });

    const result = await callService('sourceHub', `/api/admin/suppliers/${supplier_id}/${action}`, {
      method: 'POST',
      body: { reason },
    });

    if (!result.ok) return res.status(result.status || 502).json({ error: result.error || 'Action failed' });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({
      adminId,
      action: `SOURCEHUB_SUPPLIER_${action.toUpperCase()}`,
      entityType: 'supplier',
      entityId: supplier_id,
      details: { action, reason },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true, ...result.data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
