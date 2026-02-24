// Admin-only authentication middleware (separate from mobile app)
import jwt from 'jsonwebtoken';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-key';

export const adminAuth = (handler) => {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Admin token required' });
      }

      const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
      req.admin = decoded;
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid admin token' });
    }
  };
};

export const requirePermission = (permission) => {
  return (handler) => {
    return adminAuth(async (req, res) => {
      const { permissions } = req.admin;
      
      if (!permissions.all && !permissions[permission]) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      return handler(req, res);
    });
  };
};

export const auditLog = async (adminId, actionType, resourceType, resourceId, details, req) => {
  // Log admin action to database
  const logData = {
    admin_id: adminId,
    action_type: actionType,
    resource_type: resourceType,
    resource_id: resourceId,
    details: JSON.stringify(details),
    ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    user_agent: req.headers['user-agent']
  };
  
  // Insert into admin_audit_logs table
  console.log('Admin Action:', logData);
};