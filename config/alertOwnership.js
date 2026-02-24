// TradiChatter Alert Ownership and Automation Rules
// Defines which alerts are informational, manual review, or auto-enforced

export const ALERT_CATEGORIES = {
  INFORMATIONAL: 'informational',    // Dashboard display only
  MANUAL_REVIEW: 'manual_review',    // Queue for human review
  AUTO_ENFORCED: 'auto_enforced'     // Immediate automated action
};

export const ADMIN_ROLES = {
  SECURITY_ADMIN: 'security_admin',       // Security team lead
  PLATFORM_ADMIN: 'platform_admin',      // Platform operations
  COMPLIANCE_ADMIN: 'compliance_admin',   // KYC/compliance officer
  SUPER_ADMIN: 'super_admin'             // Full system access
};

// Alert ownership mapping by event type
export const ALERT_OWNERSHIP = {
  // CUSTOMER EVENTS
  [SECURITY_EVENT_TYPES.CUSTOMER_OTP_FAILED]: {
    category: ALERT_CATEGORIES.INFORMATIONAL,
    threshold: 5, // Alert after 5 failures
    owners: [ADMIN_ROLES.SECURITY_ADMIN],
    autoAction: 'RATE_LIMIT',
    description: 'Customer OTP failure pattern detected'
  },
  
  [SECURITY_EVENT_TYPES.CUSTOMER_ACCOUNT_TAKEOVER]: {
    category: ALERT_CATEGORIES.AUTO_ENFORCED,
    threshold: 1, // Immediate
    owners: [ADMIN_ROLES.SECURITY_ADMIN, ADMIN_ROLES.SUPER_ADMIN],
    autoAction: 'SUSPEND_ACCOUNT',
    description: 'Customer account takeover detected - immediate suspension'
  },

  // BUSINESS EVENTS
  [SECURITY_EVENT_TYPES.BUSINESS_KYC_VIOLATION]: {
    category: ALERT_CATEGORIES.MANUAL_REVIEW,
    threshold: 1,
    owners: [ADMIN_ROLES.COMPLIANCE_ADMIN, ADMIN_ROLES.SECURITY_ADMIN],
    autoAction: 'FLAG_FOR_REVIEW',
    description: 'Business KYC violation requires compliance review'
  },

  [SECURITY_EVENT_TYPES.BUSINESS_IMPERSONATION]: {
    category: ALERT_CATEGORIES.AUTO_ENFORCED,
    threshold: 1,
    owners: [ADMIN_ROLES.SECURITY_ADMIN, ADMIN_ROLES.COMPLIANCE_ADMIN],
    autoAction: 'SUSPEND_BUSINESS',
    description: 'Business impersonation - immediate suspension'
  },

  // AFFILIATE EVENTS
  [SECURITY_EVENT_TYPES.AFFILIATE_COMMISSION_FRAUD]: {
    category: ALERT_CATEGORIES.MANUAL_REVIEW,
    threshold: 1,
    owners: [ADMIN_ROLES.PLATFORM_ADMIN, ADMIN_ROLES.SECURITY_ADMIN],
    autoAction: 'FREEZE_COMMISSIONS',
    description: 'Affiliate commission fraud requires manual investigation'
  },

  // ADMIN EVENTS (HIGHEST PRIORITY)
  [SECURITY_EVENT_TYPES.ADMIN_PRIVILEGE_ESCALATION]: {
    category: ALERT_CATEGORIES.AUTO_ENFORCED,
    threshold: 1, // ZERO TOLERANCE
    owners: [ADMIN_ROLES.SUPER_ADMIN], // Only super admin
    autoAction: 'EMERGENCY_LOCKDOWN',
    description: 'CRITICAL: Admin privilege escalation - emergency lockdown'
  },

  [SECURITY_EVENT_TYPES.ADMIN_UNAUTHORIZED_ACCESS]: {
    category: ALERT_CATEGORIES.AUTO_ENFORCED,
    threshold: 1,
    owners: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.SECURITY_ADMIN],
    autoAction: 'SUSPEND_ADMIN',
    description: 'Admin unauthorized access - immediate suspension'
  },

  [SECURITY_EVENT_TYPES.ADMIN_OTP_FAILED]: {
    category: ALERT_CATEGORIES.MANUAL_REVIEW,
    threshold: 3, // Lower threshold for admins
    owners: [ADMIN_ROLES.SUPER_ADMIN],
    autoAction: 'LOCK_ADMIN_ACCOUNT',
    description: 'Admin OTP failures - potential compromise'
  },

  // PAYMENT EVENTS
  [SECURITY_EVENT_TYPES.PAYMENT_CARD_FRAUD]: {
    category: ALERT_CATEGORIES.AUTO_ENFORCED,
    threshold: 1,
    owners: [ADMIN_ROLES.SECURITY_ADMIN, ADMIN_ROLES.PLATFORM_ADMIN],
    autoAction: 'SUSPEND_PAYMENT_PROCESSING',
    description: 'Payment fraud detected - suspend processing'
  },

  [SECURITY_EVENT_TYPES.ESCROW_DISPUTE_FRAUD]: {
    category: ALERT_CATEGORIES.MANUAL_REVIEW,
    threshold: 1,
    owners: [ADMIN_ROLES.PLATFORM_ADMIN, ADMIN_ROLES.COMPLIANCE_ADMIN],
    autoAction: 'FREEZE_ESCROW',
    description: 'Escrow dispute fraud - freeze funds for review'
  },

  // PLATFORM EVENTS
  [SECURITY_EVENT_TYPES.SYSTEM_BREACH_ATTEMPT]: {
    category: ALERT_CATEGORIES.AUTO_ENFORCED,
    threshold: 1,
    owners: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.SECURITY_ADMIN],
    autoAction: 'PLATFORM_LOCKDOWN',
    description: 'CRITICAL: System breach attempt - platform lockdown'
  },

  // CHAT EVENTS
  [SECURITY_EVENT_TYPES.CHAT_SPAM_DETECTED]: {
    category: ALERT_CATEGORIES.INFORMATIONAL,
    threshold: 10, // Batch reporting
    owners: [ADMIN_ROLES.PLATFORM_ADMIN],
    autoAction: 'RATE_LIMIT_CHAT',
    description: 'Chat spam pattern detected'
  }
};

// Automated action definitions
export const AUTOMATED_ACTIONS = {
  // Account Actions
  SUSPEND_ACCOUNT: {
    description: 'Suspend user account immediately',
    reversible: true,
    requiresApproval: false,
    cooldown: 0
  },
  
  SUSPEND_BUSINESS: {
    description: 'Suspend business account and hide listings',
    reversible: true,
    requiresApproval: false,
    cooldown: 0
  },
  
  SUSPEND_ADMIN: {
    description: 'Suspend admin account and revoke access',
    reversible: true,
    requiresApproval: true, // Requires super admin approval
    cooldown: 0
  },

  // Rate Limiting Actions
  RATE_LIMIT: {
    description: 'Apply rate limiting to user actions',
    reversible: true,
    requiresApproval: false,
    cooldown: 300 // 5 minutes
  },

  RATE_LIMIT_CHAT: {
    description: 'Limit chat message frequency',
    reversible: true,
    requiresApproval: false,
    cooldown: 600 // 10 minutes
  },

  // Financial Actions
  FREEZE_COMMISSIONS: {
    description: 'Freeze affiliate commission payouts',
    reversible: true,
    requiresApproval: true,
    cooldown: 0
  },

  FREEZE_ESCROW: {
    description: 'Freeze escrow funds pending review',
    reversible: true,
    requiresApproval: true,
    cooldown: 0
  },

  SUSPEND_PAYMENT_PROCESSING: {
    description: 'Suspend payment processing for user',
    reversible: true,
    requiresApproval: false,
    cooldown: 0
  },

  // System Actions
  EMERGENCY_LOCKDOWN: {
    description: 'Emergency system lockdown - all operations suspended',
    reversible: true,
    requiresApproval: true, // Requires super admin
    cooldown: 0
  },

  PLATFORM_LOCKDOWN: {
    description: 'Platform-wide security lockdown',
    reversible: true,
    requiresApproval: true,
    cooldown: 0
  },

  // Review Actions
  FLAG_FOR_REVIEW: {
    description: 'Flag account for manual review',
    reversible: true,
    requiresApproval: false,
    cooldown: 3600 // 1 hour
  }
};

// Alert notification channels by admin role
export const NOTIFICATION_CHANNELS = {
  [ADMIN_ROLES.SUPER_ADMIN]: {
    email: true,
    sms: true,
    push: true,
    slack: true,
    priority: 'immediate'
  },
  
  [ADMIN_ROLES.SECURITY_ADMIN]: {
    email: true,
    sms: true,
    push: true,
    slack: true,
    priority: 'high'
  },
  
  [ADMIN_ROLES.PLATFORM_ADMIN]: {
    email: true,
    push: true,
    slack: true,
    priority: 'medium'
  },
  
  [ADMIN_ROLES.COMPLIANCE_ADMIN]: {
    email: true,
    push: true,
    priority: 'medium'
  }
};

// Alert escalation rules
export const ESCALATION_RULES = {
  // If no response within timeframe, escalate
  CRITICAL: {
    initialResponse: 300, // 5 minutes
    escalateTo: ADMIN_ROLES.SUPER_ADMIN,
    maxEscalations: 2
  },
  
  HIGH: {
    initialResponse: 900, // 15 minutes
    escalateTo: ADMIN_ROLES.SECURITY_ADMIN,
    maxEscalations: 1
  },
  
  MEDIUM: {
    initialResponse: 3600, // 1 hour
    escalateTo: ADMIN_ROLES.PLATFORM_ADMIN,
    maxEscalations: 1
  }
};