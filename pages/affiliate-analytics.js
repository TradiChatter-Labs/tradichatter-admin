import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Calendar } from 'lucide-react';

export default function AffiliateAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  
  const performanceData = [
    {
      affiliateId: 'AF001',
      name: 'John Smith',
      referrals: 12,
      conversions: 8,
      conversionRate: 66.7,
      earnings: 45000,
      clicks: 156,
      ctr: 7.7
    },
    {
      affiliateId: 'AF003',
      name: 'Mike Davis',
      referrals: 8,
      conversions: 5,
      conversionRate: 62.5,
      earnings: 23000,
      clicks: 98,
      ctr: 8.2
    },
    {
      affiliateId: 'AF004',
      name: 'Lisa Wilson',
      referrals: 15,
      conversions: 9,
      conversionRate: 60.0,
      earnings: 38000,
      clicks: 203,
      ctr: 7.4
    }
  ];

  const monthlyData = [
    { month: 'Jan', referrals: 45, earnings: 125000 },
    { month: 'Feb', referrals: 52, earnings: 148000 },
    { month: 'Mar', referrals: 38, earnings: 98000 },
    { month: 'Apr', referrals: 61, earnings: 167000 },
    { month: 'May', referrals: 49, earnings: 134000 },
    { month: 'Jun', referrals: 58, earnings: 156000 }
  ];

  const topPerformers = performanceData
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Analyze affiliate performance, conversion rates, and revenue metrics.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">Total Referrals</dt>
                  <dd className="text-lg font-medium text-gray-900">245</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">Avg Conversion Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">63.1%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">₦828K</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">Avg CTR</dt>
                  <dd className="text-lg font-medium text-gray-900">7.8%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Performance Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{data.month}</div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{data.referrals} referrals</span>
                      <span className="font-medium">₦{(data.earnings / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(data.referrals / 70) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {topPerformers.map((affiliate, index) => (
              <div key={affiliate.affiliateId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{affiliate.name}</p>
                    <p className="text-xs text-gray-500">{affiliate.referrals} referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₦{affiliate.earnings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{affiliate.conversionRate}% conv.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Detailed Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affiliate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conv. Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.map((affiliate) => (
                <tr key={affiliate.affiliateId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {affiliate.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{affiliate.name}</div>
                        <div className="text-sm text-gray-500">{affiliate.affiliateId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {affiliate.referrals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {affiliate.conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {affiliate.conversionRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₦{affiliate.earnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {affiliate.ctr}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back to Affiliate Section */}
      <div className="mt-8">
        <Link href="/affiliate-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Affiliate Section
        </Link>
      </div>
    </div>
  );
}