const { FEATURES } = require('../../../../mobile/config/featureFlags');

export default async function handler(req, res) {
  // HARD FREEZE: Check feature flag before any escrow operations
  if (!FEATURES.DELAYED_PAYOUT) {
    return res.status(403).json({ 
      error: 'Delayed Payout is disabled. No escrow operations allowed.',
      reason: 'Feature requires legal, operational, and payment provider approvals'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { escrowId, resolution } = req.body;

    if (!escrowId || !resolution) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log(`Resolving dispute for escrow ${escrowId}`);

    res.status(200).json({ 
      success: true, 
      message: 'Dispute resolved successfully',
      escrowId,
      newStatus: 'active'
    });

  } catch (error) {
    console.error('Error resolving dispute:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}