// Risk Decay Scheduler
// Automatically reduces risk scores over time

import { RiskScoringEngine } from './riskScoringEngine.js';

export class RiskDecayScheduler {
  constructor(appwriteService) {
    this.riskEngine = new RiskScoringEngine();
    this.appwriteService = appwriteService;
    this.isRunning = false;
    this.decayInterval = null;
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
      .substring(0, 1000);
  }

  // Start the risk decay scheduler
  start(intervalMinutes = 60) {
    if (this.isRunning) {
      console.log('Risk decay scheduler is already running');
      return;
    }

    const sanitizedInterval = this.sanitizeInput(intervalMinutes.toString());
    console.log(`🕐 Starting risk decay scheduler (${sanitizedInterval} minute intervals)`);
    
    this.isRunning = true;
    this.decayInterval = setInterval(async () => {
      await this.processRiskDecay();
    }, intervalMinutes * 60 * 1000);

    // Run initial decay process
    this.processRiskDecay();
  }

  // Stop the scheduler
  stop() {
    if (this.decayInterval) {
      clearInterval(this.decayInterval);
      this.decayInterval = null;
    }
    this.isRunning = false;
    console.log('🛑 Risk decay scheduler stopped');
  }

  // Process risk decay for all users and platform
  async processRiskDecay() {
    try {
      console.log('🔄 Processing risk decay...');
      
      const startTime = Date.now();
      
      // Decay user risk scores
      const userDecayResults = await this.decayUserRiskScores();
      
      // Decay platform risk score
      const platformDecayResults = await this.decayPlatformRiskScore();
      
      // Clean up old events (optional - for performance)
      await this.cleanupOldEvents();
      
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ Risk decay completed in ${processingTime}ms`);
      console.log(`   - Users processed: ${userDecayResults.usersProcessed}`);
      console.log(`   - Platform risk: ${platformDecayResults.oldRisk} → ${platformDecayResults.newRisk}`);
      
    } catch (error) {
      console.error('❌ Risk decay processing failed:', error);
    }
  }

  // Decay risk scores for all users
  async decayUserRiskScores() {
    try {
      // Get all users with recent security events
      const recentEvents = await this.appwriteService.getSecurityEvents({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
      });

      // Group events by user
      const userEvents = {};
      recentEvents.forEach(event => {
        if (event.context.userId) {
          if (!userEvents[event.context.userId]) {
            userEvents[event.context.userId] = [];
          }
          userEvents[event.context.userId].push(event);
        }
      });

      let usersProcessed = 0;
      const decayResults = [];

      // Process each user
      for (const [userId, events] of Object.entries(userEvents)) {
        try {
          const result = await this.decayUserRisk(userId, events);
          decayResults.push(result);
          usersProcessed++;
        } catch (error) {
          const sanitizedUserId = this.sanitizeInput(userId);
          console.error(`Failed to decay risk for user ${sanitizedUserId}:`, error);
        }
      }

      return {
        usersProcessed,
        decayResults
      };

    } catch (error) {
      console.error('Failed to decay user risk scores:', error);
      throw error;
    }
  }

  // Decay risk for a specific user
  async decayUserRisk(userId, events) {
    // Calculate current user risk
    const currentRisk = this.riskEngine.calculateUserRisk(userId, events);
    
    if (currentRisk.totalRisk === 0) {
      return { userId, oldRisk: 0, newRisk: 0, decayed: false };
    }

    // Determine user behavior pattern
    const userBehavior = await this.analyzeUserBehavior(userId, events);
    
    // Apply decay (assuming 1 hour has passed since last calculation)
    const newRisk = this.riskEngine.applyRiskDecay(
      currentRisk.totalRisk,
      1, // 1 hour
      'user',
      userBehavior
    );

    // Store updated risk score
    await this.storeUserRiskScore(userId, newRisk, userBehavior);

    // Check if risk level changed and trigger actions
    const oldLevel = this.riskEngine.getUserRiskLevel(currentRisk.totalRisk);
    const newLevel = this.riskEngine.getUserRiskLevel(newRisk);
    
    if (oldLevel !== newLevel) {
      await this.handleRiskLevelChange(userId, oldLevel, newLevel, newRisk);
    }

    return {
      userId,
      oldRisk: currentRisk.totalRisk,
      newRisk,
      oldLevel,
      newLevel,
      behavior: userBehavior,
      decayed: newRisk < currentRisk.totalRisk
    };
  }

  // Analyze user behavior to determine decay rate
  async analyzeUserBehavior(userId, events) {
    const now = new Date();
    const last24Hours = events.filter(e => 
      (now - new Date(e.timestamp)) <= 24 * 60 * 60 * 1000
    );
    const last7Days = events.filter(e => 
      (now - new Date(e.timestamp)) <= 7 * 24 * 60 * 60 * 1000
    );

    // Check for repeat offenses
    const criticalEvents = last7Days.filter(e => e.severity === 'critical');
    const highEvents = last7Days.filter(e => e.severity === 'high');
    
    if (criticalEvents.length > 0 || highEvents.length >= 3) {
      return 'repeat'; // Slower decay for repeat offenders
    }

    // Check for recent good behavior (no events in last 24h)
    if (last24Hours.length === 0 && last7Days.length > 0) {
      return 'good'; // Faster decay for good behavior
    }

    return 'normal'; // Standard decay rate
  }

  // Decay platform-wide risk score
  async decayPlatformRiskScore() {
    try {
      // Get recent platform events
      const recentEvents = await this.appwriteService.getSecurityEvents({
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      });

      // Calculate current platform risk
      const currentRisk = this.riskEngine.calculatePlatformRisk(recentEvents);
      
      if (currentRisk.totalRisk === 0) {
        return { oldRisk: 0, newRisk: 0, decayed: false };
      }

      // Apply platform decay (1 hour)
      const newRisk = this.riskEngine.applyRiskDecay(
        currentRisk.totalRisk,
        1,
        'platform'
      );

      // Store updated platform risk
      await this.storePlatformRiskScore(newRisk);

      // Check if platform risk level changed
      const oldLevel = this.riskEngine.getPlatformRiskLevel(currentRisk.totalRisk);
      const newLevel = this.riskEngine.getPlatformRiskLevel(newRisk);
      
      if (oldLevel !== newLevel) {
        await this.handlePlatformRiskLevelChange(oldLevel, newLevel, newRisk);
      }

      return {
        oldRisk: currentRisk.totalRisk,
        newRisk,
        oldLevel,
        newLevel,
        decayed: newRisk < currentRisk.totalRisk
      };

    } catch (error) {
      console.error('Failed to decay platform risk:', error);
      throw error;
    }
  }

  // Handle user risk level changes
  async handleRiskLevelChange(userId, oldLevel, newLevel, newRisk) {
    const sanitizedUserId = this.sanitizeInput(userId);
    const sanitizedOldLevel = this.sanitizeInput(oldLevel);
    const sanitizedNewLevel = this.sanitizeInput(newLevel);
    
    console.log(`👤 User ${sanitizedUserId} risk level: ${sanitizedOldLevel} → ${sanitizedNewLevel} (${newRisk})`);

    // If risk decreased, potentially lift restrictions
    if (this.isRiskLevelLower(newLevel, oldLevel)) {
      await this.considerLiftingRestrictions(userId, newLevel, newRisk);
    }

    // Log the change
    await this.logRiskLevelChange('user', userId, oldLevel, newLevel, newRisk);
  }

  // Handle platform risk level changes
  async handlePlatformRiskLevelChange(oldLevel, newLevel, newRisk) {
    const sanitizedOldLevel = this.sanitizeInput(oldLevel);
    const sanitizedNewLevel = this.sanitizeInput(newLevel);
    
    console.log(`🌐 Platform risk level: ${sanitizedOldLevel} → ${sanitizedNewLevel} (${newRisk})`);

    // If platform risk decreased, potentially lift restrictions
    if (this.isRiskLevelLower(newLevel, oldLevel)) {
      await this.considerLiftingPlatformRestrictions(newLevel, newRisk);
    }

    // Log the change
    await this.logRiskLevelChange('platform', null, oldLevel, newLevel, newRisk);
  }

  // Check if new risk level is lower than old
  isRiskLevelLower(newLevel, oldLevel) {
    const levels = ['minimal', 'low', 'medium', 'high', 'critical'];
    const newIndex = levels.indexOf(newLevel);
    const oldIndex = levels.indexOf(oldLevel);
    return newIndex < oldIndex;
  }

  // Consider lifting user restrictions based on improved risk
  async considerLiftingRestrictions(userId, riskLevel, riskScore) {
    const sanitizedUserId = this.sanitizeInput(userId);
    const sanitizedRiskLevel = this.sanitizeInput(riskLevel);
    
    // In production, this would check current restrictions and potentially lift them
    console.log(`🔓 Considering lifting restrictions for user ${sanitizedUserId} (${sanitizedRiskLevel})`);
    
    if (riskLevel === 'minimal' || riskLevel === 'low') {
      // Could lift payment restrictions, chat restrictions, etc.
      await this.liftUserRestrictions(userId, ['minor_restrictions']);
    }
  }

  // Consider lifting platform restrictions
  async considerLiftingPlatformRestrictions(riskLevel, riskScore) {
    const sanitizedRiskLevel = this.sanitizeInput(riskLevel);
    
    console.log(`🔓 Considering lifting platform restrictions (${sanitizedRiskLevel})`);
    
    if (riskLevel === 'normal') {
      // Could disable enhanced security measures
      await this.liftPlatformRestrictions(['enhanced_monitoring']);
    }
  }

  // Clean up old events for performance (optional)
  async cleanupOldEvents() {
    try {
      // Remove events older than 30 days (configurable)
      const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      // In production, this would archive or delete old events
      console.log(`🧹 Cleaning up events older than ${cutoffDate.toISOString()}`);
      
      // Note: Be careful with this in production - may want to archive instead of delete
      
    } catch (error) {
      console.error('Failed to cleanup old events:', error);
    }
  }

  // Storage methods (implement based on your database)
  async storeUserRiskScore(userId, riskScore, behavior) {
    // Store in user risk collection
    console.log(`💾 Storing user risk: ${userId} = ${riskScore} (${behavior})`);
  }

  async storePlatformRiskScore(riskScore) {
    // Store in platform metrics
    console.log(`💾 Storing platform risk: ${riskScore}`);
  }

  async liftUserRestrictions(userId, restrictions) {
    console.log(`🔓 Lifting user restrictions: ${userId} - ${restrictions.join(', ')}`);
  }

  async liftPlatformRestrictions(restrictions) {
    console.log(`🔓 Lifting platform restrictions: ${restrictions.join(', ')}`);
  }

  async logRiskLevelChange(type, userId, oldLevel, newLevel, riskScore) {
    const logEntry = {
      type: 'risk_level_change',
      entityType: type,
      userId,
      oldLevel,
      newLevel,
      riskScore,
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Risk Level Change:', logEntry);
    // In production, store in audit log
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalSet: this.decayInterval !== null,
      lastRun: this.lastRunTime || null
    };
  }
}