// Layer 2 → Layer 1 Notification Adapter Stubs
// DESIGN-ONLY - NO IMPLEMENTATION - NO RUNTIME EFFECT
// These stubs prepare integration with frozen Layer 1 security services

const { Layer2SafetyError } = require('../Layer2SafetyError');

// Layer 2 Safety Mode
const LAYER2_MODE = "DESIGN_ONLY";

/**
 * Send user notification via Layer 1 services
 * This adapter is inactive by design - Activation requires explicit approval
 * FUTURE: Will call Layer 1 SES service for email notifications
 * FUTURE: Will call Layer 1 Termii service for SMS notifications
 * @param {string} identifier - Email or phone number
 * @param {string} channel - 'email' or 'sms'
 * @param {string} template - Notification template
 * @param {object} data - Template data
 * @returns {object} Standardized NOT_IMPLEMENTED response
 * @throws {Layer2SafetyError} If execution attempted in DESIGN_ONLY mode
 */
function sendUserNotificationAdapter(identifier, channel, template, data) {
  // Runtime safety guard - prevents accidental execution
  if (LAYER2_MODE === "DESIGN_ONLY") {
    throw new Layer2SafetyError('User notification blocked - Layer 1 frozen');
  }
  
  // TODO: Future integration with Layer 1 notification service
  // Layer 1 endpoint reference: "notificationService.sendUser"
  return {
    status: "NOT_IMPLEMENTED",
    reason: "Layer 1 frozen",
    futureIntegration: {
      layer1Service: channel === 'email' ? 'SES' : 'Termii',
      endpoint: 'notificationService.sendUser',
      method: 'POST'
    }
  };
}

/**
 * Send admin alert via Layer 1 services
 * This adapter is inactive by design - Activation requires explicit approval
 * FUTURE: Will call Layer 1 admin notification service
 * @param {string} alertType - Type of admin alert
 * @param {object} alertData - Alert context and data
 * @returns {object} Standardized NOT_IMPLEMENTED response
 * @throws {Layer2SafetyError} If execution attempted in DESIGN_ONLY mode
 */
function sendAdminAlertAdapter(alertType, alertData) {
  // Runtime safety guard - prevents accidental execution
  if (LAYER2_MODE === "DESIGN_ONLY") {
    throw new Layer2SafetyError('Admin alert blocked - Layer 1 frozen');
  }
  
  // TODO: Future integration with Layer 1 admin alert service
  // Layer 1 endpoint reference: "adminService.sendAlert"
  return {
    status: "NOT_IMPLEMENTED",
    reason: "Layer 1 frozen",
    futureIntegration: {
      layer1Service: 'ADMIN_ALERTS',
      endpoint: 'adminService.sendAlert',
      method: 'POST'
    }
  };
}

/**
 * Get notification status from Layer 1 services
 * This adapter is inactive by design - Activation requires explicit approval
 * FUTURE: Will call Layer 1 status tracking service
 * @param {string} notificationId - Notification ID to check
 * @returns {object} Standardized NOT_IMPLEMENTED response
 * @throws {Layer2SafetyError} If execution attempted in DESIGN_ONLY mode
 */
function getNotificationStatusAdapter(notificationId) {
  // Runtime safety guard - prevents accidental execution
  if (LAYER2_MODE === "DESIGN_ONLY") {
    throw new Layer2SafetyError('Notification status blocked - Layer 1 frozen');
  }
  
  // TODO: Future integration with Layer 1 status service
  // Layer 1 endpoint reference: "notificationService.getStatus"
  return {
    status: "NOT_IMPLEMENTED",
    reason: "Layer 1 frozen",
    futureIntegration: {
      layer1Service: 'NOTIFICATION_STATUS',
      endpoint: 'notificationService.getStatus',
      method: 'GET'
    }
  };
}

/**
 * Send security alert via Layer 1 services
 * This adapter is inactive by design - Activation requires explicit approval
 * FUTURE: Will call Layer 1 security alert service
 * @param {string} alertLevel - Security alert level
 * @param {object} securityData - Security event data
 * @returns {object} Standardized NOT_IMPLEMENTED response
 * @throws {Layer2SafetyError} If execution attempted in DESIGN_ONLY mode
 */
function sendSecurityAlertAdapter(alertLevel, securityData) {
  // Runtime safety guard - prevents accidental execution
  if (LAYER2_MODE === "DESIGN_ONLY") {
    throw new Layer2SafetyError('Security alert blocked - Layer 1 frozen');
  }
  
  // TODO: Future integration with Layer 1 security service
  // Layer 1 endpoint reference: "securityService.sendAlert"
  return {
    status: "NOT_IMPLEMENTED",
    reason: "Layer 1 frozen",
    futureIntegration: {
      layer1Service: 'SECURITY_ALERTS',
      endpoint: 'securityService.sendAlert',
      method: 'POST'
    }
  };
}

module.exports = {
  sendUserNotificationAdapter,
  sendAdminAlertAdapter,
  getNotificationStatusAdapter,
  sendSecurityAlertAdapter,
  LAYER2_MODE
};