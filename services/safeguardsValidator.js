// TradiChatter Automated Safeguards Validation
// Tests automated safeguards and integrated fraud protection

import { IntegratedFraudProtection } from './integratedFraudProtection.js';

export class SafeguardsValidator {
  constructor() {
    this.protection = new IntegratedFraudProtection();
    this.testResults = [];
  }

  // Run comprehensive safeguards validation
  async runSafeguardsValidation() {
    console.log('🛡️ Testing TradiChatter Automated Safeguards System\n');

    // Test 1: High Risk Safeguards
    await this.testHighRiskSafeguards();
    
    // Test 2: Medium Risk Safeguards
    await this.testMediumRiskSafeguards();
    
    // Test 3: Rapid Risk Increase Safeguards
    await this.testRapidRiskIncreaseSafeguards();
    
    // Test 4: Integrated Protection Flow
    await this.testIntegratedProtectionFlow();

    return this.generateSafeguardsReport();
  }

  // Test high risk safeguards (Score >= 70)
  async testHighRiskSafeguards() {
    console.log('1️⃣ Testing High Risk Safeguards...');

    // Simulate high-risk KYC fraud event
    const highRiskEvent = {
      event_type: 'document_fraud',
      business_id: 'business_high_risk_test',
      metadata: { type: 'fake_nin', severity: 'critical' }
    };

    const result = await this.protection.processEventWithProtection(highRiskEvent);
    
    // Check if appropriate high-risk actions were applied
    const hasAccountLock = result.safeguard_actions.some(a => a.type === 'ACCOUNT_LOCK');
    const hasEscrowHold = result.safeguard_actions.some(a => a.type === 'ESCROW_HOLD');
    const hasTransactionLimit = result.safeguard_actions.some(a => a.type === 'TRANSACTION_LIMIT');
    const isHighProtection = result.protection_level === 'MAXIMUM_PROTECTION' || result.protection_level === 'HIGH_PROTECTION';

    const highRiskPass = result.fraud_analysis.risk_score >= 70 && 
                        (hasAccountLock || hasEscrowHold || hasTransactionLimit) && 
                        isHighProtection;

    this.testResults.push({
      test: 'High Risk Safeguards',
      status: highRiskPass ? 'PASS' : 'FAIL',
      details: {
        risk_score: result.fraud_analysis.risk_score,
        protection_level: result.protection_level,
        actions_applied: result.safeguard_actions.length,
        has_critical_actions: hasAccountLock || hasEscrowHold,
        actions: result.safeguard_actions.map(a => a.type)
      }
    });

    console.log(`   ${highRiskPass ? '✅' : '❌'} High risk safeguards: Score=${result.fraud_analysis.risk_score}, Actions=${result.safeguard_actions.length}`);
  }

  // Test medium risk safeguards (Score 31-69)
  async testMediumRiskSafeguards() {
    console.log('\n2️⃣ Testing Medium Risk Safeguards...');

    // Simulate medium-risk chat flag event
    const mediumRiskEvent = {
      event_type: 'chat_flag',
      user_id: 'user_medium_risk_test',
      metadata: { reason: 'inappropriate_content', count: 4 }
    };

    const result = await this.protection.processEventWithProtection(mediumRiskEvent);
    
    // Check if appropriate medium-risk actions were applied
    const hasEnhancedMonitoring = result.safeguard_actions.some(a => a.type === 'ENHANCED_MONITORING');
    const hasManualReview = result.safeguard_actions.some(a => a.type === 'MANUAL_REVIEW_FLAG');
    const hasChatRestriction = result.safeguard_actions.some(a => a.type === 'CHAT_RESTRICTION');
    const isMediumProtection = result.protection_level === 'MEDIUM_PROTECTION' || result.protection_level === 'HIGH_PROTECTION';

    const mediumRiskPass = result.fraud_analysis.risk_score >= 31 && 
                          result.fraud_analysis.risk_score < 70 && 
                          (hasEnhancedMonitoring || hasManualReview || hasChatRestriction) && 
                          isMediumProtection;

    this.testResults.push({
      test: 'Medium Risk Safeguards',
      status: mediumRiskPass ? 'PASS' : 'FAIL',
      details: {
        risk_score: result.fraud_analysis.risk_score,
        protection_level: result.protection_level,
        actions_applied: result.safeguard_actions.length,
        has_monitoring_actions: hasEnhancedMonitoring || hasManualReview,
        actions: result.safeguard_actions.map(a => a.type)
      }
    });

    console.log(`   ${mediumRiskPass ? '✅' : '❌'} Medium risk safeguards: Score=${result.fraud_analysis.risk_score}, Actions=${result.safeguard_actions.length}`);
  }

  // Test rapid risk increase safeguards
  async testRapidRiskIncreaseSafeguards() {
    console.log('\n3️⃣ Testing Rapid Risk Increase Safeguards...');

    // First, establish baseline risk
    await this.protection.processEventWithProtection({
      event_type: 'failed_otp',
      user_id: 'user_rapid_test',
      metadata: { attempts: 2 }
    });

    // Then trigger rapid increase with high-value transaction
    const rapidIncreaseEvent = {
      event_type: 'high_value_transaction',
      user_id: 'user_rapid_test',
      amount: 2000000, // 2M NGN - very high value
      metadata: { currency: 'NGN', rapid: true }
    };

    const result = await this.protection.processEventWithProtection(rapidIncreaseEvent);
    
    // Check if rapid increase actions were applied
    const hasImmediateReview = result.safeguard_actions.some(a => a.type === 'IMMEDIATE_REVIEW');
    const hasTemporaryRestriction = result.safeguard_actions.some(a => a.type === 'TEMPORARY_RESTRICTION');
    const hasRapidResponse = result.fraud_analysis.score_change >= 30;

    const rapidIncreasePass = hasRapidResponse && (hasImmediateReview || hasTemporaryRestriction || result.safeguard_actions.length > 0);

    this.testResults.push({
      test: 'Rapid Risk Increase Safeguards',
      status: rapidIncreasePass ? 'PASS' : 'FAIL',
      details: {
        score_change: result.fraud_analysis.score_change,
        risk_score: result.fraud_analysis.risk_score,
        protection_level: result.protection_level,
        has_rapid_response: hasRapidResponse,
        actions: result.safeguard_actions.map(a => a.type)
      }
    });

    console.log(`   ${rapidIncreasePass ? '✅' : '❌'} Rapid increase safeguards: Change=${result.fraud_analysis.score_change}, Actions=${result.safeguard_actions.length}`);
  }

  // Test integrated protection flow
  async testIntegratedProtectionFlow() {
    console.log('\n4️⃣ Testing Integrated Protection Flow...');

    const integrationTest = await this.protection.testIntegratedProtection();
    
    // Check if all components work together
    const hasTestResults = integrationTest.test_results.length > 0;
    const hasDashboardData = integrationTest.dashboard_data && integrationTest.dashboard_data.protection_overview;
    const hasProtectionLevels = integrationTest.test_results.every(r => r.protection_level);
    const hasEffectivenessMetrics = integrationTest.dashboard_data.protection_effectiveness;

    const integrationPass = hasTestResults && hasDashboardData && hasProtectionLevels && hasEffectivenessMetrics;

    this.testResults.push({
      test: 'Integrated Protection Flow',
      status: integrationPass ? 'PASS' : 'FAIL',
      details: {
        test_cases_processed: integrationTest.test_results.length,
        dashboard_available: hasDashboardData,
        protection_levels_assigned: hasProtectionLevels,
        effectiveness_calculated: !!hasEffectivenessMetrics,
        effectiveness_score: integrationTest.dashboard_data.protection_effectiveness?.effectiveness_score || 0
      }
    });

    console.log(`   ${integrationPass ? '✅' : '❌'} Integration flow: ${integrationTest.test_results.length} cases, Effectiveness=${integrationTest.dashboard_data.protection_effectiveness?.effectiveness_score || 0}%`);
  }

  // Generate comprehensive safeguards report
  generateSafeguardsReport() {
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
      safeguards_flow: this.generateSafeguardsFlow(),
      protection_matrix: this.generateProtectionMatrix(),
      dashboard_sample: this.protection.getProtectionDashboard()
    };

    this.printSafeguardsReport(report);
    return report;
  }

  // Generate safeguards flow diagram
  generateSafeguardsFlow() {
    return `
TRADICHATTER AUTOMATED SAFEGUARDS FLOW ✅

┌─────────────────────────────────────────────────────────────┐
│                    FRAUD RISK ANALYSIS                     │
├─────────────────────────────────────────────────────────────┤
│ Risk Score: 0-100    │ Risk Level: LOW/MEDIUM/HIGH         │
│ Score Change: Δ      │ Protection Level: Determined        │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 AUTOMATED SAFEGUARDS                       │
├─────────────────────────────────────────────────────────────┤
│ HIGH RISK (70+):             │ MEDIUM RISK (31-69):        │
│ • Account Lock (24h)         │ • Enhanced Monitoring       │
│ • Escrow Hold (48h)          │ • Manual Review Flag        │
│ • Transaction Limit (100k)   │ • Chat Restrictions         │
│ • KYC Re-verification        │ • Transaction Monitoring    │
├─────────────────────────────────────────────────────────────┤
│ RAPID INCREASE (Δ30+):       │ PROTECTION LEVELS:          │
│ • Immediate Review           │ • MAXIMUM_PROTECTION        │
│ • Temporary Restriction      │ • HIGH_PROTECTION           │
│ • Enhanced Monitoring        │ • MEDIUM_PROTECTION         │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   ADMIN NOTIFICATIONS                      │
├─────────────────────────────────────────────────────────────┤
│ • Critical Actions: Immediate alerts                       │
│ • High Risk: Priority notifications                        │
│ • Consolidated Reports: Action summaries                   │
└─────────────────────────────────────────────────────────────┘
`;
  }

  // Generate protection matrix
  generateProtectionMatrix() {
    return `
AUTOMATED SAFEGUARDS PROTECTION MATRIX

┌─────────────────┬─────────────┬─────────────┬─────────────────┐
│  RISK LEVEL     │  THRESHOLD  │   ACTIONS   │   DURATION      │
├─────────────────┼─────────────┼─────────────┼─────────────────┤
│ HIGH RISK       │    70+      │ Account     │    24 hours     │
│                 │             │ Lock        │                 │
├─────────────────┼─────────────┼─────────────┼─────────────────┤
│ HIGH RISK       │    75+      │ Escrow      │    48 hours     │
│                 │             │ Hold        │                 │
├─────────────────┼─────────────┼─────────────┼─────────────────┤
│ HIGH RISK       │    70+      │ Transaction │   Permanent     │
│                 │             │ Limit 100k │                 │
├─────────────────┼─────────────┼─────────────┼─────────────────┤
│ MEDIUM RISK     │    31+      │ Enhanced    │    12 hours     │
│                 │             │ Monitoring  │                 │
├─────────────────┼─────────────┼─────────────┼─────────────────┤
│ MEDIUM RISK     │    40+      │ Manual      │   Until Review  │
│                 │             │ Review Flag │                 │
├─────────────────┼─────────────┼─────────────┼─────────────────┤
│ RAPID INCREASE  │   Δ30+      │ Immediate   │   Immediate     │
│                 │             │ Review      │                 │
└─────────────────┴─────────────┴─────────────┴─────────────────┘
`;
  }

  // Print safeguards report
  printSafeguardsReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('🛡️ AUTOMATED SAFEGUARDS VALIDATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\nStatus: ${report.validation_summary.status}`);
    console.log(`Passed: ${report.validation_summary.passed}/${report.validation_summary.total}`);
    
    console.log('\n📋 Test Results:');
    report.test_results.forEach((test, index) => {
      const icon = test.status === 'PASS' ? '✅' : '❌';
      console.log(`   ${index + 1}. ${icon} ${test.test}: ${test.status}`);
    });
    
    console.log('\n📊 Protection Dashboard Sample:');
    const sample = report.dashboard_sample;
    console.log(`   Total Protection Events: ${sample.protection_overview.total_protection_events}`);
    console.log(`   Maximum Protection: ${sample.protection_overview.maximum_protection}`);
    console.log(`   High Protection: ${sample.protection_overview.high_protection}`);
    console.log(`   Active Safeguards: ${sample.safeguard_metrics.active_safeguards}`);
    console.log(`   Effectiveness Score: ${sample.protection_effectiveness.effectiveness_score}%`);
    
    console.log(report.safeguards_flow);
    console.log(report.protection_matrix);
    
    if (report.validation_summary.status === 'ALL_TESTS_PASSED') {
      console.log('🎉 STEP 6.2.2 COMPLETE - AUTOMATED SAFEGUARDS OPERATIONAL! 🎉');
    } else {
      console.log('⚠️ STEP 6.2.2 NEEDS ATTENTION - SOME TESTS FAILED ⚠️');
    }
    
    console.log('='.repeat(60));
  }
}

// Execute safeguards validation
async function executeSafeguardsValidation() {
  const validator = new SafeguardsValidator();
  const report = await validator.runSafeguardsValidation();
  return report;
}

export { SafeguardsValidator, executeSafeguardsValidation };