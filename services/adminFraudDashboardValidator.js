// TradiChatter Admin Fraud Dashboard Validation
// Tests admin integration, dashboard display, and notification system

import { AdminFraudDashboard } from './adminFraudDashboard.js';
import { FraudAlertNotificationSystem } from './fraudAlertNotifications.js';

export class AdminFraudDashboardValidator {
  constructor() {
    this.dashboard = new AdminFraudDashboard();
    this.notifications = new FraudAlertNotificationSystem();
    this.testResults = [];
  }

  // Run comprehensive admin dashboard validation
  async runAdminDashboardTests() {
    console.log('👨‍💼 Testing TradiChatter Admin Fraud Dashboard Integration\n');

    // Initialize notification preferences
    this.notifications.initializeAdminPreferences();

    // Test 1: Dashboard Data Display
    await this.testDashboardDataDisplay();
    
    // Test 2: Risk Score Display & Manual Actions
    await this.testRiskScoresAndActions();
    
    // Test 3: Fraud Alert Notifications
    await this.testFraudAlertNotifications();
    
    // Test 4: Role-Based Access Control
    await this.testRoleBasedAccess();

    return this.generateAdminDashboardReport();
  }

  // Test dashboard data display
  async testDashboardDataDisplay() {
    console.log('1️⃣ Testing Dashboard Data Display...');

    // Generate test fraud data
    await this.generateTestFraudData();

    // Get dashboard data for security admin
    const dashboardData = await this.dashboard.getFraudDashboardData('security_admin');
    
    // Validate required dashboard sections
    const hasOverview = dashboardData.overview && typeof dashboardData.overview.total_entities_monitored === 'number';
    const hasRiskScores = dashboardData.risk_scores && Array.isArray(dashboardData.risk_scores);
    const hasSuspiciousActivities = dashboardData.suspicious_activities && Array.isArray(dashboardData.suspicious_activities);
    const hasNigerianPatterns = dashboardData.nigerian_patterns && typeof dashboardData.nigerian_patterns === 'object';
    const hasManualActions = dashboardData.manual_actions && Array.isArray(dashboardData.manual_actions);
    const hasAlertsSummary = dashboardData.alerts_summary && typeof dashboardData.alerts_summary.total_active_alerts === 'number';

    const dashboardDisplayPass = hasOverview && hasRiskScores && hasSuspiciousActivities && 
                                 hasNigerianPatterns && hasManualActions && hasAlertsSummary;

    this.testResults.push({
      test: 'Dashboard Data Display',
      status: dashboardDisplayPass ? 'PASS' : 'FAIL',
      details: {
        overview_present: hasOverview,
        risk_scores_present: hasRiskScores,
        suspicious_activities_present: hasSuspiciousActivities,
        nigerian_patterns_present: hasNigerianPatterns,
        manual_actions_present: hasManualActions,
        alerts_summary_present: hasAlertsSummary,
        total_entities: dashboardData.overview?.total_entities_monitored || 0,
        high_risk_entities: dashboardData.overview?.high_risk_entities || 0
      }
    });

    console.log(`   ${dashboardDisplayPass ? '✅' : '❌'} Dashboard display: Entities=${dashboardData.overview?.total_entities_monitored || 0}, High Risk=${dashboardData.overview?.high_risk_entities || 0}`);
  }

  // Test risk scores and manual actions
  async testRiskScoresAndActions() {
    console.log('\n2️⃣ Testing Risk Scores & Manual Actions...');

    // Test manual action execution
    const testAction = await this.dashboard.executeManualAction(
      'admin_security_001',
      'security_admin',
      'freeze_account',
      'user_high_risk_test',
      'High fraud risk detected - manual intervention required'
    );

    // Test role-based action availability
    const securityActions = await this.dashboard.getAvailableManualActions('security_admin');
    const platformActions = await this.dashboard.getAvailableManualActions('platform_admin');
    const complianceActions = await this.dashboard.getAvailableManualActions('compliance_admin');

    const hasSecurityActions = securityActions.some(a => a.id === 'freeze_account');
    const hasPlatformActions = platformActions.some(a => a.id === 'hold_transactions');
    const hasComplianceActions = complianceActions.some(a => a.id === 'request_reverification');

    const manualActionsPass = testAction.success && hasSecurityActions && hasPlatformActions && hasComplianceActions;

    this.testResults.push({
      test: 'Risk Scores & Manual Actions',
      status: manualActionsPass ? 'PASS' : 'FAIL',
      details: {
        manual_action_executed: testAction.success,
        action_id: testAction.action_id,
        security_actions_count: securityActions.length,
        platform_actions_count: platformActions.length,
        compliance_actions_count: complianceActions.length,
        role_based_actions: hasSecurityActions && hasPlatformActions && hasComplianceActions
      }
    });

    console.log(`   ${manualActionsPass ? '✅' : '❌'} Manual actions: Executed=${testAction.success}, Role-based=${hasSecurityActions && hasPlatformActions && hasComplianceActions}`);
  }

  // Test fraud alert notifications
  async testFraudAlertNotifications() {
    console.log('\n3️⃣ Testing Fraud Alert Notifications...');

    // Test high-risk alert notification
    const highRiskAlert = {
      entity_id: 'user_notification_test',
      risk_score: 85,
      alert_type: 'HIGH_FRAUD_RISK',
      recommendation: 'IMMEDIATE_REVIEW_REQUIRED',
      timestamp: new Date().toISOString()
    };

    const notificationResult = await this.notifications.sendFraudAlert(
      highRiskAlert,
      ['security_admin', 'super_admin']
    );

    // Test notification preferences and rate limiting
    const notificationStats = this.notifications.getNotificationStats();

    const notificationsPass = notificationResult.notifications_sent > 0;

    this.testResults.push({
      test: 'Fraud Alert Notifications',
      status: notificationsPass ? 'PASS' : 'FAIL',
      details: {
        notifications_sent: notificationResult.notifications_sent,
        notification_channels: notificationResult.notifications.map(n => n.channel),
        high_risk_threshold_triggered: highRiskAlert.risk_score >= 70,
        notification_stats: notificationStats
      }
    });

    console.log(`   ${notificationsPass ? '✅' : '❌'} Notifications: Sent=${notificationResult.notifications_sent}, Channels=${notificationResult.notifications.map(n => n.channel).join(', ')}`);
  }

  // Test role-based access control
  async testRoleBasedAccess() {
    console.log('\n4️⃣ Testing Role-Based Access Control...');

    // Test different admin roles
    const roles = ['security_admin', 'platform_admin', 'compliance_admin', 'super_admin'];
    const roleTests = {};

    for (const role of roles) {
      const dashboardData = await this.dashboard.getFraudDashboardData(role);
      const availableActions = await this.dashboard.getAvailableManualActions(role);
      
      roleTests[role] = {
        dashboard_access: !!dashboardData,
        actions_count: availableActions.length,
        entity_id_masked: role !== 'super_admin' ? dashboardData.risk_scores?.[0]?.entity_id?.includes('***') : true
      };
    }

    // Test unauthorized action attempt
    const unauthorizedAction = await this.dashboard.executeManualAction(
      'admin_compliance_001',
      'compliance_admin',
      'freeze_account', // Security admin action
      'user_test',
      'Unauthorized test'
    );

    const roleAccessPass = !unauthorizedAction.success && // Unauthorized action should fail
                          roleTests.security_admin.dashboard_access &&
                          roleTests.platform_admin.dashboard_access &&
                          roleTests.compliance_admin.dashboard_access &&
                          roleTests.super_admin.dashboard_access;

    this.testResults.push({
      test: 'Role-Based Access Control',
      status: roleAccessPass ? 'PASS' : 'FAIL',
      details: {
        role_tests: roleTests,
        unauthorized_action_blocked: !unauthorizedAction.success,
        super_admin_full_access: roleTests.super_admin.actions_count > roleTests.security_admin.actions_count,
        entity_id_masking: Object.values(roleTests).every(test => test.entity_id_masked)
      }
    });

    console.log(`   ${roleAccessPass ? '✅' : '❌'} Role-based access: Unauthorized blocked=${!unauthorizedAction.success}, All roles accessible=${Object.values(roleTests).every(t => t.dashboard_access)}`);
  }

  // Generate test fraud data
  async generateTestFraudData() {
    // Simulate some fraud events to populate dashboard
    const testEvents = [
      {
        event_type: 'high_value_transaction',
        user_id: 'user_dashboard_test_001',
        amount: 1500000,
        metadata: { currency: 'NGN' }
      },
      {
        event_type: 'document_fraud',
        business_id: 'business_dashboard_test_001',
        metadata: { type: 'fake_nin' }
      },
      {
        event_type: 'failed_otp',
        user_id: 'user_dashboard_test_002',
        metadata: { attempts: 6 }
      }
    ];

    for (const event of testEvents) {
      await this.dashboard.fraudSystem.processWithNigerianContext(event);
    }
  }

  // Generate comprehensive admin dashboard report
  generateAdminDashboardReport() {
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
      dashboard_architecture: this.generateDashboardArchitecture(),
      notification_matrix: this.generateNotificationMatrix(),
      sample_dashboard: this.generateSampleDashboard()
    };

    this.printAdminDashboardReport(report);
    return report;
  }

  // Generate dashboard architecture diagram
  generateDashboardArchitecture() {
    return `
TRADICHATTER ADMIN FRAUD DASHBOARD ARCHITECTURE ✅

┌─────────────────────────────────────────────────────────────┐
│                    ADMIN PORTAL                            │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Security Admin  │ │ Platform Admin  │ │Compliance Admin │ │
│ │ Dashboard       │ │ Dashboard       │ │ Dashboard       │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              ADMIN FRAUD DASHBOARD SERVICE                  │
├─────────────────────────────────────────────────────────────┤
│ • Role-Based Data Filtering  • Manual Action Execution     │
│ • Risk Score Display         • Entity ID Masking           │
│ • Nigerian Pattern Analysis  • Real-Time Updates           │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 NOTIFICATION SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│ • Push Notifications         • Email Alerts                │
│ • SMS Notifications          • Rate Limiting               │
│ • Quiet Hours Respect        • Multi-Channel Delivery      │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│            FRAUD DETECTION & SAFEGUARDS                    │
├─────────────────────────────────────────────────────────────┤
│ • Nigerian Context Rules     • Automated Safeguards        │
│ • Risk Scoring Engine        • Manual Override Capability  │
│ • Immutable Audit Logging    • Admin Action Gateway        │
└─────────────────────────────────────────────────────────────┘
`;
  }

  // Generate notification matrix
  generateNotificationMatrix() {
    return `
FRAUD ALERT NOTIFICATION MATRIX

┌─────────────────┬─────────────┬─────────────┬─────────────────┐
│   ADMIN ROLE    │  CHANNELS   │ THRESHOLDS  │   RATE LIMITS   │
├─────────────────┼─────────────┼─────────────┼─────────────────┤
│ Security Admin  │ Push, Email │ 50/70/80    │ 10/hour         │
│ Platform Admin  │ Push, Email │ 60/75/85    │ 8/hour          │
│Compliance Admin │ Email, SMS  │ 55/70/80    │ 12/hour         │
│ Super Admin     │ All Channels│ 45/65/75    │ 20/hour         │
└─────────────────┴─────────────┴─────────────┴─────────────────┘

NOTIFICATION FEATURES:
• Quiet Hours: 22:00-06:00 (except Super Admin)
• Critical Alerts: Override quiet hours
• Multi-Channel: Push + Email + SMS
• Rate Limiting: Prevent notification spam
• Rich Content: HTML emails with action links
`;
  }

  // Generate sample dashboard data
  generateSampleDashboard() {
    return {
      overview: {
        total_entities_monitored: 1247,
        high_risk_entities: 23,
        active_fraud_alerts: 8,
        nigerian_events_24h: 156,
        protection_effectiveness: 87,
        automated_actions_24h: 12
      },
      top_alerts: [
        { entity_id: 'user***test', risk_score: 85, type: 'HIGH_FRAUD_RISK' },
        { entity_id: 'busi***001', risk_score: 78, type: 'KYC_FRAUD' },
        { entity_id: 'user***456', risk_score: 72, type: 'MULTI_ACCOUNT_USAGE' }
      ],
      nigerian_patterns: {
        multi_account_detected: 5,
        kyc_fraud_detected: 3,
        high_value_ngn_transactions: 12
      }
    };
  }

  // Print admin dashboard report
  printAdminDashboardReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('👨‍💼 ADMIN FRAUD DASHBOARD VALIDATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\nStatus: ${report.validation_summary.status}`);
    console.log(`Passed: ${report.validation_summary.passed}/${report.validation_summary.total}`);
    
    console.log('\n📋 Test Results:');
    report.test_results.forEach((test, index) => {
      const icon = test.status === 'PASS' ? '✅' : '❌';
      console.log(`   ${index + 1}. ${icon} ${test.test}: ${test.status}`);
    });
    
    console.log('\n📊 Sample Dashboard Data:');
    const sample = report.sample_dashboard;
    console.log(`   Total Entities: ${sample.overview.total_entities_monitored}`);
    console.log(`   High Risk: ${sample.overview.high_risk_entities}`);
    console.log(`   Active Alerts: ${sample.overview.active_fraud_alerts}`);
    console.log(`   Nigerian Events (24h): ${sample.overview.nigerian_events_24h}`);
    console.log(`   Effectiveness: ${sample.overview.protection_effectiveness}%`);
    
    console.log(report.dashboard_architecture);
    console.log(report.notification_matrix);
    
    if (report.validation_summary.status === 'ALL_TESTS_PASSED') {
      console.log('🎉 STEP 6.2.4 COMPLETE - ADMIN DASHBOARD INTEGRATION OPERATIONAL! 🎉');
    } else {
      console.log('⚠️ STEP 6.2.4 NEEDS ATTENTION - SOME TESTS FAILED ⚠️');
    }
    
    console.log('='.repeat(60));
  }
}

// Execute admin dashboard validation
async function executeAdminDashboardValidation() {
  const validator = new AdminFraudDashboardValidator();
  const report = await validator.runAdminDashboardTests();
  return report;
}

export { AdminFraudDashboardValidator, executeAdminDashboardValidation };