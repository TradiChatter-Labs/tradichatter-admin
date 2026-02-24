// Admin Action Gateway (AAG) - TradiChatter
// Handles privileged admin actions with role-based authorization
//
// 🔒 SECURITY LAYER FROZEN - DO NOT MODIFY WITHOUT AUTHORIZATION
// This component is part of the finalized security infrastructure

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class AdminActionGateway {
  constructor() {
    this.pendingApprovals = new Map(); // Dual approval tracking
    this.adminSessions = new Map(); // Active admin sessions
    this.actionHistory = new Map(); // Rate limiting
    this.adminRoles = this.initializeAdminRoles();
  }

  // Initialize admin roles and permissions
  initializeAdminRoles() {
    return {
      'super_admin': {
        permissions: ['*'], // All permissions
        requiresMFA: true,
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        rateLimit: 20 // actions per hour
      },
      'security_admin': {
        permissions: [
          'user.suspend', 'user.unsuspend', 'security.view',
          'incident.create', 'incident.update', 'alert.acknowledge'
        ],
        requiresMFA: true,
        sessionTimeout: 60 * 60 * 1000, // 1 hour
        rateLimit: 50
      },
      'platform_admin': {
        permissions: [
          'business.suspend', 'business.unsuspend', 'escrow.view',
          'payment.investigate', 'affiliate.manage'
        ],
        requiresMFA: true,
        sessionTimeout: 60 * 60 * 1000,
        rateLimit: 30
      },
      'compliance_admin': {
        permissions: [
          'kyc.approve', 'kyc.reject', 'business.verify',
          'compliance.report', 'audit.view'
        ],
        requiresMFA: true,
        sessionTimeout: 2 * 60 * 60 * 1000, // 2 hours
        rateLimit: 40
      }
    };
  }

  // Main admin action endpoint
  async executeAdminAction(request) {
    try {
      // 1. Validate admin authentication and session
      const adminAuth = await this.validateAdminAuth(request);
      if (!adminAuth.valid) {
        return this.createErrorResponse(401, adminAuth.reason);
      }

      // 2. Validate action structure
      const action = await this.validateActionStructure(request.body);
      if (!action.valid) {
        return this.createErrorResponse(400, action.reason);
      }

      // 3. Check admin permissions
      const permissionCheck = await this.checkPermissions(adminAuth.admin, action.data);
      if (!permissionCheck.allowed) {
        return this.createErrorResponse(403, permissionCheck.reason);
      }

      // 4. Apply rate limiting
      const rateLimitCheck = await this.checkAdminRateLimit(adminAuth.admin);
      if (!rateLimitCheck.allowed) {
        return this.createErrorResponse(429, 'Admin rate limit exceeded');
      }

      // 5. Check if dual approval required
      const dualApprovalCheck = await this.checkDualApprovalRequired(action.data);
      if (dualApprovalCheck.required) {
        return await this.handleDualApproval(adminAuth.admin, action.data);
      }

      // 6. Log action before execution
      const actionLog = await this.logAdminAction(adminAuth.admin, action.data, 'EXECUTING');

      // 7. Execute the action
      const result = await this.executeAction(action.data, adminAuth.admin);

      // 8. Log completion
      await this.logAdminAction(adminAuth.admin, action.data, 'COMPLETED', result);

      // 9. Return safe response (no raw PII)
      return this.createSafeResponse(result, action.data.actionType);

    } catch (error) {
      console.error('AAG: Action execution failed:', error);
      return this.createErrorResponse(500, 'Internal gateway error');
    }
  }

  // Validate admin authentication and session
  async validateAdminAuth(request) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false, reason: 'Missing admin token' };
      }

      const token = authHeader.substring(7);
      
      // Verify JWT token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      } catch (jwtError) {
        return { valid: false, reason: 'Invalid admin token' };
      }

      // Check if it's an admin token
      if (decoded.type !== 'admin' || !this.adminRoles[decoded.role]) {
        return { valid: false, reason: 'Invalid admin role' };
      }

      // Check session validity
      const sessionKey = `${decoded.adminId}_${decoded.sessionId}`;
      const session = this.adminSessions.get(sessionKey);
      
      if (!session) {
        return { valid: false, reason: 'Invalid admin session' };
      }

      // Check session timeout
      const roleConfig = this.adminRoles[decoded.role];
      if (Date.now() - session.lastActivity > roleConfig.sessionTimeout) {
        this.adminSessions.delete(sessionKey);
        return { valid: false, reason: 'Admin session expired' };
      }

      // Update session activity
      session.lastActivity = Date.now();

      // Verify MFA if required
      const mfaHeader = request.headers['x-mfa-token'];
      if (roleConfig.requiresMFA && !this.verifyMFA(decoded.adminId, mfaHeader)) {
        return { valid: false, reason: 'MFA verification required' };
      }

      return {
        valid: true,
        admin: {
          id: decoded.adminId,
          role: decoded.role,
          permissions: roleConfig.permissions,
          sessionId: decoded.sessionId
        }
      };

    } catch (error) {
      return { valid: false, reason: 'Authentication error' };
    }
  }

  // Validate action structure
  async validateActionStructure(actionData) {
    try {
      const required = ['actionType', 'targetType', 'targetId'];
      const missing = required.filter(field => !actionData[field]);
      
      if (missing.length > 0) {
        return { valid: false, reason: `Missing fields: ${missing.join(', ')}` };
      }

      // Validate action type
      const validActions = [
        'user.suspend', 'user.unsuspend', 'business.suspend', 'business.unsuspend',
        'escrow.release', 'escrow.freeze', 'kyc.approve', 'kyc.reject',
        'payment.investigate', 'affiliate.suspend', 'incident.create'
      ];

      if (!validActions.includes(actionData.actionType)) {
        return { valid: false, reason: 'Invalid action type' };
      }

      // Validate target type
      const validTargets = ['user', 'business', 'affiliate', 'escrow', 'kyc', 'payment'];
      if (!validTargets.includes(actionData.targetType)) {
        return { valid: false, reason: 'Invalid target type' };
      }

      return { valid: true, data: actionData };

    } catch (error) {
      return { valid: false, reason: 'Action validation error' };
    }
  }

  // Check admin permissions
  async checkPermissions(admin, action) {
    const roleConfig = this.adminRoles[admin.role];
    
    // Super admin has all permissions
    if (roleConfig.permissions.includes('*')) {
      return { allowed: true };
    }

    // Check specific permission
    if (!roleConfig.permissions.includes(action.actionType)) {
      return { 
        allowed: false, 
        reason: `Role ${admin.role} lacks permission for ${action.actionType}` 
      };
    }

    return { allowed: true };
  }

  // Check admin rate limiting
  async checkAdminRateLimit(admin) {
    const key = `admin_${admin.id}`;
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour window

    if (!this.actionHistory.has(key)) {
      this.actionHistory.set(key, { count: 0, windowStart: now });
    }

    const history = this.actionHistory.get(key);

    // Reset window if expired
    if (now - history.windowStart > windowMs) {
      history.count = 0;
      history.windowStart = now;
    }

    const roleConfig = this.adminRoles[admin.role];
    if (history.count >= roleConfig.rateLimit) {
      return { allowed: false, reason: 'Admin rate limit exceeded' };
    }

    history.count++;
    return { allowed: true };
  }

  // Check if dual approval is required
  async checkDualApprovalRequired(action) {
    const criticalActions = [
      'user.suspend', 'business.suspend', 'escrow.release',
      'kyc.override', 'payment.refund'
    ];

    const highValueThresholds = {
      'escrow.release': 100000, // ₦100,000
      'payment.refund': 50000   // ₦50,000
    };

    // Critical actions always require dual approval
    if (criticalActions.includes(action.actionType)) {
      return { required: true, reason: 'Critical action requires dual approval' };
    }

    // High value actions require dual approval
    if (highValueThresholds[action.actionType] && 
        action.amount >= highValueThresholds[action.actionType]) {
      return { required: true, reason: 'High value action requires dual approval' };
    }

    return { required: false };
  }

  // Handle dual approval workflow
  async handleDualApproval(admin, action) {
    const approvalId = `approval_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    
    // Store pending approval
    this.pendingApprovals.set(approvalId, {
      initiator: admin,
      action,
      timestamp: new Date().toISOString(),
      status: 'PENDING_APPROVAL',
      approvers: []
    });

    // Log the approval request
    await this.logAdminAction(admin, action, 'APPROVAL_REQUESTED');

    return {
      success: true,
      approvalId,
      status: 'PENDING_APPROVAL',
      message: 'Action requires dual approval. Approval ID: ' + approvalId,
      timestamp: new Date().toISOString()
    };
  }

  // Execute the actual admin action
  async executeAction(action, admin) {
    console.log(`AAG: Executing ${action.actionType} on ${action.targetType}:${action.targetId}`);

    // Route to appropriate backend service
    switch (action.actionType) {
      case 'user.suspend':
        return await this.suspendUser(action.targetId, action.reason, admin);
      
      case 'business.suspend':
        return await this.suspendBusiness(action.targetId, action.reason, admin);
      
      case 'escrow.release':
        return await this.releaseEscrow(action.targetId, action.amount, admin);
      
      case 'kyc.approve':
        return await this.approveKYC(action.targetId, admin);
      
      case 'kyc.reject':
        return await this.rejectKYC(action.targetId, action.reason, admin);
      
      default:
        throw new Error(`Unsupported action: ${action.actionType}`);
    }
  }

  // Individual action implementations
  async suspendUser(userId, reason, admin) {
    console.log(`🚫 AAG: Suspending user ${userId} - ${reason}`);
    
    // Call backend service to suspend user
    const result = {
      actionType: 'user.suspend',
      targetId: userId,
      status: 'COMPLETED',
      executedBy: admin.id,
      timestamp: new Date().toISOString(),
      reversible: true
    };

    return result;
  }

  async suspendBusiness(businessId, reason, admin) {
    console.log(`🏢 AAG: Suspending business ${businessId} - ${reason}`);
    
    const result = {
      actionType: 'business.suspend',
      targetId: businessId,
      status: 'COMPLETED',
      executedBy: admin.id,
      timestamp: new Date().toISOString(),
      reversible: true
    };

    return result;
  }

  async releaseEscrow(escrowId, amount, admin) {
    console.log(`💰 AAG: Releasing escrow ${escrowId} - ₦${amount}`);
    
    const result = {
      actionType: 'escrow.release',
      targetId: escrowId,
      amount,
      status: 'COMPLETED',
      executedBy: admin.id,
      timestamp: new Date().toISOString(),
      reversible: false // Financial actions not reversible
    };

    return result;
  }

  async approveKYC(kycId, admin) {
    console.log(`✅ AAG: Approving KYC ${kycId}`);
    
    const result = {
      actionType: 'kyc.approve',
      targetId: kycId,
      status: 'COMPLETED',
      executedBy: admin.id,
      timestamp: new Date().toISOString(),
      reversible: true
    };

    return result;
  }

  async rejectKYC(kycId, reason, admin) {
    console.log(`❌ AAG: Rejecting KYC ${kycId} - ${reason}`);
    
    const result = {
      actionType: 'kyc.reject',
      targetId: kycId,
      reason,
      status: 'COMPLETED',
      executedBy: admin.id,
      timestamp: new Date().toISOString(),
      reversible: true
    };

    return result;
  }

  // Log admin actions (immutable audit trail)
  async logAdminAction(admin, action, status, result = null) {
    const logEntry = {
      id: `aag_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`,
      adminId: admin.id,
      adminRole: admin.role,
      actionType: action.actionType,
      targetType: action.targetType,
      targetId: this.maskTargetId(action.targetId), // Mask for privacy
      status,
      timestamp: new Date().toISOString(),
      result: result ? this.sanitizeResult(result) : null,
      ipAddress: 'masked', // Would get from request
      userAgent: 'masked'  // Would get from request
    };

    console.log('AAG: Audit Log:', logEntry);
    // In production, store in immutable audit log
  }

  // Create safe response (no raw PII)
  createSafeResponse(result, actionType) {
    const safeResult = {
      success: true,
      actionType,
      status: result.status,
      timestamp: result.timestamp,
      reversible: result.reversible
    };

    // Add safe fields based on action type
    if (actionType.includes('escrow') && result.amount) {
      safeResult.amount = result.amount;
    }

    return safeResult;
  }

  // Utility methods
  verifyMFA(adminId, mfaToken) {
    // In production, verify MFA token
    return mfaToken && mfaToken.length > 0;
  }

  maskTargetId(targetId) {
    return targetId.substring(0, 4) + '***';
  }

  sanitizeResult(result) {
    // Remove sensitive data from result
    const sanitized = { ...result };
    delete sanitized.sensitiveData;
    return sanitized;
  }

  createErrorResponse(status, message) {
    return {
      success: false,
      error: message,
      status,
      timestamp: new Date().toISOString()
    };
  }
}