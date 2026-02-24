// TradiChatter Risk Scoring Engine
// Calculates user, business, and platform risk scores

import { SECURITY_EVENT_TYPES, SECURITY_SEVERITY_LEVELS } from './securityEvents.js';

export class RiskScoringEngine {
  constructor() {
    // Base risk scores for each event type
    this.eventRiskScores = {
      // Critical Events (80-100 points)
      [SECURITY_EVENT_TYPES.AUTH_SESSION_HIJACK]: 100,
      [SECURITY_EVENT_TYPES.PAYMENT_CARD_FRAUD]: 95,
      [SECURITY_EVENT_TYPES.ADMIN_PRIVILEGE_ESCALATION]: 100,
      [SECURITY_EVENT_TYPES.SYSTEM_BREACH_ATTEMPT]: 100,

      // High Risk Events (50-79 points)
      [SECURITY_EVENT_TYPES.KYC_DOCUMENT_FRAUD]: 75,
      [SECURITY_EVENT_TYPES.ESCROW_DISPUTE_FRAUD]: 70,
      [SECURITY_EVENT_TYPES.PAYMENT_SUSPICIOUS_AMOUNT]: 65,
      [SECURITY_EVENT_TYPES.AUTH_FAILED_LOGIN]: 60,
      [SECURITY_EVENT_TYPES.BUSINESS_FAKE_REGISTRATION]: 70,

      // Medium Risk Events (20-49 points)
      [SECURITY_EVENT_TYPES.CHAT_PHISHING_ATTEMPT]: 45,
      [SECURITY_EVENT_TYPES.PAYMENT_FAILED_ATTEMPT]: 40,
      [SECURITY_EVENT_TYPES.API_ABUSE]: 35,
      [SECURITY_EVENT_TYPES.AUTH_SUSPICIOUS_REGISTRATION]: 30,
      [SECURITY_EVENT_TYPES.BUSINESS_SUSPICIOUS_ACTIVITY]: 35,

      // Low Risk Events (5-19 points)
      [SECURITY_EVENT_TYPES.CHAT_SPAM_DETECTED]: 15,
      [SECURITY_EVENT_TYPES.AUTH_WEAK_PASSWORD]: 10,
      [SECURITY_EVENT_TYPES.MEDIA_INAPPROPRIATE_IMAGE]: 12,
      [SECURITY_EVENT_TYPES.ADMIN_CONFIG_CHANGE]: 8,

      // Info Events (1-4 points)
      [SECURITY_EVENT_TYPES.AUTH_2FA_DISABLED]: 3,
      [SECURITY_EVENT_TYPES.ADMIN_DATA_EXPORT]: 2
    };

    // Risk multipliers based on context
    this.contextMultipliers = {
      // Time-based multipliers
      timeOfDay: {
        night: 1.3,    // 11PM - 6AM
        business: 1.0, // 9AM - 5PM
        evening: 1.1   // 6PM - 11PM
      },

      // Frequency multipliers (events in last 24h)
      frequency: {
        single: 1.0,
        multiple: 1.5,  // 2-5 events
        burst: 2.0,     // 6-10 events
        flood: 3.0      // 10+ events
      },

      // Platform multipliers
      platform: {
        mobile: 1.0,
        admin: 1.5,     // Admin actions more critical
        api: 1.2,
        webhook: 1.1
      },

      // User type multipliers
      userType: {
        customer: 1.0,
        business: 1.3,  // Business accounts more critical
        affiliate: 1.2,
        admin: 2.0      // Admin accounts highest risk
      }
    };

    // Automated action thresholds
    this.actionThresholds = {
      // Individual event thresholds
      event: {
        monitor: 20,      // Start monitoring user
        restrict: 50,     // Restrict some actions
        suspend: 80,      // Suspend account
        lockdown: 95      // Immediate lockdown
      },

      // Cumulative user risk thresholds (24h window)
      user: {
        lowRisk: 50,      // Normal user
        mediumRisk: 150,  // Increased monitoring
        highRisk: 300,    // Account restrictions
        criticalRisk: 500 // Account suspension
      },

      // Platform-wide risk thresholds
      platform: {
        normal: 1000,     // Normal operations
        elevated: 2500,   // Increased security
        high: 5000,       // Enhanced monitoring
        critical: 10000   // Platform lockdown
      }
    };

    // Risk decay rates (per hour)
    this.decayRates = {
      // Event-based decay
      eventDecay: {
        critical: 0.95,   // 5% decay per hour
        high: 0.90,       // 10% decay per hour
        medium: 0.85,     // 15% decay per hour
        low: 0.80,        // 20% decay per hour
        info: 0.70        // 30% decay per hour
      },

      // User risk decay
      userDecay: {
        base: 0.92,       // 8% decay per hour
        goodBehavior: 0.85, // Faster decay for good behavior
        repeat: 0.98      // Slower decay for repeat offenders
      },

      // Platform risk decay
      platformDecay: 0.95 // 5% decay per hour
    };
  }

  // Calculate risk score for a single security event
  calculateEventRisk(event, context = {}) {
    const baseScore = this.eventRiskScores[event.eventType] || 10;
    
    // Apply context multipliers
    let multiplier = 1.0;
    
    // Time of day multiplier
    const hour = new Date(event.timestamp).getHours();
    if (hour >= 23 || hour <= 6) {
      multiplier *= this.contextMultipliers.timeOfDay.night;
    } else if (hour >= 9 && hour <= 17) {
      multiplier *= this.contextMultipliers.timeOfDay.business;
    } else {
      multiplier *= this.contextMultipliers.timeOfDay.evening;
    }

    // Platform multiplier
    if (context.platform) {
      multiplier *= this.contextMultipliers.platform[context.platform] || 1.0;
    }

    // User type multiplier
    if (context.userType) {
      multiplier *= this.contextMultipliers.userType[context.userType] || 1.0;
    }

    // Frequency multiplier (based on recent events)
    if (context.recentEventCount) {
      if (context.recentEventCount >= 10) {
        multiplier *= this.contextMultipliers.frequency.flood;
      } else if (context.recentEventCount >= 6) {
        multiplier *= this.contextMultipliers.frequency.burst;
      } else if (context.recentEventCount >= 2) {
        multiplier *= this.contextMultipliers.frequency.multiple;
      }
    }

    const finalScore = Math.min(100, Math.round(baseScore * multiplier));
    
    return {
      baseScore,
      multiplier,
      finalScore,
      severity: this.getScoreSeverity(finalScore)
    };
  }

  // Calculate cumulative user risk score
  calculateUserRisk(userId, events, timeWindowHours = 24) {
    const cutoffTime = new Date(Date.now() - (timeWindowHours * 60 * 60 * 1000));
    const recentEvents = events.filter(e => 
      e.context.userId === userId && 
      new Date(e.timestamp) > cutoffTime
    );

    if (recentEvents.length === 0) {
      return { totalRisk: 0, eventCount: 0, riskLevel: 'none' };
    }

    // Calculate total risk with decay
    let totalRisk = 0;
    const now = new Date();

    for (const event of recentEvents) {
      const eventAge = (now - new Date(event.timestamp)) / (1000 * 60 * 60); // hours
      const eventRisk = this.calculateEventRisk(event, {
        platform: event.context.platform,
        userType: event.context.userType,
        recentEventCount: recentEvents.length
      });

      // Apply time-based decay
      const decayRate = this.decayRates.eventDecay[event.severity] || 0.90;
      const decayedScore = eventRisk.finalScore * Math.pow(decayRate, eventAge);
      
      totalRisk += decayedScore;
    }

    return {
      totalRisk: Math.round(totalRisk),
      eventCount: recentEvents.length,
      riskLevel: this.getUserRiskLevel(totalRisk),
      recommendedAction: this.getRecommendedAction(totalRisk, 'user')
    };
  }

  // Calculate platform-wide risk score
  calculatePlatformRisk(allEvents, timeWindowHours = 24) {
    const cutoffTime = new Date(Date.now() - (timeWindowHours * 60 * 60 * 1000));
    const recentEvents = allEvents.filter(e => new Date(e.timestamp) > cutoffTime);

    if (recentEvents.length === 0) {
      return { totalRisk: 0, eventCount: 0, riskLevel: 'normal' };
    }

    // Aggregate risk by event type and severity
    const riskByType = {};
    const now = new Date();

    for (const event of recentEvents) {
      const eventAge = (now - new Date(event.timestamp)) / (1000 * 60 * 60);
      const eventRisk = this.calculateEventRisk(event);
      
      // Apply platform decay
      const decayedScore = eventRisk.finalScore * Math.pow(this.decayRates.platformDecay, eventAge);
      
      if (!riskByType[event.eventType]) {
        riskByType[event.eventType] = 0;
      }
      riskByType[event.eventType] += decayedScore;
    }

    const totalRisk = Object.values(riskByType).reduce((sum, risk) => sum + risk, 0);

    return {
      totalRisk: Math.round(totalRisk),
      eventCount: recentEvents.length,
      riskLevel: this.getPlatformRiskLevel(totalRisk),
      riskByType,
      recommendedAction: this.getRecommendedAction(totalRisk, 'platform')
    };
  }

  // Get severity level based on score
  getScoreSeverity(score) {
    if (score >= 95) return 'critical';
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    if (score >= 20) return 'low';
    return 'info';
  }

  // Get user risk level
  getUserRiskLevel(totalRisk) {
    if (totalRisk >= this.actionThresholds.user.criticalRisk) return 'critical';
    if (totalRisk >= this.actionThresholds.user.highRisk) return 'high';
    if (totalRisk >= this.actionThresholds.user.mediumRisk) return 'medium';
    if (totalRisk >= this.actionThresholds.user.lowRisk) return 'low';
    return 'minimal';
  }

  // Get platform risk level
  getPlatformRiskLevel(totalRisk) {
    if (totalRisk >= this.actionThresholds.platform.critical) return 'critical';
    if (totalRisk >= this.actionThresholds.platform.high) return 'high';
    if (totalRisk >= this.actionThresholds.platform.elevated) return 'elevated';
    return 'normal';
  }

  // Get recommended automated action
  getRecommendedAction(riskScore, type) {
    const thresholds = this.actionThresholds[type];
    
    if (type === 'user') {
      if (riskScore >= thresholds.criticalRisk) {
        return {
          action: 'SUSPEND_ACCOUNT',
          priority: 'immediate',
          description: 'Suspend user account immediately'
        };
      }
      if (riskScore >= thresholds.highRisk) {
        return {
          action: 'RESTRICT_ACTIONS',
          priority: 'high',
          description: 'Restrict payment and chat actions'
        };
      }
      if (riskScore >= thresholds.mediumRisk) {
        return {
          action: 'INCREASE_MONITORING',
          priority: 'medium',
          description: 'Enable enhanced monitoring'
        };
      }
      if (riskScore >= thresholds.lowRisk) {
        return {
          action: 'FLAG_FOR_REVIEW',
          priority: 'low',
          description: 'Flag account for manual review'
        };
      }
    }

    if (type === 'platform') {
      if (riskScore >= thresholds.critical) {
        return {
          action: 'PLATFORM_LOCKDOWN',
          priority: 'critical',
          description: 'Initiate emergency platform lockdown'
        };
      }
      if (riskScore >= thresholds.high) {
        return {
          action: 'ENHANCED_SECURITY',
          priority: 'high',
          description: 'Enable enhanced security measures'
        };
      }
      if (riskScore >= thresholds.elevated) {
        return {
          action: 'INCREASED_MONITORING',
          priority: 'medium',
          description: 'Increase platform monitoring'
        };
      }
    }

    return {
      action: 'MONITOR',
      priority: 'low',
      description: 'Continue normal monitoring'
    };
  }

  // Apply risk decay over time
  applyRiskDecay(currentRisk, hoursElapsed, riskType = 'user', userBehavior = 'normal') {
    let decayRate;
    
    switch (riskType) {
      case 'user':
        if (userBehavior === 'good') {
          decayRate = this.decayRates.userDecay.goodBehavior;
        } else if (userBehavior === 'repeat') {
          decayRate = this.decayRates.userDecay.repeat;
        } else {
          decayRate = this.decayRates.userDecay.base;
        }
        break;
      case 'platform':
        decayRate = this.decayRates.platformDecay;
        break;
      default:
        decayRate = 0.90;
    }

    return Math.round(currentRisk * Math.pow(decayRate, hoursElapsed));
  }

  // Generate risk assessment report
  generateRiskReport(userId, events) {
    const userRisk = this.calculateUserRisk(userId, events);
    const platformRisk = this.calculatePlatformRisk(events);
    
    // Get recent high-risk events
    const highRiskEvents = events
      .filter(e => e.context.userId === userId)
      .filter(e => this.calculateEventRisk(e).finalScore >= 50)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    return {
      userId,
      timestamp: new Date().toISOString(),
      userRisk,
      platformRisk,
      highRiskEvents: highRiskEvents.map(e => ({
        eventType: e.eventType,
        timestamp: e.timestamp,
        riskScore: this.calculateEventRisk(e).finalScore,
        severity: e.severity
      })),
      recommendations: [
        userRisk.recommendedAction,
        platformRisk.recommendedAction
      ].filter(r => r.action !== 'MONITOR')
    };
  }
}