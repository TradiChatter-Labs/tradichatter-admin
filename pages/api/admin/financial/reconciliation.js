const { adminAuth, requirePermission } = require('../../../../api/middleware/adminAuth');
const AuditLoggingService = require('../../../../services/auditLoggingService');
const { db } = require('../../../../services/sqlDatabaseService');

export default async function handler(req, res) {
  await adminAuth(req, res, async () => {
    await requirePermission('financial', 'manage')(req, res, async () => {
      if (req.method === 'POST') {
        return await runReconciliation(req, res);
      } else if (req.method === 'GET') {
        return await getReconciliationHistory(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function runReconciliation(req, res) {
  try {
    const { start, end, gateway = 'flutterwave' } = req.body;
    const adminId = req.admin.id;

    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates required' });
    }

    // Fetch transactions from database
    const transactions = await fetchTransactions(start, end, gateway);
    
    // Fetch gateway settlements
    const settlements = await fetchGatewaySettlements(gateway, start, end);
    
    // Compare and find discrepancies
    const reconciliation = compareTransactionsWithSettlements(transactions, settlements);

    // Save reconciliation report
    const [reportResult] = await db.query(
      `INSERT INTO reconciliation_reports (admin_id, start_date, end_date, gateway, matched_count, discrepancy_count, total_amount, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [adminId, start, end, gateway, reconciliation.summary.matchedCount, reconciliation.summary.discrepancyCount, reconciliation.summary.totalMatched]
    );

    // Log reconciliation activity
    await AuditLoggingService.logSystemAction(
      adminId,
      'FINANCIAL_RECONCILIATION',
      {
        gateway,
        startDate: start,
        endDate: end,
        summary: reconciliation.summary,
        reportId: reportResult.insertId
      },
      req.ip,
      req.headers['user-agent']
    );

    res.json({
      ...reconciliation,
      reportId: reportResult.insertId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Reconciliation error:', error);
    res.status(500).json({ error: 'Reconciliation failed: ' + error.message });
  }
}

async function getReconciliationHistory(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const reports = await db.query(
      `SELECT r.*, a.name as admin_name 
       FROM reconciliation_reports r 
       LEFT JOIN admins a ON r.admin_id = a.id 
       ORDER BY r.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    res.json({ reports, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reconciliation history' });
  }
}

async function fetchTransactions(startDate, endDate, gateway = 'flutterwave') {
  try {
    const query = `
      SELECT 
        t.id,
        t.reference,
        t.amount,
        t.status,
        t.gateway,
        t.created_at,
        t.flutterwave_reference,
        e.id as escrow_id,
        p.id as payout_id
      FROM transactions t
      LEFT JOIN escrows e ON t.escrow_id = e.id
      LEFT JOIN payouts p ON t.reference = p.flutterwave_reference
      WHERE DATE(t.created_at) BETWEEN ? AND ?
      AND t.gateway = ?
      AND t.status IN ('COMPLETED', 'SUCCESS')
      ORDER BY t.created_at DESC
    `;
    
    return await db.query(query, [startDate, endDate, gateway]);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

async function fetchGatewaySettlements(gateway, startDate, endDate) {
  try {
    if (gateway === 'flutterwave') {
      return await fetchFlutterwaveSettlements(startDate, endDate);
    }
    return [];
  } catch (error) {
    console.error('Error fetching settlements:', error);
    return [];
  }
}

async function fetchFlutterwaveSettlements(startDate, endDate) {
  try {
    const response = await fetch(`https://api.flutterwave.com/v3/settlements?from=${startDate}&to=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data.map(settlement => ({
        id: settlement.id,
        reference: settlement.merchant_reference,
        amount: settlement.gross_amount,
        net_amount: settlement.net_amount,
        fee: settlement.app_fee,
        settled_at: settlement.settlement_date,
        status: settlement.status
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Flutterwave API error:', error);
    return [];
  }
}

function compareTransactionsWithSettlements(transactions, settlements) {
  const txnMap = new Map();
  const settleMap = new Map();
  
  // Create maps for easier lookup
  transactions.forEach(t => {
    txnMap.set(t.reference, t);
    if (t.flutterwave_reference) {
      txnMap.set(t.flutterwave_reference, t);
    }
  });
  
  settlements.forEach(s => {
    settleMap.set(s.reference, s);
  });
  
  const matched = [];
  const discrepancies = [];
  let totalMatched = 0;
  let totalDiscrepancy = 0;
  
  // Find matches and amount discrepancies
  for (const [txnRef, txn] of txnMap) {
    const settlement = settleMap.get(txnRef);
    if (settlement) {
      if (Math.abs(settlement.amount - txn.amount) < 0.01) {
        matched.push({ 
          transaction: txn, 
          settlement,
          type: 'PERFECT_MATCH'
        });
        totalMatched += txn.amount;
      } else {
        discrepancies.push({ 
          type: 'AMOUNT_MISMATCH', 
          transaction: txn, 
          settlement,
          difference: settlement.amount - txn.amount
        });
        totalDiscrepancy += Math.abs(settlement.amount - txn.amount);
      }
      settleMap.delete(txnRef); // Remove to avoid duplicate processing
    } else {
      discrepancies.push({ 
        type: 'MISSING_SETTLEMENT', 
        transaction: txn,
        amount: txn.amount
      });
      totalDiscrepancy += txn.amount;
    }
  }
  
  // Find settlements without corresponding transactions
  for (const [ref, settlement] of settleMap) {
    discrepancies.push({ 
      type: 'UNKNOWN_SETTLEMENT', 
      settlement,
      amount: settlement.amount
    });
    totalDiscrepancy += settlement.amount;
  }
  
  return { 
    matched, 
    discrepancies, 
    summary: { 
      totalTransactions: transactions.length,
      totalSettlements: settlements.length,
      matchedCount: matched.length, 
      discrepancyCount: discrepancies.length,
      totalMatched,
      totalDiscrepancy,
      reconciliationRate: transactions.length > 0 ? (matched.length / transactions.length * 100).toFixed(2) : 0
    } 
  };
}

