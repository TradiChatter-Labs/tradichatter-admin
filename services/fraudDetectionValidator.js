// TradiChatter Fraud Detection Test & Validation
// Tests risk scoring accuracy and fraud detection logic

import { FraudDetectionService } from './fraudDetectionService.js';

export class FraudDetectionValidator {
  constructor() {
    this.fraudService = new FraudDetectionService();
    this.testResults = [];
  }

  // Run comprehensive fraud detection tests
  async runFraudDetectionTests() {
    console.log('🔍 Testing TradiChatter Fraud Detection System\n');

    // Test 1: Risk Score Calculation
    await this.testRiskScoreCalculation();
    
    // Test 2: Fraud Alert Triggers
    await this.testFraudAlertTriggers();
    
    // Test 3: Nigerian Context Rules
    await this.testNigerianContextRules();
    
    // Test 4: Dashboard Integration
    await this.testDashboardIntegration();

    return this.generateValidationReport();
  }

  // Test risk score calculation accuracy
  async testRiskScoreCalculation() {
    console.log('1️⃣ Testing Risk Score Calculation...');

    // Test Case 1: Low risk user
    const lowRiskEvents = {
      failed_otp: [{ timestamp: Date.now() - 3600000, metadata: {} }]
    };
    const lowRiskResult = await this.fraudService.riskScorer.calculateRiskScore(
      'user_low_risk', 'user', lowRiskEvents
    );

    // Test Case 2: High risk user
    const highRiskEvents = {
      kyc_failures: [
        { timestamp: Date.now() - 86400000, metadata: { reason: 'invalid_document' } },
        { timestamp: Date.now() - 43200000, metadata: { reason: 'identity_mismatch' } }
      ],
      high_value_transaction: [
        { timestamp: Date.now() - 3600000, amount: 1500000, metadata: { currency: 'NGN' } }
      ],
      document_fraud: [
        { timestamp: Date.now() - 1800000, metadata: { type: 'fake_certificate' } }
      ]
    };
    const highRiskResult = await this.fraudService.riskScorer.calculateRiskScore(
      'user_high_risk', 'user', highRiskEvents
    );

    const lowRiskPass = lowRiskResult.risk_score < 31 && lowRiskResult.risk_level === 'LOW';
    const highRiskPass = highRiskResult.risk_score >= 70 && highRiskResult.risk_level === 'HIGH';

    this.testResults.push({
      test: 'Risk Score Calculation',
      status: lowRiskPass && highRiskPass ? 'PASS' : 'FAIL',
      details: {
        low_risk_score: lowRiskResult.risk_score,
        low_risk_level: lowRiskResult.risk_level,
        high_risk_score: highRiskResult.risk_score,
        high_risk_level: highRiskResult.risk_level,
        score_range_correct: lowRiskPass && highRiskPass
      }
    });

    console.log(`   ${lowRiskPass && highRiskPass ? '✅' : '❌'} Risk scoring: Low=${lowRiskResult.risk_score}, High=${highRiskResult.risk_score}`);
  }

  // Test fraud alert triggers
  async testFraudAlertTriggers() {
    console.log('\n2️⃣ Testing Fraud Alert Triggers...');

    // Test high-value transaction alert
    const fraudResult = await this.fraudService.processSecurityEventForFraud({
      event_type: 'high_value_transaction',
      user_id: 'user_alert_test',
      amount: 2500000, // 2.5M NGN - very high value
      metadata: { currency: 'NGN', product: 'Electronics' }
    });

    // Test KYC fraud alert
    const kycFraudResult = await this.fraudService.processSecurityEventForFraud({
      event_type: 'document_fraud',
      business_id: 'business_alert_test',
      metadata: { type: 'fake_certificate', severity: 'high' }
    });

    const alertsTriggered = (fraudResult.fraud_alert !== null) || (kycFraudResult.fraud_alert !== null);

    this.testResults.push({
      test: 'Fraud Alert Triggers',
      status: alertsTriggered ? 'PASS' : 'FAIL',
      details: {
        high_value_alert: !!fraudResult.fraud_alert,
        kyc_fraud_alert: !!kycFraudResult.fraud_alert,
        total_alerts: this.fraudService.fraudAlerts.size
      }
    });

    console.log(`   ${alertsTriggered ? '✅' : '❌'} Alert triggers: ${alertsTriggered ? 'WORKING' : 'FAILED'}`);
  }

  // Test Nigerian context-specific rules
  async testNigerianContextRules() {
    console.log('\n3️⃣ Testing Nigerian Context Rules...');

    // Test high-value NGN transaction detection
    const ngnHighValueResult = await this.fraudService.processSecurityEventForFraud({
      event_type: 'high_value_transaction',
      user_id: 'user_ngn_test',
      amount: 800000, // 800k NGN - above Nigerian threshold
      metadata: { currency: 'NGN', location: 'Lagos' }
    });

    // Test rapid transaction pattern (common in Nigerian fraud)
    const rapidTransactionEvents = {
      rapid_transactions: Array.from({ length: 12 }, (_, i) => ({
        timestamp: Date.now() - (i * 30000), // 12 transactions in 6 minutes
        amount: 50000,
        metadata: { currency: 'NGN' }
      }))
    };
    
    const rapidResult = await this.fraudService.riskScorer.calculateRiskScore(
      'user_rapid_test', 'user', rapidTransactionEvents
    );

    // Test KYC document fraud (critical for Nigerian market)
    const kycDocumentEvents = {
      document_fraud: [
        { timestamp: Date.now() - 3600000, metadata: { type: 'fake_nin', severity: 'high' } },
        { timestamp: Date.now() - 1800000, metadata: { type: 'fake_bvn', severity: 'critical' } }
      ],
      kyc_failures: [
        { timestamp: Date.now() - 900000, metadata: { reason: 'document_mismatch' } }
      ]
    };
    
    const kycResult = await this.fraudService.riskScorer.calculateRiskScore(
      'business_kyc_test', 'business', kycDocumentEvents
    );

    const ngnRulesWorking = ngnHighValueResult.risk_score > 30 && 
                           rapidResult.risk_score > 40 && 
                           kycResult.risk_score > 60;

    this.testResults.push({
      test: 'Nigerian Context Rules',
      status: ngnRulesWorking ? 'PASS' : 'FAIL',
      details: {
        high_value_ngn_detection: ngnHighValueResult.risk_score,
        rapid_transaction_detection: rapidResult.risk_score,
        kyc_document_fraud_detection: kycResult.risk_score,
        context_rules_effective: ngnRulesWorking
      }
    });

    console.log(`   ${ngnRulesWorking ? '✅' : '❌'} Nigerian rules: NGN=${ngnHighValueResult.risk_score}, Rapid=${rapidResult.risk_score}, KYC=${kycResult.risk_score}`);
  }

  // Test dashboard integration
  async testDashboardIntegration() {
    console.log('\n4️⃣ Testing Dashboard Integration...');

    const dashboardData = this.fraudService.getFraudDashboardData();
    const hasRequiredData = dashboardData.risk_overview && 
                           dashboardData.high_risk_entities && 
                           dashboardData.active_fraud_alerts &&
                           dashboardData.risk_trends;

    this.testResults.push({
      test: 'Dashboard Integration',
      status: hasRequiredData ? 'PASS' : 'FAIL',
      details: {
        total_entities: dashboardData.risk_overview?.total_entities || 0,
        high_risk_entities: dashboardData.risk_overview?.high_risk_count || 0,
        active_alerts: dashboardData.risk_overview?.active_fraud_alerts || 0,
        dashboard_complete: hasRequiredData
      }
    });

    console.log(`   ${hasRequiredData ? '✅' : '❌'} Dashboard: ${dashboardData.risk_overview?.total_entities || 0} entities, ${dashboardData.risk_overview?.active_fraud_alerts || 0} alerts`);
  }

  // Generate validation report
  generateValidationReport() {
    const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
    const totalTests = this.testResults.length;
    const allPassed = passedTests === totalTests;

    const report = {
      validation_summary: {
        status: allPassed ? 'ALL_TESTS_PASSED' : 'SOME_TESTS_FAILED',
        passed: passedTests,
        total: totalTests,
        timestamp: new Date().toISOString()
      },
      test_results: this.testResults,
      fraud_detection_flow: this.generateFraudDetectionFlow(),
      risk_scoring_matrix: this.generateRiskScoringMatrix(),
      dashboard_sample: this.fraudService.getFraudDashboardData()
    };

    this.printValidationReport(report);
    return report;
  }

  // Generate fraud detection flow diagram
  generateFraudDetectionFlow() {
    return `
TRADICHATTER FRAUD DETECTION FLOW ✅

┌─────────────────────────────────────────────────────────────┐
│                    SECURITY EVENTS                         │
├─────────────────────────────────────────────────────────────┤
│ • Failed OTP (Weight: 15)    • High-Value Tx (Weight: 25)  │
│ • KYC Failures (Weight: 30)  • Document Fraud (Weight: 35) │
│ • Chat Flags (Weight: 14)    • Rapid Tx (Weight: 18)       │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRAUD RISK SCORER                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Event Weighting           │ 2. Time Decay Application    │
│ 3. Frequency Multipliers     │ 4. Nigerian Context Rules    │
│ 5. Risk Score (0-100)        │ 6. Risk Level Classification │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 RISK THRESHOLDS                            │
├─────────────────────────────────────────────────────────────┤
│ • LOW (0-30): Normal monitoring                            │
│ • MEDIUM (31-69): Enhanced monitoring, manual review       │
│ • HIGH (70-100): Auto-actions, immediate admin alerts      │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRAUD ALERTS & ACTIONS                     │
├─────────────────────────────────────────────────────────────┤
│ • High Risk: Account lock, escrow hold, admin notification │
│ • Rapid Increase: Enhanced monitoring, manual review       │
│ • Suspicious Pattern: Flag for investigation               │
└─────────────────────────────────────────────────────────────┘

NIGERIAN CONTEXT SPECIALIZATIONS:
• High-Value Threshold: ₦500,000+ (adjustable)
• KYC Document Fraud: NIN, BVN verification
• Rapid Transaction Detection: 10+ in 10 minutes
• Multi-Account Detection: Phone/Device/Email matching
`;
  }

  // Generate risk scoring matrix
  generateRiskScoringMatrix() {
    return `
FRAUD RISK SCORING MATRIX

┌─────────────────────┬────────┬─────────┬──────────────────┐
│    EVENT TYPE       │ WEIGHT │  DECAY  │   DESCRIPTION    │
├─────────────────────┼────────┼─────────┼──────────────────┤
│ Document Fraud      │   35   │  0.005  │ Fake NIN/BVN    │
│ Fake Business Reg   │   40   │  0.005  │ Fraudulent CAC   │
│ KYC Failures        │   30   │  0.01   │ Verification fail│
│ High-Value Tx       │   25   │  0.01   │ ₦500k+ threshold │
│ Escrow Disputes     │   22   │  0.03   │ Frequent disputes│
│ Multiple Devices    │   20   │  0.02   │ Multi-account    │
│ Rapid Transactions  │   18   │  0.05   │ 10+ in 10min     │
│ Failed OTP          │   15   │  0.1    │ 5+ in 5min       │
│ Chat Flags          │   14   │  0.08   │ Content violations│
└─────────────────────┴────────┴─────────┴──────────────────┘

RISK LEVELS:
• LOW (0-30): Standard monitoring, no restrictions
• MEDIUM (31-69): Enhanced monitoring, manual review flags
• HIGH (70-100): Auto-lock, escrow hold, immediate alerts
`;
  }

  // Print validation report
  printValidationReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 FRAUD DETECTION VALIDATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\nStatus: ${report.validation_summary.status}`);
    console.log(`Passed: ${report.validation_summary.passed}/${report.validation_summary.total}`);
    
    console.log('\n📋 Test Results:');
    report.test_results.forEach((test, index) => {
      const icon = test.status === 'PASS' ? '✅' : '❌';
      console.log(`   ${index + 1}. ${icon} ${test.test}: ${test.status}`);
    });
    
    console.log('\n📈 Dashboard Sample:');
    const sample = report.dashboard_sample;
    console.log(`   Total Entities: ${sample.risk_overview.total_entities}`);
    console.log(`   High Risk: ${sample.risk_overview.high_risk_count}`);
    console.log(`   Active Alerts: ${sample.risk_overview.active_fraud_alerts}`);
    console.log(`   Average Risk Score: ${sample.risk_overview.average_risk_score}`);
    
    console.log(report.fraud_detection_flow);
    console.log(report.risk_scoring_matrix);
    
    if (report.validation_summary.status === 'ALL_TESTS_PASSED') {
      console.log('🎉 STEP 6.2.1 COMPLETE - FRAUD RISK SCORING OPERATIONAL! 🎉');
    } else {
      console.log('⚠️ STEP 6.2.1 NEEDS ATTENTION - SOME TESTS FAILED ⚠️');
    }
    
    console.log('='.repeat(60));
  }
}

// Execute fraud detection validation
async function executeFraudDetectionValidation() {
  const validator = new FraudDetectionValidator();
  const report = await validator.runFraudDetectionTests();
  
  // Run additional fraud service tests
  console.log('\n🔄 Running Additional Fraud Detection Tests...');
  const additionalTests = await validator.fraudService.testFraudDetection();
  
  console.log('\n📊 Additional Test Results:');
  additionalTests.test_results.forEach((result, index) => {
    console.log(`   Test ${index + 1}: Risk Score ${result.risk_score} (${result.risk_level})`);
  });
  
  return report;
}

export { FraudDetectionValidator, executeFraudDetectionValidation };