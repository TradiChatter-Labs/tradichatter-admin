import { callService } from '../../../lib/serviceConnector';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { action } = req.query;

    if (action === 'languages') {
      const result = await callService('voiceTranslation', '/translate/languages');
      if (!result.ok) return res.status(502).json({ error: result.error || 'Voice service unavailable' });
      return res.json({ success: true, ...result.data });
    }

    if (action === 'stats') {
      const result = await callService('voiceTranslation', '/api/admin/stats');
      if (!result.ok) return res.status(502).json({ error: result.error || 'Voice service unavailable' });
      return res.json({ success: true, ...result.data });
    }

    // Default: health + basic info
    const [healthResult, langResult] = await Promise.all([
      callService('voiceTranslation', '/health'),
      callService('voiceTranslation', '/translate/languages'),
    ]);

    return res.json({
      success: true,
      health: healthResult.ok ? healthResult.data : { status: 'unhealthy', error: healthResult.error },
      languages: langResult.ok ? langResult.data : null,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
