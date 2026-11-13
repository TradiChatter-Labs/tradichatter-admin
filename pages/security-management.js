import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, Users, MessageSquare, CreditCard, Building, Settings, RefreshCw, CheckCircle } from 'lucide-react';

export default function SecurityManagement() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => { fetchMetrics(); }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system/security-audit');
      const json = await res.json();
      if (json.success) {
        setMetrics(json.metrics);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Security fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (count, threshold = 0) => {
    if (count === 0) return 'text-green-600 bg-green-100';
    if (count <= threshold) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const sections = metrics ? [
    {
      title: 'KYC Pending Review',
      description: 'Business identity verifications awaiting admin action',
      icon: Building,
      color: 'bg-green-500',
      count: metrics.pendingKyc,
      status: metrics.pendingKyc === 0 ? 'clear' : 'action required',
      href: '/kyc',
    },
    {
      title: 'AI Escalations Pending',
      description: 'Customer escalations waiting for human response',
      icon: MessageSquare,
      color: 'bg-orange-500',
      count: metrics.pendingEscalations,
      status: metrics.pendingEscalations === 0 ? 'clear' : 'action required',
      href: '/ai-agents',
    },
    {
      title: 'Suspended Users',
      description: 'User accounts currently suspended on the platform',
      icon: Users,
      color: 'bg-blue-500',
      count: metrics.suspendedUsers,
      status: 'info',
      href: '/user-suspension',
    },
    {
      title: 'Failed Backups (24h)',
      description: 'Backup failures in the last 24 hours',
      icon: Shield,
      color: 'bg-red-600',
      count: metrics.failedBackups24h,
      status: metrics.failedBackups24h === 0 ? 'clear' : 'critical',
      href: '/backup-restore',
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Live security metrics from Supabase.
            {lastUpdated && <span className="ml-2 text-gray-400">Updated {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <button onClick={fetchMetrics} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`flex-shrink-0 ${section.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">{section.count}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(section.count, 1)}`}>
                        {section.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Admin Activity */}
      {metrics?.recentAdminActions?.length > 0 && (
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Admin Activity (24h)</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {metrics.recentAdminActions.map((action, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{action.action}</p>
                    <p className="text-xs text-gray-500">Admin: {action.admin_id?.slice(0, 8) || '—'}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {action.created_at ? new Date(action.created_at).toLocaleTimeString() : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/kyc" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Building className="h-4 w-4 mr-2" /> Review KYC Queue
          </Link>
          <Link href="/admin-activity-logs" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Shield className="h-4 w-4 mr-2" /> Full Audit Logs
          </Link>
          <Link href="/user-suspension" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Users className="h-4 w-4 mr-2" /> User Suspensions
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/settings" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Settings
        </Link>
      </div>
    </div>
  );
}
