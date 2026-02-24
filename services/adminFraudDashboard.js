// TradiChatter Admin Fraud Dashboard Integration
// Displays fraud alerts, risk scores, and enables manual admin actions

import { NigerianFraudIntegration } from './nigerianFraudIntegration.js';
import { AdminActionGateway } from '../lib/adminActionGateway.js';

export class AdminFraudDashboard {
  constructor() {
    this.fraudSystem = new NigerianFraudIntegration();
    this.adminGateway = new AdminActionGateway();
    this.dashboardCache = new Map();
    this.refreshInterval = 30000; // 30 seconds
  }

  // Get comprehensive fraud dashboard data
  async getFraudDashboardData(adminRole) {
    const cacheKey = `fraud_dashboard_${adminRole}`;
    const cached = this.dashboardCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.refreshInterval) {
      return cached.data;
    }

    const dashboardData = {
      overview: await this.getFraudOverview(),
      risk_scores: await this.getTopRiskScores(adminRole),
      suspicious_activities: await this.getSuspiciousActivities(),
      nigerian_patterns: await this.getNigerianPatterns(),
      manual_actions: await this.getAvailableManualActions(adminRole),
      alerts_summary: await this.getAlertsSummary(),
      timestamp: new Date().toISOString()
    };

    this.dashboardCache.set(cacheKey, {
      data: dashboardData,
      timestamp: Date.now()
    });

    return dashboardData;
  }

  // Get fraud overview metrics
  async getFraudOverview() {
    const nigerianDashboard = this.fraudSystem.getNigerianFraudDashboard();
    const protectionDashboard = this.fraudSystem.fraudProtection.getProtectionDashboard();

    return {
      total_entities_monitored: protectionDashboard.fraud_metrics.total_entities,
      high_risk_entities: protectionDashboard.fraud_metrics.high_risk_count,
      active_fraud_alerts: protectionDashboard.fraud_metrics.active_fraud_alerts,
      nigerian_events_24h: nigerianDashboard.nigerian_overview.events_last_24h,
      protection_effectiveness: protectionDashboard.protection_effectiveness.effectiveness_score,
      automated_actions_24h: protectionDashboard.safeguard_metrics.active_safeguards
    };
  }

  // Get top risk scores with entity details
  async getTopRiskScores(adminRole) {
    const highRiskEntities = this.fraudSystem.fraudProtection.fraudDetection.riskScorer.getHighRiskEntities('all', 20);
    
    return highRiskEntities.map(entity => ({
      entity_id: this.maskEntityId(entity.entity_id, adminRole),
      entity_type: entity.entity_type,
      risk_score: entity.risk_score,
      risk_level: entity.risk_level,
      last_updated: entity.last_updated,
      top_risk_factors: entity.top_risk_factors,
      nigerian_patterns: this.getNigerianPatternsForEntity(entity.entity_id),
      manual_actions_available: this.getEntityManualActions(entity.entity_id, adminRole)
    }));
  }

  // Get suspicious activities in last 24h
  async getSuspiciousActivities() {
    const protectionDashboard = this.fraudSystem.fraudProtection.getProtectionDashboard();
    
    return protectionDashboard.recent_protection_events.map(event => ({
      id: event.id,
      entity_id: event.entity_id.replace(/^(.{4}).*(.{4})$/, '$1***$2'), // Mask middle
      entity_type: event.entity_type,
      protection_level: event.protection_level,
      risk_score: event.risk_score,
      actions_count: event.actions_count,
      timestamp: event.timestamp,
      age_hours: Math.round((Date.now() - new Date(event.timestamp).getTime()) / (1000 * 60 * 60))
    }));
  }

  // Get Nigerian fraud patterns summary
  async getNigerianPatterns() {
    const nigerianDashboard = this.fraudSystem.getNigerianFraudDashboard();
    
    return {
      multi_account_detected: nigerianDashboard.nigerian_overview.multi_account_detected,
      kyc_fraud_detected: nigerianDashboard.nigerian_overview.kyc_fraud_detected,
      high_value_ngn_transactions: nigerianDashboard.nigerian_overview.high_value_ngn_transactions,
      pattern_breakdown: nigerianDashboard.nigerian_patterns,
      effectiveness: {
        risk_adjustments: nigerianDashboard.effectiveness.risk_score_adjustments,
        nigerian_actions: nigerianDashboard.effectiveness.nigerian_actions_applied
      }
    };
  }

  // Get available manual actions based on admin role
  async getAvailableManualActions(adminRole) {
    const actions = [];

    if (['security_admin', 'super_admin'].includes(adminRole)) {
      actions.push(
        { id: 'freeze_account', label: 'Freeze Account', critical: true },
        { id: 'unfreeze_account', label: 'Unfreeze Account', critical: false },
        { id: 'reset_risk_score', label: 'Reset Risk Score', critical: false }
      );
    }

    if (['platform_admin', 'super_admin'].includes(adminRole)) {
      actions.push(
        { id: 'hold_transactions', label: 'Hold Transactions', critical: true },
        { id: 'release_transactions', label: 'Release Transactions', critical: false },
        { id: 'set_transaction_limit', label: 'Set Transaction Limit', critical: false }
      );
    }

    if (['compliance_admin', 'super_admin'].includes(adminRole)) {
      actions.push(
        { id: 'request_reverification', label: 'Request Re-verification', critical: false },
        { id: 'reject_kyc', label: 'Reject KYC', critical: true },
        { id: 'approve_kyc_override', label: 'Approve KYC Override', critical: false }
      );
    }

    return actions;
  }

  // Get alerts summary
  async getAlertsSummary() {
    const activeAlerts = this.fraudSystem.fraudProtection.fraudDetection.fraudAlerts;
    const alertsArray = Array.from(activeAlerts.values()).filter(alert => alert.status === 'ACTIVE');

    return {
      total_active_alerts: alertsArray.length,
      critical_alerts: alertsArray.filter(a => a.risk_score >= 80).length,
      high_alerts: alertsArray.filter(a => a.risk_score >= 70 && a.risk_score < 80).length,
      medium_alerts: alertsArray.filter(a => a.risk_score >= 40 && a.risk_score < 70).length,
      recent_alerts: alertsArray
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map(alert => ({
          id: alert.id,
          type: alert.alert_type,
          entity_id: alert.entity_id.replace(/^(.{4}).*(.{4})$/, '$1***$2'),
          risk_score: alert.risk_score,
          recommendation: alert.recommendation,
          created_at: alert.created_at,
          age_minutes: Math.round((Date.now() - new Date(alert.created_at).getTime()) / (1000 * 60))
        }))
    };
  }

  // Execute manual admin action
  async executeManualAction(adminId, adminRole, action, targetEntityId, reason, additionalData = {}) {
    // Validate admin has permission for this action
    const availableActions = await this.getAvailableManualActions(adminRole);
    const actionAllowed = availableActions.some(a => a.id === action);

    if (!actionAllowed) {
      return {
        success: false,
        error: 'Action not permitted for admin role',
        action: action,
        admin_role: adminRole
      };
    }

    // Execute action through Admin Action Gateway
    const actionRequest = {
      adminId,
      role: adminRole,
      action: `fraud_${action}`,
      targetId: targetEntityId,
      reason: `Manual fraud action: ${reason}`,
      metadata: {
        fraud_action: action,
        additional_data: additionalData,
        dashboard_initiated: true
      },
      requiresDualApproval: this.requiresDualApproval(action),
      requiresMFA: this.requiresMFA(action),
      source: 'fraud_dashboard',
      timestamp: new Date().toISOString()
    };

    try {
      const result = await this.adminGateway.processAction(actionRequest);
      
      // Log manual fraud action
      await this.logManualFraudAction(adminId, adminRole, action, targetEntityId, reason, result);

      return {
        success: result.success,
        action_id: result.actionId,
        status: result.status,
        message: this.getActionMessage(action, result.status),
        requires_approval: this.requiresDualApproval(action),
        requires_mfa: this.requiresMFA(action)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to execute manual action',
        action: action,
        details: error.message
      };
    }
  }

  // Check if action requires dual approval
  requiresDualApproval(action) {
    const dualApprovalActions = ['freeze_account', 'hold_transactions', 'reject_kyc'];
    return dualApprovalActions.includes(action);
  }

  // Check if action requires MFA
  requiresMFA(action) {
    const mfaActions = ['freeze_account', 'hold_transactions', 'reset_risk_score'];
    return mfaActions.includes(action);
  }

  // Get action success message
  getActionMessage(action, status) {
    const messages = {
      freeze_account: {
        pending: 'Account freeze pending approval',
        approved: 'Account frozen successfully',
        executed: 'Account frozen'
      },
      hold_transactions: {
        pending: 'Transaction hold pending approval',
        approved: 'Transactions held successfully',
        executed: 'Transactions held'
      },
      request_reverification: {
        executed: 'Re-verification requested successfully'
      }
    };

    return messages[action]?.[status] || `Action ${status}`;
  }

  // Log manual fraud action
  async logManualFraudAction(adminId, adminRole, action, targetEntityId, reason, result) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'MANUAL_FRAUD_ACTION',
      admin_id: adminId,
      admin_role: adminRole,
      action: action,
      target_entity_id: targetEntityId,
      reason: reason,
      result: result,
      timestamp: new Date().toISOString(),
      immutable: true
    };

    // In production: Store in immutable audit log
    console.log('MANUAL_FRAUD_ACTION_LOG:', logEntry);
  }

  // Mask entity ID based on admin role
  maskEntityId(entityId, adminRole) {
    if (adminRole === 'super_admin') {
      return entityId; // Super admin sees full ID
    }
    return entityId.replace(/^(.{4}).*(.{4})$/, '$1***$2'); // Mask middle for other roles
  }

  // Get Nigerian patterns for specific entity
  getNigerianPatternsForEntity(entityId) {
    // Simplified - in production would query actual patterns
    return ['phone_reuse', 'high_value_ngn'];
  }

  // Get available manual actions for specific entity
  getEntityManualActions(entityId, adminRole) {
    const baseActions = ['view_details', 'add_note'];
    const roleActions = this.getAvailableManualActions(adminRole);
    return [...baseActions, ...roleActions.map(a => a.id)];
  }

  // Generate dashboard widget configuration
  getDashboardWidgets(adminRole) {
    return {
      overview_widget: {
        title: 'Fraud Overview',
        type: 'metrics',
        refresh_interval: 30,
        data_source: 'fraud_overview'
      },
      risk_scores_widget: {
        title: 'Top Risk Scores',
        type: 'table',
        refresh_interval: 60,
        data_source: 'risk_scores',
        max_rows: 10
      },
      alerts_widget: {
        title: 'Active Fraud Alerts',
        type: 'alerts',
        refresh_interval: 15,
        data_source: 'alerts_summary'
      },
      nigerian_patterns_widget: {
        title: 'Nigerian Fraud Patterns',
        type: 'chart',
        refresh_interval: 300,
        data_source: 'nigerian_patterns'
      },
      manual_actions_widget: {
        title: 'Manual Actions',
        type: 'actions',
        data_source: 'manual_actions',
        role_based: true
      }
    };
  }

  generateLogId() {
    return `fraud_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}