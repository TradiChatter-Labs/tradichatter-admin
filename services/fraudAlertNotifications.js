// TradiChatter Fraud Alert Notification System
// Sends push/email/SMS notifications to admins for high-risk fraud events

export class FraudAlertNotificationSystem {
  constructor() {
    this.notificationChannels = new Map();
    this.adminPreferences = new Map();
    this.notificationHistory = new Map();
    this.rateLimits = new Map();
  }

  // Initialize admin notification preferences
  initializeAdminPreferences() {
    const defaultPreferences = {
      security_admin: {
        channels: ['push', 'email'],
        thresholds: {
          critical: 80,
          high: 70,
          medium: 50
        },
        quiet_hours: { start: 22, end: 6 }, // 10 PM to 6 AM
        rate_limit: 10 // Max 10 notifications per hour
      },
      platform_admin: {
        channels: ['push', 'email'],
        thresholds: {
          critical: 85,
          high: 75,
          medium: 60
        },
        quiet_hours: { start: 23, end: 7 },
        rate_limit: 8
      },
      compliance_admin: {
        channels: ['email', 'sms'],
        thresholds: {
          critical: 80,
          high: 70,
          medium: 55
        },
        quiet_hours: { start: 22, end: 6 },
        rate_limit: 12
      },
      super_admin: {
        channels: ['push', 'email', 'sms'],
        thresholds: {
          critical: 75,
          high: 65,
          medium: 45
        },
        quiet_hours: null, // No quiet hours for super admin
        rate_limit: 20
      }
    };

    Object.entries(defaultPreferences).forEach(([role, prefs]) => {
      this.adminPreferences.set(role, prefs);
    });
  }

  // Send fraud alert notification
  async sendFraudAlert(alertData, targetRoles = ['security_admin', 'super_admin']) {
    const { entity_id, risk_score, alert_type, recommendation, timestamp } = alertData;
    const notifications = [];

    for (const role of targetRoles) {
      const preferences = this.adminPreferences.get(role);
      if (!preferences) continue;

      // Check if alert meets threshold
      if (!this.meetsThreshold(risk_score, preferences.thresholds)) continue;

      // Check rate limiting
      if (this.isRateLimited(role)) continue;

      // Check quiet hours
      if (this.isQuietHours(preferences.quiet_hours)) {
        // Only send critical alerts during quiet hours
        if (risk_score < preferences.thresholds.critical) continue;
      }

      // Send notifications via preferred channels
      for (const channel of preferences.channels) {
        const notification = await this.sendNotification(channel, role, alertData);
        if (notification.success) {
          notifications.push(notification);
          this.updateRateLimit(role);
        }
      }
    }

    // Log notification activity
    await this.logNotificationActivity(alertData, notifications);

    return {
      notifications_sent: notifications.length,
      notifications: notifications,
      timestamp: new Date().toISOString()
    };
  }

  // Send notification via specific channel
  async sendNotification(channel, role, alertData) {
    const { entity_id, risk_score, alert_type, recommendation } = alertData;
    const severity = this.getSeverityLevel(risk_score);
    
    const notification = {
      id: this.generateNotificationId(),
      channel: channel,
      role: role,
      severity: severity,
      timestamp: new Date().toISOString()
    };

    try {
      switch (channel) {
        case 'push':
          await this.sendPushNotification(role, alertData, severity);
          break;
        case 'email':
          await this.sendEmailNotification(role, alertData, severity);
          break;
        case 'sms':
          await this.sendSMSNotification(role, alertData, severity);
          break;
      }

      notification.success = true;
      notification.message = `${channel} notification sent successfully`;
    } catch (error) {
      notification.success = false;
      notification.error = error.message;
    }

    return notification;
  }

  // Send push notification
  async sendPushNotification(role, alertData, severity) {
    const { entity_id, risk_score, alert_type } = alertData;
    
    const pushMessage = {
      title: `🚨 ${severity.toUpperCase()} Fraud Alert`,
      body: `Risk Score: ${risk_score} | Type: ${alert_type} | Entity: ${entity_id.slice(-4)}`,
      data: {
        alert_type: alert_type,
        entity_id: entity_id,
        risk_score: risk_score,
        action_required: true
      },
      priority: severity === 'critical' ? 'high' : 'normal'
    };

    // In production: Send via Firebase/APNs
    console.log(`PUSH_NOTIFICATION [${role}]:`, pushMessage);
  }

  // Send email notification
  async sendEmailNotification(role, alertData, severity) {
    const { entity_id, risk_score, alert_type, recommendation } = alertData;
    
    const emailContent = {
      to: this.getAdminEmail(role),
      subject: `TradiChatter Fraud Alert - ${severity.toUpperCase()} Risk Detected`,
      html: this.generateEmailTemplate(alertData, severity),
      priority: severity === 'critical' ? 'high' : 'normal'
    };

    // In production: Send via SendGrid/AWS SES
    console.log(`EMAIL_NOTIFICATION [${role}]:`, emailContent.subject);
  }

  // Send SMS notification
  async sendSMSNotification(role, alertData, severity) {
    const { entity_id, risk_score, alert_type } = alertData;
    
    const smsMessage = {
      to: this.getAdminPhone(role),
      body: `TradiChatter FRAUD ALERT: ${severity.toUpperCase()} risk (${risk_score}) detected for ${entity_id.slice(-4)}. Check dashboard immediately.`,
      priority: severity === 'critical' ? 'high' : 'normal'
    };

    // In production: Send via Twilio/AWS SNS
    console.log(`SMS_NOTIFICATION [${role}]:`, smsMessage.body);
  }

  // Generate email template
  generateEmailTemplate(alertData, severity) {
    const { entity_id, risk_score, alert_type, recommendation, timestamp } = alertData;
    
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <div style="background: ${severity === 'critical' ? '#dc3545' : '#fd7e14'}; color: white; padding: 20px;">
        <h2>🚨 TradiChatter Fraud Alert</h2>
        <p><strong>Severity:</strong> ${severity.toUpperCase()}</p>
      </div>
      
      <div style="padding: 20px; background: #f8f9fa;">
        <h3>Alert Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td><strong>Entity ID:</strong></td><td>${entity_id}</td></tr>
          <tr><td><strong>Risk Score:</strong></td><td>${risk_score}/100</td></tr>
          <tr><td><strong>Alert Type:</strong></td><td>${alert_type}</td></tr>
          <tr><td><strong>Recommendation:</strong></td><td>${recommendation}</td></tr>
          <tr><td><strong>Timestamp:</strong></td><td>${timestamp}</td></tr>
        </table>
      </div>
      
      <div style="padding: 20px;">
        <p><strong>Action Required:</strong> Please review this alert in the admin dashboard and take appropriate action.</p>
        <a href="https://admin.tradichatter.com/fraud-dashboard" 
           style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Dashboard
        </a>
      </div>
      
      <div style="padding: 10px; background: #e9ecef; font-size: 12px; color: #6c757d;">
        <p>This is an automated fraud alert from TradiChatter Security System.</p>
      </div>
    </div>`;
  }

  // Check if alert meets notification threshold
  meetsThreshold(riskScore, thresholds) {
    return riskScore >= thresholds.medium;
  }

  // Check if currently in quiet hours
  isQuietHours(quietHours) {
    if (!quietHours) return false;
    
    const now = new Date();
    const currentHour = now.getHours();
    const { start, end } = quietHours;
    
    if (start > end) {
      // Quiet hours span midnight (e.g., 22:00 to 06:00)
      return currentHour >= start || currentHour < end;
    } else {
      // Quiet hours within same day
      return currentHour >= start && currentHour < end;
    }
  }

  // Check rate limiting
  isRateLimited(role) {
    const key = `${role}_${Math.floor(Date.now() / 3600000)}`; // Per hour
    const preferences = this.adminPreferences.get(role);
    const currentCount = this.rateLimits.get(key) || 0;
    
    return currentCount >= preferences.rate_limit;
  }

  // Update rate limit counter
  updateRateLimit(role) {
    const key = `${role}_${Math.floor(Date.now() / 3600000)}`;
    const currentCount = this.rateLimits.get(key) || 0;
    this.rateLimits.set(key, currentCount + 1);
  }

  // Get severity level from risk score
  getSeverityLevel(riskScore) {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 70) return 'high';
    if (riskScore >= 50) return 'medium';
    return 'low';
  }

  // Log notification activity
  async logNotificationActivity(alertData, notifications) {
    const logEntry = {
      id: this.generateLogId(),
      type: 'FRAUD_ALERT_NOTIFICATION',
      alert_data: alertData,
      notifications_sent: notifications.length,
      notification_details: notifications,
      timestamp: new Date().toISOString(),
      immutable: true
    };

    // In production: Store in immutable audit log
    console.log('FRAUD_NOTIFICATION_LOG:', logEntry);
  }

  // Get notification statistics
  getNotificationStats() {
    const now = Date.now();
    const last24h = now - 86400000;
    
    const recentNotifications = Array.from(this.notificationHistory.values())
      .filter(notification => new Date(notification.timestamp).getTime() >= last24h);

    return {
      total_notifications_24h: recentNotifications.length,
      by_channel: {
        push: recentNotifications.filter(n => n.channel === 'push').length,
        email: recentNotifications.filter(n => n.channel === 'email').length,
        sms: recentNotifications.filter(n => n.channel === 'sms').length
      },
      by_severity: {
        critical: recentNotifications.filter(n => n.severity === 'critical').length,
        high: recentNotifications.filter(n => n.severity === 'high').length,
        medium: recentNotifications.filter(n => n.severity === 'medium').length
      },
      success_rate: recentNotifications.length > 0 ? 
        Math.round((recentNotifications.filter(n => n.success).length / recentNotifications.length) * 100) : 0,
      timestamp: new Date().toISOString()
    };
  }

  // Placeholder methods for admin contact info
  getAdminEmail(role) {
    const emails = {
      security_admin: 'security@tradichatter.com',
      platform_admin: 'platform@tradichatter.com',
      compliance_admin: 'compliance@tradichatter.com',
      super_admin: 'admin@tradichatter.com'
    };
    return emails[role] || 'admin@tradichatter.com';
  }

  getAdminPhone(role) {
    const phones = {
      security_admin: '+2348012345678',
      platform_admin: '+2348012345679',
      compliance_admin: '+2348012345680',
      super_admin: '+2348012345681'
    };
    return phones[role] || '+2348012345681';
  }

  generateNotificationId() {
    return `fraud_notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateLogId() {
    return `notification_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}