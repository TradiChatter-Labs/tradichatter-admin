const { adminAuth, requirePermission } = require('../../../../api/middleware/adminAuth');
const AuditLoggingService = require('../../../../services/auditLoggingService');

export default async function handler(req, res) {
  await adminAuth(req, res, async () => {
    await requirePermission('financial', 'view')(req, res, async () => {
      if (req.method === 'GET') {
        return await exportFinancialData(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function exportFinancialData(req, res) {
  try {
    const { 
      type = 'audit-logs', 
      startDate, 
      endDate, 
      format = 'csv',
      action,
      severity 
    } = req.query;

    let csvData = [];
    let filename = '';

    switch (type) {
      case 'audit-logs':
        csvData = await AuditLoggingService.exportAuditLogs({
          startDate,
          endDate,
          action,
          severity
        });
        filename = `audit-logs-${startDate || 'all'}-${endDate || 'all'}.csv`;
        break;
        
      case 'reconciliation':
        csvData = await exportReconciliationData(startDate, endDate);
        filename = `reconciliation-${startDate}-${endDate}.csv`;
        break;
        
      case 'payouts':
        csvData = await exportPayoutData(startDate, endDate);
        filename = `payouts-${startDate}-${endDate}.csv`;
        break;
        
      case 'webhooks':
        csvData = await exportWebhookData(startDate, endDate);
        filename = `webhooks-${startDate}-${endDate}.csv`;
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    if (format === 'csv') {
      const csvContent = csvData.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);
    } else {
      res.json({ data: csvData, filename });
    }

    // Log export activity
    await AuditLoggingService.logSystemAction(
      req.admin.id,
      'DATA_EXPORT',
      {
        exportType: type,
        startDate,
        endDate,
        format,
        recordCount: csvData.length - 1 // Subtract header row
      },
      req.ip,
      req.headers['user-agent']
    );

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed: ' + error.message });
  }
}

async function exportReconciliationData(startDate, endDate) {
  const { db } = require('../../../../services/sqlDatabaseService');
  
  let query = `
    SELECT 
      r.id,
      r.start_date,
      r.end_date,
      r.gateway,
      r.matched_count,
      r.discrepancy_count,
      r.total_amount,
      r.created_at,
      a.name as admin_name
    FROM reconciliation_reports r
    LEFT JOIN admins a ON r.admin_id = a.id
  `;
  
  const params = [];
  if (startDate && endDate) {
    query += ' WHERE DATE(r.created_at) BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }
  
  query += ' ORDER BY r.created_at DESC';
  
  const reports = await db.query(query, params);
  
  const headers = ['Report ID', 'Start Date', 'End Date', 'Gateway', 'Matched', 'Discrepancies', 'Total Amount', 'Created At', 'Admin'];
  const rows = reports.map(r => [
    r.id,
    r.start_date,
    r.end_date,
    r.gateway,
    r.matched_count,
    r.discrepancy_count,
    r.total_amount,
    r.created_at,
    r.admin_name
  ]);
  
  return [headers, ...rows];
}

async function exportPayoutData(startDate, endDate) {
  const { db } = require('../../../../services/sqlDatabaseService');
  
  let query = `
    SELECT 
      p.id,
      p.seller_id,
      s.business_name,
      p.amount,
      p.status,
      p.flutterwave_reference,
      p.reason,
      p.priority,
      p.created_at,
      p.completed_at,
      a.name as created_by_name
    FROM payouts p
    LEFT JOIN sellers s ON p.seller_id = s.id
    LEFT JOIN admins a ON p.created_by = a.id
  `;
  
  const params = [];
  if (startDate && endDate) {
    query += ' WHERE DATE(p.created_at) BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }
  
  query += ' ORDER BY p.created_at DESC';
  
  const payouts = await db.query(query, params);
  
  const headers = ['Payout ID', 'Seller ID', 'Business Name', 'Amount', 'Status', 'Reference', 'Reason', 'Priority', 'Created At', 'Completed At', 'Created By'];
  const rows = payouts.map(p => [
    p.id,
    p.seller_id,
    p.business_name,
    p.amount,
    p.status,
    p.flutterwave_reference,
    p.reason,
    p.priority,
    p.created_at,
    p.completed_at,
    p.created_by_name
  ]);
  
  return [headers, ...rows];
}

async function exportWebhookData(startDate, endDate) {
  const { db } = require('../../../../services/sqlDatabaseService');
  
  let query = `
    SELECT 
      id,
      webhook_type,
      processing_status,
      signature_verified,
      retry_count,
      error_message,
      created_at,
      processed_at
    FROM webhook_logs
  `;
  
  const params = [];
  if (startDate && endDate) {
    query += ' WHERE DATE(created_at) BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const webhooks = await db.query(query, params);
  
  const headers = ['Webhook ID', 'Type', 'Status', 'Signature Verified', 'Retry Count', 'Error Message', 'Created At', 'Processed At'];
  const rows = webhooks.map(w => [
    w.id,
    w.webhook_type,
    w.processing_status,
    w.signature_verified ? 'Yes' : 'No',
    w.retry_count,
    w.error_message || '',
    w.created_at,
    w.processed_at
  ]);
  
  return [headers, ...rows];
}