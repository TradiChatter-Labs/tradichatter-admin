// TradiChatter Real-Time Security Monitoring
// Tracks security events and triggers alerts for Nigerian chat-commerce context

export class RealTimeSecurityMonitor {
  constructor() {
    this.eventBuffer = new Map(); // In production: Redis/real-time DB
    this.alertThresholds = this.initializeThresholds();
    this.activeAlerts = new Map();
  }

  // Initialize monitoring thresholds for Nigerian context
  initializeThresholds() {
    return {
      failed_otp: { count: 5, window: 300000 }, // 5 failures in 5 minutes
      chat_flags: { count: 3, window: 3600000 }, // 3 flags in 1 hour
      escrow_anomalies: { count: 2, window: 1800000 }, // 2 anomalies in 30 minutes
      kyc_rejections: { count: 3, window: 86400000 }, // 3 rejections in 24 hours
      rapid_transactions: { count: 10, window: 600000 }, // 10 transactions in 10 minutes
      high_value_escrow: { amount: 500000, currency: 'NGN' }, // 500k NGN threshold
      suspicious_login_pattern: { count: 8, window: 3600000 } // 8 logins in 1 hour
    };
  }

  // Track security event in real-time
  async trackEvent(eventData) {
    const { event_type, user_id, business_id, amount, metadata } = eventData;
    const timestamp = Date.now();
    
    const event = {
      id: this.generateEventId(),
      event_type,
      user_id,
      business_id,
      amount,
      metadata,
      timestamp,
      processed: false
    };

    // Store event
    await this.storeEvent(event);
    
    // Check for anomalies
    const anomaly = await this.checkForAnomalies(event);
    
    if (anomaly.detected) {
      await this.triggerAlert(anomaly);
    }

    return {
      event_id: event.id,
      anomaly_detected: anomaly.detected,
      risk_score: anomaly.risk_score || 0
    };
  }

  // Check for anomalies based on event patterns
  async checkForAnomalies(event) {
    const { event_type, user_id, business_id, amount, timestamp } = event;
    const window = this.alertThresholds[event_type]?.window || 3600000;
    
    // Get recent events for this user/business
    const recentEvents = await this.getRecentEvents(user_id || business_id, event_type, window);
    
    let anomaly = { detected: false, risk_score: 0 };

    switch (event_type) {
      case 'failed_otp':
        anomaly = this.checkFailedOTPAnomaly(recentEvents, event);
        break;
      case 'chat_flag':
        anomaly = this.checkChatFlagAnomaly(recentEvents, event);
        break;
      case 'escrow_created':
      case 'escrow_disputed':
        anomaly = this.checkEscrowAnomaly(recentEvents, event);
        break;
      case 'kyc_rejected':
        anomaly = this.checkKYCAnomaly(recentEvents, event);
        break;
      case 'login_attempt':
        anomaly = this.checkLoginAnomaly(recentEvents, event);
        break;
    }

    return anomaly;
  }

  // Check failed OTP anomalies
  checkFailedOTPAnomaly(recentEvents, currentEvent) {
    const threshold = this.alertThresholds.failed_otp;
    const failedCount = recentEvents.length + 1;

    if (failedCount >= threshold.count) {
      return {
        detected: true,
        type: 'EXCESSIVE_FAILED_OTP',
        risk_score: Math.min(failedCount * 10, 100),
        details: {
          failed_attempts: failedCount,
          threshold: threshold.count,
          user_id: currentEvent.user_id,
          recommendation: 'TEMPORARY_ACCOUNT_LOCK'
        }
      };
    }

    return { detected: false, risk_score: failedCount * 2 };
  }

  // Check escrow anomalies (Nigerian context)
  checkEscrowAnomaly(recentEvents, currentEvent) {
    const { amount, metadata } = currentEvent;
    const highValueThreshold = this.alertThresholds.high_value_escrow.amount;
    
    let anomaly = { detected: false, risk_score: 0 };

    // High value transaction
    if (amount && amount >= highValueThreshold) {
      anomaly = {
        detected: true,
        type: 'HIGH_VALUE_ESCROW',
        risk_score: Math.min((amount / highValueThreshold) * 30, 80),
        details: {
          amount,
          currency: 'NGN',
          threshold: highValueThreshold,
          recommendation: 'MANUAL_REVIEW'
        }
      };
    }

    // Rapid escrow creation pattern
    const rapidThreshold = this.alertThresholds.rapid_transactions;
    if (recentEvents.length >= rapidThreshold.count) {
      anomaly = {
        detected: true,
        type: 'RAPID_ESCROW_PATTERN',
        risk_score: recentEvents.length * 8,
        details: {
          transaction_count: recentEvents.length + 1,
          threshold: rapidThreshold.count,
          recommendation: 'TRANSACTION_LIMIT'
        }
      };
    }

    return anomaly;
  }

  // Trigger alert for anomaly
  async triggerAlert(anomaly) {
    const alertId = this.generateAlertId();
    const alert = {
      id: alertId,
      type: anomaly.type,
      risk_score: anomaly.risk_score,
      details: anomaly.details,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      resolved_at: null
    };

    this.activeAlerts.set(alertId, alert);
    
    // Send to admin dashboard via SEG
    await this.notifyAdminDashboard(alert);
    
    return alertId;
  }

  // Get recent events for analysis
  async getRecentEvents(entityId, eventType, windowMs) {
    const cutoff = Date.now() - windowMs;
    const events = [];
    
    // In production: query from database with time window
    for (const [key, event] of this.eventBuffer) {
      if (event.timestamp >= cutoff && 
          event.event_type === eventType &&
          (event.user_id === entityId || event.business_id === entityId)) {
        events.push(event);
      }
    }
    
    return events.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Store event (in production: to database)
  async storeEvent(event) {
    this.eventBuffer.set(event.id, event);
    
    // Clean old events (keep last 24 hours)
    const cutoff = Date.now() - 86400000;
    for (const [key, storedEvent] of this.eventBuffer) {
      if (storedEvent.timestamp < cutoff) {
        this.eventBuffer.delete(key);
      }
    }
  }

  // Notify admin dashboard
  async notifyAdminDashboard(alert) {
    // In production: send via SEG to admin dashboard
    console.log(`ALERT TRIGGERED: ${alert.type} - Risk Score: ${alert.risk_score}`);
  }

  // Get active alerts for dashboard
  getActiveAlerts() {
    return Array.from(this.activeAlerts.values())
      .filter(alert => alert.status === 'ACTIVE')
      .sort((a, b) => b.risk_score - a.risk_score);
  }

  // Get monitoring metrics
  getMetrics() {
    const now = Date.now();
    const last24h = now - 86400000;
    
    const recentEvents = Array.from(this.eventBuffer.values())
      .filter(event => event.timestamp >= last24h);
    
    const metrics = {
      total_events_24h: recentEvents.length,
      active_alerts: this.activeAlerts.size,
      events_by_type: {},
      risk_distribution: { low: 0, medium: 0, high: 0 },
      timestamp: new Date().toISOString()
    };

    // Count events by type
    recentEvents.forEach(event => {
      metrics.events_by_type[event.event_type] = 
        (metrics.events_by_type[event.event_type] || 0) + 1;
    });

    // Risk distribution
    Array.from(this.activeAlerts.values()).forEach(alert => {
      if (alert.risk_score < 30) metrics.risk_distribution.low++;
      else if (alert.risk_score < 70) metrics.risk_distribution.medium++;
      else metrics.risk_distribution.high++;
    });

    return metrics;
  }

  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}