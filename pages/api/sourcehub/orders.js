import { callService } from '../../../lib/serviceConnector';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, status } = req.query;
    const params = new URLSearchParams({ page, limit });
    if (status) params.set('status', status);

    const result = await callService('sourceHub', `/api/admin/orders?${params}`);
    if (!result.ok) return res.status(result.status || 502).json({ error: result.error || 'SourceHub unavailable' });
    return res.json({ success: true, ...result.data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
