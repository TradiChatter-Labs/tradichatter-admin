// Layer 2 → Layer 1 OTP Adapter Stubs
// DESIGN-ONLY - NO IMPLEMENTATION - NO RUNTIME EFFECT
// These stubs prepare integration with frozen Layer 1 security services

const { Layer2SafetyError } = require('../Layer2SafetyError');

// Layer 2 Safety Mode
const LAYER2_MODE = "DESIGN_ONLY";

/**
 * Request OTP via Layer 1 services
 * This adapter is inactive by design - Activation requires explicit approval
 * FUTURE: Will call Layer 1 SES service for email OTP
 * FUTURE: Will call Layer 1 Termii service for phone OTP
 * @param {string} identifier - Email or phone number
 * @param {string} channel - 'email' or 'phone'
 * @param {string} purpose - OTP purpose
 * @returns {object} Standardized NOT_IMPLEMENTED response
 * @throws {Layer2SafetyError} If execution attempted in DESIGN_ONLY mode
 */
function requestOtpAdapter(identifier, channel, purpose) {
  // Runtime safety guard - prevents accidental execution
  if (LAYER2_MODE === "DESIGN_ONLY") {
    throw new Layer2SafetyError('OTP adapter blocked - Layer 1 frozen');
  }
  
  // TODO: Future integration with Layer 1 OTP service
  // Layer 1 endpoint reference: "otpService.generateOTP"
  return {
    status: "NOT_IMPLEMENTED",
    reason: "Layer 1 frozen",
    futureIntegration: {
      layer1Service: channel === 'email' ? 'SES' : 'Termii',
      endpoint: 'otpService.generateOTP',
      method: 'POST'
    }
  };
}

/**
 * Verify OTP code via Layer 1 services
 * This adapter is inactive by design - Activation requires explicit approval
 * FUTURE: Will call Layer 1 verification service
 * @param {string} identifier - Email or phone number
 * @param {string} code - OTP code to verify
 * @param {string} purpose - OTP purpose
 * @returns {object} Standardized NOT_IMPLEMENTED response
 * @throws {Layer2SafetyError} If execution attempted in DESIGN_ONLY mode
 */
function verifyOtpAdapter(identifier, code, purpose) {
  // Runtime safety guard - prevents accidental execution
  if (LAYER2_MODE === "DESIGN_ONLY") {
    throw new Layer2SafetyError('OTP verification blocked - Layer 1 frozen');
  }
  
  // TODO: Future integration with Layer 1 verification service
  // Layer 1 endpoint reference: "otpService.verifyOTP"
  return {
    status: "NOT_IMPLEMENTED",
    reason: "Layer 1 frozen",
    futureIntegration: {
      layer1Service: 'OTP_VERIFICATION',
      endpoint: 'otpService.verifyOTP',
      method: 'POST'
    }
  };
}

/**
 * Get OTP status from Layer 1 services
 * This adapter is inactive by design - Activation requires explicit approval
 * FUTURE: Will call Layer 1 status service
 * @param {string} identifier - Email or phone number
 * @param {string} purpose - OTP purpose
 * @returns {object} Standardized NOT_IMPLEMENTED response
 * @throws {Layer2SafetyError} If execution attempted in DESIGN_ONLY mode
 */
function getOtpStatusAdapter(identifier, purpose) {
  // Runtime safety guard - prevents accidental execution
  if (LAYER2_MODE === "DESIGN_ONLY") {
    throw new Layer2SafetyError('OTP status blocked - Layer 1 frozen');
  }
  
  // TODO: Future integration with Layer 1 status service
  // Layer 1 endpoint reference: "otpService.getStatus"
  return {
    status: "NOT_IMPLEMENTED",
    reason: "Layer 1 frozen",
    futureIntegration: {
      layer1Service: 'OTP_STATUS',
      endpoint: 'otpService.getStatus',
      method: 'GET'
    }
  };
}

/**
 * Invalidate OTP via Layer 1 services
 * This adapter is inactive by design - Activation requires explicit approval
 * FUTURE: Will call Layer 1 invalidation service
 * @param {string} identifier - Email or phone number
 * @param {string} purpose - OTP purpose
 * @returns {object} Standardized NOT_IMPLEMENTED response
 * @throws {Layer2SafetyError} If execution attempted in DESIGN_ONLY mode
 */
function invalidateOtpAdapter(identifier, purpose) {
  // Runtime safety guard - prevents accidental execution
  if (LAYER2_MODE === "DESIGN_ONLY") {
    throw new Layer2SafetyError('OTP invalidation blocked - Layer 1 frozen');
  }
  
  // TODO: Future integration with Layer 1 invalidation service
  // Layer 1 endpoint reference: "otpService.invalidateOTP"
  return {
    status: "NOT_IMPLEMENTED",
    reason: "Layer 1 frozen",
    futureIntegration: {
      layer1Service: 'OTP_INVALIDATION',
      endpoint: 'otpService.invalidateOTP',
      method: 'DELETE'
    }
  };
}

module.exports = {
  requestOtpAdapter,
  verifyOtpAdapter,
  getOtpStatusAdapter,
  invalidateOtpAdapter,
  LAYER2_MODE
};