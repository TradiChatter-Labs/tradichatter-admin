// Automated Risk Response System
// Executes automated actions based on risk scores

import { RiskScoringEngine } from './riskScoringEngine.js';

export class AutomatedRiskResponse {
  constructor(appwriteService, notificationService) {
    this.riskEngine = new RiskScoringEngine();
    this.appwriteService = appwriteService;
    this.notificationService = notificationService;
    
    // Action execution history to prevent spam
    this.actionHistory = new Map();
    
    // Cooldown periods (minutes)
    this.actionCooldowns = {
      SUSPEND_ACCOUNT: 60,        // 1 hour
      RESTRICT_ACTIONS: 30,       // 30 minutes
      INCREASE_MONITORING: 15,    // 15 minutes
      PLATFORM_LOCKDOWN: 120,     // 2 hours
      ENHANCED_SECURITY: 60       // 1 hour
    };
  }

  // Process security event and trigger automated response
  async processSecurityEvent(event) {
    try {
      // Calculate event risk
      const eventRisk = this.riskEngine.calculateEventRisk(event, {
        platform: event.context.platform,
        userType: event.context.userType
      });

      // Log risk calculation
      console.log(`Security Event Risk: ${event.eventType} = ${eventRisk.finalScore} points`);

      // Execute immediate actions for high-risk events
      if (eventRisk.finalScore >= 95) {
        await this.executeImmediateResponse(event, eventRisk);
      }

      // Calculate user cumulative risk if user involved
      if (event.context.userId) {
        await this.processUserRisk(event.context.userId, event);
      }

      // Update platform risk
      await this.updatePlatformRisk(event);

      return {
        eventProcessed: true,
        eventRisk: eventRisk.finalScore,
        actionsTriggered: []
      };

    } catch (error) {
      console.error('Failed to process security event:', error);
      throw error;
    }
  }

  // Execute immediate response for critical events
  async executeImmediateResponse(event, eventRisk) {
    const actions = [];

    // Critical events require immediate action
    if (eventRisk.finalScore >= 95) {
      switch (event.eventType) {
        case 'auth.session_hijack':
          actions.push(await this.suspendUserAccount(event.context.userId, 'Session hijacking detected'));
          actions.push(await this.invalidateUserSessions(event.context.userId));
          break;

        case 'payment.card_fraud':
          actions.push(await this.suspendUserAccount(event.context.userId, 'Payment fraud detected'));
          actions.push(await this.blockPaymentMethod(event.context.paymentMethodId));
          break;

        case 'admin.privilege_escalation':
          actions.push(await this.suspendAdminAccount(event.context.userId, 'Privilege escalation attempt'));
          actions.push(await this.triggerSecurityAlert('CRITICAL', 'Admin privilege escalation detected'));
          break;

        case 'system.breach_attempt':
          actions.push(await this.initiatePlatformLockdown('System breach attempt detected'));
          break;
      }
    }

    // Alert security team for all critical events
    await this.alertSecurityTeam(event, eventRisk, actions);

    return actions;
  }

  // Process user-specific risk accumulation
  async processUserRisk(userId, newEvent) {
    try {
      // Get user's recent events
      const userEvents = await this.appwriteService.getSecurityEvents({
        userId,
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      });

      // Add new event to calculation
      userEvents.push(newEvent);

      // Calculate cumulative user risk
      const userRisk = this.riskEngine.calculateUserRisk(userId, userEvents);
      
      console.log(`User ${userId} risk: ${userRisk.totalRisk} (${userRisk.riskLevel})`);

      // Execute recommended action
      const action = userRisk.recommendedAction;
      if (action && action.action !== 'MONITOR') {
        await this.executeUserAction(userId, action, userRisk);
      }

      // Store updated user risk score
      await this.storeUserRiskScore(userId, userRisk);

      return userRisk;

    } catch (error) {
      console.error(`Failed to process user risk for ${userId}:`, error);
      throw error;
    }
  }

  // Execute user-specific automated actions
  async executeUserAction(userId, action, userRisk) {
    // Check cooldown
    const cooldownKey = `${action.action}_${userId}`;
    if (this.isOnCooldown(cooldownKey)) {
      console.log(`Action ${action.action} for user ${userId} is on cooldown`);
      return null;
    }

    let result = null;

    switch (action.action) {
      case 'SUSPEND_ACCOUNT':
        result = await this.suspendUserAccount(userId, `High risk score: ${userRisk.totalRisk}`);
        break;

      case 'RESTRICT_ACTIONS':
        result = await this.restrictUserActions(userId, ['payment', 'chat'], userRisk.totalRisk);
        break;

      case 'INCREASE_MONITORING':
        result = await this.enableEnhancedMonitoring(userId, userRisk.totalRisk);
        break;

      case 'FLAG_FOR_REVIEW':
        result = await this.flagUserForReview(userId, userRisk);
        break;
    }

    // Set cooldown
    this.setCooldown(cooldownKey, this.actionCooldowns[action.action] || 30);

    // Log action
    await this.logAutomatedAction(userId, action, userRisk, result);

    return result;
  }

  // Update platform-wide risk assessment
  async updatePlatformRisk(newEvent) {
    try {
      // Get recent platform events
      const platformEvents = await this.appwriteService.getSecurityEvents({
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      });

      // Add new event
      platformEvents.push(newEvent);

      // Calculate platform risk
      const platformRisk = this.riskEngine.calculatePlatformRisk(platformEvents);
      
      console.log(`Platform risk: ${platformRisk.totalRisk} (${platformRisk.riskLevel})`);

      // Execute platform-wide actions if needed
      const action = platformRisk.recommendedAction;
      if (action && action.action !== 'MONITOR') {
        await this.executePlatformAction(action, platformRisk);
      }

      // Store platform risk metrics
      await this.storePlatformRiskScore(platformRisk);

      return platformRisk;

    } catch (error) {
      console.error('Failed to update platform risk:', error);
      throw error;
    }
  }

  // Execute platform-wide automated actions
  async executePlatformAction(action, platformRisk) {
    const cooldownKey = `platform_${action.action}`;
    if (this.isOnCooldown(cooldownKey)) {
      console.log(`Platform action ${action.action} is on cooldown`);
      return null;
    }

    let result = null;

    switch (action.action) {
      case 'PLATFORM_LOCKDOWN':
        result = await this.initiatePlatformLockdown(`High platform risk: ${platformRisk.totalRisk}`);
        break;

      case 'ENHANCED_SECURITY':
        result = await this.enableEnhancedPlatformSecurity(platformRisk);
        break;

      case 'INCREASED_MONITORING':
        result = await this.increasePlatformMonitoring(platformRisk);
        break;
    }

    // Set cooldown
    this.setCooldown(cooldownKey, this.actionCooldowns[action.action] || 60);

    // Log platform action
    await this.logPlatformAction(action, platformRisk, result);

    return result;
  }

  // Input sanitization for XSS prevention
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
      .replace(/[<>"'&]/g, (match) => {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match];
      })
      .substring(0, 1000); // Limit length
  }

  // Individual action implementations
  async suspendUserAccount(userId, reason) {
    const sanitizedUserId = this.sanitizeInput(userId);
    const sanitizedReason = this.sanitizeInput(reason);
    
    console.log(`🚫 SUSPENDING USER ACCOUNT: ${sanitizedUserId} - ${sanitizedReason}`);
    
    // In production, this would:
    // - Update user status in database
    // - Invalidate all sessions
    // - Block all actions
    // - Send notification to user
    
    return {
      action: 'SUSPEND_ACCOUNT',
      userId: sanitizedUserId,
      reason: sanitizedReason,
      timestamp: new Date().toISOString(),
      success: true
    };
  }

  async restrictUserActions(userId, restrictedActions, riskScore) {
    const sanitizedUserId = this.sanitizeInput(userId);
    const sanitizedActions = restrictedActions.map(action => this.sanitizeInput(action));
    
    console.log(`⚠️ RESTRICTING USER ACTIONS: ${sanitizedUserId} - ${sanitizedActions.join(', ')}`);
    
    // In production, this would:
    // - Update user permissions
    // - Block specific action types
    // - Set temporary restrictions
    
    return {
      action: 'RESTRICT_ACTIONS',
      userId: sanitizedUserId,
      restrictedActions: sanitizedActions,
      riskScore,
      timestamp: new Date().toISOString(),
      success: true
    };
  }

  async enableEnhancedMonitoring(userId, riskScore) {
    const sanitizedUserId = this.sanitizeInput(userId);
    
    console.log(`👁️ ENHANCED MONITORING: ${sanitizedUserId} - Risk: ${riskScore}`);
    
    // In production, this would:
    // - Enable detailed logging
    // - Increase event sensitivity
    // - Add to watch list
    
    return {
      action: 'INCREASE_MONITORING',
      userId: sanitizedUserId,
      riskScore,
      timestamp: new Date().toISOString(),
      success: true
    };
  }

  async initiatePlatformLockdown(reason) {
    const sanitizedReason = this.sanitizeInput(reason);
    
    console.log(`🔒 PLATFORM LOCKDOWN INITIATED: ${sanitizedReason}`);
    
    // In production, this would:
    // - Disable new registrations
    // - Restrict payment processing
    // - Enable emergency mode
    // - Alert all admins
    
    return {
      action: 'PLATFORM_LOCKDOWN',
      reason: sanitizedReason,
      timestamp: new Date().toISOString(),
      success: true
    };
  }

  // Cooldown management
  isOnCooldown(key) {
    const lastAction = this.actionHistory.get(key);
    if (!lastAction) return false;
    
    const cooldownMinutes = this.actionCooldowns[key.split('_')[0]] || 30;
    const cooldownMs = cooldownMinutes * 60 * 1000;
    
    return (Date.now() - lastAction) < cooldownMs;
  }

  setCooldown(key, minutes) {
    this.actionHistory.set(key, Date.now());
    
    // Clean up old entries after cooldown expires
    setTimeout(() => {
      this.actionHistory.delete(key);
    }, minutes * 60 * 1000);
  }

  // Logging and storage
  async logAutomatedAction(userId, action, userRisk, result) {
    const logEntry = {
      type: 'automated_action',
      userId,
      action: action.action,
      riskScore: userRisk.totalRisk,
      result,
      timestamp: new Date().toISOString()
    };
    
    console.log('Automated Action Log:', logEntry);
    // In production, store in audit log
  }

  async storeUserRiskScore(userId, userRisk) {
    // In production, store in user risk collection
    console.log(`Storing user risk: ${userId} = ${userRisk.totalRisk}`);
  }

  async storePlatformRiskScore(platformRisk) {
    // In production, store in platform metrics
    console.log(`Storing platform risk: ${platformRisk.totalRisk}`);
  }

  async alertSecurityTeam(event, eventRisk, actions) {
    const alert = {
      type: 'CRITICAL_SECURITY_EVENT',
      event: event.eventType,
      riskScore: eventRisk.finalScore,
      userId: event.context.userId,
      timestamp: event.timestamp,
      actionsTriggered: actions.map(a => a.action),
      requiresImmediate: eventRisk.finalScore >= 95
    };
    
    console.log('🚨 SECURITY TEAM ALERT:', alert);
    // In production, send to security team via multiple channels
  }
}