// TradiChatter Role-Based Dashboard View Controller
// Enforces role-based access to metrics and actions

import { ADMIN_ROLES, PERMISSIONS, hasPermission } from '../config/adminRoles.js';

export class DashboardViewController {
  constructor(userRole, userId) {
    this.userRole = userRole;
    this.userId = userId;
  }

  // Get allowed metrics based on role
  getAllowedMetrics() {
    const baseMetrics = ['total_events', 'risk_score', 'active_alerts'];
    
    const roleMetrics = {
      [ADMIN_ROLES.SECURITY_ADMIN]: [
        ...baseMetrics,
        'failed_logins', 'suspicious_activity', 'account_suspensions',
        'chat_violations', 'content_flags'
      ],
      [ADMIN_ROLES.PLATFORM_ADMIN]: [
        ...baseMetrics,
        'escrow_holds', 'payment_failures', 'transaction_disputes',
        'platform_errors', 'api_anomalies'
      ],
      [ADMIN_ROLES.COMPLIANCE_ADMIN]: [
        ...baseMetrics,
        'kyc_pending', 'kyc_rejections', 'business_verifications',
        'compliance_violations', 'regulatory_flags'
      ],
      [ADMIN_ROLES.SUPER_ADMIN]: [
        ...baseMetrics,
        'failed_logins', 'suspicious_activity', 'account_suspensions',
        'escrow_holds', 'payment_failures', 'kyc_pending',
        'admin_actions', 'system_health', 'audit_trail'
      ]
    };

    return roleMetrics[this.userRole] || baseMetrics;
  }

  // Get allowed actions based on role
  getAllowedActions() {
    const actions = [];
    
    if (hasPermission(this.userRole, PERMISSIONS.SUSPEND_ACCOUNT)) {
      actions.push({ id: 'suspend_account', label: 'Suspend Account', critical: true });
    }
    
    if (hasPermission(this.userRole, PERMISSIONS.APPROVE_KYC)) {
      actions.push({ id: 'approve_kyc', label: 'Approve KYC', critical: false });
    }
    
    if (hasPermission(this.userRole, PERMISSIONS.RELEASE_ESCROW)) {
      actions.push({ id: 'release_escrow', label: 'Release Escrow', critical: true });
    }
    
    if (hasPermission(this.userRole, PERMISSIONS.OVERRIDE_MODERATION)) {
      actions.push({ id: 'override_moderation', label: 'Override Moderation', critical: false });
    }

    return actions;
  }

  // Mask PII based on role
  maskMetricData(data) {
    const canViewPII = hasPermission(this.userRole, PERMISSIONS.VIEW_PII_DATA);
    
    if (canViewPII) return data;

    // Mask sensitive data for non-super admins
    return {
      ...data,
      user_id: data.user_id ? `***${data.user_id.slice(-4)}` : null,
      email: data.email ? `***@${data.email.split('@')[1]}` : null,
      phone: data.phone ? `***${data.phone.slice(-4)}` : null,
      business_name: data.business_name ? `${data.business_name.slice(0, 3)}***` : null,
      ip_address: data.ip_address ? `${data.ip_address.split('.')[0]}.***` : null
    };
  }

  // Generate dashboard configuration
  getDashboardConfig() {
    return {
      role: this.userRole,
      allowedMetrics: this.getAllowedMetrics(),
      allowedActions: this.getAllowedActions(),
      canViewPII: hasPermission(this.userRole, PERMISSIONS.VIEW_PII_DATA),
      canViewFullAudit: hasPermission(this.userRole, PERMISSIONS.VIEW_FULL_AUDIT_LOGS),
      rateLimitPerHour: this.getRateLimit()
    };
  }

  getRateLimit() {
    const limits = {
      [ADMIN_ROLES.SECURITY_ADMIN]: 50,
      [ADMIN_ROLES.PLATFORM_ADMIN]: 30,
      [ADMIN_ROLES.COMPLIANCE_ADMIN]: 20,
      [ADMIN_ROLES.SUPER_ADMIN]: 100
    };
    return limits[this.userRole] || 10;
  }
}