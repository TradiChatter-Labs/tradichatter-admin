const { adminAuth, requirePermission } = require('../../../../api/middleware/adminAuth');

export default async function handler(req, res) {
  await adminAuth(req, res, async () => {
    await requirePermission('system', 'view')(req, res, async () => {
      if (req.method === 'GET') {
        return await getWebhookLogs(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function getWebhookLogs(req, res) {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM webhook_logs';
    let params = [];
    
    if (status && status !== 'all') {
      query += ' WHERE processing_status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const logs = await db.query(query, params);
    
    res.json({ logs, page, limit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}