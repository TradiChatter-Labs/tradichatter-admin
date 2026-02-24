// TradiChatter Integrated Fraud Protection System
// Combines fraud detection with automated safeguards

import { FraudDetectionService } from './fraudDetectionService.js';
import { AutomatedFraudSafeguards } from './automatedSafeguards.js';

export class IntegratedFraudProtection {
  constructor() {
    this.fraudDetection = new FraudDetectionService();
    this.safeguards = new AutomatedFraudSafeguards();
    this.protectionEvents = new Map();
  }

  // Process security event with full fraud protection
  async processEventWithProtection(eventData) {
    // Step 1: Process through fraud detection
    const fraudResult = await this.fraudDetection.processSecurityEventForFraud(eventData);
    
    // Step 2: Apply automated safeguards based on risk
    const safeguardResult = await this.safeguards.applySafeguards(fraudResult);
    
    // Step 3: Log integrated protection event
    const protectionEvent = {
      id: this.generateProtectionId(),
      entity_id: fraudResult.entity_id,
      entity_type: fraudResult.entity_type,
      original_event: eventData,
      fraud_analysis: {
        risk_score: fraudResult.risk_score,
        risk_level: fraudResult.risk_level,
        score_change: fraudResult.score_change,
        fraud_alert: fraudResult.fraud_alert
      },
      safeguard_actions: safeguardResult.actions_applied,
      protection_level: this.determineProtectionLevel(fraudResult, safeguardResult),
      timestamp: new Date().toISOString()
    };

    this.protectionEvents.set(protectionEvent.id, protectionEvent);
    
    // Step 4: Send consolidated admin notification if needed
    if (this.requiresAdminNotification(protectionEvent)) {
      await this.sendConsolidatedAlert(protectionEvent);
    }

    return protectionEvent;
  }

  // Determine overall protection level
  determineProtectionLevel(fraudResult, safeguardResult) {
    const { risk_score, fraud_alert } = fraudResult;
    const { actions_applied } = safeguardResult;

    if (risk_score >= 80 || (fraud_alert && fraud_alert.risk_score >= 70)) {
      return 'MAXIMUM_PROTECTION';
    } else if (risk_score >= 50 || actions_applied.length >= 3) {
      return 'HIGH_PROTECTION';
    } else if (risk_score >= 31 || actions_applied.length >= 1) {
      return 'MEDIUM_PROTECTION';
    } else {
      return 'STANDARD_MONITORING';
    }
  }

  // Check if admin notification is required
  requiresAdminNotification(protectionEvent) {
    const { protection_level, safeguard_actions, fraud_analysis } = protectionEvent;
    
    // Critical actions require notification
    const criticalActions = ['ACCOUNT_LOCK', 'ESCROW_HOLD', 'KYC_REVERIFICATION'];
    const hasCriticalActions = safeguard_actions.some(action => 
      criticalActions.includes(action.type)
    );

    // High risk or maximum protection requires notification
    const highRisk = fraud_analysis.risk_score >= 70;
    const maxProtection = protection_level === 'MAXIMUM_PROTECTION';

    return hasCriticalActions || highRisk || maxProtection;
  }

  // Send consolidated alert to admins
  async sendConsolidatedAlert(protectionEvent) {
    const alert = {
      type: 'INTEGRATED_FRAUD_PROTECTION_ALERT',
      protection_id: protectionEvent.id,
      entity_id: protectionEvent.entity_id,
      entity_type: protectionEvent.entity_type,
      protection_level: protectionEvent.protection_level,
      risk_score: protectionEvent.fraud_analysis.risk_score,
      actions_taken: protectionEvent.safeguard_actions.map(a => a.type),
      requires_immediate_attention: protectionEvent.protection_level === 'MAXIMUM_PROTECTION',
      timestamp: protectionEvent.timestamp
    };

    // In production: Send via admin notification system
    console.log('INTEGRATED_FRAUD_PROTECTION_ALERT:', alert);
  }

  // Get comprehensive fraud protection dashboard
  getProtectionDashboard() {
    const fraudDashboard = this.fraudDetection.getFraudDashboardData();
    const safeguardsDashboard = this.safeguards.getSafeguardsDashboardData();
    const protectionEvents = Array.from(this.protectionEvents.values());

    return {
      protection_overview: {
        total_protection_events: protectionEvents.length,
        maximum_protection: protectionEvents.filter(e => e.protection_level === 'MAXIMUM_PROTECTION').length,
        high_protection: protectionEvents.filter(e => e.protection_level === 'HIGH_PROTECTION').length,
        medium_protection: protectionEvents.filter(e => e.protection_level === 'MEDIUM_PROTECTION').length,
        standard_monitoring: protectionEvents.filter(e => e.protection_level === 'STANDARD_MONITORING').length
      },

      fraud_metrics: fraudDashboard.risk_overview,
      
      safeguard_metrics: safeguardsDashboard.overview,
      
      recent_protection_events: protectionEvents
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15)
        .map(event => ({
          id: event.id,
          entity_id: event.entity_id,
          entity_type: event.entity_type,
          protection_level: event.protection_level,
          risk_score: event.fraud_analysis.risk_score,
          actions_count: event.safeguard_actions.length,
          timestamp: event.timestamp
        })),

      protection_effectiveness: this.calculateProtectionEffectiveness(),
      
      timestamp: new Date().toISOString()
    };
  }

  // Calculate protection effectiveness metrics
  calculateProtectionEffectiveness() {
    const events = Array.from(this.protectionEvents.values());
    const last24h = events.filter(e => 
      new Date(e.timestamp).getTime() >= Date.now() - 86400000
    );

    const highRiskPrevented = last24h.filter(e => 
      e.fraud_analysis.risk_score >= 70 && e.safeguard_actions.length > 0
    ).length;

    const totalHighRisk = last24h.filter(e => 
      e.fraud_analysis.risk_score >= 70
    ).length;

    return {
      prevention_rate: totalHighRisk > 0 ? Math.round((highRiskPrevented / totalHighRisk) * 100) : 0,
      events_processed_24h: last24h.length,
      high_risk_prevented: highRiskPrevented,
      total_high_risk: totalHighRisk,
      average_response_time: '< 1 second', // Real-time processing
      effectiveness_score: this.calculateEffectivenessScore(last24h)
    };
  }

  // Calculate overall effectiveness score
  calculateEffectivenessScore(events) {
    if (events.length === 0) return 0;

    let score = 0;
    events.forEach(event => {
      // Points for risk detection
      score += Math.min(event.fraud_analysis.risk_score / 10, 10);
      
      // Points for appropriate actions
      if (event.fraud_analysis.risk_score >= 70 && event.safeguard_actions.length > 0) {
        score += 15;
      } else if (event.fraud_analysis.risk_score >= 31 && event.safeguard_actions.length > 0) {
        score += 10;
      }
      
      // Points for protection level matching risk
      if (event.protection_level === 'MAXIMUM_PROTECTION' && event.fraud_analysis.risk_score >= 80) {
        score += 10;
      }
    });

    return Math.min(Math.round(score / events.length), 100);
  }

  // Test integrated fraud protection
  async testIntegratedProtection() {
    console.log('🧪 Testing Integrated Fraud Protection System...\n');

    const testCases = [
      {
        name: 'High-Value Transaction',
        event: {
          event_type: 'high_value_transaction',
          user_id: 'user_protection_test_001',
          amount: 1500000,
          metadata: { currency: 'NGN', suspicious: true }
        }
      },
      {
        name: 'KYC Document Fraud',
        event: {
          event_type: 'document_fraud',
          business_id: 'business_protection_test_001',
          metadata: { type: 'fake_nin', severity: 'high' }
        }
      },
      {
        name: 'Rapid Failed OTP',
        event: {
          event_type: 'failed_otp',
          user_id: 'user_protection_test_002',
          metadata: { attempts: 6, ip: '192.168.1.100' }
        }
      }
    ];

    const results = [];
    
    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.name}`);
      const result = await this.processEventWithProtection(testCase.event);
      
      console.log(`  Risk Score: ${result.fraud_analysis.risk_score}`);
      console.log(`  Protection Level: ${result.protection_level}`);
      console.log(`  Actions Applied: ${result.safeguard_actions.length}`);
      console.log(`  Actions: ${result.safeguard_actions.map(a => a.type).join(', ')}\n`);
      
      results.push(result);
    }

    return {
      test_results: results,
      dashboard_data: this.getProtectionDashboard()
    };
  }

  generateProtectionId() {
    return `protection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}