// STEP 1 — OTP Flow Validation Test
// Production verification of Layer 3 OTP Flow Service
// SAFE: Only calls Layer 2 adapters, no Layer 1 access

const { OTPFlowService } = require('../lib/layer3/otpFlowService');
const { OTP_CHANNELS, OTP_PURPOSES } = require('../lib/layer2');

const TEST_EMAIL = 'tradegainroyal@gmail.com';
const TEST_PHONE = '+2348123456789';
const TEST_PURPOSE = OTP_PURPOSES.LOGIN_VERIFICATION;

async function validateOTPFlow() {
  console.log('🔍 STEP 1 — OTP Flow Validation Starting...');
  
  const otpService = new OTPFlowService();
  const results = { metadata: otpService.metadata, tests: {} };

  try {
    // 1. Email OTP Request
    console.log('1️⃣ Testing requestOtp() via EMAIL...');
    const emailOtp = await otpService.requestOtp(TEST_EMAIL, OTP_CHANNELS.EMAIL, TEST_PURPOSE);
    results.tests.emailOtpRequest = { success: emailOtp.success, error: emailOtp.error };
    console.log('   Email OTP:', emailOtp.success ? '✅ SUCCESS' : '❌ FAILED');

    // 2. SMS OTP Request
    console.log('2️⃣ Testing requestOtp() via SMS...');
    const smsOtp = await otpService.requestOtp(TEST_PHONE, OTP_CHANNELS.PHONE, TEST_PURPOSE);
    results.tests.smsOtpRequest = { success: smsOtp.success, error: smsOtp.error };
    console.log('   SMS OTP:', smsOtp.success ? '✅ SUCCESS' : '❌ FAILED');

    // 3. OTP Verification
    console.log('3️⃣ Testing verifyOtp()...');
    const emailVerify = await otpService.verifyOtp(TEST_EMAIL, '123456', TEST_PURPOSE);
    const smsVerify = await otpService.verifyOtp(TEST_PHONE, '123456', TEST_PURPOSE);
    results.tests.emailVerify = { success: emailVerify.success, error: emailVerify.error };
    results.tests.smsVerify = { success: smsVerify.success, error: smsVerify.error };
    console.log('   Email Verify:', emailVerify.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('   SMS Verify:', smsVerify.success ? '✅ SUCCESS' : '❌ FAILED');

    // 4. OTP Status
    console.log('4️⃣ Testing getOtpStatus()...');
    const emailStatus = await otpService.getOtpStatus(TEST_EMAIL, TEST_PURPOSE);
    const smsStatus = await otpService.getOtpStatus(TEST_PHONE, TEST_PURPOSE);
    results.tests.emailStatus = { success: emailStatus.success, error: emailStatus.error };
    results.tests.smsStatus = { success: smsStatus.success, error: smsStatus.error };
    console.log('   Email Status:', emailStatus.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('   SMS Status:', smsStatus.success ? '✅ SUCCESS' : '❌ FAILED');

    // 5. OTP Invalidation
    console.log('5️⃣ Testing invalidateOtp()...');
    const emailInvalidate = await otpService.invalidateOtp(TEST_EMAIL, TEST_PURPOSE);
    const smsInvalidate = await otpService.invalidateOtp(TEST_PHONE, TEST_PURPOSE);
    results.tests.emailInvalidate = { success: emailInvalidate.success, error: emailInvalidate.error };
    results.tests.smsInvalidate = { success: smsInvalidate.success, error: smsInvalidate.error };
    console.log('   Email Invalidate:', emailInvalidate.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('   SMS Invalidate:', smsInvalidate.success ? '✅ SUCCESS' : '❌ FAILED');

    // 6. Metadata Validation
    console.log('6️⃣ Validating Metadata...');
    const meta = otpService.metadata;
    console.log(`   Mode: ${meta.mode} (Expected: LIVE)`);
    console.log(`   Layer 2 Integration: ${meta.layer2Integration} (Expected: true)`);
    console.log(`   Layer 1 Blocked: ${meta.layer1Blocked} (Expected: true)`);

    return results;
  } catch (error) {
    results.error = error.message;
    return results;
  }
}

module.exports = { validateOTPFlow };

if (require.main === module) {
  validateOTPFlow().then(console.log).catch(console.error);
}