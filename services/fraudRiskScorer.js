// TradiChatter Fraud Risk Scoring Engine
// Calculates risk scores 0-100 for Nigerian chat-commerce context

export class FraudRiskScorer {
  constructor() {
    this.riskWeights = this.initializeRiskWeights();
    this.userRiskProfiles = new Map(); // In production: database
    this.businessRiskProfiles = new Map();
  }

  // Initialize risk weights for Nigerian context
  initializeRiskWeights() {
    return {
      // Authentication & Access
      failed_otp: { weight: 15, decay: 0.1 }, // High weight for OTP failures
      suspicious_login: { weight: 12, decay: 0.05 },
      multiple_devices: { weight: 20, decay: 0.02 }, // Multi-account detection
      
      // Transaction Patterns
      high_value_transaction: { weight: 25, decay: 0.01 }, // Critical for Nigerian context
      rapid_transactions: { weight: 18, decay: 0.05 },
      unusual_transaction_time: { weight: 8, decay: 0.1 },
      cross_border_transaction: { weight: 15, decay: 0.02 },
      
      // Escrow & Payment
      escrow_disputes: { weight: 22, decay: 0.03 },
      rapid_cancellations: { weight: 16, decay: 0.05 },
      payment_failures: { weight: 10, decay: 0.1 },
      refund_abuse: { weight: 20, decay: 0.02 },
      
      // KYC & Verification
      kyc_failures: { weight: 30, decay: 0.01 }, // Highest weight for KYC issues
      document_fraud: { weight: 35, decay: 0.005 }, // Critical for Nigerian market
      identity_mismatch: { weight: 28, decay: 0.01 },
      
      // Chat & Communication
      chat_flags: { weight: 14, decay: 0.08 },
      spam_reports: { weight: 12, decay: 0.1 },
      inappropriate_content: { weight: 10, decay: 0.1 },
      
      // Business-Specific
      fake_business_registration: { weight: 40, decay: 0.005 },
      business_verification_failure: { weight: 25, decay: 0.02 },
      customer_complaints: { weight: 18, decay: 0.05 }
    };
  }

  // Calculate risk score for user or business
  async calculateRiskScore(entityId, entityType, events) {
    const profile = this.getRiskProfile(entityId, entityType);
    let totalRisk = 0;
    let eventContributions = {};

    // Process each event type
    for (const [eventType, eventList] of Object.entries(events)) {
      if (!this.riskWeights[eventType]) continue;

      const contribution = this.calculateEventContribution(eventType, eventList);
      eventContributions[eventType] = contribution;
      totalRisk += contribution;
    }

    // Apply time decay to existing risk
    const decayedExistingRisk = this.applyTimeDecay(profile.risk_score, profile.last_updated);
    
    // Calculate new risk score (max 100)
    const newRiskScore = Math.min(decayedExistingRisk + totalRisk, 100);
    
    // Update profile
    profile.risk_score = newRiskScore;
    profile.last_updated = Date.now();
    profile.event_contributions = eventContributions;
    profile.risk_level = this.getRiskLevel(newRiskScore);

    this.updateRiskProfile(entityId, entityType, profile);

    return {
      entity_id: entityId,
      entity_type: entityType,
      risk_score: newRiskScore,
      risk_level: profile.risk_level,
      event_contributions: eventContributions,
      previous_score: decayedExistingRisk,
      score_change: newRiskScore - decayedExistingRisk,
      timestamp: new Date().toISOString()
    };
  }

  // Calculate contribution of specific event type
  calculateEventContribution(eventType, events) {
    const config = this.riskWeights[eventType];
    if (!config || !events.length) return 0;

    // Base contribution from event count and recency
    let contribution = 0;
    const now = Date.now();

    events.forEach(event => {
      const ageHours = (now - event.timestamp) / (1000 * 60 * 60);
      const recencyMultiplier = Math.max(0.1, 1 - (ageHours * config.decay));
      
      // Special handling for high-value transactions
      if (eventType === 'high_value_transaction' && event.amount) {
        const amountMultiplier = Math.min(event.amount / 500000, 3); // NGN 500k baseline
        contribution += config.weight * recencyMultiplier * amountMultiplier;
      } else {
        contribution += config.weight * recencyMultiplier;
      }
    });

    // Frequency multiplier for repeated events
    if (events.length > 1) {
      const frequencyMultiplier = Math.min(1 + (events.length - 1) * 0.2, 2);
      contribution *= frequencyMultiplier;
    }

    return Math.min(contribution, 50); // Cap individual event type contribution
  }

  // Apply time-based decay to existing risk
  applyTimeDecay(currentRisk, lastUpdated) {
    if (!lastUpdated) return 0;
    
    const ageHours = (Date.now() - lastUpdated) / (1000 * 60 * 60);
    const decayRate = 0.02; // 2% decay per hour
    const decayFactor = Math.max(0, 1 - (ageHours * decayRate));
    
    return currentRisk * decayFactor;
  }

  // Get risk level category
  getRiskLevel(score) {
    if (score >= 70) return 'HIGH';
    if (score >= 31) return 'MEDIUM';
    return 'LOW';
  }

  // Get or create risk profile
  getRiskProfile(entityId, entityType) {
    const profileMap = entityType === 'business' ? this.businessRiskProfiles : this.userRiskProfiles;
    
    if (!profileMap.has(entityId)) {
      profileMap.set(entityId, {
        entity_id: entityId,
        entity_type: entityType,
        risk_score: 0,
        risk_level: 'LOW',
        created_at: Date.now(),
        last_updated: null,
        event_contributions: {},
        total_events: 0
      });
    }
    
    return profileMap.get(entityId);
  }

  // Update risk profile
  updateRiskProfile(entityId, entityType, profile) {
    const profileMap = entityType === 'business' ? this.businessRiskProfiles : this.userRiskProfiles;
    profileMap.set(entityId, profile);
  }

  // Get high-risk entities
  getHighRiskEntities(entityType = 'all', limit = 50) {
    let profiles = [];
    
    if (entityType === 'all' || entityType === 'user') {
      profiles.push(...Array.from(this.userRiskProfiles.values()));
    }
    
    if (entityType === 'all' || entityType === 'business') {
      profiles.push(...Array.from(this.businessRiskProfiles.values()));
    }
    
    return profiles
      .filter(profile => profile.risk_score >= 70)
      .sort((a, b) => b.risk_score - a.risk_score)
      .slice(0, limit)
      .map(profile => ({
        entity_id: profile.entity_id,
        entity_type: profile.entity_type,
        risk_score: profile.risk_score,
        risk_level: profile.risk_level,
        last_updated: new Date(profile.last_updated).toISOString(),
        top_risk_factors: this.getTopRiskFactors(profile.event_contributions)
      }));
  }

  // Get top risk factors for an entity
  getTopRiskFactors(eventContributions) {
    return Object.entries(eventContributions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([event, contribution]) => ({
        event_type: event,
        contribution: Math.round(contribution),
        description: this.getEventDescription(event)
      }));
  }

  // Get human-readable event description
  getEventDescription(eventType) {
    const descriptions = {
      failed_otp: 'Multiple failed OTP attempts',
      high_value_transaction: 'High-value transactions',
      kyc_failures: 'KYC verification failures',
      document_fraud: 'Suspicious document submissions',
      escrow_disputes: 'Frequent escrow disputes',
      rapid_transactions: 'Rapid transaction patterns',
      multiple_devices: 'Multiple device usage',
      fake_business_registration: 'Suspicious business registration'
    };
    
    return descriptions[eventType] || eventType.replace(/_/g, ' ');
  }

  // Get risk distribution statistics
  getRiskDistribution() {
    const allProfiles = [
      ...Array.from(this.userRiskProfiles.values()),
      ...Array.from(this.businessRiskProfiles.values())
    ];

    const distribution = {
      total_entities: allProfiles.length,
      low_risk: allProfiles.filter(p => p.risk_score < 31).length,
      medium_risk: allProfiles.filter(p => p.risk_score >= 31 && p.risk_score < 70).length,
      high_risk: allProfiles.filter(p => p.risk_score >= 70).length,
      average_risk_score: allProfiles.length > 0 ? 
        Math.round(allProfiles.reduce((sum, p) => sum + p.risk_score, 0) / allProfiles.length) : 0,
      timestamp: new Date().toISOString()
    };

    return distribution;
  }

  // Simulate fraud events for testing
  generateTestEvents(entityId, entityType) {
    const testEvents = {
      failed_otp: [
        { timestamp: Date.now() - 300000, metadata: { ip: '192.168.1.100' } },
        { timestamp: Date.now() - 240000, metadata: { ip: '192.168.1.100' } },
        { timestamp: Date.now() - 180000, metadata: { ip: '192.168.1.100' } }
      ],
      high_value_transaction: [
        { timestamp: Date.now() - 600000, amount: 750000, metadata: { currency: 'NGN' } },
        { timestamp: Date.now() - 300000, amount: 1200000, metadata: { currency: 'NGN' } }
      ],
      kyc_failures: [
        { timestamp: Date.now() - 86400000, metadata: { reason: 'invalid_document' } }
      ]
    };

    return testEvents;
  }
}