// TradiChatter Security Events Schema
// This defines all security events that can occur in the platform
//
// 🔒 SECURITY LAYER FROZEN - DO NOT MODIFY WITHOUT AUTHORIZATION
// Event types, severities, and weights are finalized

export const SECURITY_EVENT_TYPES = {
  // Customer Authentication Events (OTP-based)
  CUSTOMER_OTP_FAILED: 'customer.otp_failed',
  CUSTOMER_DEVICE_SUSPICIOUS: 'customer.device_suspicious', 
  CUSTOMER_ACCOUNT_TAKEOVER: 'customer.account_takeover',
  CUSTOMER_DEVICE_TRUST_VIOLATION: 'customer.device_trust_violation',

  // Business Authentication Events (OTP-based)
  BUSINESS_OTP_FAILED: 'business.otp_failed',
  BUSINESS_DEVICE_SUSPICIOUS: 'business.device_suspicious',
  BUSINESS_KYC_VIOLATION: 'business.kyc_violation',
  BUSINESS_IMPERSONATION: 'business.impersonation',

  // Affiliate Authentication Events (OTP-based)
  AFFILIATE_OTP_FAILED: 'affiliate.otp_failed',
  AFFILIATE_DEVICE_SUSPICIOUS: 'affiliate.device_suspicious',
  AFFILIATE_COMMISSION_FRAUD: 'affiliate.commission_fraud',
  AFFILIATE_REFERRAL_ABUSE: 'affiliate.referral_abuse',

  // Admin Authentication Events (CRITICAL - OTP-based)
  ADMIN_OTP_FAILED: 'admin.otp_failed',
  ADMIN_PRIVILEGE_ESCALATION: 'admin.privilege_escalation',
  ADMIN_UNAUTHORIZED_ACCESS: 'admin.unauthorized_access',
  ADMIN_CONFIG_CHANGE: 'admin.config_change',
  ADMIN_DATA_EXPORT: 'admin.data_export',

  // Chat & Media Security Events
  CHAT_INAPPROPRIATE_CONTENT: 'chat.inappropriate_content',
  CHAT_SPAM_DETECTED: 'chat.spam_detected',
  CHAT_PHISHING_ATTEMPT: 'chat.phishing_attempt',
  MEDIA_MALICIOUS_UPLOAD: 'media.malicious_upload',
  MEDIA_INAPPROPRIATE_IMAGE: 'media.inappropriate_image',

  // Payments & Escrow Security Events (NO WALLET)
  PAYMENT_FAILED_ATTEMPT: 'payment.failed_attempt',
  PAYMENT_SUSPICIOUS_AMOUNT: 'payment.suspicious_amount',
  PAYMENT_CARD_FRAUD: 'payment.card_fraud',
  ESCROW_DISPUTE_FRAUD: 'escrow.dispute_fraud',
  ESCROW_RELEASE_ANOMALY: 'escrow.release_anomaly',
  PAYMENT_GATEWAY_ERROR: 'payment.gateway_error',
  PAYMENT_CHARGEBACK: 'payment.chargeback',

  // Business & KYC Security Events
  KYC_DOCUMENT_FRAUD: 'kyc.document_fraud',
  KYC_VERIFICATION_FAILED: 'kyc.verification_failed',
  BUSINESS_SUSPICIOUS_ACTIVITY: 'business.suspicious_activity',
  BUSINESS_FAKE_REGISTRATION: 'business.fake_registration',
  COMPLIANCE_VIOLATION: 'compliance.violation',

  // System Events
  SYSTEM_BREACH_ATTEMPT: 'system.breach_attempt',
  API_ABUSE: 'api.abuse'
};

export const SECURITY_SEVERITY_LEVELS = {
  CRITICAL: 'critical',    // Immediate threat, auto-lockdown
  HIGH: 'high',           // Urgent attention required
  MEDIUM: 'medium',       // Monitor closely
  LOW: 'low',            // Log and track
  INFO: 'info'           // Informational only
};

export const SECURITY_EVENT_SEVERITIES = {
  // CRITICAL Events (Auto-lockdown triggers) - ADMIN FOCUSED
  [SECURITY_EVENT_TYPES.ADMIN_PRIVILEGE_ESCALATION]: SECURITY_SEVERITY_LEVELS.CRITICAL,
  [SECURITY_EVENT_TYPES.SYSTEM_BREACH_ATTEMPT]: SECURITY_SEVERITY_LEVELS.CRITICAL,
  [SECURITY_EVENT_TYPES.PAYMENT_CARD_FRAUD]: SECURITY_SEVERITY_LEVELS.CRITICAL,
  [SECURITY_EVENT_TYPES.CUSTOMER_ACCOUNT_TAKEOVER]: SECURITY_SEVERITY_LEVELS.CRITICAL,

  // HIGH Severity Events - Actor-specific
  [SECURITY_EVENT_TYPES.ADMIN_UNAUTHORIZED_ACCESS]: SECURITY_SEVERITY_LEVELS.HIGH,
  [SECURITY_EVENT_TYPES.ADMIN_OTP_FAILED]: SECURITY_SEVERITY_LEVELS.HIGH,
  [SECURITY_EVENT_TYPES.BUSINESS_KYC_VIOLATION]: SECURITY_SEVERITY_LEVELS.HIGH,
  [SECURITY_EVENT_TYPES.PAYMENT_SUSPICIOUS_AMOUNT]: SECURITY_SEVERITY_LEVELS.HIGH,
  [SECURITY_EVENT_TYPES.KYC_DOCUMENT_FRAUD]: SECURITY_SEVERITY_LEVELS.HIGH,
  [SECURITY_EVENT_TYPES.ESCROW_DISPUTE_FRAUD]: SECURITY_SEVERITY_LEVELS.HIGH,

  // MEDIUM Severity Events
  [SECURITY_EVENT_TYPES.BUSINESS_OTP_FAILED]: SECURITY_SEVERITY_LEVELS.MEDIUM,
  [SECURITY_EVENT_TYPES.CUSTOMER_OTP_FAILED]: SECURITY_SEVERITY_LEVELS.MEDIUM,
  [SECURITY_EVENT_TYPES.AFFILIATE_COMMISSION_FRAUD]: SECURITY_SEVERITY_LEVELS.MEDIUM,
  [SECURITY_EVENT_TYPES.CHAT_PHISHING_ATTEMPT]: SECURITY_SEVERITY_LEVELS.MEDIUM,
  [SECURITY_EVENT_TYPES.PAYMENT_FAILED_ATTEMPT]: SECURITY_SEVERITY_LEVELS.MEDIUM,
  [SECURITY_EVENT_TYPES.API_ABUSE]: SECURITY_SEVERITY_LEVELS.MEDIUM,

  // LOW Severity Events
  [SECURITY_EVENT_TYPES.CHAT_SPAM_DETECTED]: SECURITY_SEVERITY_LEVELS.LOW,
  [SECURITY_EVENT_TYPES.CUSTOMER_DEVICE_SUSPICIOUS]: SECURITY_SEVERITY_LEVELS.LOW,
  [SECURITY_EVENT_TYPES.MEDIA_INAPPROPRIATE_IMAGE]: SECURITY_SEVERITY_LEVELS.LOW,
  [SECURITY_EVENT_TYPES.AFFILIATE_OTP_FAILED]: SECURITY_SEVERITY_LEVELS.LOW,

  // INFO Events
  [SECURITY_EVENT_TYPES.ADMIN_CONFIG_CHANGE]: SECURITY_SEVERITY_LEVELS.INFO,
  [SECURITY_EVENT_TYPES.ADMIN_DATA_EXPORT]: SECURITY_SEVERITY_LEVELS.INFO
};

// Event emission points in TradiChatter
export const EVENT_EMISSION_SOURCES = {
  // Mobile App (React Native)
  MOBILE_APP: {
    location: 'mobile/services/securityService.js',
    events: [
      SECURITY_EVENT_TYPES.AUTH_FAILED_LOGIN,
      SECURITY_EVENT_TYPES.AUTH_WEAK_PASSWORD,
      SECURITY_EVENT_TYPES.CHAT_INAPPROPRIATE_CONTENT,
      SECURITY_EVENT_TYPES.PAYMENT_FAILED_ATTEMPT
    ]
  },

  // Appwrite Backend
  APPWRITE_FUNCTIONS: {
    location: 'appwrite/functions/security-monitor',
    events: [
      SECURITY_EVENT_TYPES.AUTH_SUSPICIOUS_REGISTRATION,
      SECURITY_EVENT_TYPES.KYC_VERIFICATION_FAILED,
      SECURITY_EVENT_TYPES.PAYMENT_SUSPICIOUS_AMOUNT
    ]
  },

  // Rust Backend Services
  RUST_SERVICES: {
    location: 'rust-backend/src/services/security.rs',
    events: [
      SECURITY_EVENT_TYPES.CHAT_SPAM_DETECTED,
      SECURITY_EVENT_TYPES.ESCROW_RELEASE_ANOMALY,
      SECURITY_EVENT_TYPES.API_ABUSE
    ]
  },

  // Admin Portal
  ADMIN_PORTAL: {
    location: 'admin/lib/securityLogger.js',
    events: [
      SECURITY_EVENT_TYPES.ADMIN_UNAUTHORIZED_ACCESS,
      SECURITY_EVENT_TYPES.ADMIN_PRIVILEGE_ESCALATION,
      SECURITY_EVENT_TYPES.ADMIN_CONFIG_CHANGE,
      SECURITY_EVENT_TYPES.ADMIN_DATA_EXPORT
    ]
  },

  // Payment Gateways (Webhooks)
  PAYMENT_WEBHOOKS: {
    location: 'api/webhooks/payment-security',
    events: [
      SECURITY_EVENT_TYPES.PAYMENT_CARD_FRAUD,
      SECURITY_EVENT_TYPES.PAYMENT_CHARGEBACK,
      SECURITY_EVENT_TYPES.PAYMENT_GATEWAY_ERROR
    ]
  }
};

// Automated Response Actions
export const AUTOMATED_RESPONSES = {
  [SECURITY_SEVERITY_LEVELS.CRITICAL]: {
    actions: ['LOCKDOWN_ACCOUNT', 'ALERT_ADMINS', 'LOG_INCIDENT'],
    timeout: 0 // Immediate
  },
  [SECURITY_SEVERITY_LEVELS.HIGH]: {
    actions: ['ALERT_ADMINS', 'INCREASE_MONITORING', 'LOG_INCIDENT'],
    timeout: 300 // 5 minutes
  },
  [SECURITY_SEVERITY_LEVELS.MEDIUM]: {
    actions: ['LOG_INCIDENT', 'QUEUE_REVIEW'],
    timeout: 1800 // 30 minutes
  },
  [SECURITY_SEVERITY_LEVELS.LOW]: {
    actions: ['LOG_INCIDENT'],
    timeout: 3600 // 1 hour
  }
};

// Risk Score Calculations
export const RISK_SCORE_WEIGHTS = {
  [SECURITY_EVENT_TYPES.AUTH_FAILED_LOGIN]: 5,
  [SECURITY_EVENT_TYPES.PAYMENT_CARD_FRAUD]: 50,
  [SECURITY_EVENT_TYPES.KYC_DOCUMENT_FRAUD]: 30,
  [SECURITY_EVENT_TYPES.CHAT_SPAM_DETECTED]: 2,
  [SECURITY_EVENT_TYPES.ADMIN_PRIVILEGE_ESCALATION]: 100,
  [SECURITY_EVENT_TYPES.ESCROW_DISPUTE_FRAUD]: 40,
  [SECURITY_EVENT_TYPES.API_ABUSE]: 15
};

// Event Context Requirements
export const EVENT_CONTEXT_SCHEMA = {
  required: ['timestamp', 'userId', 'ipAddress', 'userAgent', 'eventType'],
  optional: ['sessionId', 'deviceId', 'location', 'additionalData'],
  
  // TradiChatter-specific context
  tradichatter: {
    chatId: 'string',      // For chat-related events
    businessId: 'string',  // For business-related events
    orderId: 'string',     // For payment/escrow events
    transactionId: 'string', // For financial events
    affiliateId: 'string'  // For affiliate-related events
  }
};