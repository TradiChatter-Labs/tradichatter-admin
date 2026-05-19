// Role-Based Access Control — permission definitions
// Roles: super_admin > admin > moderator > viewer

const ROLE_HIERARCHY = { super_admin: 4, admin: 3, moderator: 2, viewer: 1 };

// Pages restricted above 'viewer' level
const PAGE_PERMISSIONS = {
  '/admin-users': 'super_admin',
  '/feature-flags': 'admin',
  '/maintenance-mode': 'admin',
  '/system-configuration': 'admin',
  '/security-management': 'admin',
  '/security-management-new': 'admin',
  '/security-audit-dashboard': 'admin',
  '/platform-fees': 'super_admin',
  '/subscription-management': 'admin',
  '/ai-agents/kill-switch': 'admin',
};

// Actions that require write access (moderator+ can write, viewer cannot)
const WRITE_ROLES = ['super_admin', 'admin', 'moderator'];

export function canAccessPage(role, pathname) {
  const requiredRole = PAGE_PERMISSIONS[pathname];
  if (!requiredRole) return true; // No restriction = everyone can view
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole];
}

export function canWrite(role) {
  return WRITE_ROLES.includes(role);
}

export function getRoleLevel(role) {
  return ROLE_HIERARCHY[role] || 0;
}

export default { canAccessPage, canWrite, getRoleLevel, PAGE_PERMISSIONS };
