const COMMS_URL = process.env.COMMS_SERVICE_URL || '';
const COMMS_KEY = process.env.COMMS_API_KEY || '';

export default async function handler(req, res) {
  if (!COMMS_URL) {
    return res.status(503).json({ success: false, error: 'Communication service not configured' });
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${COMMS_URL}/api/push/campaigns`, {
        headers: { 'X-API-Key': COMMS_KEY },
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const response = await fetch(`${COMMS_URL}/api/push/campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': COMMS_KEY },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
