import mobileAppIntegration from '../../../lib/mobile-app-integration';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await mobileAppIntegration.getMobileAppBusinesses();
      return res.status(200).json(result);
    }

    if (req.method === 'PUT') {
      const { businessId, isActive } = req.body;
      
      if (!businessId || typeof isActive !== 'boolean') {
        return res.status(400).json({ 
          success: false, 
          error: 'businessId and isActive (boolean) are required' 
        });
      }

      const result = await mobileAppIntegration.updateBusinessStatus(businessId, isActive);
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Mobile app businesses API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}