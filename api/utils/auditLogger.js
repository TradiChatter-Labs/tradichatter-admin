const db = require('../config/database');

const auditLog = async (adminId, actionType, details, ipAddress) => {
  try {
    await db.query(
      'INSERT INTO audit_logs (admin_id, action_type, details, ip_address, timestamp) VALUES (?, ?, ?, ?, NOW())',
      [adminId, actionType, JSON.stringify(details), ipAddress]
    );
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

module.exports = { auditLog };