const { adminAuth, requirePermission, auditLog } = require('../../../../api/middleware/adminAuth');
const { FEATURES } = require('../../../../mobile/config/featureFlags');

export default async function handler(req, res) {
  // HARD FREEZE: Check feature flag before any payout operations
  if (!FEATURES.DELAYED_PAYOUT) {
    return res.status(403).json({ 
      error: 'Delayed Payout is disabled. No payout operations allowed.',
      reason: 'Feature requires legal, operational, and payment provider approvals'
    });
  }

  await adminAuth(req, res, async () => {
    await requirePermission('payouts', 'manage')(req, res, async () => {
      if (req.method === 'GET') {
        return await getPayouts(req, res);
      } else if (req.method === 'POST') {
        return await createPayout(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function getPayouts(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, s.business_name, s.account_bank, s.account_number
      FROM payouts p
      LEFT JOIN subaccounts s ON p.seller_id = s.seller_id
    `;
    
    if (status) query += ` WHERE p.status = ?`;
    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    
    const params = status ? [status, limit, offset] : [limit, offset];
    const payouts = await db.query(query, params);
    
    res.json({ payouts, page, limit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createPayout(req, res) {
  try {
    const { seller_id, amount, reason, priority = 'NORMAL' } = req.body;
    const adminId = req.admin.id;
    
    // Validate input
    if (!seller_id || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid seller ID and amount required' });
    }

    // Get seller details and subaccount
    const [seller] = await db.query(
      `SELECT s.*, sa.account_bank, sa.account_number, sa.bank_name 
       FROM sellers s 
       LEFT JOIN subaccounts sa ON s.id = sa.seller_id 
       WHERE s.id = ? AND sa.status = 'ACTIVE'`,
      [seller_id]
    );
    
    if (!seller.length) {
      return res.status(400).json({ error: 'Seller not found or no active bank account' });
    }

    const sellerData = seller[0];
    const reference = `PAYOUT_${seller_id}_${Date.now()}`;

    // Check available balance
    const [balance] = await db.query(
      'SELECT COALESCE(SUM(amount), 0) as available_balance FROM seller_balances WHERE seller_id = ?',
      [seller_id]
    );

    if (balance[0].available_balance < amount) {
      return res.status(400).json({ 
        error: 'Insufficient balance',
        available: balance[0].available_balance,
        requested: amount
      });
    }
    
    // Create Flutterwave transfer
    const transferPayload = {
      account_bank: sellerData.account_bank,
      account_number: sellerData.account_number,
      amount: amount,
      currency: 'NGN',
      reference: reference,
      narration: reason || `Payout to ${sellerData.business_name}`,
      callback_url: `${process.env.BASE_URL}/api/webhooks/flutterwave`,
      debit_currency: 'NGN'
    };

    const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/transfers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transferPayload)
    });
    
    const result = await flutterwaveResponse.json();
    
    if (result.status === 'success') {
      // Save payout record
      const [payoutResult] = await db.query(
        `INSERT INTO payouts (seller_id, amount, flutterwave_reference, status, reason, priority, created_by, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [seller_id, amount, result.data.reference, 'PROCESSING', reason, priority, adminId]
      );

      // Deduct from seller balance
      await db.query(
        'UPDATE seller_balances SET amount = amount - ? WHERE seller_id = ?',
        [amount, seller_id]
      );
      
      // Comprehensive audit logging
      await AuditLoggingService.logPayoutAction(
        adminId,
        'PAYOUT_CREATED',
        payoutResult.insertId,
        amount,
        {
          sellerId: seller_id,
          businessName: sellerData.business_name,
          accountNumber: sellerData.account_number,
          bankName: sellerData.bank_name,
          flutterwaveReference: result.data.reference,
          reason,
          priority
        },
        req.ip,
        req.headers['user-agent']
      );

      res.json({ 
        success: true, 
        payoutId: payoutResult.insertId,
        reference: result.data.reference,
        amount,
        status: 'PROCESSING'
      });
    } else {
      // Log failed payout attempt
      await AuditLoggingService.logPayoutAction(
        adminId,
        'PAYOUT_FAILED',
        null,
        amount,
        {
          sellerId: seller_id,
          error: result.message,
          reason
        },
        req.ip,
        req.headers['user-agent']
      );

      res.status(400).json({ 
        error: 'Payout creation failed',
        details: result.message 
      });
    }
  } catch (error) {
    console.error('Payout creation error:', error);
    
    // Log system error
    await AuditLoggingService.logPayoutAction(
      req.admin?.id,
      'PAYOUT_SYSTEM_ERROR',
      null,
      req.body.amount,
      {
        sellerId: req.body.seller_id,
        error: error.message
      },
      req.ip,
      req.headers['user-agent']
    );

    res.status(500).json({ error: 'System error: ' + error.message });
  }
}