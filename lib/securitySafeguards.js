// TradiChatter Automated Security Safeguards
// Implements rate limiting, account locking, and security freeze mode

import { ROLE_RATE_LIMITS } from '../config/adminRoles.js';

export class SecuritySafeguards {
  constructor() {
    this.rateLimitStore = new Map(); // In production: use Redis
    this.suspiciousActivity = new Map();
    this.securityFreezeActive = false;
  }

  // Rate limiting per admin role
  async checkRateLimit(adminId, role) {
    const key = `${adminId}:${role}`;
    const limit = ROLE_RATE_LIMITS[role] || 10;
    const window = 60 * 60 * 1000; // 1 hour
    const now = Date.now();

    if (!this.rateLimitStore.has(key)) {
      this.rateLimitStore.set(key, { count: 0, resetTime: now + window });
    }

    const record = this.rateLimitStore.get(key);

    // Reset if window expired
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + window;
    }

    if (record.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        message: `Rate limit exceeded. Limit: ${limit}/hour`
      };
    }

    record.count++;
    return {
      allowed: true,
      remaining: limit - record.count,
      resetTime: record.resetTime
    };
  }

  // Track suspicious admin activity
  trackSuspiciousActivity(adminId, activity) {
    const key = adminId;
    const now = Date.now();
    const window = 30 * 60 * 1000; // 30 minutes

    if (!this.suspiciousActivity.has(key)) {
      this.suspiciousActivity.set(key, []);
    }

    const activities = this.suspiciousActivity.get(key);
    
    // Remove old activities
    const recent = activities.filter(a => now - a.timestamp < window);
    recent.push({ activity, timestamp: now });
    
    this.suspiciousActivity.set(key, recent);

    // Check for suspicious patterns
    return this.evaluateSuspiciousActivity(recent);
  }

  evaluateSuspiciousActivity(activities) {
    const suspiciousThresholds = {
      'failed_login': 5,
      'permission_denied': 10,
      'unusual_action_pattern': 3,
      'rapid_actions': 20
    };

    const counts = {};
    activities.forEach(a => {
      counts[a.activity] = (counts[a.activity] || 0) + 1;
    });

    for (const [activity, count] of Object.entries(counts)) {
      if (count >= (suspiciousThresholds[activity] || 5)) {
        return {
          suspicious: true,
          activity,
          count,
          threshold: suspiciousThresholds[activity],
          recommendation: 'LOCK_ACCOUNT'
        };
      }
    }

    return { suspicious: false };
  }

  // Lock admin account after suspicious activity
  async lockAdminAccount(adminId, reason) {
    try {
      // In production: update admin status in database
      const lockRecord = {
        adminId,
        reason,
        lockedAt: new Date().toISOString(),
        lockedBy: 'AUTOMATED_SAFEGUARD',
        status: 'LOCKED'
      };

      // Log the lock action
      await this.logSecurityAction('ADMIN_ACCOUNT_LOCKED', lockRecord);

      return {
        success: true,
        message: `Admin account ${adminId} locked due to: ${reason}`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to lock admin account'
      };
    }
  }

  // Security freeze mode - makes admin portal read-only
  async enableSecurityFreeze(adminId, reason) {
    this.securityFreezeActive = true;
    
    const freezeRecord = {
      enabledBy: adminId,
      reason,
      enabledAt: new Date().toISOString(),
      status: 'ACTIVE'
    };

    await this.logSecurityAction('SECURITY_FREEZE_ENABLED', freezeRecord);

    return {
      success: true,
      message: 'Security freeze mode enabled - Admin portal is now read-only'
    };
  }

  async disableSecurityFreeze(adminId, reason) {
    this.securityFreezeActive = false;
    
    const unfreezeRecord = {
      disabledBy: adminId,
      reason,
      disabledAt: new Date().toISOString(),
      status: 'DISABLED'
    };

    await this.logSecurityAction('SECURITY_FREEZE_DISABLED', unfreezeRecord);

    return {
      success: true,
      message: 'Security freeze mode disabled - Admin portal restored'
    };
  }

  // Check if security freeze is active
  isSecurityFreezeActive() {
    return this.securityFreezeActive;
  }

  // Validate action during security freeze
  validateActionDuringFreeze(action) {
    if (!this.securityFreezeActive) return { allowed: true };

    const readOnlyActions = [
      'view_metrics',
      'view_audit_logs',
      'view_pending_approvals'
    ];

    if (readOnlyActions.includes(action)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      message: 'Action blocked - Security freeze mode active'
    };
  }

  async logSecurityAction(action, data) {
    // In production: send to immutable audit log
    console.log(`SECURITY_SAFEGUARD: ${action}`, data);
  }

  // Get safeguard status
  getStatus() {
    return {
      securityFreezeActive: this.securityFreezeActive,
      activeRateLimits: this.rateLimitStore.size,
      suspiciousAccounts: this.suspiciousActivity.size,
      timestamp: new Date().toISOString()
    };
  }
}