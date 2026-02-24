const { adminAuth, requirePermission } = require('../../../../api/middleware/adminAuth');
const { db } = require('../../../../services/sqlDatabaseService');

export default async function handler(req, res) {
  await adminAuth(req, res, async () => {
    await requirePermission('financial', 'view')(req, res, async () => {
      if (req.method === 'GET') {
        return await getFinancialStats(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function getFinancialStats(req, res) {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    
    // Get transaction statistics
    const [transactionStats] = await db.query(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'COMPLETED' THEN amount ELSE 0 END) as completed_amount,
        SUM(CASE WHEN status = 'FAILED' THEN amount ELSE 0 END) as failed_amount,
        AVG(amount) as avg_transaction_amount
      FROM transactions 
      WHERE created_at >= ?
    `, [startDate]);

    // Get escrow statistics
    const [escrowStats] = await db.query(`
      SELECT 
        COUNT(*) as total_escrows,
        SUM(CASE WHEN status = 'ACTIVE' THEN amount ELSE 0 END) as active_escrow_amount,
        SUM(CASE WHEN status = 'COMPLETED' THEN amount ELSE 0 END) as completed_escrow_amount,
        COUNT(CASE WHEN status = 'DISPUTED' THEN 1 END) as disputed_escrows
      FROM escrows 
      WHERE created_at >= ?
    `, [startDate]);

    // Get payout statistics
    const [payoutStats] = await db.query(`
      SELECT 
        COUNT(*) as total_payouts,
        SUM(CASE WHEN status = 'COMPLETED' THEN amount ELSE 0 END) as completed_payout_amount,
        SUM(CASE WHEN status = 'PROCESSING' THEN amount ELSE 0 END) as pending_payout_amount,
        COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_payouts
      FROM payouts 
      WHERE created_at >= ?
    `, [startDate]);

    // Get webhook statistics
    const [webhookStats] = await db.query(`
      SELECT 
        COUNT(*) as total_webhooks,
        COUNT(CASE WHEN processing_status = 'SUCCESS' THEN 1 END) as successful_webhooks,
        COUNT(CASE WHEN processing_status = 'FAILED' THEN 1 END) as failed_webhooks,
        AVG(retry_count) as avg_retry_count
      FROM webhook_logs 
      WHERE created_at >= ?
    `, [startDate]);

    // Get audit log statistics
    const [auditStats] = await db.query(`
      SELECT 
        COUNT(*) as total_audit_events,
        COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_events,
        COUNT(CASE WHEN severity = 'WARNING' THEN 1 END) as warning_events,
        COUNT(CASE WHEN action LIKE '%ESCROW%' THEN 1 END) as escrow_events
      FROM audit_logs 
      WHERE created_at >= ?
    `, [startDate]);

    // Get recent reconciliation reports
    const recentReconciliations = await db.query(`
      SELECT r.*, a.name as admin_name
      FROM reconciliation_reports r
      LEFT JOIN admins a ON r.admin_id = a.id
      ORDER BY r.created_at DESC
      LIMIT 5
    `);

    // Calculate financial health metrics
    const totalVolume = (transactionStats[0]?.completed_amount || 0);
    const escrowUtilization = totalVolume > 0 ? 
      ((escrowStats[0]?.active_escrow_amount || 0) / totalVolume * 100).toFixed(2) : 0;
    
    const webhookReliability = webhookStats[0]?.total_webhooks > 0 ?
      ((webhookStats[0]?.successful_webhooks || 0) / webhookStats[0].total_webhooks * 100).toFixed(2) : 100;

    const payoutEfficiency = payoutStats[0]?.total_payouts > 0 ?
      ((payoutStats[0]?.total_payouts - (payoutStats[0]?.failed_payouts || 0)) / payoutStats[0].total_payouts * 100).toFixed(2) : 100;

    res.json({
      period: `${period} days`,
      timestamp: new Date().toISOString(),
      transactions: transactionStats[0] || {},
      escrows: escrowStats[0] || {},
      payouts: payoutStats[0] || {},
      webhooks: webhookStats[0] || {},
      audit: auditStats[0] || {},
      reconciliations: recentReconciliations || [],
      healthMetrics: {
        totalVolume,
        escrowUtilization: parseFloat(escrowUtilization),
        webhookReliability: parseFloat(webhookReliability),
        payoutEfficiency: parseFloat(payoutEfficiency)
      }
    });
  } catch (error) {
    console.error('Financial stats error:', error);
    res.status(500).json({ error: 'Failed to fetch financial statistics' });
  }
}