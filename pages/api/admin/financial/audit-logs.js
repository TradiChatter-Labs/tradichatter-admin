const { adminAuth, requirePermission } = require('../../../../api/middleware/adminAuth');
const AuditLoggingService = require('../../../../services/auditLoggingService');

module.exports = async function handler(req, res) {
  await adminAuth(req, res, async () => {
    await requirePermission('financial', 'view')(req, res, async () => {
      if (req.method === 'GET') {
        return await getAuditLogs(req, res);
      } else if (req.method === 'POST') {
        return await exportAuditLogs(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function getAuditLogs(req, res) {
  try {
    const { page = 1, limit = 50, action, severity, entityId, startDate, endDate, searchTerm } = req.query;
    const offset = (page - 1) * limit;

    const filters = {
      limit: parseInt(limit),
      offset,
      action,
      severity,
      entityId,
      startDate,
      endDate
    };

    const logs = await AuditLoggingService.getAuditTrail(filters);
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: logs.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
}

async function exportAuditLogs(req, res) {
  try {
    const { startDate, endDate, action, severity } = req.body;
    
    const csvData = await AuditLoggingService.exportAuditLogs({
      startDate,
      endDate,
      action,
      severity
    });
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
}