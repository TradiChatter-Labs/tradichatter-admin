import { useState } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, Users, MessageSquare, CreditCard, Building, Settings, FileText, Eye, TrendingUp, Clock } from 'lucide-react';

export default function SecurityManagement() {
  const [activeTab, setActiveTab] = useState('overview');

  // TradiChatter-specific security metrics
  const securityMetrics = {
    accountAuth: {
      failedLogins: 23,
      suspiciousRegistrations: 5,
      weakPasswords: 12,
      twoFAAdoption: 67
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
    },
    adminInternal: {
      adminLogins: 45,
      privilegeAttempts: 0,
      configChanges: 8,
      dataExports: 3
    }
  };

  const securitySections = [
    {
      id: 'account-auth',
      title: 'Account & Auth Security',
      description: 'Monitor user authentication and account security',
      icon: Users,
      color: 'bg-blue-500',
      alerts: securityMetrics.accountAuth.failedLogins,
      status: 'active'
    },
    {
      id: 'chat-media',
      title: 'Chat & Media Security',
      description: 'Content moderation and chat safety monitoring',
      icon: MessageSquare,
      color: 'bg-green-500',
      alerts: securityMetrics.chatMedia.flaggedMessages,
      status: 'active'
    },
    {
      id: 'payments-escrow',
      title: 'Payments & Escrow Security',
      description: 'Financial transaction and escrow monitoring',
      icon: CreditCard,
      color: 'bg-purple-500',
      alerts: securityMetrics.paymentsEscrow.failedPayments,
      status: 'critical'
    },
    {
      id: 'business-kyc',
      title: 'Business & KYC Security',
      description: 'Business verification and compliance monitoring',
      icon: Building,
      color: 'bg-orange-500',
      alerts: securityMetrics.businessKYC.kycFailures,
      status: 'warning'
    },
    {
      id: 'admin-internal',
      title: 'Admin & Internal Security',
      description: 'Administrative access and internal security',
      icon: Settings,
      color: 'bg-red-500',
      alerts: securityMetrics.adminInternal.privilegeAttempts,
      status: 'secure'
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      description: 'Immutable security event trail and compliance',
      icon: FileText,
      color: 'bg-gray-500',
      alerts: 0,
      status: 'active'
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
      accountAuth: 0.25,
      chatMedia: 0.15,
      paymentsEscrow: 0.35, // Higher weight for financial security
      businessKYC: 0.15,
      adminInternal: 0.10
    };

    let totalScore = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      const metrics = securityMetrics[key];
      const sectionScore = Object.values(metrics).reduce((sum, val) => {
        if (key === 'accountAuth') return sum + (100 - val); // Lower is better for failures
        if (key === 'paymentsEscrow') return sum + (100 - val * 2); // Critical for payments
        return sum + (100 - val);
      }, 0) / Object.keys(metrics).length;
      totalScore += sectionScore * weight;
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Run Security Audit
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
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
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
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Lockdown
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Eye className="h-4 w-4 mr-2" />
            View Live Threats
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <TrendingUp className="h-4 w-4 mr-2" />
            Security Reports
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Clock className="h-4 w-4 mr-2" />
            Audit History
          </button>
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