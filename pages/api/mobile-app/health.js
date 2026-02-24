import mobileAppIntegration from '../../../lib/mobile-app-integration';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const health = await mobileAppIntegration.checkHealth();
    const statusCode = health.status === 'healthy' ? 200 : health.status === 'disabled' ? 200 : 503;
    
    return res.status(statusCode).json({
      success: health.status === 'healthy',
      status: health.status,
      message: health.message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Mobile app health check error:', error);
    res.status(500).json({ 
      success: false, 
      status: 'error',
      message: 'Health check failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}