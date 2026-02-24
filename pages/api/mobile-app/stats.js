import mobileAppIntegration from '../../../lib/mobile-app-integration';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await mobileAppIntegration.getMobileAppStats();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Mobile app stats API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}