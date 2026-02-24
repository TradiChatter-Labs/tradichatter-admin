import Link from 'next/link';
import { Store, ShoppingCart, CreditCard, Package, BarChart3, Users, MessageSquare, Shield, Crown, Target } from 'lucide-react';

export default function BusinessSection() {
  const businessFeatures = [
    {
      title: 'Business Management',
      description: 'Manage all registered businesses and their profiles',
      icon: Store,
      href: '/businesses',
      color: 'bg-blue-500',
      implemented: true
    },
    {
      title: 'Orders Management', 
      description: 'Monitor and manage all business orders',
      icon: ShoppingCart,
      href: '/orders',
      color: 'bg-green-500',
      implemented: true
    },
    {
      title: 'Payments & Transactions',
      description: 'Handle payments, disputes, and financial transactions',
      icon: CreditCard,
      href: '/payments',
      color: 'bg-purple-500',
      implemented: true
    },
    {
      title: 'KYC Verification',
      description: 'Manage business verification and compliance',
      icon: Shield,
      href: '/kyc',
      color: 'bg-red-500',
      implemented: true
    },
    {
      title: 'Inventory Management',
      description: 'Monitor stock levels and inventory across businesses',
      icon: Package,
      href: '/inventory',
      color: 'bg-yellow-500',
      implemented: true
    },
    {
      title: 'Business Analytics',
      description: 'View business performance and revenue analytics',
      icon: BarChart3,
      href: '/business-analytics',
      color: 'bg-indigo-500',
      implemented: true
    },
    {
      title: 'Marketing Management',
      description: 'Oversee marketing campaigns and promotions',
      icon: MessageSquare,
      href: '/marketing-management',
      color: 'bg-pink-500',
      implemented: true
    },
    {
      title: 'Team Management',
      description: 'Manage business teams and permissions',
      icon: Users,
      href: '/team-management',
      color: 'bg-teal-500',
      implemented: true
    },
    {
      title: 'Delivery Management',
      description: 'Manage delivery services and logistics',
      icon: Package,
      href: '/delivery-management',
      color: 'bg-orange-500',
      implemented: true
    },
    {
      title: 'Financial Reports',
      description: 'View comprehensive financial reports',
      icon: BarChart3,
      href: '/financial',
      color: 'bg-emerald-500',
      implemented: true
    },
    {
      title: 'Escrow Management',
      description: 'Manage escrow transactions and disputes',
      icon: Shield,
      href: '/escrow',
      color: 'bg-cyan-500',
      implemented: true
    },
    {
      title: 'Subscription Management',
      description: 'Monitor business subscriptions, trials, and billing',
      icon: Crown,
      href: '/subscription-management',
      color: 'bg-amber-500',
      implemented: true
    },
    {
      title: 'Advertising Management',
      description: 'Manage business advertisements and campaign approvals',
      icon: Target,
      href: '/advertising-management',
      color: 'bg-rose-500',
      implemented: true
    }
  ];

  const stats = [
    { label: 'Total Businesses', value: '89', change: '+8%' },
    { label: 'Active Orders', value: '245', change: '+15%' },
    { label: 'Pending KYC', value: '12', change: '-5%' },
    { label: 'Revenue Today', value: '₦125K', change: '+22%' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Business Section</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage all business-related operations, from registration to revenue tracking.
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
        {businessFeatures.map((feature) => {
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