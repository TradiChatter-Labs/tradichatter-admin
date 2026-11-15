import jwt from 'jsonwebtoken';
import { supabase, logAdminAction } from '../../lib/supabaseAdmin.js';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Admin-Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Admin access denied. No token provided.' });

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('id, email, role, status')
      .eq('id', decoded.adminId)
      .eq('status', 'active')
      .single();

    if (error || !admin) return res.status(401).json({ error: 'Invalid admin token' });

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid admin token' });
  }
};

const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    // Permissions are role-based via admin_users.role — simplified check
    if (!req.admin) return res.status(401).json({ error: 'Not authenticated' });
    if (req.admin.role !== 'super_admin' && req.admin.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

const auditLog = (actionType, resourceType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
      if (res.statusCode < 400 && req.admin) {
        logAdminAction({
          adminId: req.admin.id,
          action: actionType,
          entityType: resourceType,
          entityId: req.params?.id || null,
          details: { body: req.body, params: req.params },
          ip: req.ip,
        }).catch(console.error);
      }
      originalSend.call(this, data);
    };
    next();
  };
};

export { adminAuth, requirePermission, auditLog };
