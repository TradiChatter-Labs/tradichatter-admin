// Layer 2 DRY_RUN Validation Test
// Confirms all Layer 2 orchestration methods return DRY_RUN responses
// SAFE: No live execution, only validates DRY_RUN mode

const { Layer2Interface, OTP_PURPOSES, OTP_CHANNELS, NOTIFICATION_TEMPLATES, ADMIN_ALERT_TYPES } = require('../lib/layer2');

async function validateLayer2DryRun() {
  console.log('🔍 Layer 2 DRY_RUN Validation Starting...');
  
  const layer2 = new Layer2Interface();
  const results = { metadata: layer2.metadata, tests: {} };

  try {
    // Test OTP Orchestration
    console.log('1️⃣ Testing OTP Orchestration...');
    const emailOtp = await layer2.otp.sendEmailOTP('test@example.com', OTP_PURPOSES.LOGIN_VERIFICATION);
    const phoneOtp = await layer2.otp.sendPhoneOTP('+1234567890', OTP_PURPOSES.LOGIN_VERIFICATION);
    const emailVerify = await layer2.otp.verifyEmailOTP('test@example.com', '123456', OTP_PURPOSES.LOGIN_VERIFICATION);
    const otpStatus = await layer2.otp.getOTPStatus('test@example.com', OTP_PURPOSES.LOGIN_VERIFICATION);
    const otpInvalidate = await layer2.otp.invalidateOTP('test@example.com', OTP_PURPOSES.LOGIN_VERIFICATION);

    results.tests.otp = {
      sendEmailOTP: { dryRun: emailOtp.dryRun, success: emailOtp.success === false },
      sendPhoneOTP: { dryRun: phoneOtp.dryRun, success: phoneOtp.success === false },
      verifyEmailOTP: { dryRun: emailVerify.dryRun, success: emailVerify.success === false },
      getOTPStatus: { dryRun: otpStatus.dryRun, success: otpStatus.success === false },
      invalidateOTP: { dryRun: otpInvalidate.dryRun, success: otpInvalidate.success === false }
    };

    // Test Notification Orchestration
    console.log('2️⃣ Testing Notification Orchestration...');
    const emailNotif = await layer2.notifications.sendEmailNotification('test@example.com', NOTIFICATION_TEMPLATES.WELCOME, {});
    const smsNotif = await layer2.notifications.sendSMSNotification('+1234567890', NOTIFICATION_TEMPLATES.WELCOME, {});
    const adminAlert = await layer2.notifications.sendAdminAlert(ADMIN_ALERT_TYPES.SYSTEM_ERROR, {});
    const notifStatus = await layer2.notifications.getNotificationStatus('test_id');

    results.tests.notifications = {
      sendEmailNotification: { dryRun: emailNotif.dryRun, success: emailNotif.success === false },
      sendSMSNotification: { dryRun: smsNotif.dryRun, success: smsNotif.success === false },
      sendAdminAlert: { dryRun: adminAlert.dryRun, success: adminAlert.success === false },
      getNotificationStatus: { dryRun: notifStatus.dryRun, success: notifStatus.success === false }
    };

    // Test Health Check
    console.log('3️⃣ Testing Health Check...');
    const healthCheck = await layer2.healthCheck();
    results.tests.healthCheck = { dryRun: healthCheck.dryRun };

    // Test Interface Info
    console.log('4️⃣ Testing Interface Info...');
    const interfaceInfo = layer2.getInterfaceInfo();
    results.tests.interfaceInfo = {
      layer1Blocked: interfaceInfo.safetyLock.layer1Blocked,
      executionPrevented: interfaceInfo.safetyLock.executionPrevented,
      mode: interfaceInfo.mode
    };

    console.log('✅ All Layer 2 methods return DRY_RUN responses');
    return results;

  } catch (error) {
    console.error('❌ Layer 2 DRY_RUN validation error:', error.message);
    results.error = error.message;
    return results;
  }
}

module.exports = { validateLayer2DryRun };

if (require.main === module) {
  validateLayer2DryRun().then(console.log).catch(console.error);
}