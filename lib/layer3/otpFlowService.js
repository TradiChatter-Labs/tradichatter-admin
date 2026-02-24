// Layer 3 - OTP Flow Service (SAFE IMPLEMENTATION)
// Application Integration Layer - Calls Layer 2 adapters only
// SAFE FOR FROZEN SECURITY - NO LAYER 1 ACCESS

const { Layer2Interface, Layer2SafetyError, OTP_PURPOSES, OTP_CHANNELS } = require('../layer2');

const DRY_RUN = false; // ACTIVATED - Live execution enabled
const NON_EXECUTING = false;

class OTPFlowService {
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
   * Requests OTP for user verification
   * @param {string} identifier - User identifier (email/phone)
   * @param {string} channel - Delivery channel (email/sms)
   * @param {string} purpose - OTP purpose (login, reset, verify)
   * @returns {Promise<Object>} OTP request result
   */
  async requestOtp(identifier, channel, purpose) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 call simulated', 
          dryRun: true,
          metadata: { identifier, channel, purpose }
        };
      }

      // Validate inputs
      if (!identifier || !channel || !purpose) {
        throw new Error('Missing required parameters');
      }

      // Route to appropriate Layer 2 method
      let result;
      switch (channel) {
        case OTP_CHANNELS.EMAIL:
          result = await this.layer2.otp.sendEmailOTP(identifier, purpose);
          break;
        case OTP_CHANNELS.PHONE:
          result = await this.layer2.otp.sendPhoneOTP(identifier, purpose);
          break;
        case OTP_CHANNELS.DUAL:
          const [email, phone] = identifier.split(',');
          result = await this.layer2.otp.sendDualOTP(email, phone, purpose);
          break;
        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }

      return {
        success: result.success,
        otpId: result.otpId,
        expiresAt: result.expiresAt,
        channel,
        purpose,
        live: result.live, // Pass through live flag from Layer 2
        dryRun: result.dryRun // Pass through dryRun flag from Layer 2
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error; // Re-throw safety errors
      }
      return {
        success: false,
        error: error.message,
        channel,
        purpose
      };
    }
  }

  /**
   * Verifies submitted OTP code
   * @param {string} identifier - User identifier
   * @param {string} code - OTP code to verify
   * @param {string} purpose - OTP purpose
   * @returns {Promise<Object>} Verification result
   */
  async verifyOtp(identifier, code, purpose) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 verification simulated', 
          dryRun: true,
          metadata: { identifier, code: '***', purpose }
        };
      }

      // Determine channel from identifier format
      const channel = identifier.includes('@') ? OTP_CHANNELS.EMAIL : OTP_CHANNELS.PHONE;
      
      let result;
      if (channel === OTP_CHANNELS.EMAIL) {
        result = await this.layer2.otp.verifyEmailOTP(identifier, code, purpose);
      } else {
        result = await this.layer2.otp.verifyPhoneOTP(identifier, code, purpose);
      }

      return {
        success: result.valid && !result.expired,
        valid: result.valid,
        expired: result.expired,
        attemptsRemaining: result.attemptsRemaining,
        purpose,
        live: result.live, // Pass through live flag from Layer 2
        dryRun: result.dryRun // Pass through dryRun flag from Layer 2
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        purpose
      };
    }
  }

  /**
   * Gets OTP status and metadata
   * @param {string} identifier - User identifier
   * @param {string} purpose - OTP purpose
   * @returns {Promise<Object>} OTP status
   */
  async getOtpStatus(identifier, purpose) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 status check simulated', 
          dryRun: true,
          metadata: { identifier, purpose }
        };
      }

      const result = await this.layer2.otp.getOTPStatus(identifier, purpose);
      return {
        success: true,
        exists: result.exists,
        expiresAt: result.expiresAt,
        attemptsUsed: result.attemptsUsed,
        purpose,
        live: result.live, // Pass through live flag from Layer 2
        dryRun: result.dryRun // Pass through dryRun flag from Layer 2
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        purpose
      };
    }
  }

  /**
   * Invalidates existing OTP
   * @param {string} identifier - User identifier
   * @param {string} purpose - OTP purpose
   * @returns {Promise<Object>} Invalidation result
   */
  async invalidateOtp(identifier, purpose) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 invalidation simulated', 
          dryRun: true,
          metadata: { identifier, purpose }
        };
      }

      const result = await this.layer2.otp.invalidateOTP(identifier, purpose);
      return {
        success: result.success,
        purpose,
        live: result.live, // Pass through live flag from Layer 2
        dryRun: result.dryRun // Pass through dryRun flag from Layer 2
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        purpose
      };
    }
  }
}

module.exports = { OTPFlowService, DRY_RUN, NON_EXECUTING };