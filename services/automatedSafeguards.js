// TradiChatter Automated Fraud Safeguards
// Implements automated actions for high/medium risk users and businesses

export class AutomatedFraudSafeguards {
  constructor() {
    this.safeguardActions = new Map(); // Track active safeguards
    this.actionThresholds = this.initializeThresholds();
    this.cooldownPeriods = new Map(); // Prevent action spam
  }

  // Initialize action thresholds
  initializeThresholds() {
    return {
      // High Risk Actions (Score >= 70)
      high_risk: {
        account_lock: { threshold: 70, duration: 86400000 }, // 24 hours
        escrow_hold: { threshold: 75, duration: 172800000 }, // 48 hours
        transaction_limit: { threshold: 70, amount: 100000 }, // 100k NGN limit
        kyc_reverification: { threshold: 80, required: true }
      },
      
      // Medium Risk Actions (Score 31-69)
      medium_risk: {
        enhanced_monitoring: { threshold: 31, duration: 43200000 }, // 12 hours
        manual_review_flag: { threshold: 40, priority: 'medium' },
        transaction_monitoring: { threshold: 50, enhanced: true },
        chat_restriction: { threshold: 45, duration: 21600000 } // 6 hours
      },
      
      // Rapid Risk Increase Actions
      rapid_increase: {
        immediate_review: { score_change: 30, priority: 'high' },
        temporary_restriction: { score_change: 40, duration: 7200000 } // 2 hours
      }
    };
  }

  // Process risk result and apply safeguards
  async applySafeguards(riskResult) {
    const { entity_id, entity_type, risk_score, risk_level, score_change } = riskResult;
    const appliedActions = [];

    // Check cooldown period
    if (this.isInCooldown(entity_id)) {
      return { actions_applied: [], reason: 'COOLDOWN_ACTIVE' };
    }

    // High Risk Safeguards
    if (risk_score >= 70) {
      const highRiskActions = await this.applyHighRiskSafeguards(entity_id, entity_type, risk_score);
      appliedActions.push(...highRiskActions);
    }
    
    // Medium Risk Safeguards
    else if (risk_score >= 31) {
      const mediumRiskActions = await this.applyMediumRiskSafeguards(entity_id, entity_type, risk_score);
      appliedActions.push(...mediumRiskActions);
    }

    // Rapid Risk Increase Safeguards
    if (score_change >= 30) {
      const rapidActions = await this.applyRapidIncreaseSafeguards(entity_id, entity_type, score_change);
      appliedActions.push(...rapidActions);
    }

    // Log all applied actions
    await this.logSafeguardActions(entity_id, entity_type, appliedActions, riskResult);

    // Set cooldown to prevent action spam
    this.setCooldown(entity_id, 300000); // 5 minute cooldown

    return {
      entity_id,
      entity_type,
      risk_score,
      actions_applied: appliedActions,
      timestamp: new Date().toISOString()
    };
  }

  // Apply high risk safeguards
  async applyHighRiskSafeguards(entityId, entityType, riskScore) {
    const actions = [];

    // Account Lock (Score >= 70)
    if (riskScore >= this.actionThresholds.high_risk.account_lock.threshold) {
      const lockAction = await this.lockAccount(entityId, entityType, riskScore);
      if (lockAction.success) actions.push(lockAction);
    }

    // Escrow Hold (Score >= 75)
    if (riskScore >= this.actionThresholds.high_risk.escrow_hold.threshold) {
      const escrowAction = await this.holdEscrowTransactions(entityId, entityType, riskScore);
      if (escrowAction.success) actions.push(escrowAction);
    }

    // Transaction Limit (Score >= 70)
    if (riskScore >= this.actionThresholds.high_risk.transaction_limit.threshold) {
      const limitAction = await this.setTransactionLimit(entityId, entityType, riskScore);
      if (limitAction.success) actions.push(limitAction);
    }

    // KYC Re-verification (Score >= 80)
    if (riskScore >= this.actionThresholds.high_risk.kyc_reverification.threshold) {
      const kycAction = await this.requireKYCReverification(entityId, entityType, riskScore);
      if (kycAction.success) actions.push(kycAction);
    }

    // Send high-risk alert to admins
    await this.sendHighRiskAlert(entityId, entityType, riskScore, actions);

    return actions;
  }

  // Apply medium risk safeguards
  async applyMediumRiskSafeguards(entityId, entityType, riskScore) {
    const actions = [];

    // Enhanced Monitoring (Score >= 31)
    if (riskScore >= this.actionThresholds.medium_risk.enhanced_monitoring.threshold) {
      const monitorAction = await this.enableEnhancedMonitoring(entityId, entityType, riskScore);
      if (monitorAction.success) actions.push(monitorAction);
    }

    // Manual Review Flag (Score >= 40)
    if (riskScore >= this.actionThresholds.medium_risk.manual_review_flag.threshold) {
      const reviewAction = await this.flagForManualReview(entityId, entityType, riskScore);
      if (reviewAction.success) actions.push(reviewAction);
    }

    // Transaction Monitoring (Score >= 50)
    if (riskScore >= this.actionThresholds.medium_risk.transaction_monitoring.threshold) {
      const txMonitorAction = await this.enableTransactionMonitoring(entityId, entityType, riskScore);
      if (txMonitorAction.success) actions.push(txMonitorAction);
    }

    // Chat Restriction (Score >= 45)
    if (riskScore >= this.actionThresholds.medium_risk.chat_restriction.threshold) {
      const chatAction = await this.restrictChatFeatures(entityId, entityType, riskScore);
      if (chatAction.success) actions.push(chatAction);
    }

    return actions;
  }

  // Apply rapid risk increase safeguards
  async applyRapidIncreaseSafeguards(entityId, entityType, scoreChange) {
    const actions = [];

    // Immediate Review (Change >= 30)
    if (scoreChange >= this.actionThresholds.rapid_increase.immediate_review.score_change) {
      const reviewAction = await this.triggerImmediateReview(entityId, entityType, scoreChange);
      if (reviewAction.success) actions.push(reviewAction);
    }

    // Temporary Restriction (Change >= 40)
    if (scoreChange >= this.actionThresholds.rapid_increase.temporary_restriction.score_change) {
      const restrictAction = await this.applyTemporaryRestriction(entityId, entityType, scoreChange);
      if (restrictAction.success) actions.push(restrictAction);
    }

    return actions;
  }

  // Lock account
  async lockAccount(entityId, entityType, riskScore) {
    const action = {
      type: 'ACCOUNT_LOCK',
      entity_id: entityId,
      entity_type: entityType,
      risk_score: riskScore,
      duration: this.actionThresholds.high_risk.account_lock.duration,
      expires_at: new Date(Date.now() + this.actionThresholds.high_risk.account_lock.duration).toISOString(),
      reason: 'HIGH_FRAUD_RISK',
      success: true,
      timestamp: new Date().toISOString()
    };

    // In production: Update user/business status in database
    this.safeguardActions.set(`${entityId}_lock`, action);
    
    return action;
  }

  // Hold escrow transactions
  async holdEscrowTransactions(entityId, entityType, riskScore) {
    const action = {
      type: 'ESCROW_HOLD',
      entity_id: entityId,
      entity_type: entityType,
      risk_score: riskScore,
      duration: this.actionThresholds.high_risk.escrow_hold.duration,
      expires_at: new Date(Date.now() + this.actionThresholds.high_risk.escrow_hold.duration).toISOString(),
      reason: 'HIGH_FRAUD_RISK_ESCROW_PROTECTION',
      success: true,
      timestamp: new Date().toISOString()
    };

    // In production: Hold all pending escrow transactions
    this.safeguardActions.set(`${entityId}_escrow_hold`, action);
    
    return action;
  }

  // Set transaction limit
  async setTransactionLimit(entityId, entityType, riskScore) {
    const action = {
      type: 'TRANSACTION_LIMIT',
      entity_id: entityId,
      entity_type: entityType,
      risk_score: riskScore,
      limit_amount: this.actionThresholds.high_risk.transaction_limit.amount,
      currency: 'NGN',
      reason: 'HIGH_FRAUD_RISK_LIMIT',
      success: true,
      timestamp: new Date().toISOString()
    };

    // In production: Set transaction limits in payment system
    this.safeguardActions.set(`${entityId}_tx_limit`, action);
    
    return action;
  }

  // Flag for manual review
  async flagForManualReview(entityId, entityType, riskScore) {
    const action = {
      type: 'MANUAL_REVIEW_FLAG',
      entity_id: entityId,
      entity_type: entityType,
      risk_score: riskScore,
      priority: riskScore >= 60 ? 'high' : 'medium',
      reason: 'MEDIUM_FRAUD_RISK',
      success: true,
      timestamp: new Date().toISOString()
    };

    // In production: Add to admin review queue
    this.safeguardActions.set(`${entityId}_review`, action);
    
    return action;
  }

  // Enable enhanced monitoring
  async enableEnhancedMonitoring(entityId, entityType, riskScore) {
    const action = {
      type: 'ENHANCED_MONITORING',
      entity_id: entityId,
      entity_type: entityType,
      risk_score: riskScore,
      duration: this.actionThresholds.medium_risk.enhanced_monitoring.duration,
      expires_at: new Date(Date.now() + this.actionThresholds.medium_risk.enhanced_monitoring.duration).toISOString(),
      monitoring_level: 'enhanced',
      success: true,
      timestamp: new Date().toISOString()
    };

    this.safeguardActions.set(`${entityId}_monitor`, action);
    return action;
  }

  // Send high-risk alert to admins
  async sendHighRiskAlert(entityId, entityType, riskScore, actions) {
    const alert = {
      type: 'HIGH_RISK_AUTOMATED_ACTION',
      entity_id: entityId,
      entity_type: entityType,
      risk_score: riskScore,
      actions_taken: actions.map(a => a.type),
      priority: 'CRITICAL',
      requires_admin_review: true,
      timestamp: new Date().toISOString()
    };

    // In production: Send via push notification, email, SMS
    console.log('HIGH_RISK_AUTOMATED_ACTION_ALERT:', alert);
  }

  // Check if entity is in cooldown
  isInCooldown(entityId) {
    const cooldownEnd = this.cooldownPeriods.get(entityId);
    return cooldownEnd && Date.now() < cooldownEnd;
  }

  // Set cooldown period
  setCooldown(entityId, duration) {
    this.cooldownPeriods.set(entityId, Date.now() + duration);
  }

  // Log safeguard actions
  async logSafeguardActions(entityId, entityType, actions, riskResult) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'AUTOMATED_SAFEGUARD_ACTIONS',
      entity_id: entityId,
      entity_type: entityType,
      risk_score: riskResult.risk_score,
      risk_level: riskResult.risk_level,
      score_change: riskResult.score_change,
      actions_applied: actions,
      timestamp: new Date().toISOString(),
      immutable: true
    };

    // In production: Store in immutable audit log
    console.log('SAFEGUARD_ACTIONS_LOG:', logEntry);
  }

  // Get active safeguards for entity
  getActiveSafeguards(entityId) {
    const activeSafeguards = [];
    
    for (const [key, action] of this.safeguardActions) {
      if (key.startsWith(entityId) && this.isActionActive(action)) {
        activeSafeguards.push(action);
      }
    }
    
    return activeSafeguards;
  }

  // Check if action is still active
  isActionActive(action) {
    if (!action.expires_at) return true;
    return new Date(action.expires_at).getTime() > Date.now();
  }

  // Get safeguards dashboard data
  getSafeguardsDashboardData() {
    const allActions = Array.from(this.safeguardActions.values());
    const activeActions = allActions.filter(action => this.isActionActive(action));
    
    return {
      overview: {
        total_safeguards_applied: allActions.length,
        active_safeguards: activeActions.length,
        account_locks: activeActions.filter(a => a.type === 'ACCOUNT_LOCK').length,
        escrow_holds: activeActions.filter(a => a.type === 'ESCROW_HOLD').length,
        transaction_limits: activeActions.filter(a => a.type === 'TRANSACTION_LIMIT').length,
        manual_reviews: activeActions.filter(a => a.type === 'MANUAL_REVIEW_FLAG').length
      },
      
      recent_actions: allActions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20)
        .map(action => ({
          type: action.type,
          entity_id: action.entity_id,
          entity_type: action.entity_type,
          risk_score: action.risk_score,
          timestamp: action.timestamp,
          expires_at: action.expires_at,
          active: this.isActionActive(action)
        })),
      
      timestamp: new Date().toISOString()
    };
  }

  generateLogId() {
    return `safeguard_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Placeholder methods for additional safeguard actions
  async requireKYCReverification(entityId, entityType, riskScore) {
    return { type: 'KYC_REVERIFICATION', entity_id: entityId, success: true, timestamp: new Date().toISOString() };
  }

  async enableTransactionMonitoring(entityId, entityType, riskScore) {
    return { type: 'TRANSACTION_MONITORING', entity_id: entityId, success: true, timestamp: new Date().toISOString() };
  }

  async restrictChatFeatures(entityId, entityType, riskScore) {
    return { type: 'CHAT_RESTRICTION', entity_id: entityId, success: true, timestamp: new Date().toISOString() };
  }

  async triggerImmediateReview(entityId, entityType, scoreChange) {
    return { type: 'IMMEDIATE_REVIEW', entity_id: entityId, success: true, timestamp: new Date().toISOString() };
  }

  async applyTemporaryRestriction(entityId, entityType, scoreChange) {
    return { type: 'TEMPORARY_RESTRICTION', entity_id: entityId, success: true, timestamp: new Date().toISOString() };
  }
}