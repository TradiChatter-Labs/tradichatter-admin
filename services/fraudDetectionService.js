// TradiChatter Fraud Detection Integration
// Connects risk scoring with real-time monitoring and admin dashboard

import { FraudRiskScorer } from './fraudRiskScorer.js';
import { RealTimeSecurityMonitor } from './realTimeMonitor.js';

export class FraudDetectionService {
  constructor() {
    this.riskScorer = new FraudRiskScorer();
    this.monitor = new RealTimeSecurityMonitor();
    this.fraudAlerts = new Map();
  }

  // Process security event and update risk score
  async processSecurityEventForFraud(eventData) {
    const { event_type, user_id, business_id, amount, metadata } = eventData;
    const entityId = user_id || business_id;
    const entityType = user_id ? 'user' : 'business';

    // Group events by entity for risk calculation
    const events = await this.getRecentEventsForEntity(entityId, entityType);
    
    // Add current event
    if (!events[event_type]) events[event_type] = [];
    events[event_type].push({
      timestamp: Date.now(),
      amount,
      metadata
    });

    // Calculate updated risk score
    const riskResult = await this.riskScorer.calculateRiskScore(entityId, entityType, events);
    
    // Check if fraud alert should be triggered
    const fraudAlert = await this.checkFraudAlert(riskResult);
    
    // Log fraud detection event
    await this.logFraudDetectionEvent(riskResult, fraudAlert);

    return {
      entity_id: entityId,
      entity_type: entityType,
      risk_score: riskResult.risk_score,
      risk_level: riskResult.risk_level,
      score_change: riskResult.score_change,
      fraud_alert: fraudAlert,
      timestamp: riskResult.timestamp
    };
  }

  // Check if fraud alert should be triggered
  async checkFraudAlert(riskResult) {
    const { entity_id, risk_score, risk_level, score_change } = riskResult;
    
    let alertTriggered = false;
    let alertType = null;
    let recommendation = null;

    // High risk threshold crossed
    if (risk_score >= 70 && risk_level === 'HIGH') {
      alertTriggered = true;
      alertType = 'HIGH_FRAUD_RISK';
      recommendation = 'IMMEDIATE_REVIEW_REQUIRED';
    }
    
    // Rapid risk increase
    else if (score_change >= 30) {
      alertTriggered = true;
      alertType = 'RAPID_RISK_INCREASE';
      recommendation = 'MONITOR_CLOSELY';
    }
    
    // Medium risk with specific patterns
    else if (risk_score >= 50 && this.hasHighRiskPatterns(riskResult)) {
      alertTriggered = true;
      alertType = 'SUSPICIOUS_PATTERN';
      recommendation = 'MANUAL_REVIEW';
    }

    if (alertTriggered) {
      const alert = {
        id: this.generateAlertId(),
        entity_id,
        alert_type: alertType,
        risk_score,
        risk_level,
        recommendation,
        created_at: new Date().toISOString(),
        status: 'ACTIVE'
      };

      this.fraudAlerts.set(alert.id, alert);
      await this.notifyAdmins(alert);
      
      return alert;
    }

    return null;
  }

  // Check for high-risk patterns
  hasHighRiskPatterns(riskResult) {
    const { event_contributions } = riskResult;
    
    // Check for critical fraud indicators
    const criticalEvents = ['kyc_failures', 'document_fraud', 'fake_business_registration'];
    const hasCriticalEvents = criticalEvents.some(event => 
      event_contributions[event] && event_contributions[event] > 20
    );

    // Check for multiple high-contribution events
    const highContributions = Object.values(event_contributions).filter(contrib => contrib > 15);
    const hasMultipleHighContributions = highContributions.length >= 3;

    return hasCriticalEvents || hasMultipleHighContributions;
  }

  // Get recent events for entity
  async getRecentEventsForEntity(entityId, entityType) {
    // In production: query from database
    // For now, simulate with some test data
    const events = {};
    
    // Get events from monitoring system
    const monitorEvents = Array.from(this.monitor.eventBuffer.values())
      .filter(event => 
        (event.user_id === entityId || event.business_id === entityId) &&
        event.timestamp >= Date.now() - 86400000 // Last 24 hours
      );

    // Group by event type
    monitorEvents.forEach(event => {
      if (!events[event.event_type]) events[event.event_type] = [];
      events[event.event_type].push({
        timestamp: event.timestamp,
        amount: event.amount,
        metadata: event.metadata
      });
    });

    return events;
  }

  // Log fraud detection event
  async logFraudDetectionEvent(riskResult, fraudAlert) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'FRAUD_DETECTION',
      entity_id: riskResult.entity_id,
      entity_type: riskResult.entity_type,
      risk_score: riskResult.risk_score,
      risk_level: riskResult.risk_level,
      score_change: riskResult.score_change,
      alert_triggered: !!fraudAlert,
      alert_id: fraudAlert?.id || null,
      event_contributions: riskResult.event_contributions,
      timestamp: new Date().toISOString(),
      immutable: true
    };

    // In production: store in immutable audit log
    console.log('FRAUD_DETECTION_LOG:', logEntry);
  }

  // Notify admins of fraud alert
  async notifyAdmins(alert) {
    const notification = {
      type: 'FRAUD_ALERT',
      alert_id: alert.id,
      entity_id: alert.entity_id,
      risk_score: alert.risk_score,
      alert_type: alert.alert_type,
      recommendation: alert.recommendation,
      priority: alert.risk_score >= 80 ? 'CRITICAL' : 'HIGH',
      timestamp: alert.created_at
    };

    // In production: send via push notification, email, SMS
    console.log('FRAUD_ALERT_NOTIFICATION:', notification);
  }

  // Get fraud dashboard data
  getFraudDashboardData() {
    const riskDistribution = this.riskScorer.getRiskDistribution();
    const highRiskEntities = this.riskScorer.getHighRiskEntities('all', 10);
    const activeAlerts = Array.from(this.fraudAlerts.values())
      .filter(alert => alert.status === 'ACTIVE')
      .sort((a, b) => b.risk_score - a.risk_score);

    return {
      risk_overview: {
        total_entities: riskDistribution.total_entities,
        high_risk_count: riskDistribution.high_risk,
        medium_risk_count: riskDistribution.medium_risk,
        low_risk_count: riskDistribution.low_risk,
        average_risk_score: riskDistribution.average_risk_score,
        active_fraud_alerts: activeAlerts.length
      },
      
      high_risk_entities: highRiskEntities,
      
      active_fraud_alerts: activeAlerts.slice(0, 10).map(alert => ({
        id: alert.id,
        entity_id: alert.entity_id,
        alert_type: alert.alert_type,
        risk_score: alert.risk_score,
        recommendation: alert.recommendation,
        created_at: alert.created_at,
        age_hours: Math.round((Date.now() - new Date(alert.created_at).getTime()) / (1000 * 60 * 60))
      })),
      
      risk_trends: this.getRiskTrends(),
      
      timestamp: new Date().toISOString()
    };
  }

  // Get risk trends (simplified)
  getRiskTrends() {
    const now = Date.now();
    const last24h = now - 86400000;
    const last48h = now - 172800000;

    const recent24h = Array.from(this.fraudAlerts.values())
      .filter(alert => new Date(alert.created_at).getTime() >= last24h);
    
    const previous24h = Array.from(this.fraudAlerts.values())
      .filter(alert => {
        const alertTime = new Date(alert.created_at).getTime();
        return alertTime >= last48h && alertTime < last24h;
      });

    return {
      alerts_last_24h: recent24h.length,
      alerts_previous_24h: previous24h.length,
      trend: recent24h.length > previous24h.length ? 'INCREASING' : 
             recent24h.length < previous24h.length ? 'DECREASING' : 'STABLE',
      change_percentage: previous24h.length > 0 ? 
        Math.round(((recent24h.length - previous24h.length) / previous24h.length) * 100) : 0
    };
  }

  // Test fraud detection with sample data
  async testFraudDetection() {
    console.log('🧪 Testing Fraud Detection System...\n');

    // Test Case 1: High-value transaction user
    const testUser1 = 'user_fraud_test_001';
    const highValueEvents = this.riskScorer.generateTestEvents(testUser1, 'user');
    
    const result1 = await this.riskScorer.calculateRiskScore(testUser1, 'user', highValueEvents);
    console.log(`Test 1 - High Value User: Risk Score ${result1.risk_score} (${result1.risk_level})`);

    // Test Case 2: KYC fraud business
    const testBusiness1 = 'business_fraud_test_001';
    const kycFraudEvents = {
      kyc_failures: [
        { timestamp: Date.now() - 86400000, metadata: { reason: 'invalid_document' } },
        { timestamp: Date.now() - 43200000, metadata: { reason: 'identity_mismatch' } }
      ],
      document_fraud: [
        { timestamp: Date.now() - 21600000, metadata: { type: 'fake_certificate' } }
      ]
    };
    
    const result2 = await this.riskScorer.calculateRiskScore(testBusiness1, 'business', kycFraudEvents);
    console.log(`Test 2 - KYC Fraud Business: Risk Score ${result2.risk_score} (${result2.risk_level})`);

    // Test Case 3: Process through fraud detection service
    const fraudResult = await this.processSecurityEventForFraud({
      event_type: 'high_value_transaction',
      user_id: 'user_fraud_test_002',
      amount: 2000000,
      metadata: { currency: 'NGN', suspicious: true }
    });
    
    console.log(`Test 3 - Fraud Service: Risk Score ${fraudResult.risk_score}, Alert: ${!!fraudResult.fraud_alert}`);

    return {
      test_results: [result1, result2, fraudResult],
      dashboard_data: this.getFraudDashboardData()
    };
  }

  generateAlertId() {
    return `fraud_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateLogId() {
    return `fraud_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}