// TradiChatter Secure Communication Paths
// Defines allowed and forbidden communication between platform components

export const COMMUNICATION_PATHS = {
  // ALLOWED PATHS
  ALLOWED: {
    // Mobile/Web Apps → Backend Services (User Operations)
    'mobile_app → appwrite_backend': {
      purpose: 'User authentication, chat, payments, orders',
      protocols: ['HTTPS', 'WebSocket'],
      authentication: 'JWT + OTP',
      dataFlow: 'bidirectional',
      restrictions: [
        'No admin API access',
        'No direct database access',
        'Rate limited per user'
      ]
    },

    'web_app → appwrite_backend': {
      purpose: 'Business management, customer portal',
      protocols: ['HTTPS'],
      authentication: 'JWT + OTP',
      dataFlow: 'bidirectional',
      restrictions: [
        'No admin API access',
        'Business scope only',
        'Rate limited per business'
      ]
    },

    // Backend Services → Security Event Stream (Internal)
    'appwrite_backend → security_gateway': {
      purpose: 'Security event emission',
      protocols: ['Internal API'],
      authentication: 'Service Token',
      dataFlow: 'unidirectional (write-only)',
      restrictions: [
        'Event creation only',
        'No event modification',
        'Structured event format required'
      ]
    },

    'rust_backend → security_gateway': {
      purpose: 'Real-time security monitoring',
      protocols: ['Internal API'],
      authentication: 'Service Token',
      dataFlow: 'unidirectional (write-only)',
      restrictions: [
        'Event creation only',
        'No historical data access'
      ]
    },

    // Security Gateway → Admin Metrics Stream (Read-Only)
    'security_gateway → admin_metrics_stream': {
      purpose: 'Aggregated security metrics for admin dashboard',
      protocols: ['Internal Stream'],
      authentication: 'Service Token',
      dataFlow: 'unidirectional (read-only)',
      restrictions: [
        'Aggregated data only',
        'No raw user data',
        'PII masked automatically'
      ]
    },

    // Admin Portal → Admin Action Gateway (Privileged)
    'admin_portal → admin_action_gateway': {
      purpose: 'Administrative actions and queries',
      protocols: ['HTTPS'],
      authentication: 'Admin JWT + MFA + Session Token',
      dataFlow: 'bidirectional',
      restrictions: [
        'Role-based access control',
        'All actions logged',
        'Time-bound sessions',
        'Dual approval for critical actions'
      ]
    },

    // Admin Action Gateway → Backend Services (Controlled)
    'admin_action_gateway → appwrite_backend': {
      purpose: 'Execute approved admin actions',
      protocols: ['Internal API'],
      authentication: 'Privileged Service Token',
      dataFlow: 'unidirectional (command-only)',
      restrictions: [
        'Pre-approved actions only',
        'Audit trail required',
        'Reversible actions preferred'
      ]
    }
  },

  // EXPLICITLY FORBIDDEN PATHS
  FORBIDDEN: {
    'mobile_app → admin_portal': {
      reason: 'Security isolation violation',
      risk: 'CRITICAL',
      enforcement: 'Network firewall + API gateway block'
    },

    'web_app → admin_portal': {
      reason: 'Security isolation violation', 
      risk: 'CRITICAL',
      enforcement: 'Network firewall + API gateway block'
    },

    'mobile_app → admin_action_gateway': {
      reason: 'Privilege escalation risk',
      risk: 'CRITICAL',
      enforcement: 'Authentication rejection'
    },

    'web_app → admin_action_gateway': {
      reason: 'Privilege escalation risk',
      risk: 'CRITICAL', 
      enforcement: 'Authentication rejection'
    },

    'admin_portal → appwrite_backend': {
      reason: 'Direct database access bypasses audit',
      risk: 'HIGH',
      enforcement: 'API gateway block + authentication rejection'
    },

    'admin_portal → rust_backend': {
      reason: 'Direct service access bypasses controls',
      risk: 'HIGH',
      enforcement: 'Network isolation + service authentication'
    },

    'mobile_app → security_gateway': {
      reason: 'Security event tampering risk',
      risk: 'HIGH',
      enforcement: 'Service token validation'
    },

    'web_app → security_gateway': {
      reason: 'Security event tampering risk',
      risk: 'HIGH',
      enforcement: 'Service token validation'
    }
  }
};

// Network Architecture Diagram (Text-based)
export const NETWORK_ARCHITECTURE = `
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           TradiChatter Secure Architecture                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐    ┌─────────────┐                                            │
│  │ Mobile App  │    │  Web App    │                                            │
│  │ (Customer)  │    │ (Business)  │                                            │
│  └──────┬──────┘    └──────┬──────┘                                            │
│         │                  │                                                   │
│         │ HTTPS/WSS        │ HTTPS                                             │
│         │ JWT + OTP        │ JWT + OTP                                         │
│         │                  │                                                   │
│         ▼                  ▼                                                   │
│  ┌─────────────────────────────────────────┐                                  │
│  │         API Gateway                     │                                  │
│  │    (Rate Limiting + Auth)               │                                  │
│  └─────────────────┬───────────────────────┘                                  │
│                    │                                                          │
│                    ▼                                                          │
│  ┌─────────────────────────────────────────┐                                  │
│  │       Appwrite Backend                  │                                  │
│  │   (Auth, Database, Real-time)           │                                  │
│  └─────────────────┬───────────────────────┘                                  │
│                    │                                                          │
│                    │ Service Token                                            │
│                    ▼                                                          │
│  ┌─────────────────────────────────────────┐                                  │
│  │      Security Event Gateway             │                                  │
│  │    (Event Collection + Validation)      │◄─────────────────────────────────┤
│  └─────────────────┬───────────────────────┘                                  │
│                    │                                                          │
│                    │ Internal Stream                                          │
│                    ▼                                                          │
│  ┌─────────────────────────────────────────┐                                  │
│  │     Admin Metrics Stream                │                                  │
│  │   (Aggregated, PII-Masked Data)         │                                  │
│  └─────────────────┬───────────────────────┘                                  │
│                    │                                                          │
│                    │ Read-Only Stream                                         │
│                    ▼                                                          │
│  ┌─────────────────────────────────────────┐    ┌─────────────────────────────┐│
│  │      Admin Action Gateway               │◄───┤      Admin Portal          ││
│  │  (Privileged Actions + Audit)           │    │  (Security Dashboard)      ││
│  └─────────────────┬───────────────────────┘    └─────────────────────────────┘│
│                    │                                         ▲                │
│                    │ Privileged Service Token                │                │
│                    ▼                                         │                │
│  ┌─────────────────────────────────────────┐                │                │
│  │       Backend Control APIs              │                │                │
│  │   (User Management, Suspensions)        │                │                │
│  └─────────────────────────────────────────┘                │                │
│                                                              │                │
│  ┌─────────────────────────────────────────┐                │                │
│  │         Rust Backend                    │                │                │
│  │  (Chat Monitoring, Escrow Logic)        │────────────────┘                │
│  └─────────────────────────────────────────┘                                 │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                              ISOLATION BOUNDARIES                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🚫 FORBIDDEN PATHS:                                                          │
│     Mobile/Web Apps ──X──> Admin Portal                                      │
│     Mobile/Web Apps ──X──> Admin Action Gateway                              │
│     Admin Portal ──X──> Appwrite Backend (Direct)                            │
│     Admin Portal ──X──> Rust Backend (Direct)                                │
│                                                                               │
│  ✅ SECURITY CONTROLS:                                                        │
│     • Network Firewalls                                                      │
│     • API Gateway Authentication                                             │
│     • Service Token Validation                                               │
│     • Role-Based Access Control                                              │
│     • Audit Logging (All Admin Actions)                                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
`;

// Data Flow Security Rules
export const DATA_FLOW_RULES = {
  // User Data Flow (Mobile/Web → Backend)
  USER_DATA_FLOW: {
    source: ['mobile_app', 'web_app'],
    destination: 'appwrite_backend',
    dataTypes: ['user_profile', 'chat_messages', 'orders', 'payments'],
    security: {
      encryption: 'TLS 1.3',
      authentication: 'JWT + OTP verification',
      authorization: 'User scope only',
      rateLimit: '1000 requests/hour/user'
    },
    restrictions: [
      'Users can only access their own data',
      'Businesses can only access their customer data',
      'No cross-user data access',
      'No admin data visibility'
    ]
  },

  // Security Event Flow (Backend → Security Gateway)
  SECURITY_EVENT_FLOW: {
    source: ['appwrite_backend', 'rust_backend'],
    destination: 'security_gateway',
    dataTypes: ['security_events', 'audit_logs', 'threat_indicators'],
    security: {
      encryption: 'Internal TLS',
      authentication: 'Service tokens',
      authorization: 'Write-only access',
      rateLimit: 'Unlimited (internal)'
    },
    restrictions: [
      'Event creation only',
      'No event modification',
      'Structured format required',
      'Automatic PII masking'
    ]
  },

  // Admin Metrics Flow (Security Gateway → Admin Portal)
  ADMIN_METRICS_FLOW: {
    source: 'security_gateway',
    destination: 'admin_portal',
    dataTypes: ['aggregated_metrics', 'security_scores', 'alert_summaries'],
    security: {
      encryption: 'TLS 1.3',
      authentication: 'Admin JWT + MFA',
      authorization: 'Role-based access',
      rateLimit: '100 requests/minute/admin'
    },
    restrictions: [
      'Aggregated data only',
      'No raw user data',
      'PII automatically masked',
      'Time-bound access tokens'
    ]
  },

  // Admin Action Flow (Admin Portal → Backend)
  ADMIN_ACTION_FLOW: {
    source: 'admin_portal',
    destination: ['appwrite_backend', 'rust_backend'],
    dataTypes: ['admin_commands', 'user_suspensions', 'configuration_changes'],
    security: {
      encryption: 'TLS 1.3 + Message Signing',
      authentication: 'Admin JWT + MFA + Session Token',
      authorization: 'Privileged role verification',
      rateLimit: '10 actions/minute/admin'
    },
    restrictions: [
      'Pre-approved actions only',
      'Dual approval for critical actions',
      'Complete audit trail',
      'Reversible actions preferred',
      'Time-bound admin sessions'
    ]
  }
};

// Security Boundary Enforcement
export const BOUNDARY_ENFORCEMENT = {
  NETWORK_LEVEL: {
    firewalls: [
      'Block mobile/web apps from admin network segments',
      'Isolate admin portal in separate VPC/subnet',
      'Restrict admin action gateway to admin network only'
    ],
    loadBalancers: [
      'Separate load balancers for user-facing and admin services',
      'Admin load balancer requires VPN/private network access'
    ]
  },

  APPLICATION_LEVEL: {
    apiGateway: [
      'Reject admin API calls from user authentication tokens',
      'Validate service tokens for internal communications',
      'Rate limit all endpoints by source type'
    ],
    authentication: [
      'Separate JWT issuers for users vs admins',
      'Admin tokens require MFA verification',
      'Service tokens rotated automatically'
    ]
  },

  DATA_LEVEL: {
    encryption: [
      'Different encryption keys for user vs admin data',
      'Admin actions signed with admin-specific keys',
      'Service communications use mutual TLS'
    ],
    access: [
      'Admin portal cannot query user databases directly',
      'All admin data access through controlled APIs',
      'Automatic PII masking in admin views'
    ]
  }
};