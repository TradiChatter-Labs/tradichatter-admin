/**
 * Admin API: /api/system/backup
 * Proxies to AI Agent Service backup endpoints.
 * Replaces the previous fake mock implementation.
 */

const AI_AGENT_BASE = 'https://tradichatter-ai-agent.fly.dev';
const INTERNAL_TOKEN = process.env.INTERNAL_API_TOKEN || 'tradichatter-internal-token-2024';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return listBackups(req, res);
    case 'POST':
      return triggerBackup(req, res);
    case 'PUT':
      return restoreBackup(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function listBackups(req, res) {
  try {
    const response = await fetch(`${AI_AGENT_BASE}/api/backup/list`, {
      method: 'GET',
      headers: { 'X-Internal-Token': INTERNAL_TOKEN },
    });
    const data = await response.json();
    return res.status(response.ok ? 200 : 500).json(data);
  } catch (error) {
    console.error('[backup API] list error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch backup list', backups: [] });
  }
}

async function triggerBackup(req, res) {
  try {
    // Get admin ID from token for audit trail
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    let adminId = 'admin';
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      adminId = payload.id || payload.sub || 'admin';
    } catch {
      // token parse failed — use default
    }

    const response = await fetch(`${AI_AGENT_BASE}/api/backup/trigger-manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Token': INTERNAL_TOKEN,
        'X-Admin-Id': adminId,
      },
    });
    const data = await response.json();
    return res.status(response.ok ? 202 : 500).json(data);
  } catch (error) {
    console.error('[backup API] trigger error:', error);
    return res.status(500).json({ success: false, error: 'Failed to trigger backup' });
  }
}

async function restoreBackup(req, res) {
  try {
    const { backup_log_id, admin_id, confirmation } = req.body;

    if (!backup_log_id || !admin_id) {
      return res.status(400).json({ error: 'backup_log_id and admin_id required' });
    }
    if (confirmation !== 'CONFIRM') {
      return res.status(400).json({ error: 'Type CONFIRM to proceed' });
    }

    const response = await fetch(`${AI_AGENT_BASE}/api/backup/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Token': INTERNAL_TOKEN,
      },
      body: JSON.stringify({ backup_log_id, admin_id, confirmation }),
    });
    const data = await response.json();
    return res.status(response.ok ? 202 : 500).json(data);
  } catch (error) {
    console.error('[backup API] restore error:', error);
    return res.status(500).json({ success: false, error: 'Failed to start restore' });
  }
}
