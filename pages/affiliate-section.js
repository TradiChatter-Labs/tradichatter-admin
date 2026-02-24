import Link from 'next/link';
import { DollarSign, Users, TrendingUp, CreditCard, UserPlus, BarChart3, Award, Settings, Banknote } from 'lucide-react';

export default function AffiliateSection() {
  const affiliateFeatures = [
    {
      title: 'Affiliate Management',
      description: 'Manage affiliate registrations and approvals',
      icon: Users,
      href: '/affiliate-management',
      color: 'bg-blue-500',
      implemented: true
    },
    {
      title: 'Commission Tracking',
      description: 'Track affiliate commissions and earnings',
      icon: DollarSign,
      href: '/commission-tracking',
      color: 'bg-green-500',
      implemented: true
    },
    {
      title: 'Affiliate Analytics',
      description: 'Analyze affiliate performance and metrics',
      icon: BarChart3,
      href: '/affiliate-analytics',
      color: 'bg-purple-500',
      implemented: true
    },
    {
      title: 'Payout Management',
      description: 'Process affiliate payments and withdrawals',
      icon: CreditCard,
      href: '/affiliate-payouts',
      color: 'bg-red-500',
      implemented: true
    },
    {
      title: 'Registration Approval',
      description: 'Review and approve new affiliate applications',
      icon: UserPlus,
      href: '/affiliate-approvals',
      color: 'bg-yellow-500',
      implemented: true
    },
    {
      title: 'Leaderboard Management',
      description: 'Manage affiliate rankings and competitions',
      icon: Award,
      href: '/affiliate-leaderboard',
      color: 'bg-indigo-500',
      implemented: true
    },
    {
      title: 'Withdrawals Management',
      description: 'Manage affiliate withdrawal requests and payouts',
      icon: Banknote,
      href: '/withdrawals',
      color: 'bg-rose-500',
      implemented: true
    }
  ];

  const stats = [
    { label: 'Total Affiliates', value: '156', change: '+24%' },
    { label: 'Active This Month', value: '89', change: '+18%' },
    { label: 'Pending Payouts', value: '₦45K', change: '+12%' },
    { label: 'Total Commissions', value: '₦234K', change: '+35%' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Section</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage the affiliate program, track performance, and process commissions.
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

      {/* Success Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <Award className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Affiliate Section Complete
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                All affiliate management features are now fully operational. You can manage affiliates, track commissions, process payouts, and analyze performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {affiliateFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.title} href={feature.href}>
              <div className="relative hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-white overflow-hidden shadow rounded-lg">
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
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Access Feature →
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </Link>
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