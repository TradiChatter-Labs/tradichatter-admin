import { callService } from '../../../lib/serviceConnector';
import { logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { action, supplier_id } = req.query;

    if (action === 'pending') {
      const result = await callService('avs', '/api/admin/pending-reviews');
      if (!result.ok) return res.status(502).json({ error: result.error || 'AVS Engine unavailable' });
      return res.json({ success: true, ...result.data });
    }

    if (action === 'score' && supplier_id) {
      const result = await callService('avs', `/api/verify/supplier/${supplier_id}/score`);
      if (!result.ok) return res.status(502).json({ error: result.error || 'AVS Engine unavailable' });
      return res.json({ success: true, ...result.data });
    }

    if (action === 'audit' && supplier_id) {
      const result = await callService('avs', `/api/verify/supplier/${supplier_id}/audit`);
      if (!result.ok) return res.status(502).json({ error: result.error || 'AVS Engine unavailable' });
      return res.json({ success: true, ...result.data });
    }

    if (action === 'weights') {
      const result = await callService('avs', '/api/learning/weights/current');
      if (!result.ok) return res.status(502).json({ error: result.error || 'AVS Engine unavailable' });
      return res.json({ success: true, ...result.data });
    }

    if (action === 'accuracy') {
      const result = await callService('avs', '/api/learning/accuracy');
      if (!result.ok) return res.status(502).json({ error: result.error || 'AVS Engine unavailable' });
      return res.json({ success: true, ...result.data });
    }

    // Default: pending reviews
    const result = await callService('avs', '/api/admin/pending-reviews');
    if (!result.ok) return res.status(502).json({ error: result.error || 'AVS Engine unavailable' });
    return res.json({ success: true, ...result.data });
  }

  if (req.method === 'POST') {
    const { action, supplier_id, decision, reason, badge } = req.body;

    if (action === 'override') {
      if (!supplier_id || !decision) return res.status(400).json({ error: 'supplier_id and decision required' });

      const result = await callService('avs', '/api/admin/override', {
        method: 'POST',
        body: { supplier_id, decision, reason },
      });

      if (!result.ok) return res.status(502).json({ error: result.error || 'Override failed' });

      const adminId = req.headers['x-admin-id'] || 'unknown';
      await logAdminAction({
        adminId,
        action: `AVS_OVERRIDE_${decision.toUpperCase()}`,
        entityType: 'supplier_verification',
        entityId: supplier_id,
        details: { decision, reason },
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      });

      return res.json({ success: true, ...result.data });
    }

    if (action === 'tune-weights') {
      const result = await callService('avs', '/api/learning/weights/tune', { method: 'POST' });
      if (!result.ok) return res.status(502).json({ error: result.error || 'Tuning failed' });

      const adminId = req.headers['x-admin-id'] || 'unknown';
      await logAdminAction({
        adminId,
        action: 'AVS_WEIGHTS_TUNED',
        entityType: 'avs_system',
        entityId: 'weights',
        details: result.data,
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      });

      return res.json({ success: true, ...result.data });
    }

    if (action === 'evaluate-badge') {
      if (!supplier_id) return res.status(400).json({ error: 'supplier_id required' });
      const result = await callService('avs', `/api/learning/badge/evaluate/${supplier_id}`, { method: 'POST' });
      if (!result.ok) return res.status(502).json({ error: result.error || 'Evaluation failed' });
      return res.json({ success: true, ...result.data });
    }

    return res.status(400).json({ error: 'Unknown action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
