import { callService } from '../../../lib/serviceConnector';
import { logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { action } = req.query;

    if (action === 'metrics') {
      const result = await callService('aiAgents', '/api/admin/metrics');
      if (!result.ok) return res.status(502).json({ error: result.error || 'AI Agent Service unavailable' });
      return res.json({ success: true, ...result.data });
    }

    if (action === 'conversations') {
      const { business_id, limit = 50, offset = 0 } = req.query;
      const params = new URLSearchParams({ limit, offset });
      if (business_id) params.set('business_id', business_id);
      const result = await callService('aiAgents', `/api/admin/conversations?${params}`);
      if (!result.ok) return res.status(502).json({ error: result.error || 'AI Agent Service unavailable' });
      return res.json({ success: true, ...result.data });
    }

    if (action === 'status') {
      const result = await callService('aiAgents', '/api/admin/agent-status');
      if (!result.ok) return res.status(502).json({ error: result.error || 'AI Agent Service unavailable' });
      return res.json({ success: true, ...result.data });
    }

    // Default: get overview
    const result = await callService('aiAgents', '/api/admin/overview');
    if (!result.ok) return res.status(502).json({ error: result.error || 'AI Agent Service unavailable' });
    return res.json({ success: true, ...result.data });
  }

  if (req.method === 'POST') {
    const { action, agent_type, enabled, business_id, reason } = req.body;

    if (action === 'toggle') {
      if (!agent_type || typeof enabled !== 'boolean') {
        return res.status(400).json({ error: 'agent_type and enabled required' });
      }

      const result = await callService('aiAgents', '/api/admin/toggle-agent', {
        method: 'POST',
        body: { agent_type, enabled, business_id },
      });

      if (!result.ok) return res.status(502).json({ error: result.error || 'Toggle failed' });

      const adminId = req.headers['x-admin-id'] || 'unknown';
      await logAdminAction({
        adminId,
        action: enabled ? 'AI_AGENT_ENABLED' : 'AI_AGENT_DISABLED',
        entityType: 'ai_agent',
        entityId: agent_type,
        details: { agent_type, enabled, business_id, reason },
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      });

      return res.json({ success: true, ...result.data });
    }

    if (action === 'kill-all') {
      const result = await callService('aiAgents', '/api/admin/kill-switch', {
        method: 'POST',
        body: { enabled: false, reason },
      });

      if (!result.ok) return res.status(502).json({ error: result.error || 'Kill switch failed' });

      const adminId = req.headers['x-admin-id'] || 'unknown';
      await logAdminAction({
        adminId,
        action: 'AI_KILL_SWITCH_ACTIVATED',
        entityType: 'ai_system',
        entityId: 'all',
        details: { reason },
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      });

      return res.json({ success: true, message: 'All AI agents disabled' });
    }

    if (action === 'enable-all') {
      const result = await callService('aiAgents', '/api/admin/kill-switch', {
        method: 'POST',
        body: { enabled: true, reason },
      });

      if (!result.ok) return res.status(502).json({ error: result.error || 'Enable failed' });

      const adminId = req.headers['x-admin-id'] || 'unknown';
      await logAdminAction({
        adminId,
        action: 'AI_KILL_SWITCH_DEACTIVATED',
        entityType: 'ai_system',
        entityId: 'all',
        details: { reason },
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      });

      return res.json({ success: true, message: 'All AI agents enabled' });
    }

    return res.status(400).json({ error: 'Unknown action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
