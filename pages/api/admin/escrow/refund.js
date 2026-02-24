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
        return await refundEscrow(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function refundEscrow(req, res) {
  try {
    const { escrowId, amount, reason } = req.body;

    if (!escrowId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update escrow status
    await db.query(
      'UPDATE escrow_transactions SET status = ?, admin_action_by = ?, admin_action_reason = ?, updated_at = NOW() WHERE id = ?',
      ['REFUNDED', req.admin.id, reason || 'Admin refund', escrowId]
    );

    // Log the action
    await auditLog(req.admin.id, 'ESCROW_REFUNDED', {
      escrow_id: escrowId,
      amount,
      reason
    }, req.ip);

    res.json({ 
      success: true, 
      message: 'Refund processed successfully',
      escrowId,
      refundAmount: amount,
      newStatus: 'REFUNDED'
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}