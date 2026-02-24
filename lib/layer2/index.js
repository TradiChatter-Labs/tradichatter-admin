// Layer 2 Interface - Main Entry Point
// This layer provides a clean interface to frozen Layer 1 security services
// DRY_RUN IMPLEMENTATION - No live execution yet

const { OTPOrchestrationService, OTP_PURPOSES, OTP_CHANNELS, DRY_RUN: OTP_DRY_RUN } = require('./otpOrchestration');
const { 
  NotificationOrchestrationService, 
  NOTIFICATION_TEMPLATES, 
  NOTIFICATION_CHANNELS, 
  ADMIN_ALERT_TYPES,
  DRY_RUN: NOTIF_DRY_RUN
} = require('./notificationOrchestration');
const { Layer2SafetyError } = require('./Layer2SafetyError');

// Layer 2 DRY_RUN Configuration
const DRY_RUN = true;
const NON_EXECUTING = true;
const LAYER1_BLOCKED = true;

// Layer 2 Interface Status
const LAYER2_STATUS = {
  READY: 'ready',
  INITIALIZING: 'initializing',
  ERROR: 'error',
  DRY_RUN: 'dry_run'
};

// Adapter Readiness Status
const ADAPTER_STATUS = {
  DRY_RUN_ONLY: 'dry_run_only',
  LAYER1_FROZEN: 'layer1_frozen',
  IMPLEMENTED: 'implemented',
  DESIGN_ONLY: 'design_only'
};

// Layer 2 Safety Mode
const LAYER2_MODE = "DRY_RUN";

class Layer2Interface {
  constructor() {
    // Initialize Layer 2 services in DRY_RUN mode
    this.otp = new OTPOrchestrationService();
    this.notifications = new NotificationOrchestrationService();
    this.status = LAYER2_STATUS.DRY_RUN;
    this.mode = LAYER2_MODE;
    
    // Metadata tracking
    this.metadata = {
      dryRun: DRY_RUN,
      nonExecuting: NON_EXECUTING,
      layer1Blocked: LAYER1_BLOCKED,
      otpDryRun: OTP_DRY_RUN,
      notificationDryRun: NOTIF_DRY_RUN
    };
  }

  /**
   * Health check for Layer 2 interface
   * @returns {Promise<{status: string, services: object, timestamp: string}>}
   */
  async healthCheck() {
    return {
      status: this.status,
      services: {
        otp: this.otp.metadata,
        notifications: this.notifications.metadata
      },
      timestamp: new Date().toISOString(),
      dryRun: DRY_RUN
    };
  }

  /**
   * Get Layer 2 interface information
   * @returns {object} Interface metadata and capabilities
   */
  getInterfaceInfo() {
    return {
      layer: 2,
      mode: this.mode,
      services: ['otp', 'notifications'],
      status: this.status,
      safetyLock: {
        active: true,
        mode: LAYER2_MODE,
        layer1Blocked: LAYER1_BLOCKED,
        executionPrevented: NON_EXECUTING
      },
      adapters: {
        otp: ADAPTER_STATUS.DRY_RUN_ONLY,
        notification: ADAPTER_STATUS.DRY_RUN_ONLY,
        layer1Integration: ADAPTER_STATUS.LAYER1_FROZEN
      },
      capabilities: {
        otpChannels: Object.values(OTP_CHANNELS),
        notificationChannels: Object.values(NOTIFICATION_CHANNELS),
        otpPurposes: Object.values(OTP_PURPOSES),
        notificationTemplates: Object.values(NOTIFICATION_TEMPLATES)
      },
      metadata: this.metadata
    };
  }
}

module.exports = { 
  Layer2Interface, 
  Layer2SafetyError,
  LAYER2_STATUS,
  LAYER2_MODE,
  ADAPTER_STATUS,
  OTP_PURPOSES,
  OTP_CHANNELS,
  NOTIFICATION_TEMPLATES,
  NOTIFICATION_CHANNELS,
  ADMIN_ALERT_TYPES,
  DRY_RUN,
  NON_EXECUTING,
  LAYER1_BLOCKED
};