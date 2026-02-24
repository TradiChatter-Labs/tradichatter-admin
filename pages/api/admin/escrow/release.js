const { adminAuth, requirePermission, auditLog } = require('../../../../api/middleware/adminAuth');
const { FEATURES } = require('../../../../mobile/config/featureFlags');

export default async function handler(req, res) {
  // HARD FREEZE: Check feature flag before any escrow operations
  if (!FEATURES.DELAYED_PAYOUT) {
    return res.status(403).json({ 
      error: 'Delayed Payout is disabled. No escrow operations allowed.',
      reason: 'Feature requires legal, operational, and payment provider approvals'
    });
  }

  await adminAuth(req, res, async () => {
    await requirePermission('escrow', 'manage')(req, res, async () => {
      if (req.method === 'POST') {
        return await releaseEscrow(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function releaseEscrow(req, res) {
  try {
    const { escrowId, amount, reason } = req.body;

    if (!escrowId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update escrow status
    await db.query(
      'UPDATE escrow_transactions SET status = ?, admin_action_by = ?, admin_action_reason = ?, updated_at = NOW() WHERE id = ?',
      ['RELEASED', req.admin.id, reason || 'Admin release', escrowId]
    );

    // Log the action
    await auditLog(req.admin.id, 'ESCROW_RELEASED', {
      escrow_id: escrowId,
      amount,
      reason
    }, req.ip);

    res.json({ 
      success: true, 
      message: 'Escrow released successfully',
      escrowId,
      releasedAmount: amount,
      newStatus: 'RELEASED'
    });

  } catch (error) {
    console.error('Error releasing escrow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}