// TradiChatter Dashboard Integration Service
// Links dashboard metrics to AAG actions with permission enforcement

import { AdminActionGateway } from './adminActionGateway.js';
import { SecurityEventGateway } from './securityEventGateway.js';
import { DashboardViewController } from './dashboardViewController.js';
import { hasPermission, requiresDualApproval, requiresMFA } from '../config/adminRoles.js';

export class DashboardIntegrationService {
  constructor() {
    this.aag = new AdminActionGateway();
    this.seg = new SecurityEventGateway();
  }

  // Get role-based metrics from SEG
  async getMetricsForRole(adminId, role) {
    const controller = new DashboardViewController(role, adminId);
    const allowedMetrics = controller.getAllowedMetrics();
    
    try {
      // Request aggregated metrics from SEG
      const rawMetrics = await this.seg.getAggregatedMetrics(allowedMetrics);
      
      // Apply PII masking based on role
      const maskedMetrics = controller.maskMetricData(rawMetrics);
      
      return {
        success: true,
        metrics: maskedMetrics,
        role: role,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch metrics',
        role: role
      };
    }
  }

  // Execute dashboard action through AAG
  async executeAction(adminId, role, action, targetId, reason) {
    // Validate permission
    if (!hasPermission(role, action)) {
      return {
        success: false,
        error: 'Insufficient permissions',
        action: action,
        role: role
      };
    }

    // Check if dual approval required
    const needsDualApproval = requiresDualApproval(action);
    const needsMFA = requiresMFA(action);

    try {
      const actionRequest = {
        adminId,
        role,
        action,
        targetId,
        reason,
        requiresDualApproval: needsDualApproval,
        requiresMFA: needsMFA,
        source: 'dashboard',
        timestamp: new Date().toISOString()
      };

      const result = await this.aag.processAction(actionRequest);
      
      return {
        success: result.success,
        actionId: result.actionId,
        status: result.status,
        requiresApproval: needsDualApproval,
        requiresMFA: needsMFA,
        message: this.getActionMessage(action, result.status)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Action execution failed',
        action: action
      };
    }
  }

  // Get pending approvals for role
  async getPendingApprovals(adminId, role) {
    if (!hasPermission(role, 'view_pending_approvals')) {
      return { success: false, error: 'No permission to view approvals' };
    }

    try {
      const pending = await this.aag.getPendingApprovals(role);
      return {
        success: true,
        approvals: pending,
        count: pending.length
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch pending approvals'
      };
    }
  }

  // Approve pending action (for dual approval workflow)
  async approveAction(adminId, role, actionId, decision) {
    try {
      const result = await this.aag.processApproval(adminId, role, actionId, decision);
      
      return {
        success: result.success,
        actionId: actionId,
        decision: decision,
        status: result.status,
        message: `Action ${decision === 'approve' ? 'approved' : 'rejected'}`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Approval processing failed'
      };
    }
  }

  getActionMessage(action, status) {
    const messages = {
      'suspend_account': {
        'pending': 'Account suspension pending approval',
        'approved': 'Account suspended successfully',
        'executed': 'Account suspended'
      },
      'release_escrow': {
        'pending': 'Escrow release pending approval',
        'approved': 'Escrow released successfully',
        'executed': 'Escrow released'
      },
      'approve_kyc': {
        'executed': 'KYC approved successfully'
      }
    };

    return messages[action]?.[status] || `Action ${status}`;
  }

  // Security freeze mode check
  async isSecurityFreezeActive() {
    try {
      const freezeStatus = await this.seg.getSystemStatus();
      return freezeStatus.securityFreeze || false;
    } catch (error) {
      return false;
    }
  }
}