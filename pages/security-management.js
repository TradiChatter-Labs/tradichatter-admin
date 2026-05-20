import { useState } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, Users, MessageSquare, CreditCard, Building, Settings, FileText, Eye, TrendingUp, Clock } from 'lucide-react';

export default function SecurityManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuditing, setIsAuditing] = useState(false);

  // TradiChatter-specific security metrics by actor type
  const securityMetrics = {
    // Customer Security Metrics
    customerAuth: {
      failedOTPAttempts: 18,
      suspiciousDevices: 4,
      accountTakeovers: 1,
      deviceTrustViolations: 7
    },
    // Business Security Metrics  
    businessAuth: {
      failedOTPAttempts: 12,
      suspiciousDevices: 2,
      kycViolations: 3,
      businessImpersonation: 1
    },
    // Affiliate Security Metrics
    affiliateAuth: {
      failedOTPAttempts: 8,
      suspiciousDevices: 1,
      commissionFraud: 2,
      referralAbuse: 4
    },
    // Admin Security Metrics (HIGHEST PRIORITY)
    adminAuth: {
      failedOTPAttempts: 2,
      privilegeEscalation: 0,
      unauthorizedAccess: 1,
      configChanges: 5
    },
    chatMedia: {
      flaggedMessages: 8,
      spamDetected: 15,
      mediaViolations: 3,
      moderationQueue: 12
    },
    paymentsEscrow: {
      failedPayments: 7,
      escrowDisputes: 2,
      suspiciousAmounts: 4,
      gatewayAlerts: 1
    },
    businessKYC: {
      kycFailures: 6,
      documentFraud: 2,
      suspiciousBusinesses: 3,
      complianceViolations: 1
    }
  };

  const securitySections = [
    {
      id: 'customer-auth',
      title: 'Customer Authentication Security',
      description: 'Monitor customer OTP, device trust, and account security',
      icon: Users,
      color: 'bg-blue-500',
      alerts: securityMetrics.customerAuth.failedOTPAttempts,
      status: 'active',
      actorType: 'customer'
    },
    {
      id: 'business-auth', 
      title: 'Business Authentication Security',
      description: 'Monitor business OTP, KYC compliance, and verification',
      icon: Building,
      color: 'bg-green-500',
      alerts: securityMetrics.businessAuth.kycViolations,
      status: 'warning',
      actorType: 'business'
    },
    {
      id: 'affiliate-auth',
      title: 'Affiliate Authentication Security', 
      description: 'Monitor affiliate OTP, commission fraud, and referral abuse',
      icon: TrendingUp,
      color: 'bg-purple-500',
      alerts: securityMetrics.affiliateAuth.commissionFraud,
      status: 'active',
      actorType: 'affiliate'
    },
    {
      id: 'admin-security',
      title: 'Admin Security (CRITICAL)',
      description: 'Monitor admin access, privilege escalation, and internal threats',
      icon: Settings,
      color: 'bg-red-600',
      alerts: securityMetrics.adminAuth.unauthorizedAccess,
      status: securityMetrics.adminAuth.privilegeEscalation > 0 ? 'critical' : 'secure',
      actorType: 'admin',
      priority: 'highest'
    },
    {
      id: 'chat-media',
      title: 'Chat & Media Security',
      description: 'Content moderation and chat safety monitoring',
      icon: MessageSquare,
      color: 'bg-orange-500',
      alerts: securityMetrics.chatMedia.flaggedMessages,
      status: 'active',
      actorType: 'platform'
    },
    {
      id: 'payments-escrow',
      title: 'Payments & Escrow Security',
      description: 'Financial transaction and escrow monitoring',
      icon: CreditCard,
      color: 'bg-indigo-500',
      alerts: securityMetrics.paymentsEscrow.failedPayments,
      status: 'active',
      actorType: 'platform'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'secure': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const calculateSecurityScore = () => {
    const weights = {
      adminAuth: 0.40,        // HIGHEST - Admin security is critical
      paymentsEscrow: 0.25,   // HIGH - Financial security
      businessAuth: 0.15,     // MEDIUM - Business verification
      customerAuth: 0.10,     // MEDIUM - Customer security
      affiliateAuth: 0.05,    // LOW - Affiliate security
      chatMedia: 0.05         // LOW - Content moderation
    };

    let totalScore = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      const metrics = securityMetrics[key];
      if (metrics) {
        const sectionScore = Object.values(metrics).reduce((sum, val) => {
          // Admin metrics are inverted - 0 violations = 100 score
          if (key === 'adminAuth') return sum + (100 - val * 10); // Admin violations heavily penalized
          if (key === 'paymentsEscrow') return sum + (100 - val * 3); // Financial violations penalized
          return sum + (100 - val); // Standard penalty
        }, 0) / Object.keys(metrics).length;
        totalScore += Math.max(0, sectionScore) * weight;
      }
    });

    return Math.max(0, Math.min(100, Math.round(totalScore)));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">TradiChatter Security Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Comprehensive security monitoring for chat-commerce platform.
        </p>
      </div>

      {/* Security Score */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Platform Security Score</h3>
            <p className="text-sm text-gray-500">Real-time security health assessment</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{calculateSecurityScore()}%</div>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <button 
            onClick={() => {
              setIsAuditing(true);
              setTimeout(() => setIsAuditing(false), 3000);
            }}
            disabled={isAuditing}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isAuditing ? 'Running Audit...' : 'Run Security Audit'}
          </button>
        </div>
      </div>

      {/* Security Sections Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {securitySections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`flex-shrink-0 ${section.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {section.alerts > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {section.alerts} alerts
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(section.status)}`}>
                      {section.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{section.description}</p>
                </div>
                
                <div className="mt-4">
                  <button 
                    onClick={() => alert(`${section.title}: ${section.alerts} active alerts. Detailed view coming soon.`)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <button 
            onClick={() => confirm('Are you sure you want to initiate emergency lockdown?') && alert('Emergency lockdown initiated')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Lockdown
          </button>
          <button 
            onClick={() => alert('Live threat monitoring — no active threats detected')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Live Threats
          </button>
          <Link href="/admin-activity-logs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Security Reports
          </Link>
          <Link href="/admin-activity-logs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Clock className="h-4 w-4 mr-2" />
            Audit History
          </Link>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="mt-8">
        <Link href="/settings" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Settings
        </Link>
      </div>
    </div>
  );
}