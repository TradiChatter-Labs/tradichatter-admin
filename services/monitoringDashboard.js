// TradiChatter Real-Time Monitoring Dashboard Integration
// Displays security alerts and metrics for admin portal

import { RealTimeSecurityMonitor } from './realTimeMonitor.js';

export class MonitoringDashboard {
  constructor() {
    this.monitor = new RealTimeSecurityMonitor();
    this.refreshInterval = 30000; // 30 seconds
    this.isRunning = false;
  }

  // Start real-time monitoring
  startMonitoring() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.monitoringInterval = setInterval(() => {
      this.updateDashboardMetrics();
    }, this.refreshInterval);
    
    console.log('Real-time monitoring started');
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.isRunning = false;
      console.log('Real-time monitoring stopped');
    }
  }

  // Process incoming security event
  async processSecurityEvent(eventData) {
    const result = await this.monitor.trackEvent(eventData);
    
    if (result.anomaly_detected) {
      await this.handleAnomalyDetected(result);
    }
    
    return result;
  }

  // Handle detected anomaly
  async handleAnomalyDetected(result) {
    const alerts = this.monitor.getActiveAlerts();
    const latestAlert = alerts[0]; // Highest risk score first
    
    if (latestAlert && latestAlert.risk_score >= 70) {
      await this.sendHighRiskNotification(latestAlert);
    }
  }

  // Send high-risk notification to admins
  async sendHighRiskNotification(alert) {
    const notification = {
      type: 'HIGH_RISK_ALERT',
      alert_id: alert.id,
      risk_score: alert.risk_score,
      alert_type: alert.type,
      details: alert.details,
      timestamp: alert.created_at,
      requires_immediate_attention: true
    };
    
    // In production: send via push notification, email, SMS
    console.log('HIGH RISK ALERT:', notification);
  }

  // Get dashboard data for admin portal
  getDashboardData() {
    const metrics = this.monitor.getMetrics();
    const activeAlerts = this.monitor.getActiveAlerts();
    const topAlerts = activeAlerts.slice(0, 10); // Top 10 alerts
    
    return {
      overview: {
        total_events_24h: metrics.total_events_24h,
        active_alerts: metrics.active_alerts,
        high_risk_alerts: activeAlerts.filter(a => a.risk_score >= 70).length,
        medium_risk_alerts: activeAlerts.filter(a => a.risk_score >= 30 && a.risk_score < 70).length,
        low_risk_alerts: activeAlerts.filter(a => a.risk_score < 30).length
      },
      
      events_by_type: metrics.events_by_type,
      
      top_alerts: topAlerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        risk_score: alert.risk_score,
        entity_id: alert.details.user_id || alert.details.business_id,
        recommendation: alert.details.recommendation,
        created_at: alert.created_at,
        status: alert.status
      })),
      
      risk_distribution: metrics.risk_distribution,
      
      recent_activity: this.getRecentActivity(),
      
      timestamp: new Date().toISOString()
    };
  }

  // Get recent security activity summary
  getRecentActivity() {
    const events = Array.from(this.monitor.eventBuffer.values())
      .filter(event => event.timestamp >= Date.now() - 3600000) // Last hour
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
    
    return events.map(event => ({
      event_type: event.event_type,
      entity_id: event.user_id || event.business_id,
      timestamp: new Date(event.timestamp).toISOString(),
      metadata: event.metadata
    }));
  }

  // Update dashboard metrics (called by interval)
  updateDashboardMetrics() {
    const dashboardData = this.getDashboardData();
    
    // In production: emit to admin dashboard via WebSocket/SSE
    this.emitDashboardUpdate(dashboardData);
  }

  // Emit dashboard update (WebSocket/SSE in production)
  emitDashboardUpdate(data) {
    // Simulate dashboard update
    console.log(`Dashboard Update: ${data.overview.active_alerts} active alerts, ${data.overview.total_events_24h} events in 24h`);
  }

  // Simulate security events for testing
  async simulateSecurityEvents() {
    const testEvents = [
      {
        event_type: 'failed_otp',
        user_id: 'user_12345',
        metadata: { ip_address: '192.168.1.100', attempts: 3 }
      },
      {
        event_type: 'escrow_created',
        user_id: 'user_67890',
        business_id: 'business_abc123',
        amount: 750000, // High value
        metadata: { currency: 'NGN', product: 'Electronics' }
      },
      {
        event_type: 'chat_flag',
        user_id: 'user_11111',
        business_id: 'business_xyz789',
        metadata: { reason: 'inappropriate_content', reporter: 'user_22222' }
      },
      {
        event_type: 'kyc_rejected',
        business_id: 'business_def456',
        metadata: { reason: 'invalid_documents', reviewer: 'admin_compliance_001' }
      }
    ];

    console.log('Simulating security events...');
    
    for (const event of testEvents) {
      const result = await this.processSecurityEvent(event);
      console.log(`Event processed: ${event.event_type} - Anomaly: ${result.anomaly_detected}, Risk: ${result.risk_score}`);
      
      // Wait between events
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Get monitoring status
  getMonitoringStatus() {
    return {
      is_running: this.isRunning,
      refresh_interval: this.refreshInterval,
      total_events_tracked: this.monitor.eventBuffer.size,
      active_alerts: this.monitor.activeAlerts.size,
      uptime: this.isRunning ? 'Active' : 'Stopped',
      last_update: new Date().toISOString()
    };
  }
}