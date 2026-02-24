import Link from 'next/link';
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingCart, Calendar } from 'lucide-react';

export default function BusinessAnalytics() {
  const metrics = [
    { name: 'Total Revenue', value: '₦2.4M', change: '+15%', icon: DollarSign },
    { name: 'Active Businesses', value: '89', change: '+8%', icon: Users },
    { name: 'Orders This Month', value: '1,247', change: '+23%', icon: ShoppingCart },
    { name: 'Avg Order Value', value: '₦12,500', change: '+5%', icon: TrendingUp }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Comprehensive analytics for business performance and revenue tracking.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{metric.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{metric.value}</div>
                        <div className="ml-2 text-sm font-semibold text-green-600">{metric.change}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trends</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Revenue chart will be implemented here</p>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Growth</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Growth chart will be implemented here</p>
          </div>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}