// TradiChatter Security Monitoring & Alerts System
// Comprehensive monitoring with real-time alerts for security events

export class SecurityMonitoringSystem {
  constructor() {
    this.monitoringMetrics = new Map();
    this.alertRules = new Map();
    this.activeAlerts = new Map();
    this.alertHistory = new Map();
    this.monitoringStatus = 'ACTIVE';
  }

  // Initialize monitoring metrics and alert rules
  initializeMonitoring() {
    // Define monitoring metrics
    const metrics = {
      security_events: {
        failed_logins: { threshold: 10, window: 300000, severity: 'HIGH' },
        fraud_alerts: { threshold: 5, window: 600000, severity: 'CRITICAL' },
        admin_actions: { threshold: 20, window: 3600000, severity: 'MEDIUM' },
        kyc_rejections: { threshold: 15, window: 3600000, severity: 'HIGH' },
        high_value_transactions: { threshold: 3, window: 1800000, severity: 'HIGH' }
      },
      
      system_health: {
        api_response_time: { threshold: 2000, severity: 'MEDIUM' }, // 2 seconds
        error_rate: { threshold: 5, window: 300000, severity: 'HIGH' }, // 5% in 5 min
        database_connections: { threshold: 80, severity: 'HIGH' }, // 80% usage
        memory_usage: { threshold: 85, severity: 'CRITICAL' }, // 85% usage
        cpu_usage: { threshold: 80, severity: 'HIGH' } // 80% usage
      },
      
      fraud_patterns: {
        nigerian_multi_account: { threshold: 3, window: 1800000, severity: 'CRITICAL' },
        document_reuse: { threshold: 2, window: 3600000, severity: 'CRITICAL' },
        rapid_transactions: { threshold: 8, window: 600000, severity: 'HIGH' },
        escrow_disputes: { threshold: 5, window: 3600000, severity: 'MEDIUM' }
      },
      
      admin_security: {
        failed_admin_logins: { threshold: 3, window: 300000, severity: 'CRITICAL' },
        unauthorized_actions: { threshold: 1, window: 60000, severity: 'CRITICAL' },
        privilege_escalation: { threshold: 1, window: 60000, severity: 'CRITICAL' },
        suspicious_admin_activity: { threshold: 5, window: 1800000, severity: 'HIGH' }
      }
    };

    Object.entries(metrics).forEach(([category, categoryMetrics]) => {
      this.monitoringMetrics.set(category, categoryMetrics);
    });

    // Initialize alert rules
    this.initializeAlertRules();
  }

  // Initialize alert rules and notification preferences
  initializeAlertRules() {
    const alertRules = {
      CRITICAL: {
        notification_channels: ['push', 'email', 'sms'],
        escalation_time: 300000, // 5 minutes
        auto_response: true,
        admin_roles: ['security_admin', 'super_admin']
      },
      HIGH: {
        notification_channels: ['push', 'email'],
        escalation_time: 900000, // 15 minutes
        auto_response: false,
        admin_roles: ['security_admin', 'platform_admin', 'super_admin']
      },
      MEDIUM: {
        notification_channels: ['email'],
        escalation_time: 1800000, // 30 minutes
        auto_response: false,
        admin_roles: ['security_admin', 'platform_admin', 'compliance_admin', 'super_admin']
      },
      LOW: {
        notification_channels: ['email'],
        escalation_time: 3600000, // 1 hour
        auto_response: false,
        admin_roles: ['super_admin']
      }
    };

    Object.entries(alertRules).forEach(([severity, rule]) => {
      this.alertRules.set(severity, rule);
    });
  }

  // Process security event and check for alerts
  async processSecurityEvent(eventData) {
    const { event_type, severity, metadata, timestamp } = eventData;
    
    // Update monitoring metrics
    await this.updateMetrics(event_type, eventData);
    
    // Check for alert conditions
    const alertTriggered = await this.checkAlertConditions(event_type, eventData);
    
    if (alertTriggered) {
      await this.triggerAlert(alertTriggered);
    }

    return {
      event_processed: true,
      alert_triggered: !!alertTriggered,
      alert_id: alertTriggered?.id || null,
      timestamp: new Date().toISOString()
    };
  }

  // Update monitoring metrics
  async updateMetrics(eventType, eventData) {
    const now = Date.now();
    
    // Find relevant metric category
    for (const [category, metrics] of this.monitoringMetrics) {
      if (metrics[eventType]) {
        const metric = metrics[eventType];
        const metricKey = `${category}_${eventType}`;
        
        if (!this.monitoringMetrics.has(metricKey + '_data')) {
          this.monitoringMetrics.set(metricKey + '_data', []);
        }
        
        const metricData = this.monitoringMetrics.get(metricKey + '_data');
        metricData.push({
          timestamp: now,
          data: eventData,
          severity: eventData.severity || metric.severity
        });
        
        // Clean old data outside window
        if (metric.window) {
          const cutoff = now - metric.window;
          const filteredData = metricData.filter(d => d.timestamp >= cutoff);
          this.monitoringMetrics.set(metricKey + '_data', filteredData);
        }
      }
    }
  }

  // Check alert conditions
  async checkAlertConditions(eventType, eventData) {
    const now = Date.now();
    
    for (const [category, metrics] of this.monitoringMetrics) {
      if (metrics[eventType]) {
        const metric = metrics[eventType];
        const metricKey = `${category}_${eventType}`;
        const metricData = this.monitoringMetrics.get(metricKey + '_data') || [];
        
        // Check threshold-based alerts
        if (metric.threshold && metric.window) {
          const recentEvents = metricData.filter(d => 
            now - d.timestamp <= metric.window
          );
          
          if (recentEvents.length >= metric.threshold) {
            return {
              id: this.generateAlertId(),
              type: 'THRESHOLD_EXCEEDED',
              category: category,
              event_type: eventType,
              severity: metric.severity,
              threshold: metric.threshold,
              actual_count: recentEvents.length,
              window_minutes: metric.window / 60000,
              triggered_at: new Date().toISOString(),
              events: recentEvents.slice(-5) // Last 5 events
            };
          }
        }
        
        // Check immediate critical alerts
        if (eventData.severity === 'CRITICAL') {
          return {
            id: this.generateAlertId(),
            type: 'CRITICAL_EVENT',
            category: category,
            event_type: eventType,
            severity: 'CRITICAL',
            immediate: true,
            triggered_at: new Date().toISOString(),
            event_data: eventData
          };
        }
      }
    }
    
    return null;
  }

  // Trigger alert and send notifications
  async triggerAlert(alertData) {
    const alertId = alertData.id;
    const severity = alertData.severity;
    const alertRule = this.alertRules.get(severity);
    
    if (!alertRule) return;

    // Store active alert
    this.activeAlerts.set(alertId, {
      ...alertData,
      status: 'ACTIVE',
      notifications_sent: 0,
      escalated: false,
      created_at: new Date().toISOString()
    });

    // Send notifications
    const notificationResult = await this.sendAlertNotifications(alertData, alertRule);
    
    // Update alert with notification results
    const alert = this.activeAlerts.get(alertId);
    alert.notifications_sent = notificationResult.sent;
    alert.notification_channels = notificationResult.channels;

    // Schedule escalation if needed
    if (alertRule.escalation_time) {
      setTimeout(() => {
        this.escalateAlert(alertId);
      }, alertRule.escalation_time);
    }

    // Trigger auto-response if configured
    if (alertRule.auto_response) {
      await this.triggerAutoResponse(alertData);
    }

    console.log(`ALERT TRIGGERED: ${alertData.type} - ${alertData.severity} - ID: ${alertId}`);
    
    return alertId;
  }

  // Send alert notifications
  async sendAlertNotifications(alertData, alertRule) {
    const notifications = [];
    const channels = alertRule.notification_channels;
    const adminRoles = alertRule.admin_roles;

    for (const channel of channels) {
      for (const role of adminRoles) {
        const notification = await this.sendNotification(channel, role, alertData);
        if (notification.success) {
          notifications.push(notification);
        }
      }
    }

    return {
      sent: notifications.length,
      channels: channels,
      notifications: notifications
    };
  }

  // Send individual notification
  async sendNotification(channel, role, alertData) {
    const notification = {
      id: this.generateNotificationId(),
      channel: channel,
      role: role,
      alert_id: alertData.id,
      severity: alertData.severity,
      timestamp: new Date().toISOString()
    };

    try {
      switch (channel) {
        case 'push':
          await this.sendPushNotification(role, alertData);
          break;
        case 'email':
          await this.sendEmailNotification(role, alertData);
          break;
        case 'sms':
          await this.sendSMSNotification(role, alertData);
          break;
      }
      
      notification.success = true;
      notification.message = `${channel} notification sent to ${role}`;
    } catch (error) {
      notification.success = false;
      notification.error = error.message;
    }

    return notification;
  }

  // Escalate alert if not acknowledged
  async escalateAlert(alertId) {
    const alert = this.activeAlerts.get(alertId);
    if (!alert || alert.status !== 'ACTIVE' || alert.escalated) return;

    alert.escalated = true;
    alert.escalated_at = new Date().toISOString();

    // Send escalation notifications to super admin
    await this.sendNotification('sms', 'super_admin', {
      ...alert,
      type: 'ESCALATED_ALERT',
      message: `ESCALATED: ${alert.type} - ${alert.severity}`
    });

    console.log(`ALERT ESCALATED: ${alertId}`);
  }

  // Trigger automated response
  async triggerAutoResponse(alertData) {
    const responses = [];

    switch (alertData.type) {
      case 'CRITICAL_EVENT':
        if (alertData.event_type === 'failed_admin_logins') {
          responses.push(await this.lockAdminAccount(alertData));
        }
        break;
      
      case 'THRESHOLD_EXCEEDED':
        if (alertData.event_type === 'fraud_alerts') {
          responses.push(await this.enableSecurityFreeze());
        }
        break;
    }

    return responses;
  }

  // Get monitoring dashboard data
  getMonitoringDashboard() {
    const now = Date.now();
    const last24h = now - 86400000;

    return {
      monitoring_status: this.monitoringStatus,
      active_alerts: {
        total: this.activeAlerts.size,
        critical: Array.from(this.activeAlerts.values()).filter(a => a.severity === 'CRITICAL').length,
        high: Array.from(this.activeAlerts.values()).filter(a => a.severity === 'HIGH').length,
        medium: Array.from(this.activeAlerts.values()).filter(a => a.severity === 'MEDIUM').length
      },
      
      recent_alerts: Array.from(this.activeAlerts.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map(alert => ({
          id: alert.id,
          type: alert.type,
          severity: alert.severity,
          category: alert.category,
          event_type: alert.event_type,
          created_at: alert.created_at,
          status: alert.status,
          escalated: alert.escalated
        })),
      
      metrics_summary: this.getMetricsSummary(),
      
      system_health: {
        monitoring_active: this.monitoringStatus === 'ACTIVE',
        last_update: new Date().toISOString(),
        alerts_processed_24h: this.getAlertsProcessed24h()
      },
      
      timestamp: new Date().toISOString()
    };
  }

  // Get metrics summary
  getMetricsSummary() {
    const summary = {};
    
    for (const [category, metrics] of this.monitoringMetrics) {
      if (typeof metrics === 'object' && !Array.isArray(metrics)) {
        summary[category] = Object.keys(metrics).length;
      }
    }
    
    return summary;
  }

  // Get alerts processed in last 24 hours
  getAlertsProcessed24h() {
    const now = Date.now();
    const last24h = now - 86400000;
    
    return Array.from(this.alertHistory.values())
      .filter(alert => new Date(alert.created_at).getTime() >= last24h)
      .length;
  }

  // Acknowledge alert
  async acknowledgeAlert(alertId, adminId, adminRole) {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return { success: false, error: 'Alert not found' };

    alert.status = 'ACKNOWLEDGED';
    alert.acknowledged_by = adminId;
    alert.acknowledged_at = new Date().toISOString();
    alert.admin_role = adminRole;

    // Move to history
    this.alertHistory.set(alertId, alert);
    this.activeAlerts.delete(alertId);

    return {
      success: true,
      alert_id: alertId,
      acknowledged_by: adminId,
      acknowledged_at: alert.acknowledged_at
    };
  }

  // Placeholder notification methods
  async sendPushNotification(role, alertData) {
    console.log(`PUSH [${role}]: ${alertData.type} - ${alertData.severity}`);
  }

  async sendEmailNotification(role, alertData) {
    console.log(`EMAIL [${role}]: ${alertData.type} - ${alertData.severity}`);
  }

  async sendSMSNotification(role, alertData) {
    console.log(`SMS [${role}]: ${alertData.type} - ${alertData.severity}`);
  }

  async lockAdminAccount(alertData) {
    return { action: 'ADMIN_ACCOUNT_LOCKED', target: alertData.event_data?.admin_id };
  }

  async enableSecurityFreeze() {
    return { action: 'SECURITY_FREEZE_ENABLED', duration: '1 hour' };
  }

  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateNotificationId() {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}