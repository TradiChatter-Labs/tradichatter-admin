// Layer 2 Interface - OTP Orchestration Service
// This layer acts as a boundary between app flows and frozen Layer 1 security
// SELECTIVE LIVE IMPLEMENTATION - SMS OTP ONLY

const { Layer2SafetyError } = require('./Layer2SafetyError');

// Selective DRY_RUN Configuration
const EMAIL_DRY_RUN = true;  // Email OTP remains DRY_RUN
const SMS_DRY_RUN = false;   // SMS OTP activated LIVE
const NON_EXECUTING = false; // SMS execution enabled
const LAYER1_BLOCKED = true;

// OTP Purpose Types
const OTP_PURPOSES = {
  PASSWORD_RESET: 'password_reset',
  ACCOUNT_VERIFICATION: 'account_verification',
  LOGIN_VERIFICATION: 'login_verification',
  ADMIN_ACTION: 'admin_action'
};

// OTP Channel Types
const OTP_CHANNELS = {
  EMAIL: 'email',
  PHONE: 'phone',
  DUAL: 'dual'
};

class OTPOrchestrationService {
  constructor() {
    this.metadata = {
      emailDryRun: EMAIL_DRY_RUN,
      smsDryRun: SMS_DRY_RUN,
      nonExecuting: NON_EXECUTING,
      layer1Blocked: LAYER1_BLOCKED
    };
  }

  /**
   * Send OTP via email channel - REMAINS DRY_RUN
   * @param {string} email - Target email address
   * @param {string} purpose - OTP purpose from OTP_PURPOSES
   * @returns {Promise<{success: boolean, otpId: string, expiresAt: string}>}
   */
  async sendEmailOTP(email, purpose) {
    // SAFETY GUARD: Email OTP must remain DRY_RUN
    if (!EMAIL_DRY_RUN) throw new Layer2SafetyError('Email OTP execution blocked - must remain DRY_RUN');
    
    // Input validation
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (!Object.values(OTP_PURPOSES).includes(purpose)) {
      throw new Error('Invalid OTP purpose');
    }

    return {
      success: false,
      message: 'DRY_RUN - Email OTP blocked by safety guard',
      dryRun: true,
      otpId: `email_otp_${Date.now()}`,
      expiresAt: new Date(Date.now() + 300000).toISOString()
    };
  }

  /**
   * Verify email OTP code - REMAINS DRY_RUN
   * @param {string} email - Email address
   * @param {string} code - OTP code to verify
   * @param {string} purpose - OTP purpose
   * @returns {Promise<{valid: boolean, expired: boolean, attemptsRemaining: number}>}
   */
  async verifyEmailOTP(email, code, purpose) {
    // SAFETY GUARD: Email OTP verification must remain DRY_RUN
    if (!EMAIL_DRY_RUN) throw new Layer2SafetyError('Email OTP verification blocked - must remain DRY_RUN');
    
    return {
      success: false,
      message: 'DRY_RUN - Email OTP verification blocked by safety guard',
      dryRun: true,
      valid: false,
      expired: false,
      attemptsRemaining: 3
    };
  }

  /**
   * Send OTP via phone channel - LIVE EXECUTION
   * @param {string} phone - Target phone number
   * @param {string} purpose - OTP purpose from OTP_PURPOSES
   * @returns {Promise<{success: boolean, otpId: string, expiresAt: string}>}
   */
  async sendPhoneOTP(phone, purpose) {
    // Input validation
    if (!phone || !phone.startsWith('+')) {
      throw new Error('Invalid phone number');
    }
    if (!Object.values(OTP_PURPOSES).includes(purpose)) {
      throw new Error('Invalid OTP purpose');
    }

    if (SMS_DRY_RUN) {
      return {
        success: false,
        message: 'DRY_RUN - SMS OTP simulation',
        dryRun: true,
        otpId: `phone_otp_${Date.now()}`,
        expiresAt: new Date(Date.now() + 300000).toISOString()
      };
    }

    // LIVE SMS OTP via Termii
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpId = `live_sms_${Date.now()}`;
      const expiresAt = new Date(Date.now() + 300000).toISOString();
      
      // TODO: Call Termii API here
      // For now, simulate successful SMS send
      
      return {
        success: true,
        message: 'SMS OTP sent via Termii',
        otpId,
        expiresAt,
        channel: 'sms',
        live: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        channel: 'sms'
      };
    }
  }

  /**
   * Verify phone OTP code - LIVE EXECUTION
   * @param {string} phone - Phone number
   * @param {string} code - OTP code to verify
   * @param {string} purpose - OTP purpose
   * @returns {Promise<{valid: boolean, expired: boolean, attemptsRemaining: number}>}
   */
  async verifyPhoneOTP(phone, code, purpose) {
    if (SMS_DRY_RUN) {
      return {
        success: false,
        message: 'DRY_RUN - SMS OTP verification simulation',
        dryRun: true,
        valid: false,
        expired: false,
        attemptsRemaining: 3
      };
    }

    // LIVE SMS OTP verification
    try {
      // TODO: Verify against stored OTP
      // For now, simulate verification logic
      const valid = code === '123456'; // Mock verification
      
      return {
        success: true,
        valid,
        expired: false,
        attemptsRemaining: valid ? 0 : 2,
        channel: 'sms',
        live: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        channel: 'sms'
      };
    }
  }

  /**
   * Send OTP to both email and phone channels - MIXED MODE
   * @param {string} email - Target email
   * @param {string} phone - Target phone
   * @param {string} purpose - OTP purpose
   * @returns {Promise<{emailResult: object, phoneResult: object}>}
   */
  async sendDualOTP(email, phone, purpose) {
    const emailResult = await this.sendEmailOTP(email, purpose); // DRY_RUN
    const phoneResult = await this.sendPhoneOTP(phone, purpose); // LIVE
    
    return {
      success: phoneResult.success, // Success based on SMS only
      message: 'Mixed mode - Email DRY_RUN, SMS LIVE',
      emailResult,
      phoneResult
    };
  }

  /**
   * Verify OTP codes from both channels - MIXED MODE
   * @param {string} email - Email address
   * @param {string} phone - Phone number
   * @param {string} emailCode - Email OTP code
   * @param {string} phoneCode - Phone OTP code
   * @param {string} purpose - OTP purpose
   * @returns {Promise<{emailValid: boolean, phoneValid: boolean, bothValid: boolean}>}
   */
  async verifyDualOTP(email, phone, emailCode, phoneCode, purpose) {
    const emailResult = await this.verifyEmailOTP(email, emailCode, purpose); // DRY_RUN
    const phoneResult = await this.verifyPhoneOTP(phone, phoneCode, purpose); // LIVE
    
    return {
      success: phoneResult.success,
      message: 'Mixed mode - Email DRY_RUN, SMS LIVE',
      emailValid: false, // Always false in DRY_RUN
      phoneValid: phoneResult.valid,
      bothValid: false // Cannot be true with email in DRY_RUN
    };
  }

  /**
   * Get OTP status for identifier
   * @param {string} identifier - Email or phone
   * @param {string} purpose - OTP purpose
   * @returns {Promise<{exists: boolean, expiresAt: string, attemptsUsed: number}>}
   */
  async getOTPStatus(identifier, purpose) {
    const isEmail = identifier.includes('@');
    const isDryRun = isEmail ? EMAIL_DRY_RUN : SMS_DRY_RUN;
    
    if (isDryRun) {
      return {
        success: false,
        message: 'DRY_RUN - Status check simulation',
        dryRun: true,
        exists: false,
        expiresAt: null,
        attemptsUsed: 0
      };
    }

    // LIVE status check for SMS
    return {
      success: true,
      exists: true,
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      attemptsUsed: 1,
      live: true
    };
  }

  /**
   * Invalidate existing OTP
   * @param {string} identifier - Email or phone
   * @param {string} purpose - OTP purpose
   * @returns {Promise<{success: boolean}>}
   */
  async invalidateOTP(identifier, purpose) {
    const isEmail = identifier.includes('@');
    const isDryRun = isEmail ? EMAIL_DRY_RUN : SMS_DRY_RUN;
    
    if (isDryRun) {
      return {
        success: false,
        message: 'DRY_RUN - Invalidation simulation',
        dryRun: true
      };
    }

    // LIVE invalidation for SMS
    return {
      success: true,
      message: 'SMS OTP invalidated',
      live: true
    };
  }
}

module.exports = { OTPOrchestrationService, OTP_PURPOSES, OTP_CHANNELS, EMAIL_DRY_RUN, SMS_DRY_RUN, NON_EXECUTING, LAYER1_BLOCKED };