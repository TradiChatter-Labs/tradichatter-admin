import jwt from 'jsonwebtoken';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production';

// Extract admin from request token. Returns null if invalid.
export function getAdminFromRequest(req) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.admin_token;
    if (!token) return null;
    return jwt.verify(token, ADMIN_JWT_SECRET);
  } catch {
    return null;
  }
}

// Middleware: reject if role is below required level
const ROLE_HIERARCHY = { super_admin: 4, admin: 3, moderator: 2, viewer: 1 };

export function requireRole(minRole) {
  return (handler) => async (req, res) => {
    const admin = getAdminFromRequest(req);
    if (!admin) return res.status(401).json({ error: 'Not authenticated' });
    if ((ROLE_HIERARCHY[admin.role] || 0) < (ROLE_HIERARCHY[minRole] || 0)) {
      return res.status(403).json({ error: `Requires ${minRole} role or higher` });
    }
    req.admin = admin;
    return handler(req, res);
  };
}
