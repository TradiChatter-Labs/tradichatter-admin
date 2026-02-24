// Security Event Emission Utilities
// How different parts of TradiChatter emit security events

import { SECURITY_EVENT_TYPES, SECURITY_SEVERITY_LEVELS } from './securityEvents.js';

// Base Security Event Structure
export class SecurityEvent {
  constructor(eventType, context = {}) {
    this.eventType = eventType;
    this.timestamp = new Date().toISOString();
    this.severity = this.getSeverity(eventType);
    this.context = {
      userId: context.userId || null,
      ipAddress: context.ipAddress || null,
      userAgent: context.userAgent || null,
      sessionId: context.sessionId || null,
      ...context
    };
    this.id = this.generateEventId();
  }

  getSeverity(eventType) {
    const severityMap = {
      [SECURITY_EVENT_TYPES.AUTH_SESSION_HIJACK]: SECURITY_SEVERITY_LEVELS.CRITICAL,
      [SECURITY_EVENT_TYPES.PAYMENT_CARD_FRAUD]: SECURITY_SEVERITY_LEVELS.CRITICAL,
      [SECURITY_EVENT_TYPES.ADMIN_PRIVILEGE_ESCALATION]: SECURITY_SEVERITY_LEVELS.CRITICAL,
      [SECURITY_EVENT_TYPES.AUTH_FAILED_LOGIN]: SECURITY_SEVERITY_LEVELS.HIGH,
      [SECURITY_EVENT_TYPES.PAYMENT_SUSPICIOUS_AMOUNT]: SECURITY_SEVERITY_LEVELS.HIGH,
      [SECURITY_EVENT_TYPES.CHAT_SPAM_DETECTED]: SECURITY_SEVERITY_LEVELS.LOW
    };
    return severityMap[eventType] || SECURITY_SEVERITY_LEVELS.MEDIUM;
  }

  generateEventId() {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Mobile App Event Emitter
export class MobileSecurityEmitter {
  static async emitAuthFailure(userId, ipAddress, reason) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.AUTH_FAILED_LOGIN, {
      userId,
      ipAddress,
      reason,
      platform: 'mobile',
      additionalData: { failureReason: reason }
    });
    
    return await this.sendToBackend(event);
  }

  static async emitChatViolation(userId, chatId, messageId, violationType) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.CHAT_INAPPROPRIATE_CONTENT, {
      userId,
      chatId,
      messageId,
      violationType,
      platform: 'mobile'
    });
    
    return await this.sendToBackend(event);
  }

  static async emitPaymentFailure(userId, transactionId, amount, reason) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.PAYMENT_FAILED_ATTEMPT, {
      userId,
      transactionId,
      amount,
      reason,
      platform: 'mobile'
    });
    
    return await this.sendToBackend(event);
  }

  static async sendToBackend(event) {
    try {
      const response = await fetch('/api/security/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to emit security event:', error);
      return false;
    }
  }
}

// Appwrite Function Event Emitter
export class AppwriteSecurityEmitter {
  static async emitSuspiciousRegistration(userId, registrationData, riskFactors) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.AUTH_SUSPICIOUS_REGISTRATION, {
      userId,
      riskFactors,
      registrationData: {
        email: registrationData.email,
        phone: registrationData.phone,
        location: registrationData.location
      },
      platform: 'appwrite'
    });
    
    return await this.storeInDatabase(event);
  }

  static async emitKYCFailure(businessId, userId, documentType, failureReason) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.KYC_VERIFICATION_FAILED, {
      businessId,
      userId,
      documentType,
      failureReason,
      platform: 'appwrite'
    });
    
    return await this.storeInDatabase(event);
  }

  static async storeInDatabase(event) {
    // Store in Appwrite database
    try {
      // This would use Appwrite SDK to store the event
      console.log('Storing security event:', event);
      return true;
    } catch (error) {
      console.error('Failed to store security event:', error);
      return false;
    }
  }
}

// Rust Backend Event Emitter
export class RustSecurityEmitter {
  static emitSpamDetection(userId, chatId, messageContent, spamScore) {
    const event = {
      event_type: SECURITY_EVENT_TYPES.CHAT_SPAM_DETECTED,
      timestamp: new Date().toISOString(),
      context: {
        user_id: userId,
        chat_id: chatId,
        spam_score: spamScore,
        platform: 'rust'
      }
    };
    
    return this.sendToSecurityService(event);
  }

  static emitEscrowAnomaly(escrowId, userId, businessId, anomalyType) {
    const event = {
      event_type: SECURITY_EVENT_TYPES.ESCROW_RELEASE_ANOMALY,
      timestamp: new Date().toISOString(),
      context: {
        escrow_id: escrowId,
        user_id: userId,
        business_id: businessId,
        anomaly_type: anomalyType,
        platform: 'rust'
      }
    };
    
    return this.sendToSecurityService(event);
  }

  static sendToSecurityService(event) {
    // Rust implementation would send to security service
    console.log('Rust security event:', event);
    return true;
  }
}

// Admin Portal Event Emitter
export class AdminSecurityEmitter {
  static async emitUnauthorizedAccess(adminId, attemptedResource, ipAddress) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.ADMIN_UNAUTHORIZED_ACCESS, {
      adminId,
      attemptedResource,
      ipAddress,
      platform: 'admin'
    });
    
    return await this.logToSecuritySystem(event);
  }

  static async emitConfigChange(adminId, configType, oldValue, newValue) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.ADMIN_CONFIG_CHANGE, {
      adminId,
      configType,
      changes: { oldValue, newValue },
      platform: 'admin'
    });
    
    return await this.logToSecuritySystem(event);
  }

  static async emitDataExport(adminId, exportType, recordCount) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.ADMIN_DATA_EXPORT, {
      adminId,
      exportType,
      recordCount,
      platform: 'admin'
    });
    
    return await this.logToSecuritySystem(event);
  }

  static async logToSecuritySystem(event) {
    try {
      // Send to centralized security logging
      const response = await fetch('/api/admin/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to log admin security event:', error);
      return false;
    }
  }
}

// Payment Gateway Webhook Event Handler
export class PaymentSecurityHandler {
  static handleFraudAlert(webhookData) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.PAYMENT_CARD_FRAUD, {
      transactionId: webhookData.transaction_id,
      userId: webhookData.user_id,
      amount: webhookData.amount,
      fraudScore: webhookData.fraud_score,
      gateway: webhookData.gateway,
      platform: 'webhook'
    });
    
    return this.processSecurityEvent(event);
  }

  static handleChargeback(webhookData) {
    const event = new SecurityEvent(SECURITY_EVENT_TYPES.PAYMENT_CHARGEBACK, {
      transactionId: webhookData.transaction_id,
      userId: webhookData.user_id,
      amount: webhookData.amount,
      reason: webhookData.chargeback_reason,
      gateway: webhookData.gateway,
      platform: 'webhook'
    });
    
    return this.processSecurityEvent(event);
  }

  static async processSecurityEvent(event) {
    // Process critical payment security events immediately
    if (event.severity === SECURITY_SEVERITY_LEVELS.CRITICAL) {
      await this.triggerEmergencyResponse(event);
    }
    
    return await this.storeSecurityEvent(event);
  }

  static async triggerEmergencyResponse(event) {
    // Immediate lockdown for critical payment fraud
    console.log('CRITICAL PAYMENT SECURITY EVENT:', event);
    // Would trigger account lockdown, admin alerts, etc.
  }

  static async storeSecurityEvent(event) {
    // Store in security database
    return true;
  }
}