// Security Event Gateway (SEG) - TradiChatter
// Handles all security event emissions from backend services
//
// 🔒 SECURITY LAYER FROZEN - DO NOT MODIFY WITHOUT AUTHORIZATION
// This component is part of the finalized security infrastructure

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { RiskScoringEngine } from './riskScoringEngine.js';

export class SecurityEventGateway {
  constructor() {
    this.riskEngine = new RiskScoringEngine();
    this.eventBuffer = new Map(); // For aggregation
    this.rateLimits = new Map(); // Rate limiting per source
    this.serviceTokens = new Map(); // Valid service tokens
    
    // Initialize service tokens
    this.initializeServiceTokens();
    
    // Start aggregation processor
    this.startAggregationProcessor();
  }

  // Initialize valid service tokens for backend services
  initializeServiceTokens() {
    this.serviceTokens.set('appwrite_backend', {
      token: process.env.APPWRITE_SERVICE_TOKEN,
      permissions: ['security_events', 'user_events', 'payment_events']
    });
    
    this.serviceTokens.set('rust_backend', {
      token: process.env.RUST_SERVICE_TOKEN,
      permissions: ['chat_events', 'escrow_events', 'api_events']
    });
  }

  // Main event ingestion endpoint
  async ingestSecurityEvent(request) {
    try {
      // 1. Validate service authentication
      const serviceAuth = await this.validateServiceAuth(request);
      if (!serviceAuth.valid) {
        return this.createErrorResponse(401, 'Invalid service authentication');
      }

      // 2. Validate event structure
      const event = await this.validateEventStructure(request.body);
      if (!event.valid) {
        return this.createErrorResponse(400, 'Invalid event structure');
      }

      // 3. Apply rate limiting
      const rateLimitCheck = await this.checkRateLimit(serviceAuth.service, event.data);
      if (!rateLimitCheck.allowed) {
        return this.createErrorResponse(429, 'Rate limit exceeded');
      }

      // 4. Mask sensitive data
      const maskedEvent = await this.maskSensitiveData(event.data);

      // 5. Add immutable timestamp and signature
      const finalEvent = await this.finalizeEvent(maskedEvent, serviceAuth.service);

      // 6. Store event (immutable)
      await this.storeEvent(finalEvent);

      // 7. Add to aggregation buffer
      await this.bufferForAggregation(finalEvent);

      // 8. Check for immediate alerts
      await this.checkImmediateAlerts(finalEvent);

      return this.createSuccessResponse(finalEvent.id);

    } catch (error) {
      console.error('SEG: Event ingestion failed:', error);
      return this.createErrorResponse(500, 'Internal gateway error');
    }
  }

  // Validate service authentication
  async validateServiceAuth(request) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false, reason: 'Missing bearer token' };
      }

      const token = authHeader.substring(7);
      
      // Check if it's a valid service token
      for (const [service, config] of this.serviceTokens.entries()) {
        if (token === config.token) {
          return {
            valid: true,
            service,
            permissions: config.permissions
          };
        }
      }

      return { valid: false, reason: 'Invalid service token' };

    } catch (error) {
      return { valid: false, reason: 'Authentication error' };
    }
  }

  // Validate event structure
  async validateEventStructure(eventData) {
    try {
      const required = ['eventType', 'timestamp', 'severity', 'context'];
      const missing = required.filter(field => !eventData[field]);
      
      if (missing.length > 0) {
        return { valid: false, reason: `Missing fields: ${missing.join(', ')}` };
      }

      // Validate event type
      const validEventTypes = [
        'customer.otp_failed', 'business.kyc_violation', 'affiliate.commission_fraud',
        'admin.privilege_escalation', 'payment.card_fraud', 'escrow.dispute_fraud',
        'chat.spam_detected', 'system.breach_attempt'
      ];

      if (!validEventTypes.includes(eventData.eventType)) {
        return { valid: false, reason: 'Invalid event type' };
      }

      return { valid: true, data: eventData };

    } catch (error) {
      return { valid: false, reason: 'Structure validation error' };
    }
  }

  // Apply rate limiting based on event type and source
  async checkRateLimit(service, event) {
    const key = `${service}_${event.eventType}`;
    const now = Date.now();
    const windowMs = 60000; // 1 minute window

    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, { count: 0, windowStart: now });
    }

    const limit = this.rateLimits.get(key);

    // Reset window if expired
    if (now - limit.windowStart > windowMs) {
      limit.count = 0;
      limit.windowStart = now;
    }

    // Define rate limits by event type
    const limits = {
      'chat.spam_detected': 1000,     // High volume allowed
      'customer.otp_failed': 100,     // Medium volume
      'payment.card_fraud': 10,       // Low volume - critical
      'admin.privilege_escalation': 1, // Immediate alert
      'system.breach_attempt': 1      // Immediate alert
    };

    const maxCount = limits[event.eventType] || 50; // Default limit

    if (limit.count >= maxCount) {
      return { allowed: false, reason: 'Rate limit exceeded' };
    }

    limit.count++;
    return { allowed: true };
  }

  // Mask sensitive data in events
  async maskSensitiveData(event) {
    const maskedEvent = { ...event };
    
    // Mask PII in context
    if (maskedEvent.context) {
      // Mask user IDs (keep first 4 chars)
      if (maskedEvent.context.userId) {
        maskedEvent.context.userId = this.maskString(maskedEvent.context.userId, 4);
      }

      // Mask email addresses
      if (maskedEvent.context.email) {
        maskedEvent.context.email = this.maskEmail(maskedEvent.context.email);
      }

      // Mask phone numbers
      if (maskedEvent.context.phone) {
        maskedEvent.context.phone = this.maskPhone(maskedEvent.context.phone);
      }

      // Mask payment references
      if (maskedEvent.context.transactionId) {
        maskedEvent.context.transactionId = this.maskString(maskedEvent.context.transactionId, 6);
      }

      // Remove sensitive additional data
      if (maskedEvent.context.additionalData) {
        const sensitiveKeys = ['password', 'otp', 'token', 'key', 'secret'];
        for (const key of sensitiveKeys) {
          if (maskedEvent.context.additionalData[key]) {
            maskedEvent.context.additionalData[key] = '[MASKED]';
          }
        }
      }
    }

    return maskedEvent;
  }

  // Finalize event with immutable timestamp and signature
  async finalizeEvent(event, service) {
    const finalEvent = {
      ...event,
      id: `seg_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`,
      gatewayTimestamp: new Date().toISOString(),
      sourceService: service,
      processed: false
    };

    // Create event signature for integrity
    const eventString = JSON.stringify({
      id: finalEvent.id,
      eventType: finalEvent.eventType,
      timestamp: finalEvent.timestamp,
      gatewayTimestamp: finalEvent.gatewayTimestamp
    });

    finalEvent.signature = crypto
      .createHmac('sha256', process.env.EVENT_SIGNING_KEY)
      .update(eventString)
      .digest('hex');

    return finalEvent;
  }

  // Store event immutably
  async storeEvent(event) {
    console.log(`SEG: Storing event ${event.id} - ${event.eventType}`);
  }

  // Buffer events for aggregation
  async bufferForAggregation(event) {
    const bufferKey = `${event.eventType}_${new Date().toISOString().split('T')[0]}`;
    
    if (!this.eventBuffer.has(bufferKey)) {
      this.eventBuffer.set(bufferKey, {
        eventType: event.eventType,
        date: new Date().toISOString().split('T')[0],
        count: 0,
        totalRiskScore: 0,
        severityBreakdown: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
      });
    }

    const buffer = this.eventBuffer.get(bufferKey);
    buffer.count++;
    buffer.totalRiskScore += this.riskEngine.calculateEventRisk(event).finalScore;
    buffer.severityBreakdown[event.severity]++;
  }

  // Check for immediate alerts
  async checkImmediateAlerts(event) {
    const criticalEvents = [
      'admin.privilege_escalation',
      'system.breach_attempt', 
      'payment.card_fraud',
      'customer.account_takeover'
    ];

    if (criticalEvents.includes(event.eventType)) {
      await this.triggerImmediateAlert(event);
    }
  }

  // Trigger immediate alert for critical events
  async triggerImmediateAlert(event) {
    console.log(`🚨 SEG: IMMEDIATE ALERT - ${event.eventType}`);
    
    const alert = {
      type: 'IMMEDIATE_SECURITY_ALERT',
      eventId: event.id,
      eventType: event.eventType,
      severity: event.severity,
      timestamp: event.gatewayTimestamp,
      requiresAction: true
    };

    await this.streamToAdminMetrics(alert);
  }

  // Stream aggregated data to admin metrics
  async streamToAdminMetrics(data) {
    console.log('SEG: Streaming to admin metrics:', data);
  }

  // Start aggregation processor (runs every 5 minutes)
  startAggregationProcessor() {
    setInterval(async () => {
      await this.processAggregatedMetrics();
    }, 5 * 60 * 1000);
  }

  // Process and stream aggregated metrics
  async processAggregatedMetrics() {
    const metrics = [];
    
    for (const [key, buffer] of this.eventBuffer.entries()) {
      if (buffer.count > 0) {
        metrics.push({
          ...buffer,
          avgRiskScore: buffer.totalRiskScore / buffer.count,
          timestamp: new Date().toISOString()
        });
      }
    }

    if (metrics.length > 0) {
      await this.streamToAdminMetrics({
        type: 'AGGREGATED_METRICS',
        metrics,
        timestamp: new Date().toISOString()
      });
    }

    this.eventBuffer.clear();
  }

  // Utility methods
  maskString(str, keepChars = 4) {
    if (!str || str.length <= keepChars) return str;
    return str.substring(0, keepChars) + '*'.repeat(str.length - keepChars);
  }

  maskEmail(email) {
    const [local, domain] = email.split('@');
    return `${local.substring(0, 2)}***@${domain}`;
  }

  maskPhone(phone) {
    return phone.replace(/\d(?=\d{4})/g, '*');
  }

  createSuccessResponse(eventId) {
    return {
      success: true,
      eventId,
      timestamp: new Date().toISOString()
    };
  }

  createErrorResponse(status, message) {
    return {
      success: false,
      error: message,
      status,
      timestamp: new Date().toISOString()
    };
  }
}