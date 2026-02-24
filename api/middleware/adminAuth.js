import jwt from 'jsonwebtoken';
import { db } from '../../config/database.js';

// Admin-specific authentication middleware (separate from mobile app)
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Admin-Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Admin access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    
    // Verify admin exists and is active
    const [admin] = await db.execute(
      'SELECT id, email, role, status FROM admins WHERE id = ? AND status = "ACTIVE"',
      [decoded.adminId]
    );

    if (!admin.length) {
      return res.status(401).json({ error: 'Invalid admin token' });
    }

    req.admin = admin[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid admin token' });
  }
};

// Permission-based authorization
const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const [permissions] = await db.execute(`
        SELECT p.name FROM admin_permissions p
        JOIN admin_role_permissions rp ON p.id = rp.permission_id
        JOIN admin_user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.admin_id = ? AND p.resource = ? AND p.action = ?
      `, [req.admin.id, resource, action]);

      if (!permissions.length) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

// Audit logging middleware
const auditLog = (actionType, resourceType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log successful admin actions
      if (res.statusCode < 400) {
        db.execute(`
          INSERT INTO audit_logs (admin_id, action_type, resource_type, resource_id, details, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          req.admin.id,
          actionType,
          resourceType,
          req.params.id || null,
          JSON.stringify({ body: req.body, params: req.params }),
          req.ip,
          req.get('User-Agent')
        ]).catch(console.error);
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

export { adminAuth, requirePermission, auditLog };