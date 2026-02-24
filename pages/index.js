import Link from 'next/link';
import { Users, Store, DollarSign, BarChart3, ShoppingCart, CreditCard, TrendingUp, Settings, Shield, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Total Users', value: '1,247', icon: Users, change: '+12%' },
    { name: 'Active Businesses', value: '89', icon: Store, change: '+8%' },
    { name: 'Total Orders', value: '3,421', icon: ShoppingCart, change: '+23%' },
    { name: 'Revenue', value: '₦2.4M', icon: CreditCard, change: '+15%' },
  ];

  const sections = [
    {
      title: 'Business Section',
      description: 'Manage businesses, orders, payments, and business operations',
      icon: Store,
      color: 'bg-blue-500',
      href: '/business-section',
      features: ['Business Management', 'Orders & Payments', 'KYC Verification', 'Inventory', 'Marketing']
    },
    {
      title: 'Customer Section', 
      description: 'Manage customers, support, reviews, and customer analytics',
      icon: Users,
      color: 'bg-green-500',
      href: '/customer-section',
      features: ['User Management', 'Customer Support', 'Reviews', 'Chat Moderation', 'Analytics']
    },
    {
      title: 'Affiliate Section',
      description: 'Manage affiliate program, commissions, and affiliate analytics', 
      icon: DollarSign,
      color: 'bg-purple-500',
      href: '/affiliate-section',
      features: ['Affiliate Management', 'Commission Tracking', 'Payouts', 'Performance Analytics']
    },
    {
      title: 'Content Moderation',
      description: 'Manage content moderation, user suspensions, and platform safety',
      icon: Shield,
      color: 'bg-red-500',
      href: '/content-moderation',
      features: ['Reported Content', 'Moderation Rules', 'Content Takedown', 'User Suspension']
    },
    {
      title: 'System Configuration',
      description: 'Manage system settings, feature flags, and platform configuration',
      icon: Settings,
      color: 'bg-orange-500',
      href: '/system-configuration',
      features: ['Feature Flags', 'App Configuration', 'Notification Templates', 'Maintenance Mode']
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">TradiChatt Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your platform across three main sections: Business, Customer, and Affiliate operations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 mb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${section.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {section.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Access Section →
                    </span>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-9">
            <Link href="/admin-users" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Users className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Admin Users</div>
            </Link>
            <Link href="/admin-activity-logs" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <BarChart3 className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Activity Logs</div>
            </Link>
            <Link href="/admin-2fa" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <CreditCard className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Two-Factor Auth</div>
            </Link>
            <Link href="/analytics" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Analytics</div>
            </Link>
            <Link href="/content-moderation" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Content Moderation</div>
            </Link>
            <Link href="/kyc" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Store className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">KYC Verification</div>
            </Link>
            <Link href="/payments" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Payments</div>
            </Link>
            <Link href="/feature-flags" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Settings className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Feature Flags</div>
            </Link>
            <Link href="/system-monitoring" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">System Monitoring</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}