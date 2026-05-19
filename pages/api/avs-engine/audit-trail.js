import { callService } from '../../../lib/serviceConnector';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { supplier_id } = req.query;
  if (!supplier_id) return res.status(400).json({ error: 'supplier_id required' });

  const result = await callService('avs', `/api/verify/supplier/${supplier_id}/audit`);
  if (!result.ok) return res.status(502).json({ error: result.error || 'AVS Engine unavailable' });
  return res.json({ success: true, ...result.data });
}
