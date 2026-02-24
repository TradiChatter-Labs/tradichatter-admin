// Layer 3 - Notification Flow Service (SAFE IMPLEMENTATION)
// Application Integration Layer - Calls Layer 2 adapters only
// SAFE FOR FROZEN SECURITY - NO LAYER 1 ACCESS

const { Layer2Interface, Layer2SafetyError, NOTIFICATION_TEMPLATES, NOTIFICATION_CHANNELS, ADMIN_ALERT_TYPES } = require('../layer2');

const DRY_RUN = false; // ACTIVATED - Live execution enabled
const NON_EXECUTING = false;

class NotificationFlowService {
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
   * Sends user notification via specified channel
   * @param {string} identifier - User identifier (email/phone)
   * @param {string} channel - Notification channel (email/sms)
   * @param {string} template - Notification template
   * @param {Object} data - Template data
   * @returns {Promise<Object>} Notification result
   */
  async sendUserNotification(identifier, channel, template, data) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 notification simulated', 
          dryRun: true,
          metadata: { identifier, channel, template }
        };
      }

      // Validate inputs
      if (!identifier || !channel || !template) {
        throw new Error('Missing required parameters');
      }

      // Route to appropriate Layer 2 method
      let result;
      switch (channel) {
        case NOTIFICATION_CHANNELS.EMAIL:
          result = await this.layer2.notifications.sendEmailNotification(identifier, template, data);
          break;
        case NOTIFICATION_CHANNELS.SMS:
          result = await this.layer2.notifications.sendSMSNotification(identifier, template, data);
          break;
        case NOTIFICATION_CHANNELS.DUAL:
          const [email, phone] = identifier.split(',');
          result = await this.layer2.notifications.sendDualNotification(email, phone, template, data);
          break;
        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }

      return {
        success: result.success,
        messageId: result.messageId,
        channel,
        template
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error; // Re-throw safety errors
      }
      return {
        success: false,
        error: error.message,
        channel,
        template
      };
    }
  }

  /**
   * Sends admin alert notification
   * @param {string} alertType - Type of alert
   * @param {Object} alertData - Alert data
   * @returns {Promise<Object>} Alert result
   */
  async sendAdminAlert(alertType, alertData) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 admin alert simulated', 
          dryRun: true,
          metadata: { alertType, alertData }
        };
      }

      // Validate alert type
      if (!Object.values(ADMIN_ALERT_TYPES).includes(alertType)) {
        throw new Error(`Invalid alert type: ${alertType}`);
      }

      const result = await this.layer2.notifications.sendAdminAlert(alertType, alertData);
      return {
        success: result.success,
        alertId: result.alertId,
        alertType
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        alertType
      };
    }
  }

  /**
   * Gets notification delivery status
   * @param {string} notificationId - Notification identifier
   * @returns {Promise<Object>} Status result
   */
  async getNotificationStatus(notificationId) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 status check simulated', 
          dryRun: true,
          metadata: { notificationId }
        };
      }

      const result = await this.layer2.notifications.getNotificationStatus(notificationId);
      return {
        success: true,
        status: result.status,
        deliveredAt: result.deliveredAt,
        error: result.error
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

  /**
   * Sends security alert notification
   * @param {string} alertLevel - Security alert level
   * @param {Object} securityData - Security alert data
   * @returns {Promise<Object>} Security alert result
   */
  async sendSecurityAlert(alertLevel, securityData) {
    try {
      if (DRY_RUN) {
        return { 
          success: false, 
          message: 'DRY_RUN - Layer 2 security alert simulated', 
          dryRun: true,
          metadata: { alertLevel, securityData }
        };
      }

      // Route security alerts through admin alert system
      const result = await this.layer2.notifications.sendAdminAlert(
        ADMIN_ALERT_TYPES.SECURITY_BREACH, 
        { level: alertLevel, ...securityData }
      );
      
      return {
        success: result.success,
        alertId: result.alertId,
        alertLevel
      };
    } catch (error) {
      if (error instanceof Layer2SafetyError) {
        throw error;
      }
      return {
        success: false,
        error: error.message,
        alertLevel
      };
    }
  }
}

module.exports = { NotificationFlowService, DRY_RUN, NON_EXECUTING };