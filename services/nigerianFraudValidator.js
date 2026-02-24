// TradiChatter Nigerian Context Fraud Detection Validation
// Tests Nigerian-specific fraud detection rules and integration

import { NigerianFraudIntegration } from './nigerianFraudIntegration.js';

export class NigerianFraudValidator {
  constructor() {
    this.nigerianFraud = new NigerianFraudIntegration();
    this.testResults = [];
  }

  // Run comprehensive Nigerian fraud detection tests
  async runNigerianFraudTests() {
    console.log('🇳🇬 Testing TradiChatter Nigerian Context Fraud Detection\n');

    // Test 1: Multi-Account Usage Detection
    await this.testMultiAccountDetection();
    
    // Test 2: High-Value NGN Transaction Detection
    await this.testHighValueNGNDetection();
    
    // Test 3: KYC Document Fraud Detection
    await this.testKYCDocumentFraud();
    
    // Test 4: Rapid Transaction Pattern Detection
    await this.testRapidTransactionPatterns();

    return this.generateNigerianFraudReport();
  }

  // Test multi-account usage detection
  async testMultiAccountDetection() {
    console.log('1️⃣ Testing Multi-Account Usage Detection...');

    // Test phone number reuse
    const phoneReuseEvent = {
      event_type: 'account_creation',
      user_id: 'user_phone_test_001',
      metadata: {
        phone: '+2348012345678',
        device_id: 'device_123',
        email: 'test@example.com'
      }
    };

    // Create first account
    await this.nigerianFraud.processWithNigerianContext(phoneReuseEvent);
    
    // Try to create second account with same phone
    const duplicatePhoneEvent = {
      ...phoneReuseEvent,
      user_id: 'user_phone_test_002'
    };

    const result = await this.nigerianFraud.processWithNigerianContext(duplicatePhoneEvent);
    
    // Check if phone reuse was detected
    const phoneReuseDetected = result.nigerian_analysis?.risk_patterns?.some(pattern => 
      pattern.patterns?.some(p => p.type === 'PHONE_REUSE')
    );

    const riskScoreIncreased = result.fraud_analysis.risk_score > result.fraud_analysis.original_risk_score;

    const multiAccountPass = phoneReuseDetected && riskScoreIncreased;

    this.testResults.push({
      test: 'Multi-Account Usage Detection',
      status: multiAccountPass ? 'PASS' : 'FAIL',
      details: {
        phone_reuse_detected: phoneReuseDetected,
        risk_score_original: result.fraud_analysis.original_risk_score,
        risk_score_adjusted: result.fraud_analysis.risk_score,
        nigerian_patterns: result.nigerian_analysis.nigerian_risks_detected,
        nigerian_actions: result.nigerian_safeguards?.nigerian_actions_applied || 0
      }
    });

    console.log(`   ${multiAccountPass ? '✅' : '❌'} Multi-account detection: Phone reuse=${phoneReuseDetected}, Risk increase=${riskScoreIncreased}`);
  }

  // Test high-value NGN transaction detection
  async testHighValueNGNDetection() {
    console.log('\n2️⃣ Testing High-Value NGN Transaction Detection...');

    const highValueEvent = {
      event_type: 'high_value_transaction',
      user_id: 'user_ngn_test_001',
      amount: 2500000, // 2.5M NGN - very high value
      metadata: {
        currency: 'NGN',
        location: 'Lagos',
        transaction_type: 'escrow_creation'
      }
    };

    const result = await this.nigerianFraud.processWithNigerianContext(highValueEvent);
    
    // Check if high-value NGN transaction was detected
    const highValueDetected = result.nigerian_analysis?.risk_patterns?.some(pattern => 
      pattern.anomalies?.some(a => a.type === 'VERY_HIGH_VALUE_NGN')
    );

    const nigerianSafeguardApplied = result.nigerian_safeguards?.actions?.some(action => 
      action.type === 'NIGERIAN_HIGH_VALUE_HOLD'
    );

    const highValuePass = highValueDetected && result.fraud_analysis.risk_score >= 50;

    this.testResults.push({
      test: 'High-Value NGN Transaction Detection',
      status: highValuePass ? 'PASS' : 'FAIL',
      details: {
        high_value_detected: highValueDetected,
        transaction_amount: highValueEvent.amount,
        risk_score: result.fraud_analysis.risk_score,
        nigerian_safeguard_applied: nigerianSafeguardApplied,
        protection_level: result.protection_level
      }
    });

    console.log(`   ${highValuePass ? '✅' : '❌'} High-value NGN detection: Detected=${highValueDetected}, Risk=${result.fraud_analysis.risk_score}`);
  }

  // Test KYC document fraud detection
  async testKYCDocumentFraud() {
    console.log('\n3️⃣ Testing KYC Document Fraud Detection...');

    // Test document reuse
    const kycEvent1 = {
      event_type: 'kyc_submission',
      business_id: 'business_kyc_test_001',
      metadata: {
        document_type: 'NIN',
        document_number: '12345678901',
        document_image: 'base64_image_data'
      }
    };

    // Submit first KYC
    await this.nigerianFraud.processWithNigerianContext(kycEvent1);
    
    // Try to submit same document for different business
    const kycEvent2 = {
      ...kycEvent1,
      business_id: 'business_kyc_test_002'
    };

    const result = await this.nigerianFraud.processWithNigerianContext(kycEvent2);
    
    // Check if document reuse was detected
    const documentReuseDetected = result.nigerian_analysis?.risk_patterns?.some(pattern => 
      pattern.fraud_patterns?.some(p => p.type === 'DOCUMENT_REUSE')
    );

    const kycBlockApplied = result.nigerian_safeguards?.actions?.some(action => 
      action.type === 'NIGERIAN_KYC_FRAUD_BLOCK'
    );

    const kycFraudPass = documentReuseDetected && result.fraud_analysis.risk_score >= 60;

    this.testResults.push({
      test: 'KYC Document Fraud Detection',
      status: kycFraudPass ? 'PASS' : 'FAIL',
      details: {
        document_reuse_detected: documentReuseDetected,
        kyc_block_applied: kycBlockApplied,
        risk_score: result.fraud_analysis.risk_score,
        document_type: kycEvent1.metadata.document_type,
        protection_level: result.protection_level
      }
    });

    console.log(`   ${kycFraudPass ? '✅' : '❌'} KYC fraud detection: Document reuse=${documentReuseDetected}, Block=${kycBlockApplied}`);
  }

  // Test rapid transaction pattern detection
  async testRapidTransactionPatterns() {
    console.log('\n4️⃣ Testing Rapid Transaction Pattern Detection...');

    const userId = 'user_rapid_test_001';
    let finalResult = null;

    // Generate 12 rapid transactions
    for (let i = 0; i < 12; i++) {
      const rapidTxEvent = {
        event_type: 'escrow_transaction',
        user_id: userId,
        amount: 50000, // 50k NGN each
        metadata: {
          currency: 'NGN',
          transaction_sequence: i + 1
        }
      };

      finalResult = await this.nigerianFraud.processWithNigerianContext(rapidTxEvent);
      
      // Small delay between transactions
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Check if rapid transaction pattern was detected
    const rapidPatternDetected = finalResult.nigerian_analysis?.risk_patterns?.some(pattern => 
      pattern.anomalies?.some(a => a.type === 'RAPID_TRANSACTION_PATTERN')
    );

    const riskScoreElevated = finalResult.fraud_analysis.risk_score >= 40;

    const rapidPatternPass = rapidPatternDetected && riskScoreElevated;

    this.testResults.push({
      test: 'Rapid Transaction Pattern Detection',
      status: rapidPatternPass ? 'PASS' : 'FAIL',
      details: {
        rapid_pattern_detected: rapidPatternDetected,
        transaction_count: 12,
        risk_score: finalResult.fraud_analysis.risk_score,
        nigerian_multiplier: finalResult.fraud_analysis.nigerian_multiplier,
        protection_level: finalResult.protection_level
      }
    });

    console.log(`   ${rapidPatternPass ? '✅' : '❌'} Rapid pattern detection: Detected=${rapidPatternDetected}, Risk=${finalResult.fraud_analysis.risk_score}`);
  }

  // Generate comprehensive Nigerian fraud report
  generateNigerianFraudReport() {
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
      nigerian_context_rules: this.generateNigerianRulesMatrix(),
      fraud_patterns_detected: this.generateDetectedPatterns(),
      dashboard_sample: this.nigerianFraud.getNigerianFraudDashboard()
    };

    this.printNigerianFraudReport(report);
    return report;
  }

  // Generate Nigerian rules matrix
  generateNigerianRulesMatrix() {
    return `
NIGERIAN CONTEXT FRAUD DETECTION RULES

┌─────────────────────┬─────────────┬─────────────┬─────────────────┐
│    FRAUD TYPE       │  THRESHOLD  │ RISK SCORE  │   ACTION        │
├─────────────────────┼─────────────┼─────────────┼─────────────────┤
│ Phone Number Reuse  │   2+ users  │     35      │ Restrict Signup │
│ Device Reuse        │   3+ users  │     45      │ Account Review  │
│ Document Reuse      │   2+ users  │     45      │ KYC Block       │
│ High-Value NGN      │   ₦2M+      │     40      │ Manual Review   │
│ Very High-Value NGN │   ₦2M+      │     40      │ Transaction Hold│
│ Rapid Transactions  │   10/10min  │     30      │ Rate Limiting   │
│ Invalid NIN Format  │   Pattern   │     30      │ Re-verification │
│ Invalid BVN Format  │   Pattern   │     30      │ Additional Docs │
└─────────────────────┴─────────────┴─────────────┴─────────────────┘

NIGERIAN DOCUMENT FORMATS:
• NIN: 11 digits (e.g., 12345678901)
• BVN: 11 digits (e.g., 98765432109)  
• Driver's License: 3 letters + 9 digits + 2 letters
• Voter's Card: 19 alphanumeric characters
• Passport: 1 letter + 8 digits
`;
  }

  // Generate detected patterns summary
  generateDetectedPatterns() {
    const patterns = {
      multi_account_usage: this.testResults.find(t => t.test === 'Multi-Account Usage Detection')?.status === 'PASS',
      high_value_ngn: this.testResults.find(t => t.test === 'High-Value NGN Transaction Detection')?.status === 'PASS',
      kyc_document_fraud: this.testResults.find(t => t.test === 'KYC Document Fraud Detection')?.status === 'PASS',
      rapid_transactions: this.testResults.find(t => t.test === 'Rapid Transaction Pattern Detection')?.status === 'PASS'
    };

    return patterns;
  }

  // Print Nigerian fraud report
  printNigerianFraudReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('🇳🇬 NIGERIAN CONTEXT FRAUD DETECTION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\nStatus: ${report.validation_summary.status}`);
    console.log(`Passed: ${report.validation_summary.passed}/${report.validation_summary.total}`);
    
    console.log('\n📋 Test Results:');
    report.test_results.forEach((test, index) => {
      const icon = test.status === 'PASS' ? '✅' : '❌';
      console.log(`   ${index + 1}. ${icon} ${test.test}: ${test.status}`);
    });
    
    console.log('\n📊 Nigerian Dashboard Sample:');
    const sample = report.dashboard_sample;
    console.log(`   Total Nigerian Events: ${sample.nigerian_overview.total_nigerian_events}`);
    console.log(`   Multi-Account Detected: ${sample.nigerian_overview.multi_account_detected}`);
    console.log(`   KYC Fraud Detected: ${sample.nigerian_overview.kyc_fraud_detected}`);
    console.log(`   High-Value NGN Transactions: ${sample.nigerian_overview.high_value_ngn_transactions}`);
    console.log(`   Risk Score Adjustments: ${sample.effectiveness.risk_score_adjustments}`);
    
    console.log(report.nigerian_context_rules);
    
    if (report.validation_summary.status === 'ALL_TESTS_PASSED') {
      console.log('🎉 STEP 6.2.3 COMPLETE - NIGERIAN CONTEXT RULES OPERATIONAL! 🎉');
    } else {
      console.log('⚠️ STEP 6.2.3 NEEDS ATTENTION - SOME TESTS FAILED ⚠️');
    }
    
    console.log('='.repeat(60));
  }
}

// Execute Nigerian fraud validation
async function executeNigerianFraudValidation() {
  const validator = new NigerianFraudValidator();
  const report = await validator.runNigerianFraudTests();
  return report;
}

export { NigerianFraudValidator, executeNigerianFraudValidation };