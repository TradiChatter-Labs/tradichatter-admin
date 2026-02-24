// TradiChatter Gateway Architecture & Communication Flows
// Defines how SEG and AAG communicate securely with platform components

export const GATEWAY_ARCHITECTURE = `
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    TradiChatter Security Gateway Architecture                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐    ┌─────────────┐                                            │
│  │ Mobile App  │    │  Web App    │                                            │
│  │ (Customers) │    │ (Business)  │                                            │
│  └──────┬──────┘    └──────┬──────┘                                            │
│         │                  │                                                   │
│         │ HTTPS + JWT      │ HTTPS + JWT                                       │
│         │ (NO GATEWAY      │ (NO GATEWAY                                       │
│         │  ACCESS)         │  ACCESS)                                          │
│         ▼                  ▼                                                   │
│  ┌─────────────────────────────────────────┐                                  │
│  │         Appwrite Backend                │                                  │
│  │      (User Operations Only)             │                                  │
│  └─────────────────┬───────────────────────┘                                  │
│                    │                                                          │
│                    │ Service Token                                            │
│                    │ (Write-Only)                                             │
│                    ▼                                                          │
│  ┌─────────────────────────────────────────┐                                  │
│  │    Security Event Gateway (SEG)         │                                  │
│  │  ┌─────────────────────────────────────┐ │                                  │
│  │  │ • Event Validation                  │ │                                  │
│  │  │ • Rate Limiting                     │ │                                  │
│  │  │ • PII Masking                       │ │                                  │
│  │  │ • Immutable Storage                 │ │                                  │
│  │  │ • Aggregation Buffer                │ │                                  │
│  │  │ • Immediate Alerts                  │ │                                  │
│  │  └─────────────────────────────────────┘ │                                  │
│  └─────────────────┬───────────────────────┘                                  │
│                    │                                                          │
│                    │ Aggregated Stream                                        │
│                    │ (PII Masked)                                             │
│                    ▼                                                          │
│  ┌─────────────────────────────────────────┐                                  │
│  │      Admin Metrics Dashboard            │                                  │
│  │    (Read-Only Aggregated Data)          │                                  │
│  └─────────────────┬───────────────────────┘                                  │
│                    ▲                                                          │
│                    │ HTTPS + Admin JWT + MFA                                  │
│                    │                                                          │
│  ┌─────────────────────────────────────────┐                                  │
│  │         Admin Portal                    │                                  │
│  │  ┌─────────────────────────────────────┐ │                                  │
│  │  │ • Role-Based UI                     │ │                                  │
│  │  │ • MFA Required                      │ │                                  │
│  │  │ • Session Timeout                   │ │                                  │
│  │  │ • Audit Trail View                  │ │                                  │
│  │  └─────────────────────────────────────┘ │                                  │
│  └─────────────────┬───────────────────────┘                                  │
│                    │                                                          │
│                    │ HTTPS + Admin JWT + MFA                                  │
│                    │ (Privileged Actions)                                     │
│                    ▼                                                          │
│  ┌─────────────────────────────────────────┐                                  │
│  │    Admin Action Gateway (AAG)           │                                  │
│  │  ┌─────────────────────────────────────┐ │                                  │
│  │  │ • Admin Authentication              │ │                                  │
│  │  │ • Role-Based Authorization          │ │                                  │
│  │  │ • Dual Approval Workflow            │ │                                  │
│  │  │ • Rate Limiting                     │ │                                  │
│  │  │ • Immutable Audit Logging           │ │                                  │
│  │  │ • Safe Response Filtering           │ │                                  │
│  │  └─────────────────────────────────────┘ │                                  │
│  └─────────────────┬───────────────────────┘                                  │
│                    │                                                          │
│                    │ Privileged Service Token                                 │
│                    │ (Controlled Commands)                                    │
│                    ▼                                                          │
│  ┌─────────────────────────────────────────┐                                  │
│  │       Backend Control APIs              │                                  │
│  │   (User Suspension, KYC, Escrow)        │                                  │
│  └─────────────────────────────────────────┘                                  │
│                                                                               │
│  ┌─────────────────────────────────────────┐                                  │
│  │         Rust Backend                    │────────────────┐                 │
│  │  (Chat Monitoring, Escrow Logic)        │                │                 │
│  └─────────────────────────────────────────┘                │                 │
│                    ▲                                        │                 │
│                    │ Service Token                          │                 │
│                    │ (Write-Only Events)                    │                 │
│                    └────────────────────────────────────────┘                 │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                              SECURITY CONTROLS                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🔒 AUTHENTICATION:                                                           │
│     • Mobile/Web: JWT + OTP (User scope only)                                │
│     • Backend Services: Service Tokens (Write-only to SEG)                   │
│     • Admin Portal: JWT + MFA + Session Tokens                               │
│     • Gateways: mTLS + Signed Requests                                       │
│                                                                               │
│  🛡️ AUTHORIZATION:                                                            │
│     • SEG: Service token validation only                                     │
│     • AAG: Role-based permissions + dual approval                            │
│     • Admin Portal: Role-based UI + session management                       │
│                                                                               │
│  📊 DATA PROTECTION:                                                          │
│     • SEG: Automatic PII masking + aggregation                               │
│     • AAG: Safe response filtering + audit logging                           │
│     • All communications: TLS 1.3 encryption                                 │
│                                                                               │
│  ⚡ RATE LIMITING:                                                            │
│     • SEG: Event type based (1000/min spam, 1/min critical)                  │
│     • AAG: Admin role based (20/hour super, 50/hour security)                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
`;

// Example Event Flow: Backend → SEG → Admin Metrics
export const EXAMPLE_EVENT_FLOW = {
  // Step 1: Backend Service Emits Event
  backendEvent: {
    method: 'POST',
    url: 'https://seg.tradichatter.com/events',
    headers: {
      'Authorization': 'Bearer appwrite_service_token_xyz',
      'Content-Type': 'application/json'
    },
    body: {
      eventType: 'customer.otp_failed',
      severity: 'medium',
      timestamp: '2024-01-20T10:30:00Z',
      context: {
        userId: 'user_12345',
        ipAddress: '192.168.1.100',
        userAgent: 'TradiChatter-Mobile/1.0',
        attemptCount: 3,
        additionalData: {
          deviceId: 'device_abc123',
          location: 'Lagos, Nigeria'
        }
      }
    }
  },

  // Step 2: SEG Processes and Masks Event
  segProcessing: {
    validation: 'PASSED',
    rateLimit: 'ALLOWED',
    maskedEvent: {
      eventType: 'customer.otp_failed',
      severity: 'medium',
      timestamp: '2024-01-20T10:30:00Z',
      context: {
        userId: 'user****', // Masked
        ipAddress: '192.168.***.***', // Masked
        userAgent: 'TradiChatter-Mobile/1.0',
        attemptCount: 3,
        additionalData: {
          deviceId: 'devi****', // Masked
          location: 'Lagos, Nigeria'
        }
      },
      id: 'seg_1705747800000_a1b2c3d4',
      gatewayTimestamp: '2024-01-20T10:30:01Z',
      sourceService: 'appwrite_backend',
      signature: 'sha256_signature_hash'
    }
  },

  // Step 3: SEG Streams to Admin Metrics
  adminMetricsStream: {
    type: 'AGGREGATED_METRICS',
    timestamp: '2024-01-20T10:35:00Z',
    metrics: [
      {
        eventType: 'customer.otp_failed',
        date: '2024-01-20',
        count: 15,
        avgRiskScore: 25,
        severityBreakdown: {
          critical: 0,
          high: 2,
          medium: 10,
          low: 3,
          info: 0
        }
      }
    ]
  }
};

// Example Admin Action Flow: Admin Portal → AAG → Backend
export const EXAMPLE_ADMIN_ACTION_FLOW = {
  // Step 1: Admin Portal Sends Action Request
  adminRequest: {
    method: 'POST',
    url: 'https://aag.tradichatter.com/actions',
    headers: {
      'Authorization': 'Bearer admin_jwt_token_xyz',
      'X-MFA-Token': 'mfa_token_123',
      'Content-Type': 'application/json'
    },
    body: {
      actionType: 'user.suspend',
      targetType: 'user',
      targetId: 'user_12345',
      reason: 'Multiple OTP failures indicating potential compromise',
      metadata: {
        duration: '24h',
        notifyUser: true
      }
    }
  },

  // Step 2: AAG Validates and Processes
  aagProcessing: {
    adminValidation: 'PASSED',
    roleCheck: 'SECURITY_ADMIN - AUTHORIZED',
    permissionCheck: 'user.suspend - ALLOWED',
    rateLimit: 'WITHIN_LIMITS',
    dualApproval: 'NOT_REQUIRED',
    auditLog: {
      id: 'aag_1705747900000_x1y2z3w4',
      adminId: 'admin_789',
      adminRole: 'security_admin',
      actionType: 'user.suspend',
      targetType: 'user',
      targetId: 'user****', // Masked in log
      status: 'EXECUTING',
      timestamp: '2024-01-20T10:31:00Z'
    }
  },

  // Step 3: AAG Executes Action via Backend
  backendExecution: {
    method: 'POST',
    url: 'https://backend.tradichatter.com/admin/users/suspend',
    headers: {
      'Authorization': 'Bearer privileged_service_token',
      'X-Admin-Action-Id': 'aag_1705747900000_x1y2z3w4'
    },
    body: {
      userId: 'user_12345',
      reason: 'Multiple OTP failures indicating potential compromise',
      duration: '24h',
      executedBy: 'admin_789'
    }
  },

  // Step 4: AAG Returns Safe Response
  adminResponse: {
    success: true,
    actionType: 'user.suspend',
    status: 'COMPLETED',
    timestamp: '2024-01-20T10:31:02Z',
    reversible: true,
    // Note: No raw user data returned
    actionId: 'aag_1705747900000_x1y2z3w4'
  }
};

// API Boundary Definitions
export const API_BOUNDARIES = {
  // Security Event Gateway (SEG) - Write-Only
  SEG_API: {
    baseUrl: 'https://seg.tradichatter.com',
    authentication: 'Service Tokens Only',
    endpoints: {
      'POST /events': {
        purpose: 'Ingest security events from backend services',
        allowedSources: ['appwrite_backend', 'rust_backend'],
        rateLimit: 'Event-type dependent',
        response: 'Event ID only'
      },
      'GET /health': {
        purpose: 'Gateway health check',
        allowedSources: ['monitoring_service'],
        rateLimit: '10/minute',
        response: 'Health status'
      }
    },
    forbidden: [
      'Event reading/querying',
      'Event modification',
      'Direct admin access',
      'User app access'
    ]
  },

  // Admin Action Gateway (AAG) - Privileged Actions
  AAG_API: {
    baseUrl: 'https://aag.tradichatter.com',
    authentication: 'Admin JWT + MFA + Session',
    endpoints: {
      'POST /actions': {
        purpose: 'Execute privileged admin actions',
        allowedSources: ['admin_portal'],
        rateLimit: 'Role-based (10-50/hour)',
        response: 'Safe action result (no PII)'
      },
      'GET /approvals': {
        purpose: 'List pending dual approvals',
        allowedSources: ['admin_portal'],
        rateLimit: '100/hour',
        response: 'Approval list (masked data)'
      },
      'POST /approvals/{id}/approve': {
        purpose: 'Approve pending action',
        allowedSources: ['admin_portal'],
        rateLimit: '20/hour',
        response: 'Approval status'
      }
    },
    forbidden: [
      'Direct backend access',
      'User app access',
      'Unauthenticated access',
      'Raw user data exposure'
    ]
  }
};