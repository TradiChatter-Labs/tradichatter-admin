const { adminAuth, requirePermission, auditLog } = require('../../../../api/middleware/adminAuth');
const AuditLoggingService = require('../../../../services/auditLoggingService');
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
        return await forceReleaseEscrow(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function forceReleaseEscrow(req, res) {
  try {
    const { escrowId, reason, releaseAmount } = req.body;
    const adminId = req.admin.id;

    if (!escrowId || !reason) {
      return res.status(400).json({ error: 'Escrow ID and reason required' });
    }

    // 1. Validate escrow exists and get details
    const [escrow] = await db.query(
      'SELECT * FROM escrows WHERE id = ? AND status IN ("ACTIVE", "DISPUTED")',
      [escrowId]
    );

    if (!escrow.length) {
      return res.status(404).json({ error: 'Escrow not found or cannot be force released' });
    }

    const escrowData = escrow[0];
    const amountToRelease = releaseAmount || escrowData.amount;

    // 2. Process Flutterwave transfer to seller
    const transferResponse = await fetch('https://api.flutterwave.com/v3/transfers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account_bank: escrowData.seller_bank_code,
        account_number: escrowData.seller_account_number,
        amount: amountToRelease,
        currency: 'NGN',
        reference: `FORCE_RELEASE_${escrowId}_${Date.now()}`,
        narration: `Force release for escrow ${escrowId}`,
        callback_url: `${process.env.BASE_URL}/api/webhooks/flutterwave`
      })
    });

    const transferResult = await transferResponse.json();

    if (transferResult.status !== 'success') {
      throw new Error(`Transfer failed: ${transferResult.message}`);
    }

    // 3. Update escrow status
    await db.query(
      'UPDATE escrows SET status = ?, released_amount = ?, released_at = NOW(), admin_notes = ? WHERE id = ?',
      ['FORCE_RELEASED', amountToRelease, reason, escrowId]
    );

    // 4. Create transaction record
    await db.query(
      'INSERT INTO transactions (escrow_id, type, amount, status, flutterwave_reference, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [escrowId, 'FORCE_RELEASE', amountToRelease, 'COMPLETED', transferResult.data.reference]
    );

    // 5. Comprehensive audit logging
    await AuditLoggingService.logFinancialAction({
      adminId,
      action: 'ESCROW_FORCE_RELEASE',
      entityType: 'escrow',
      entityId: escrowId,
      details: {
        originalAmount: escrowData.amount,
        releasedAmount: amountToRelease,
        reason,
        flutterwaveReference: transferResult.data.reference,
        sellerId: escrowData.seller_id,
        buyerId: escrowData.buyer_id
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ 
      success: true, 
      message: 'Force release completed successfully',
      escrowId,
      amountReleased: amountToRelease,
      transferReference: transferResult.data.reference
    });
  } catch (error) {
    console.error('Force release error:', error);
    
    // Log failed attempt
    await AuditLoggingService.logFinancialAction({
      adminId: req.admin?.id,
      action: 'ESCROW_FORCE_RELEASE_FAILED',
      entityType: 'escrow',
      entityId: req.body.escrowId,
      details: {
        error: error.message,
        reason: req.body.reason
      },
      ipAddress: req.ip,
      severity: 'HIGH'
    });

    res.status(500).json({ error: 'Force release failed: ' + error.message });
  }
}