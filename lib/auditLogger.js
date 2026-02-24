// TradiChatter Audit Logging Service
// Immutable audit trail for all admin actions and approvals

export class AuditLogger {
  constructor() {
    this.logBuffer = []; // In production: direct to Appwrite/database
  }

  // Log dashboard action
  async logDashboardAction(adminId, role, action, details) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'DASHBOARD_ACTION',
      adminId,
      role,
      action,
      details,
      timestamp: new Date().toISOString(),
      source: 'admin_dashboard',
      immutable: true
    };

    await this.writeAuditLog(logEntry);
    return logEntry.id;
  }

  // Log dual approval workflow
  async logDualApproval(actionId, approver1, approver2, decision, details) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'DUAL_APPROVAL',
      actionId,
      approver1: {
        adminId: approver1.adminId,
        role: approver1.role,
        timestamp: approver1.timestamp,
        decision: approver1.decision
      },
      approver2: approver2 ? {
        adminId: approver2.adminId,
        role: approver2.role,
        timestamp: approver2.timestamp,
        decision: approver2.decision
      } : null,
      finalDecision: decision,
      details,
      timestamp: new Date().toISOString(),
      immutable: true
    };

    await this.writeAuditLog(logEntry);
    return logEntry.id;
  }

  // Log MFA revalidation
  async logMFARevalidation(adminId, action, success, method) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'MFA_REVALIDATION',
      adminId,
      action,
      success,
      method, // 'otp', 'sms', 'email'
      timestamp: new Date().toISOString(),
      immutable: true
    };

    await this.writeAuditLog(logEntry);
    return logEntry.id;
  }

  // Log permission check
  async logPermissionCheck(adminId, role, permission, granted, resource) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'PERMISSION_CHECK',
      adminId,
      role,
      permission,
      granted,
      resource,
      timestamp: new Date().toISOString(),
      immutable: true
    };

    await this.writeAuditLog(logEntry);
    return logEntry.id;
  }

  // Log security safeguard trigger
  async logSafeguardTrigger(adminId, safeguard, reason, action) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'SAFEGUARD_TRIGGER',
      adminId,
      safeguard, // 'rate_limit', 'account_lock', 'security_freeze'
      reason,
      action, // 'blocked', 'locked', 'frozen'
      timestamp: new Date().toISOString(),
      immutable: true
    };

    await this.writeAuditLog(logEntry);
    return logEntry.id;
  }

  // Log role change
  async logRoleChange(targetAdminId, changedBy, oldRole, newRole, reason) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'ROLE_CHANGE',
      targetAdminId,
      changedBy,
      oldRole,
      newRole,
      reason,
      timestamp: new Date().toISOString(),
      immutable: true
    };

    await this.writeAuditLog(logEntry);
    return logEntry.id;
  }

  // Write to immutable audit log
  async writeAuditLog(logEntry) {
    try {
      // In production: Write to Appwrite collection with system-only permissions
      this.logBuffer.push(logEntry);
      
      // Simulate immutable storage
      Object.freeze(logEntry);
      
      return {
        success: true,
        logId: logEntry.id,
        timestamp: logEntry.timestamp
      };
    } catch (error) {
      // Critical: Audit logging failure should be escalated
      console.error('CRITICAL: Audit log write failed', error);
      throw new Error('Audit logging failed - action cannot proceed');
    }
  }

  // Get audit trail for admin (role-based filtering)
  async getAuditTrail(requestingRole, filters = {}) {
    const canViewFull = requestingRole === 'super_admin';
    
    let logs = this.logBuffer.filter(log => {
      if (filters.adminId && log.adminId !== filters.adminId) return false;
      if (filters.type && log.type !== filters.type) return false;
      if (filters.startDate && log.timestamp < filters.startDate) return false;
      if (filters.endDate && log.timestamp > filters.endDate) return false;
      return true;
    });

    // Mask sensitive data for non-super admins
    if (!canViewFull) {
      logs = logs.map(log => ({
        ...log,
        adminId: log.adminId ? `***${log.adminId.slice(-4)}` : null,
        details: log.details ? { ...log.details, sensitive: '[MASKED]' } : null
      }));
    }

    return {
      success: true,
      logs,
      count: logs.length,
      canViewFull
    };
  }

  // Generate unique log ID
  generateLogId() {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get audit statistics
  async getAuditStats(role) {
    const canViewStats = ['super_admin', 'security_admin'].includes(role);
    
    if (!canViewStats) {
      return { success: false, error: 'Insufficient permissions' };
    }

    const stats = {
      totalLogs: this.logBuffer.length,
      logsByType: {},
      recentActivity: this.logBuffer.slice(-10),
      timestamp: new Date().toISOString()
    };

    // Count by type
    this.logBuffer.forEach(log => {
      stats.logsByType[log.type] = (stats.logsByType[log.type] || 0) + 1;
    });

    return { success: true, stats };
  }
}