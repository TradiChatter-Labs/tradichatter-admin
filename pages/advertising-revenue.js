import { useState } from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, Calendar, Download, BarChart3, PieChart } from 'lucide-react';

export default function AdvertisingRevenue() {
  const [timeRange, setTimeRange] = useState('30d');
  
  const revenueData = {
    '7d': {
      totalRevenue: 8750,
      platformFee: 875,
      totalSpend: 87500,
      campaigns: 12,
      avgCPC: 45,
      avgCPM: 1200
    },
    '30d': {
      totalRevenue: 35200,
      platformFee: 3520,
      totalSpend: 352000,
      campaigns: 48,
      avgCPC: 42,
      avgCPM: 1150
    },
    '90d': {
      totalRevenue: 98600,
      platformFee: 9860,
      totalSpend: 986000,
      campaigns: 134,
      avgCPC: 38,
      avgCPM: 1080
    }
  };

  const monthlyRevenue = [
    { month: 'Oct 2023', revenue: 28500, spend: 285000, campaigns: 42 },
    { month: 'Nov 2023', revenue: 31200, spend: 312000, campaigns: 45 },
    { month: 'Dec 2023', revenue: 35800, spend: 358000, campaigns: 52 },
    { month: 'Jan 2024', revenue: 35200, spend: 352000, campaigns: 48 }
  ];

  const businessRevenue = [
    { business: 'Fashion Hub', revenue: 4500, spend: 45000, campaigns: 8 },
    { business: 'Tech Solutions Ltd', revenue: 3200, spend: 32000, campaigns: 6 },
    { business: 'Food Corner', revenue: 2800, spend: 28000, campaigns: 5 },
    { business: 'Electronics Store', revenue: 2500, spend: 25000, campaigns: 4 },
    { business: 'Beauty Store', revenue: 1900, spend: 19000, campaigns: 3 }
  ];

  const adTypeRevenue = [
    { type: 'Sponsored Messages', revenue: 15600, percentage: 44.3 },
    { type: 'Discovery Banners', revenue: 12800, percentage: 36.4 },
    { type: 'Promoted Business', revenue: 6800, percentage: 19.3 }
  ];

  const currentData = revenueData[timeRange];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Advertising Revenue Reports</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track advertising revenue, analyze performance metrics, and generate financial reports.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
              <dd className="text-2xl font-semibold text-green-600">₦{currentData.totalRevenue.toLocaleString()}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <dt className="text-sm font-medium text-gray-500">Platform Fee (10%)</dt>
              <dd className="text-2xl font-semibold text-blue-600">₦{currentData.platformFee.toLocaleString()}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <dt className="text-sm font-medium text-gray-500">Total Ad Spend</dt>
              <dd className="text-2xl font-semibold text-purple-600">₦{currentData.totalSpend.toLocaleString()}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <dt className="text-sm font-medium text-gray-500">Active Campaigns</dt>
              <dd className="text-2xl font-semibold text-orange-600">{currentData.campaigns}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">₦{currentData.avgCPC}</div>
            <div className="text-sm text-gray-500">Average Cost Per Click</div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₦{currentData.avgCPM}</div>
            <div className="text-sm text-gray-500">Average Cost Per Mille</div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Monthly Revenue Trend</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad Spend</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaigns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyRevenue.map((month, index) => {
                  const prevMonth = index > 0 ? monthlyRevenue[index - 1] : null;
                  const growth = prevMonth ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1) : 0;
                  
                  return (
                    <tr key={month.month}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{month.month}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-semibold">₦{month.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₦{month.spend.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{month.campaigns}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growth >= 0 ? '+' : ''}{growth}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue by Business */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Revenue Generating Businesses</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {businessRevenue.map((business, index) => (
                <div key={business.business} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{business.business}</div>
                      <div className="text-xs text-gray-500">{business.campaigns} campaigns</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">₦{business.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">₦{business.spend.toLocaleString()} spend</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Revenue by Ad Type</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {adTypeRevenue.map((type) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PieChart className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{type.type}</div>
                      <div className="text-xs text-gray-500">{type.percentage}% of total</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">₦{type.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Revenue Summary ({timeRange})</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">₦{currentData.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Platform Revenue</div>
              <div className="text-xs text-gray-400 mt-1">10% of total ad spend</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{currentData.campaigns}</div>
              <div className="text-sm text-gray-500 mt-1">Total Campaigns</div>
              <div className="text-xs text-gray-400 mt-1">Revenue generating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">₦{Math.round(currentData.totalRevenue / currentData.campaigns).toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Avg Revenue per Campaign</div>
              <div className="text-xs text-gray-400 mt-1">Platform earnings</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/advertising-management" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Advertising Management
        </Link>
      </div>
    </div>
  );
}