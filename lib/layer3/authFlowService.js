// Layer 3 - Auth Flow Service (SAFE IMPLEMENTATION)
// Application Integration Layer - Orchestrates OTP + Notifications via Layer 2
// SAFE FOR FROZEN SECURITY - NO LAYER 1 ACCESS

const { Layer2Interface, Layer2SafetyError, OTP_PURPOSES, OTP_CHANNELS, NOTIFICATION_TEMPLATES } = require('../layer2');

const DRY_RUN = false; // ACTIVATED - Live execution enabled
const NON_EXECUTING = false;

class AuthFlowService {
  constructor() {
    this.status = 'IMPLEMENTED';
    this.executing = false;
    this.metadata = {
      mode: DRY_RUN ? 'DRY_RUN' : 'LIVE',
      layer: 3,
      safetyLocked: true,
      layer2Integration: true,
      layer1Blocked: true
    };
    
    // Initialize Layer 2 interface
    this.layer2 = new Layer2Interface();
  }

  /**
   * Initiates password reset flow
   * @param {string} email - User email address
   * @returns {Promise<Object>} Password reset initiation result
   */
  async requestPasswordReset(email) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 password reset flow simulated', 
          dryRun: true,
          metadata: { email, purpose: OTP_PURPOSES.PASSWORD_RESET }
        };
      }

      // Validate email
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email address');
      }

      // Step 1: Generate OTP via Layer 2
      const otpResult = await this.layer2.otp.sendEmailOTP(email, OTP_PURPOSES.PASSWORD_RESET);
      if (!otpResult.success) {
        throw new Error('Failed to send OTP');
      }

      // Step 2: Send notification via Layer 2
      const notificationResult = await this.layer2.notifications.sendEmailNotification(
        email, 
        NOTIFICATION_TEMPLATES.PASSWORD_RESET, 
        { otpId: otpResult.otpId, expiresAt: otpResult.expiresAt }
      );

      return {
        success: true,
        otpId: otpResult.otpId,
        notificationId: notificationResult.messageId,
        expiresAt: otpResult.expiresAt,
        purpose: OTP_PURPOSES.PASSWORD_RESET
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        purpose: OTP_PURPOSES.PASSWORD_RESET
      };
    }
  }

  /**
   * Verifies password reset code
   * @param {string} email - User email address
   * @param {string} code - Reset verification code
   * @returns {Promise<Object>} Password reset verification result
   */
  async verifyPasswordReset(email, code) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 password reset verification simulated', 
          dryRun: true,
          metadata: { email, code: '***', purpose: OTP_PURPOSES.PASSWORD_RESET }
        };
      }

      // Verify OTP via Layer 2
      const verifyResult = await this.layer2.otp.verifyEmailOTP(email, code, OTP_PURPOSES.PASSWORD_RESET);
      
      return {
        success: verifyResult.valid && !verifyResult.expired,
        valid: verifyResult.valid,
        expired: verifyResult.expired,
        attemptsRemaining: verifyResult.attemptsRemaining,
        purpose: OTP_PURPOSES.PASSWORD_RESET
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        purpose: OTP_PURPOSES.PASSWORD_RESET
      };
    }
  }

  /**
   * Initiates account verification flow
   * @param {string} email - User email address
   * @param {string} phone - User phone number
   * @returns {Promise<Object>} Account verification initiation result
   */
  async requestAccountVerification(email, phone) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 account verification flow simulated', 
          dryRun: true,
          metadata: { email, phone, purpose: OTP_PURPOSES.ACCOUNT_VERIFICATION }
        };
      }

      // Validate inputs
      if (!email || !phone) {
        throw new Error('Email and phone required');
      }

      // Step 1: Send dual OTP via Layer 2
      const otpResult = await this.layer2.otp.sendDualOTP(email, phone, OTP_PURPOSES.ACCOUNT_VERIFICATION);
      if (!otpResult.emailResult.success || !otpResult.phoneResult.success) {
        throw new Error('Failed to send verification codes');
      }

      // Step 2: Send welcome notification via Layer 2
      const notificationResult = await this.layer2.notifications.sendEmailNotification(
        email, 
        NOTIFICATION_TEMPLATES.WELCOME, 
        { phone, verificationRequired: true }
      );

      return {
        success: true,
        emailOtpId: otpResult.emailResult.otpId,
        phoneOtpId: otpResult.phoneResult.otpId,
        notificationId: notificationResult.messageId,
        purpose: OTP_PURPOSES.ACCOUNT_VERIFICATION
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        purpose: OTP_PURPOSES.ACCOUNT_VERIFICATION
      };
    }
  }

  /**
   * Verifies account with dual OTP codes
   * @param {string} email - User email address
   * @param {string} phone - User phone number
   * @param {string} emailCode - Email verification code
   * @param {string} phoneCode - Phone verification code
   * @returns {Promise<Object>} Account verification result
   */
  async verifyAccountVerification(email, phone, emailCode, phoneCode) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 dual verification simulated', 
          dryRun: true,
          metadata: { email, phone, emailCode: '***', phoneCode: '***' }
        };
      }

      // Verify dual OTP via Layer 2
      const verifyResult = await this.layer2.otp.verifyDualOTP(
        email, phone, emailCode, phoneCode, OTP_PURPOSES.ACCOUNT_VERIFICATION
      );
      
      return {
        success: verifyResult.bothValid,
        emailValid: verifyResult.emailValid,
        phoneValid: verifyResult.phoneValid,
        bothValid: verifyResult.bothValid,
        purpose: OTP_PURPOSES.ACCOUNT_VERIFICATION
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        purpose: OTP_PURPOSES.ACCOUNT_VERIFICATION
      };
    }
  }

  /**
   * Completes password reset with new password
   * @param {string} email - User email address
   * @param {string} resetToken - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password reset completion result
   */
  async completePasswordReset(email, resetToken, newPassword) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 password reset completion simulated', 
          dryRun: true,
          metadata: { email, resetToken: '***', newPassword: '***' }
        };
      }

      // Note: Password update would go through Layer 1 auth system
      // For now, just invalidate the OTP via Layer 2
      const invalidateResult = await this.layer2.otp.invalidateOTP(email, OTP_PURPOSES.PASSWORD_RESET);
      
      return {
        success: invalidateResult.success,
        message: 'Password reset flow completed',
        purpose: OTP_PURPOSES.PASSWORD_RESET
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        purpose: OTP_PURPOSES.PASSWORD_RESET
      };
    }
  }

  /**
   * Gets authentication flow status
   * @param {string} flowId - Flow identifier
   * @returns {Promise<Object>} Flow status result
   */
  async getFlowStatus(flowId) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 flow status check simulated', 
          dryRun: true,
          metadata: { flowId }
        };
      }

      // Check OTP status via Layer 2 (using flowId as identifier)
      const otpStatus = await this.layer2.otp.getOTPStatus(flowId, OTP_PURPOSES.PASSWORD_RESET);
      
      return {
        success: true,
        exists: otpStatus.exists,
        expiresAt: otpStatus.expiresAt,
        attemptsUsed: otpStatus.attemptsUsed
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = { AuthFlowService, DRY_RUN, NON_EXECUTING };