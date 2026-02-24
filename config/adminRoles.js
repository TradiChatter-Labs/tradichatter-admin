// TradiChatter Admin Roles & Permissions Configuration
// Defines role-based access control for admin portal

export const ADMIN_ROLES = {
  SECURITY_ADMIN: 'security_admin',
  PLATFORM_ADMIN: 'platform_admin', 
  COMPLIANCE_ADMIN: 'compliance_admin',
  SUPER_ADMIN: 'super_admin'
};

export const PERMISSIONS = {
  // Metrics Viewing
  VIEW_SECURITY_METRICS: 'view_security_metrics',
  VIEW_PLATFORM_METRICS: 'view_platform_metrics',
  VIEW_COMPLIANCE_METRICS: 'view_compliance_metrics',
  VIEW_FULL_AUDIT_LOGS: 'view_full_audit_logs',
  VIEW_PII_DATA: 'view_pii_data',
  
  // Account Actions
  SUSPEND_ACCOUNT: 'suspend_account',
  REINSTATE_ACCOUNT: 'reinstate_account',
  
  // KYC Actions
  APPROVE_KYC: 'approve_kyc',
  REJECT_KYC: 'reject_kyc',
  
  // Escrow Actions
  RELEASE_ESCROW: 'release_escrow',
  HOLD_ESCROW: 'hold_escrow',
  
  // Content Moderation
  OVERRIDE_MODERATION: 'override_moderation',
  
  // System Actions
  ENABLE_SECURITY_FREEZE: 'enable_security_freeze',
  DISABLE_SECURITY_FREEZE: 'disable_security_freeze'
};

export const ROLE_PERMISSIONS = {
  [ADMIN_ROLES.SECURITY_ADMIN]: [
    PERMISSIONS.VIEW_SECURITY_METRICS,
    PERMISSIONS.SUSPEND_ACCOUNT,
    PERMISSIONS.REINSTATE_ACCOUNT,
    PERMISSIONS.OVERRIDE_MODERATION
  ],
  
  [ADMIN_ROLES.PLATFORM_ADMIN]: [
    PERMISSIONS.VIEW_PLATFORM_METRICS,
    PERMISSIONS.RELEASE_ESCROW,
    PERMISSIONS.HOLD_ESCROW,
    PERMISSIONS.OVERRIDE_MODERATION
  ],
  
  [ADMIN_ROLES.COMPLIANCE_ADMIN]: [
    PERMISSIONS.VIEW_COMPLIANCE_METRICS,
    PERMISSIONS.APPROVE_KYC,
    PERMISSIONS.REJECT_KYC
  ],
  
  [ADMIN_ROLES.SUPER_ADMIN]: [
    ...Object.values(PERMISSIONS) // All permissions
  ]
};

// Actions requiring dual approval
export const DUAL_APPROVAL_ACTIONS = [
  PERMISSIONS.SUSPEND_ACCOUNT,
  PERMISSIONS.REINSTATE_ACCOUNT,
  PERMISSIONS.RELEASE_ESCROW,
  PERMISSIONS.HOLD_ESCROW
];

// Actions requiring MFA revalidation
export const MFA_REQUIRED_ACTIONS = [
  PERMISSIONS.RELEASE_ESCROW,
  PERMISSIONS.ENABLE_SECURITY_FREEZE,
  PERMISSIONS.DISABLE_SECURITY_FREEZE,
  PERMISSIONS.VIEW_PII_DATA
];

// Rate limits per role (actions per hour)
export const ROLE_RATE_LIMITS = {
  [ADMIN_ROLES.SECURITY_ADMIN]: 50,
  [ADMIN_ROLES.PLATFORM_ADMIN]: 30,
  [ADMIN_ROLES.COMPLIANCE_ADMIN]: 20,
  [ADMIN_ROLES.SUPER_ADMIN]: 100
};

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

export function requiresDualApproval(permission) {
  return DUAL_APPROVAL_ACTIONS.includes(permission);
}

export function requiresMFA(permission) {
  return MFA_REQUIRED_ACTIONS.includes(permission);
}