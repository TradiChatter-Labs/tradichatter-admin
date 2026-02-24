// TradiChatter Nigerian Context Fraud Integration
// Integrates Nigerian-specific fraud detection with main fraud system

import { NigerianFraudDetector } from './nigerianFraudDetector.js';
import { IntegratedFraudProtection } from './integratedFraudProtection.js';

export class NigerianFraudIntegration {
  constructor() {
    this.nigerianDetector = new NigerianFraudDetector();
    this.fraudProtection = new IntegratedFraudProtection();
    this.nigerianFraudEvents = new Map();
  }

  // Process event with Nigerian context analysis
  async processWithNigerianContext(eventData) {
    const { event_type, user_id, business_id, amount, metadata } = eventData;
    const entityId = user_id || business_id;
    const entityType = user_id ? 'user' : 'business';

    // Step 1: Run standard fraud detection
    const standardResult = await this.fraudProtection.processEventWithProtection(eventData);

    // Step 2: Apply Nigerian context analysis
    const nigerianAnalysis = await this.analyzeNigerianContext(entityId, entityType, eventData);

    // Step 3: Combine results and adjust risk score
    const combinedResult = this.combineAnalysisResults(standardResult, nigerianAnalysis);

    // Step 4: Apply additional Nigerian-specific safeguards if needed
    const nigerianSafeguards = await this.applyNigerianSafeguards(combinedResult);

    // Step 5: Log Nigerian fraud analysis
    await this.logNigerianFraudAnalysis(combinedResult, nigerianSafeguards);

    return {
      ...combinedResult,
      nigerian_analysis: nigerianAnalysis,
      nigerian_safeguards: nigerianSafeguards,
      enhanced_protection: true
    };
  }

  // Analyze Nigerian-specific fraud patterns
  async analyzeNigerianContext(entityId, entityType, eventData) {
    const { event_type, amount, metadata } = eventData;
    const nigerianRisks = [];

    // Multi-account usage detection
    if (metadata && (metadata.phone || metadata.device_id || metadata.email)) {
      const multiAccountRisk = await this.nigerianDetector.detectMultiAccountUsage(
        entityId, entityType, metadata
      );
      if (multiAccountRisk.detected) {
        nigerianRisks.push({
          type: 'MULTI_ACCOUNT_USAGE',
          ...multiAccountRisk
        });
      }
    }

    // Transaction anomaly detection
    if (event_type.includes('transaction') || event_type.includes('escrow')) {
      const transactionRisk = await this.nigerianDetector.detectTransactionAnomalies(
        entityId, { amount, currency: 'NGN', timestamp: Date.now(), transaction_type: event_type }
      );
      if (transactionRisk.detected) {
        nigerianRisks.push({
          type: 'TRANSACTION_ANOMALY',
          ...transactionRisk
        });
      }
    }

    // KYC fraud detection
    if (event_type.includes('kyc') || event_type.includes('document')) {
      const kycRisk = await this.nigerianDetector.detectKYCFraud(
        entityId, metadata || {}
      );
      if (kycRisk.detected) {
        nigerianRisks.push({
          type: 'KYC_FRAUD',
          ...kycRisk
        });
      }
    }

    // Refund abuse detection
    if (event_type.includes('refund') || event_type.includes('cancellation')) {
      const refundRisk = await this.nigerianDetector.detectRefundAbuse(
        entityId, { refund_amount: amount, timestamp: Date.now(), ...metadata }
      );
      if (refundRisk.detected) {
        nigerianRisks.push({
          type: 'REFUND_ABUSE',
          ...refundRisk
        });
      }
    }

    return {
      nigerian_risks_detected: nigerianRisks.length,
      total_nigerian_risk_score: nigerianRisks.reduce((sum, risk) => sum + risk.risk_score, 0),
      risk_patterns: nigerianRisks,
      nigerian_context_applied: true,
      timestamp: new Date().toISOString()
    };
  }

  // Combine standard and Nigerian analysis results
  combineAnalysisResults(standardResult, nigerianAnalysis) {
    const originalRiskScore = standardResult.fraud_analysis.risk_score;
    const nigerianRiskScore = nigerianAnalysis.total_nigerian_risk_score;
    
    // Apply Nigerian context multiplier
    const nigerianMultiplier = this.calculateNigerianMultiplier(nigerianAnalysis.risk_patterns);
    const adjustedRiskScore = Math.min(
      originalRiskScore + (nigerianRiskScore * nigerianMultiplier), 
      100
    );

    // Determine new protection level
    const newProtectionLevel = this.determineEnhancedProtectionLevel(
      adjustedRiskScore, 
      nigerianAnalysis.risk_patterns
    );

    return {
      ...standardResult,
      fraud_analysis: {
        ...standardResult.fraud_analysis,
        original_risk_score: originalRiskScore,
        nigerian_risk_score: nigerianRiskScore,
        risk_score: adjustedRiskScore,
        nigerian_multiplier: nigerianMultiplier,
        risk_score_adjusted: adjustedRiskScore !== originalRiskScore
      },
      protection_level: newProtectionLevel,
      nigerian_context_enhanced: true
    };
  }

  // Calculate Nigerian context multiplier
  calculateNigerianMultiplier(riskPatterns) {
    let multiplier = 1.0;

    // High-impact Nigerian fraud patterns get higher multipliers
    const highImpactPatterns = ['MULTI_ACCOUNT_USAGE', 'KYC_FRAUD', 'DOCUMENT_REUSE'];
    const hasHighImpact = riskPatterns.some(pattern => 
      highImpactPatterns.includes(pattern.type)
    );

    if (hasHighImpact) {
      multiplier = 1.5; // 50% increase for high-impact patterns
    } else if (riskPatterns.length >= 2) {
      multiplier = 1.3; // 30% increase for multiple patterns
    } else if (riskPatterns.length >= 1) {
      multiplier = 1.2; // 20% increase for single pattern
    }

    return multiplier;
  }

  // Determine enhanced protection level with Nigerian context
  determineEnhancedProtectionLevel(riskScore, riskPatterns) {
    // Critical Nigerian fraud patterns trigger maximum protection
    const criticalPatterns = ['DOCUMENT_REUSE', 'PHONE_REUSE', 'VERY_HIGH_VALUE_NGN'];
    const hasCriticalPattern = riskPatterns.some(pattern => 
      criticalPatterns.some(critical => pattern.patterns?.some(p => p.type === critical))
    );

    if (hasCriticalPattern || riskScore >= 85) {
      return 'MAXIMUM_PROTECTION_NIGERIAN';
    } else if (riskScore >= 70) {
      return 'HIGH_PROTECTION_NIGERIAN';
    } else if (riskScore >= 40) {
      return 'MEDIUM_PROTECTION_NIGERIAN';
    } else {
      return 'STANDARD_MONITORING_NIGERIAN';
    }
  }

  // Apply Nigerian-specific safeguards
  async applyNigerianSafeguards(combinedResult) {
    const { entity_id, entity_type, fraud_analysis, nigerian_analysis } = combinedResult;
    const nigerianActions = [];

    // Apply safeguards based on Nigerian risk patterns
    for (const riskPattern of nigerian_analysis.risk_patterns) {
      switch (riskPattern.type) {
        case 'MULTI_ACCOUNT_USAGE':
          const multiAccountAction = await this.handleMultiAccountUsage(entity_id, riskPattern);
          if (multiAccountAction) nigerianActions.push(multiAccountAction);
          break;

        case 'KYC_FRAUD':
          const kycAction = await this.handleKYCFraud(entity_id, riskPattern);
          if (kycAction) nigerianActions.push(kycAction);
          break;

        case 'TRANSACTION_ANOMALY':
          const transactionAction = await this.handleTransactionAnomaly(entity_id, riskPattern);
          if (transactionAction) nigerianActions.push(transactionAction);
          break;

        case 'REFUND_ABUSE':
          const refundAction = await this.handleRefundAbuse(entity_id, riskPattern);
          if (refundAction) nigerianActions.push(refundAction);
          break;
      }
    }

    return {
      nigerian_actions_applied: nigerianActions.length,
      actions: nigerianActions,
      timestamp: new Date().toISOString()
    };
  }

  // Handle multi-account usage
  async handleMultiAccountUsage(entityId, riskPattern) {
    if (riskPattern.risk_score >= 35) {
      return {
        type: 'NIGERIAN_MULTI_ACCOUNT_RESTRICTION',
        entity_id: entityId,
        action: 'RESTRICT_ACCOUNT_CREATION',
        reason: 'Multi-account usage detected',
        duration: 86400000, // 24 hours
        nigerian_context: true,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }

  // Handle KYC fraud
  async handleKYCFraud(entityId, riskPattern) {
    if (riskPattern.fraud_patterns?.some(p => p.type === 'DOCUMENT_REUSE')) {
      return {
        type: 'NIGERIAN_KYC_FRAUD_BLOCK',
        entity_id: entityId,
        action: 'PERMANENT_KYC_BLOCK',
        reason: 'Document reuse detected',
        nigerian_context: true,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }

  // Handle transaction anomaly
  async handleTransactionAnomaly(entityId, riskPattern) {
    if (riskPattern.anomalies?.some(a => a.type === 'VERY_HIGH_VALUE_NGN')) {
      return {
        type: 'NIGERIAN_HIGH_VALUE_HOLD',
        entity_id: entityId,
        action: 'HOLD_HIGH_VALUE_TRANSACTIONS',
        reason: 'Very high value NGN transaction',
        duration: 172800000, // 48 hours
        nigerian_context: true,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }

  // Handle refund abuse
  async handleRefundAbuse(entityId, riskPattern) {
    return {
      type: 'NIGERIAN_REFUND_RESTRICTION',
      entity_id: entityId,
      action: 'LIMIT_REFUND_REQUESTS',
      reason: 'Refund abuse pattern detected',
      duration: 604800000, // 7 days
      nigerian_context: true,
      timestamp: new Date().toISOString()
    };
  }

  // Log Nigerian fraud analysis
  async logNigerianFraudAnalysis(combinedResult, nigerianSafeguards) {
    const logEntry = {
      id: this.generateNigerianLogId(),
      type: 'NIGERIAN_FRAUD_ANALYSIS',
      entity_id: combinedResult.entity_id,
      entity_type: combinedResult.entity_type,
      original_risk_score: combinedResult.fraud_analysis.original_risk_score,
      adjusted_risk_score: combinedResult.fraud_analysis.risk_score,
      nigerian_risk_score: combinedResult.fraud_analysis.nigerian_risk_score,
      nigerian_multiplier: combinedResult.fraud_analysis.nigerian_multiplier,
      protection_level: combinedResult.protection_level,
      nigerian_patterns: combinedResult.nigerian_analysis.risk_patterns.length,
      nigerian_actions: nigerianSafeguards.nigerian_actions_applied,
      timestamp: new Date().toISOString(),
      immutable: true
    };

    // In production: Store in immutable audit log
    console.log('NIGERIAN_FRAUD_ANALYSIS_LOG:', logEntry);
  }

  // Get Nigerian fraud dashboard data
  getNigerianFraudDashboard() {
    const allEvents = Array.from(this.nigerianFraudEvents.values());
    const last24h = allEvents.filter(event => 
      new Date(event.timestamp).getTime() >= Date.now() - 86400000
    );

    return {
      nigerian_overview: {
        total_nigerian_events: allEvents.length,
        events_last_24h: last24h.length,
        multi_account_detected: last24h.filter(e => 
          e.nigerian_analysis?.risk_patterns?.some(p => p.type === 'MULTI_ACCOUNT_USAGE')
        ).length,
        kyc_fraud_detected: last24h.filter(e => 
          e.nigerian_analysis?.risk_patterns?.some(p => p.type === 'KYC_FRAUD')
        ).length,
        high_value_ngn_transactions: last24h.filter(e => 
          e.nigerian_analysis?.risk_patterns?.some(p => p.type === 'TRANSACTION_ANOMALY')
        ).length
      },

      nigerian_patterns: this.getNigerianPatternStats(last24h),
      
      effectiveness: {
        risk_score_adjustments: last24h.filter(e => 
          e.fraud_analysis?.risk_score_adjusted
        ).length,
        nigerian_actions_applied: last24h.reduce((sum, e) => 
          sum + (e.nigerian_safeguards?.nigerian_actions_applied || 0), 0
        )
      },

      timestamp: new Date().toISOString()
    };
  }

  // Get Nigerian pattern statistics
  getNigerianPatternStats(events) {
    const patterns = {
      phone_reuse: 0,
      device_reuse: 0,
      document_reuse: 0,
      high_value_ngn: 0,
      rapid_transactions: 0
    };

    events.forEach(event => {
      event.nigerian_analysis?.risk_patterns?.forEach(pattern => {
        pattern.patterns?.forEach(p => {
          switch (p.type) {
            case 'PHONE_REUSE': patterns.phone_reuse++; break;
            case 'DEVICE_REUSE': patterns.device_reuse++; break;
            case 'DOCUMENT_REUSE': patterns.document_reuse++; break;
            case 'VERY_HIGH_VALUE_NGN': patterns.high_value_ngn++; break;
            case 'RAPID_TRANSACTION_PATTERN': patterns.rapid_transactions++; break;
          }
        });
      });
    });

    return patterns;
  }

  generateNigerianLogId() {
    return `nigerian_fraud_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}