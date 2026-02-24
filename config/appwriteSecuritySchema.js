// Appwrite Security Database Schema
// Collections for storing TradiChatter security events

export const APPWRITE_SECURITY_COLLECTIONS = {
  // Main security events collection (immutable)
  SECURITY_EVENTS: {
    collectionId: 'security_events',
    name: 'Security Events',
    permissions: {
      read: ['role:admin', 'role:security'], // ONLY admin portal can read
      create: ['role:system'], // ONLY system services can create
      update: [], // IMMUTABLE - No updates allowed
      delete: [] // IMMUTABLE - No deletes allowed for audit trail
    },
    attributes: [
      {
        key: 'eventId',
        type: 'string',
        size: 50,
        required: true,
        array: false
      },
      {
        key: 'eventType',
        type: 'string',
        size: 100,
        required: true,
        array: false
      },
      {
        key: 'severity',
        type: 'enum',
        elements: ['critical', 'high', 'medium', 'low', 'info'],
        required: true,
        array: false
      },
      {
        key: 'timestamp',
        type: 'datetime',
        required: true,
        array: false
      },
      {
        key: 'userId',
        type: 'string',
        size: 50,
        required: false,
        array: false
      },
      {
        key: 'ipAddress',
        type: 'string',
        size: 45, // IPv6 support
        required: false,
        array: false
      },
      {
        key: 'userAgent',
        type: 'string',
        size: 500,
        required: false,
        array: false
      },
      {
        key: 'platform',
        type: 'enum',
        elements: ['mobile', 'admin', 'appwrite', 'rust', 'webhook'],
        required: true,
        array: false
      },
      {
        key: 'context',
        type: 'string', // JSON string for flexible context data
        size: 10000,
        required: false,
        array: false
      },
      {
        key: 'riskScore',
        type: 'integer',
        min: 0,
        max: 100,
        required: true,
        array: false
      },
      {
        key: 'processed',
        type: 'boolean',
        required: true,
        default: false,
        array: false
      },
      {
        key: 'responseAction',
        type: 'string',
        size: 200,
        required: false,
        array: false
      }
    ],
    indexes: [
      {
        key: 'eventType_timestamp',
        type: 'key',
        attributes: ['eventType', 'timestamp'],
        orders: ['ASC', 'DESC']
      },
      {
        key: 'severity_timestamp',
        type: 'key',
        attributes: ['severity', 'timestamp'],
        orders: ['ASC', 'DESC']
      },
      {
        key: 'userId_timestamp',
        type: 'key',
        attributes: ['userId', 'timestamp'],
        orders: ['ASC', 'DESC']
      },
      {
        key: 'platform_timestamp',
        type: 'key',
        attributes: ['platform', 'timestamp'],
        orders: ['ASC', 'DESC']
      }
    ]
  },

  // Security metrics aggregation (updated periodically)
  SECURITY_METRICS: {
    collectionId: 'security_metrics',
    name: 'Security Metrics',
    permissions: {
      read: ['role:admin', 'role:security'],
      create: ['role:system'],
      update: ['role:system'],
      delete: ['role:system']
    },
    attributes: [
      {
        key: 'metricDate',
        type: 'date',
        required: true,
        array: false
      },
      {
        key: 'eventType',
        type: 'string',
        size: 100,
        required: true,
        array: false
      },
      {
        key: 'count',
        type: 'integer',
        min: 0,
        required: true,
        array: false
      },
      {
        key: 'severity',
        type: 'enum',
        elements: ['critical', 'high', 'medium', 'low', 'info'],
        required: true,
        array: false
      },
      {
        key: 'platform',
        type: 'string',
        size: 50,
        required: true,
        array: false
      },
      {
        key: 'avgRiskScore',
        type: 'float',
        min: 0,
        max: 100,
        required: true,
        array: false
      }
    ],
    indexes: [
      {
        key: 'metricDate_eventType',
        type: 'key',
        attributes: ['metricDate', 'eventType'],
        orders: ['DESC', 'ASC']
      }
    ]
  },

  // Active security incidents (mutable for status updates)
  SECURITY_INCIDENTS: {
    collectionId: 'security_incidents',
    name: 'Security Incidents',
    permissions: {
      read: ['role:admin', 'role:security'],
      create: ['role:system', 'role:security'],
      update: ['role:admin', 'role:security'],
      delete: ['role:admin']
    },
    attributes: [
      {
        key: 'incidentId',
        type: 'string',
        size: 50,
        required: true,
        array: false
      },
      {
        key: 'title',
        type: 'string',
        size: 200,
        required: true,
        array: false
      },
      {
        key: 'description',
        type: 'string',
        size: 2000,
        required: true,
        array: false
      },
      {
        key: 'severity',
        type: 'enum',
        elements: ['critical', 'high', 'medium', 'low'],
        required: true,
        array: false
      },
      {
        key: 'status',
        type: 'enum',
        elements: ['open', 'investigating', 'resolved', 'closed'],
        required: true,
        default: 'open',
        array: false
      },
      {
        key: 'assignedTo',
        type: 'string',
        size: 50,
        required: false,
        array: false
      },
      {
        key: 'relatedEvents',
        type: 'string', // JSON array of event IDs
        size: 5000,
        required: false,
        array: false
      },
      {
        key: 'createdAt',
        type: 'datetime',
        required: true,
        array: false
      },
      {
        key: 'updatedAt',
        type: 'datetime',
        required: true,
        array: false
      },
      {
        key: 'resolvedAt',
        type: 'datetime',
        required: false,
        array: false
      }
    ]
  }
};

// Appwrite Security Service
export class AppwriteSecurityService {
  constructor(client, databases) {
    this.client = client;
    this.databases = databases;
    this.databaseId = 'tradichatter_security';
  }

  // Store security event (immutable)
  async storeSecurityEvent(event) {
    try {
      const document = {
        eventId: event.id,
        eventType: event.eventType,
        severity: event.severity,
        timestamp: event.timestamp,
        userId: event.context.userId,
        ipAddress: event.context.ipAddress,
        userAgent: event.context.userAgent,
        platform: event.context.platform,
        context: JSON.stringify(event.context),
        riskScore: this.calculateRiskScore(event),
        processed: false,
        responseAction: null
      };

      const result = await this.databases.createDocument(
        this.databaseId,
        APPWRITE_SECURITY_COLLECTIONS.SECURITY_EVENTS.collectionId,
        event.id,
        document
      );

      // Trigger automated response if critical
      if (event.severity === 'critical') {
        await this.triggerAutomatedResponse(event);
      }

      return result;
    } catch (error) {
      console.error('Failed to store security event:', error);
      throw error;
    }
  }

  // Get security events with filters
  async getSecurityEvents(filters = {}) {
    try {
      const queries = [];
      
      if (filters.eventType) {
        queries.push(`eventType=${filters.eventType}`);
      }
      if (filters.severity) {
        queries.push(`severity=${filters.severity}`);
      }
      if (filters.userId) {
        queries.push(`userId=${filters.userId}`);
      }
      if (filters.startDate) {
        queries.push(`timestamp>=${filters.startDate}`);
      }
      if (filters.endDate) {
        queries.push(`timestamp<=${filters.endDate}`);
      }

      const result = await this.databases.listDocuments(
        this.databaseId,
        APPWRITE_SECURITY_COLLECTIONS.SECURITY_EVENTS.collectionId,
        queries
      );

      return result.documents;
    } catch (error) {
      console.error('Failed to get security events:', error);
      throw error;
    }
  }

  // Update daily metrics (aggregation)
  async updateSecurityMetrics(date) {
    try {
      const events = await this.getSecurityEvents({
        startDate: `${date}T00:00:00.000Z`,
        endDate: `${date}T23:59:59.999Z`
      });

      const metrics = this.aggregateEvents(events, date);
      
      for (const metric of metrics) {
        await this.databases.createDocument(
          this.databaseId,
          APPWRITE_SECURITY_COLLECTIONS.SECURITY_METRICS.collectionId,
          `${date}_${metric.eventType}_${metric.platform}`,
          metric
        );
      }

      return metrics;
    } catch (error) {
      console.error('Failed to update security metrics:', error);
      throw error;
    }
  }

  // Create security incident
  async createSecurityIncident(eventIds, title, description, severity) {
    try {
      const incidentId = `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const incident = {
        incidentId,
        title,
        description,
        severity,
        status: 'open',
        relatedEvents: JSON.stringify(eventIds),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await this.databases.createDocument(
        this.databaseId,
        APPWRITE_SECURITY_COLLECTIONS.SECURITY_INCIDENTS.collectionId,
        incidentId,
        incident
      );

      return result;
    } catch (error) {
      console.error('Failed to create security incident:', error);
      throw error;
    }
  }

  calculateRiskScore(event) {
    const riskWeights = {
      'auth.session_hijack': 100,
      'payment.card_fraud': 90,
      'admin.privilege_escalation': 100,
      'kyc.document_fraud': 70,
      'payment.suspicious_amount': 60,
      'auth.failed_login': 20,
      'chat.spam_detected': 5
    };

    return riskWeights[event.eventType] || 10;
  }

  async triggerAutomatedResponse(event) {
    // Trigger immediate response for critical events
    console.log(`CRITICAL SECURITY EVENT: ${event.eventType}`, event);
    
    // Would trigger:
    // - Account lockdown
    // - Admin notifications
    // - Incident creation
    // - Emergency protocols
  }

  aggregateEvents(events, date) {
    const aggregated = {};
    
    events.forEach(event => {
      const key = `${event.eventType}_${event.platform}_${event.severity}`;
      
      if (!aggregated[key]) {
        aggregated[key] = {
          metricDate: date,
          eventType: event.eventType,
          platform: event.platform,
          severity: event.severity,
          count: 0,
          totalRiskScore: 0
        };
      }
      
      aggregated[key].count++;
      aggregated[key].totalRiskScore += event.riskScore;
    });

    return Object.values(aggregated).map(metric => ({
      ...metric,
      avgRiskScore: metric.totalRiskScore / metric.count
    }));
  }
}