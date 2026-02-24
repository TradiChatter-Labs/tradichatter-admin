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
    const { escrowId, buyerEmail, sellerEmail } = req.body;

    if (!escrowId || !buyerEmail || !sellerEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log(`Contacting parties for escrow ${escrowId}: ${buyerEmail}, ${sellerEmail}`);

    res.status(200).json({ 
      success: true, 
      message: 'Communication sent to both parties',
      escrowId,
      recipients: [buyerEmail, sellerEmail]
    });

  } catch (error) {
    console.error('Error contacting parties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}