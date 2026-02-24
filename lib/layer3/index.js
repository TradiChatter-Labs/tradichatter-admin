// Layer 3 - Application Integration Layer (DRY-RUN MODE ONLY)
// Main interface for flow services - NO EXECUTION
// SAFE FOR FROZEN SECURITY - NON_EXECUTING

const { OTPFlowService, DRY_RUN: OTP_DRY_RUN, NON_EXECUTING: OTP_NON_EXECUTING } = require('./otpFlowService');
const { NotificationFlowService, DRY_RUN: NOTIF_DRY_RUN, NON_EXECUTING: NOTIF_NON_EXECUTING } = require('./notificationFlowService');
const { AuthFlowService, DRY_RUN: AUTH_DRY_RUN, NON_EXECUTING: AUTH_NON_EXECUTING } = require('./authFlowService');

const LAYER3_DRY_RUN = true;
const LAYER3_NON_EXECUTING = true;

class Layer2SafetyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Layer2SafetyError';
  }
}

/**
 * Layer 3 Application Integration Interface
 * Coordinates flow services in DRY-RUN mode only
 */
class Layer3Interface {
  constructor() {
    this.status = 'DRY_RUN';
    this.executing = false;
    this.metadata = {
      mode: 'DRY_RUN',
      layer: 3,
      safetyLocked: true,
      services: {
        otp: OTP_DRY_RUN && OTP_NON_EXECUTING,
        notification: NOTIF_DRY_RUN && NOTIF_NON_EXECUTING,
        auth: AUTH_DRY_RUN && AUTH_NON_EXECUTING
      }
    };

    // Initialize services in DRY-RUN mode
    this.otpFlow = new OTPFlowService();
    this.notificationFlow = new NotificationFlowService();
    this.authFlow = new AuthFlowService();
  }

  /**
   * Gets Layer 3 status and safety information
   * @returns {Object} Layer 3 status
   */
  getStatus() {
    return {
      layer: 3,
      status: this.status,
      executing: this.executing,
      dryRun: LAYER3_DRY_RUN,
      nonExecuting: LAYER3_NON_EXECUTING,
      services: this.metadata.services,
      safetyLocked: this.metadata.safetyLocked
    };
  }

  /**
   * Validates all services are in DRY-RUN mode
   * @returns {boolean} True if all services are safe
   */
  validateSafety() {
    const allSafe = OTP_DRY_RUN && OTP_NON_EXECUTING &&
                   NOTIF_DRY_RUN && NOTIF_NON_EXECUTING &&
                   AUTH_DRY_RUN && AUTH_NON_EXECUTING;
    
    if (!allSafe) {
      throw new Layer2SafetyError('Layer 3 safety validation failed');
    }
    
    return allSafe;
  }
}

module.exports = {
  Layer3Interface,
  OTPFlowService,
  NotificationFlowService,
  AuthFlowService,
  LAYER3_DRY_RUN,
  LAYER3_NON_EXECUTING
};