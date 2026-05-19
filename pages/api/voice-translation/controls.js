import { callService } from '../../../lib/serviceConnector';
import { logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await callService('voiceTranslation', '/api/admin/config');
    if (!result.ok) return res.status(502).json({ error: result.error || 'Voice service unavailable' });
    return res.json({ success: true, ...result.data });
  }

  if (req.method === 'POST') {
    const { action, language, provider, enabled } = req.body;
    if (!action) return res.status(400).json({ error: 'action required' });

    let path, body;
    if (action === 'toggle_language') {
      path = '/api/admin/languages/toggle';
      body = { language, enabled };
    } else if (action === 'switch_provider') {
      path = '/api/admin/providers/switch';
      body = { provider };
    } else if (action === 'update_config') {
      path = '/api/admin/config';
      body = req.body.config;
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const result = await callService('voiceTranslation', path, { method: 'POST', body });
    if (!result.ok) return res.status(502).json({ error: result.error || 'Action failed' });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({ adminId, action: `VOICE_${action.toUpperCase()}`, entityType: 'voice_service', entityId: language || provider || 'config', details: { action, language, provider, enabled }, ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress });

    return res.json({ success: true, ...result.data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
