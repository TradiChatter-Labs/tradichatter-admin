import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, DollarSign, ShoppingBag, BarChart3, PieChart, Activity, Calendar } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 2450000,
      growth: 12.5,
      trend: [1200, 1800, 2100, 1900, 2400, 2200, 2450]
    },
    users: {
      total: 1247,
      active: 892,
      new: 156,
      growth: 8.3
    },
    businesses: {
      total: 89,
      active: 76,
      new: 12,
      growth: 15.2
    },
    orders: {
      total: 3421,
      completed: 3089,
      pending: 245,
      cancelled: 87,
      growth: 22.1
    },
    topBusinesses: [
      { name: 'Mama Ngozi Kitchen', revenue: 450000, orders: 234 },
      { name: 'Tech Solutions Ltd', revenue: 380000, orders: 89 },
      { name: 'Fashion Hub', revenue: 320000, orders: 156 }
    ],
    revenueByCategory: [
      { category: 'Food & Restaurant', amount: 980000, percentage: 40 },
      { category: 'Technology', amount: 612500, percentage: 25 },
      { category: 'Fashion', amount: 490000, percentage: 20 },
      { category: 'Electronics', amount: 245000, percentage: 10 },
      { category: 'Services', amount: 122500, percentage: 5 }
    ]
  });

  const StatCard = ({ title, value, growth, icon: Icon, color = 'blue' }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {growth && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {growth > 0 ? '+' : ''}{growth}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Platform performance and business intelligence overview
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₦${analytics.revenue.total.toLocaleString()}`}
          growth={analytics.revenue.growth}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Active Users"
          value={analytics.users.active.toLocaleString()}
          growth={analytics.users.growth}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Businesses"
          value={analytics.businesses.active}
          growth={analytics.businesses.growth}
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="Total Orders"
          value={analytics.orders.total.toLocaleString()}
          growth={analytics.orders.growth}
          icon={ShoppingBag}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.revenue.trend.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-blue-500 rounded-t"
                  style={{
                    height: `${(value / Math.max(...analytics.revenue.trend)) * 200}px`,
                    width: '30px'
                  }}
                />
                <span className="text-xs text-gray-500 mt-2">
                  Day {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Revenue by Category</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.revenueByCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  />
                  <span className="text-sm text-gray-900">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ₦{item.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Businesses */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Businesses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Order</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.topBusinesses.map((business, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">
                            {business.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{business.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{business.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {business.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{Math.round(business.revenue / business.orders).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">User Growth</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="text-sm font-medium">{analytics.users.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">New This Period</span>
              <span className="text-sm font-medium text-green-600">+{analytics.users.new}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Order Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-green-600">{analytics.orders.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-yellow-600">{analytics.orders.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cancelled</span>
              <span className="text-sm font-medium text-red-600">{analytics.orders.cancelled}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Business Growth</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Businesses</span>
              <span className="text-sm font-medium">{analytics.businesses.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">New This Period</span>
              <span className="text-sm font-medium text-green-600">+{analytics.businesses.new}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}