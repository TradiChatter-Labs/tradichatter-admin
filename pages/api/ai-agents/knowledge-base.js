import { callService } from '../../../lib/serviceConnector';
import { logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { business_id, page = 1, limit = 50 } = req.query;
    const params = new URLSearchParams({ page, limit });
    if (business_id) params.set('business_id', business_id);

    const result = await callService('aiAgents', `/api/admin/knowledge-base?${params}`);
    if (!result.ok) return res.status(502).json({ error: result.error || 'AI Agent Service unavailable' });
    return res.json({ success: true, ...result.data });
  }

  if (req.method === 'POST') {
    const { business_id, action, knowledge_id, content, category } = req.body;
    if (!business_id) return res.status(400).json({ error: 'business_id required' });

    let path, body;
    if (action === 'add') {
      path = '/api/admin/knowledge-base';
      body = { business_id, content, category };
    } else if (action === 'update') {
      path = `/api/admin/knowledge-base/${knowledge_id}`;
      body = { content, category };
    } else if (action === 'delete') {
      path = `/api/admin/knowledge-base/${knowledge_id}`;
      const result = await callService('aiAgents', path, { method: 'DELETE' });
      if (!result.ok) return res.status(502).json({ error: result.error || 'Delete failed' });

      const adminId = req.headers['x-admin-id'] || 'unknown';
      await logAdminAction({ adminId, action: 'AI_KNOWLEDGE_DELETED', entityType: 'ai_knowledge', entityId: knowledge_id, details: { business_id }, ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress });
      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const method = action === 'update' ? 'PUT' : 'POST';
    const result = await callService('aiAgents', path, { method, body });
    if (!result.ok) return res.status(502).json({ error: result.error || 'Action failed' });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({ adminId, action: `AI_KNOWLEDGE_${action.toUpperCase()}`, entityType: 'ai_knowledge', entityId: knowledge_id || 'new', details: { business_id, category }, ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress });

    return res.json({ success: true, ...result.data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
