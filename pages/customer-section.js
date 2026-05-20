import Link from 'next/link';
import { Users, MessageSquare, Star, BarChart3, Headphones, UserCheck, Settings, TrendingUp } from 'lucide-react';

export default function CustomerSection() {
  const customerFeatures = [
    {
      title: 'User Management',
      description: 'Manage customer accounts, profiles, and permissions',
      icon: Users,
      href: '/users',
      color: 'bg-blue-500',
      implemented: true
    },
    {
      title: 'Chat Moderation',
      description: 'Monitor and moderate customer conversations',
      icon: MessageSquare,
      href: '/chat-moderation',
      color: 'bg-green-500',
      implemented: true
    },
    {
      title: 'Reviews Management',
      description: 'Manage customer reviews and ratings',
      icon: Star,
      href: '/reviews-management',
      color: 'bg-yellow-500',
      implemented: true
    },
    {
      title: 'Customer Support',
      description: 'Handle customer support tickets and inquiries',
      icon: Headphones,
      href: '/customer-support',
      color: 'bg-red-500',
      implemented: true
    }
  ];

  const stats = [
    { label: 'Total Customers', value: '1,247', change: '+12%' },
    { label: 'Active Today', value: '342', change: '+8%' },
    { label: 'Support Tickets', value: '23', change: '-15%' },
    { label: 'Avg Rating', value: '4.6', change: '+0.2' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Section</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage customer relationships, support, and engagement across the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
              <dd className="mt-1 flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                <div className="ml-2 text-sm font-semibold text-green-600">{stat.change}</div>
              </dd>
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customerFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="relative">
              {feature.implemented ? (
                <Link href={feature.href}>
                  <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 ${feature.color} rounded-md p-3`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-sm font-medium text-blue-600">
                          Access Feature →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg opacity-60">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 ${feature.color} rounded-md p-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-400">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      In Development
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Back to Dashboard */}
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}