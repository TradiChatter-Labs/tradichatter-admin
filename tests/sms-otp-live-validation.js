// SMS OTP LIVE Validation Test
// Tests ONLY SMS OTP functionality while ensuring email remains DRY_RUN
// SAFE: Email OTP blocked by safety guards

const { OTPFlowService } = require('../lib/layer3/otpFlowService');
const { OTP_CHANNELS, OTP_PURPOSES } = require('../lib/layer2');

const TEST_PHONE = '+2348123456789';
const TEST_EMAIL = 'tradegainroyal@gmail.com';
const TEST_PURPOSE = OTP_PURPOSES.LOGIN_VERIFICATION;

async function validateSMSOTPOnly() {
  console.log('🔍 SMS OTP LIVE Validation Starting...');
  
  const otpService = new OTPFlowService();
  const results = { metadata: otpService.metadata, tests: {} };

  try {
    // 1. Test SMS OTP Request (LIVE)
    console.log('1️⃣ Testing SMS OTP Request (LIVE)...');
    const smsOtpResult = await otpService.requestOtp(TEST_PHONE, OTP_CHANNELS.PHONE, TEST_PURPOSE);
    results.tests.smsOtpRequest = {
      success: smsOtpResult.success,
      live: smsOtpResult.live,
      channel: smsOtpResult.channel,
      error: smsOtpResult.error
    };
    console.log('   SMS OTP Request:', smsOtpResult.success ? '✅ LIVE SUCCESS' : '❌ FAILED');

    // 2. Test Email OTP Request (Must remain DRY_RUN)
    console.log('2️⃣ Testing Email OTP Request (Must be DRY_RUN)...');
    const emailOtpResult = await otpService.requestOtp(TEST_EMAIL, OTP_CHANNELS.EMAIL, TEST_PURPOSE);
    results.tests.emailOtpRequest = {
      success: emailOtpResult.success,
      dryRun: emailOtpResult.dryRun,
      blocked: emailOtpResult.message?.includes('safety guard'),
      error: emailOtpResult.error
    };
    console.log('   Email OTP Request:', emailOtpResult.dryRun ? '✅ BLOCKED (DRY_RUN)' : '❌ SAFETY VIOLATION');

    // 3. Test SMS OTP Verification (LIVE)
    console.log('3️⃣ Testing SMS OTP Verification (LIVE)...');
    const smsVerifyResult = await otpService.verifyOtp(TEST_PHONE, '123456', TEST_PURPOSE);
    results.tests.smsVerify = {
      success: smsVerifyResult.success,
      valid: smsVerifyResult.valid,
      live: smsVerifyResult.live,
      error: smsVerifyResult.error
    };
    console.log('   SMS OTP Verify:', smsVerifyResult.success ? '✅ LIVE SUCCESS' : '❌ FAILED');

    // 4. Test Email OTP Verification (Must remain DRY_RUN)
    console.log('4️⃣ Testing Email OTP Verification (Must be DRY_RUN)...');
    const emailVerifyResult = await otpService.verifyOtp(TEST_EMAIL, '123456', TEST_PURPOSE);
    results.tests.emailVerify = {
      success: emailVerifyResult.success,
      dryRun: emailVerifyResult.dryRun,
      blocked: emailVerifyResult.message?.includes('safety guard'),
      error: emailVerifyResult.error
    };
    console.log('   Email OTP Verify:', emailVerifyResult.dryRun ? '✅ BLOCKED (DRY_RUN)' : '❌ SAFETY VIOLATION');

    // 5. Test SMS OTP Status (LIVE)
    console.log('5️⃣ Testing SMS OTP Status (LIVE)...');
    const smsStatusResult = await otpService.getOtpStatus(TEST_PHONE, TEST_PURPOSE);
    results.tests.smsStatus = {
      success: smsStatusResult.success,
      exists: smsStatusResult.exists,
      live: smsStatusResult.live,
      error: smsStatusResult.error
    };
    console.log('   SMS OTP Status:', smsStatusResult.success ? '✅ LIVE SUCCESS' : '❌ FAILED');

    // 6. Test SMS OTP Invalidation (LIVE)
    console.log('6️⃣ Testing SMS OTP Invalidation (LIVE)...');
    const smsInvalidateResult = await otpService.invalidateOtp(TEST_PHONE, TEST_PURPOSE);
    results.tests.smsInvalidate = {
      success: smsInvalidateResult.success,
      live: smsInvalidateResult.live,
      error: smsInvalidateResult.error
    };
    console.log('   SMS OTP Invalidate:', smsInvalidateResult.success ? '✅ LIVE SUCCESS' : '❌ FAILED');

    // 7. Safety Guard Validation
    console.log('7️⃣ Validating Safety Guards...');
    const safetyValidation = {
      emailBlocked: results.tests.emailOtpRequest.dryRun && results.tests.emailVerify.dryRun,
      smsLive: results.tests.smsOtpRequest.success && results.tests.smsVerify.success,
      layer1Blocked: otpService.metadata.layer1Blocked
    };
    results.tests.safetyValidation = safetyValidation;
    
    console.log(`   Email Safety Guard: ${safetyValidation.emailBlocked ? '✅ ACTIVE' : '❌ FAILED'}`);
    console.log(`   SMS Live Execution: ${safetyValidation.smsLive ? '✅ ACTIVE' : '❌ FAILED'}`);
    console.log(`   Layer 1 Blocked: ${safetyValidation.layer1Blocked ? '✅ ACTIVE' : '❌ FAILED'}`);

    return results;

  } catch (error) {
    console.error('❌ SMS OTP validation error:', error.message);
    results.error = error.message;
    return results;
  }
}

module.exports = { validateSMSOTPOnly };

if (require.main === module) {
  validateSMSOTPOnly().then(console.log).catch(console.error);
}