import { getFeatureFlags, updateFeatureFlag, logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await getFeatureFlags();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, flags: data });
  }

  if (req.method === 'PATCH') {
    const { id, enabled } = req.body;
    if (!id || typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'id and enabled (boolean) required' });
    }

    const adminId = req.headers['x-admin-id'] || 'unknown';
    const { data, error } = await updateFeatureFlag(id, enabled, adminId);
    if (error) return res.status(500).json({ error: error.message });

    await logAdminAction({
      adminId,
      action: enabled ? 'FEATURE_FLAG_ENABLED' : 'FEATURE_FLAG_DISABLED',
      entityType: 'feature_flag',
      entityId: id,
      details: { enabled },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true, flag: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
