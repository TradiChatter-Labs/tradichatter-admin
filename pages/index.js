import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Store, DollarSign, BarChart3, ShoppingCart, CreditCard, TrendingUp, Settings, Shield, Activity, Globe, Bot, Truck, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/system/dashboard-stats');
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: 'Retail App (Business)',
      description: 'Manage sellers, orders, payments, escrow, subscriptions',
      icon: Store,
      color: 'bg-blue-500',
      href: '/business-section',
      features: ['Business Management', 'Orders & Escrow', 'Subscriptions', 'KYC', 'Payments']
    },
    {
      title: 'Retail App (Customer)',
      description: 'Manage buyers, support, reviews, chat moderation',
      icon: Users,
      color: 'bg-green-500',
      href: '/customer-section',
      features: ['User Management', 'Customer Support', 'Chat Moderation', 'Call Management']
    },
    {
      title: 'SourceHub (B2B)',
      description: 'Suppliers, wholesale orders, escrow, logistics, treasury',
      icon: Truck,
      color: 'bg-indigo-500',
      href: '/sourcehub',
      features: ['Supplier Management', 'Wholesale Orders', 'Escrow & Treasury', 'Disputes', 'Logistics']
    },
    {
      title: 'AI Agents',
      description: 'Monitor and control 6 AI agents for Premium sellers',
      icon: Bot,
      color: 'bg-purple-500',
      href: '/ai-agents',
      features: ['Agent Dashboard', 'Conversation Logs', 'Kill Switch', 'Knowledge Base']
    },
    {
      title: 'Voice & Video',
      description: 'Translation pipeline, call monitoring, language config',
      icon: Globe,
      color: 'bg-teal-500',
      href: '/voice-translation',
      features: ['Pipeline Health', 'Language Config', 'Call Monitoring', 'Latency Metrics']
    },
    {
      title: 'AVS Engine',
      description: 'Supplier verification, trust scores, badge management',
      icon: Shield,
      color: 'bg-red-500',
      href: '/avs-engine',
      features: ['Verification Queue', 'Badge Management', 'Weight Tuning', 'Audit Trail']
    },
    {
      title: 'Affiliate Program',
      description: 'Manage affiliates, commissions, payouts, analytics',
      icon: DollarSign,
      color: 'bg-amber-500',
      href: '/affiliate-section',
      features: ['Affiliate Management', 'Commission Tracking', 'Payouts', 'Leaderboard']
    },
    {
      title: 'System & Config',
      description: 'Feature flags, monitoring, maintenance, security',
      icon: Settings,
      color: 'bg-gray-600',
      href: '/system-configuration',
      features: ['Feature Flags', 'System Monitoring', 'Maintenance Mode', 'Security Audit']
    },
  ];

  const getHealthIcon = (status) => {
    if (status === 'healthy') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'timeout' || status === 'degraded') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">TradiChatter Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Unified control panel for all TradiChatter systems — Retail, SourceHub, AI, Voice, AVS.
        </p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-500" />
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.totalUsers?.toLocaleString()}</dd>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <Store className="h-6 w-6 text-green-500" />
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Businesses</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.activeBusinesses?.toLocaleString()}</dd>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <ShoppingCart className="h-6 w-6 text-orange-500" />
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.totalOrders?.toLocaleString()}</dd>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 text-purple-500" />
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                  <dd className="text-2xl font-semibold text-gray-900">₦{(stats.totalRevenue || 0).toLocaleString()}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Health Bar */}
      {stats?.services && (
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Service Health</h3>
            <span className="text-xs text-gray-500">
              {stats.systemHealth?.healthy}/{stats.systemHealth?.total} healthy
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(stats.services).map(([key, svc]) => (
              <div key={key} className="flex items-center space-x-2 p-2 rounded border border-gray-100">
                {getHealthIcon(svc.status)}
                <div>
                  <div className="text-xs font-medium text-gray-700">{svc.name}</div>
                  <div className="text-xs text-gray-400">{svc.latency}ms</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 mb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${section.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ul className="text-sm text-gray-500 space-y-1">
                      {section.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Access */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <Link href="/feature-flags" className="text-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Settings className="h-6 w-6 text-orange-500 mx-auto mb-1" />
              <div className="text-xs font-medium text-gray-900">Feature Flags</div>
            </Link>
            <Link href="/system-monitoring" className="text-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Activity className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <div className="text-xs font-medium text-gray-900">Monitoring</div>
            </Link>
            <Link href="/escrow" className="text-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Shield className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <div className="text-xs font-medium text-gray-900">Escrow</div>
            </Link>
            <Link href="/subscription-management" className="text-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <CreditCard className="h-6 w-6 text-purple-500 mx-auto mb-1" />
              <div className="text-xs font-medium text-gray-900">Subscriptions</div>
            </Link>
            <Link href="/kyc" className="text-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Users className="h-6 w-6 text-red-500 mx-auto mb-1" />
              <div className="text-xs font-medium text-gray-900">KYC</div>
            </Link>
            <Link href="/admin-activity-logs" className="text-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <BarChart3 className="h-6 w-6 text-gray-500 mx-auto mb-1" />
              <div className="text-xs font-medium text-gray-900">Audit Logs</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
