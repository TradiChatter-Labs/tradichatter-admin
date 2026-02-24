import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Eye, MousePointer, DollarSign, 
  Users, Calendar, Download, Filter, Search 
} from 'lucide-react';

const AdvertisingAnalytics = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock analytics data
  const overviewMetrics = {
    totalRevenue: 125000,
    totalImpressions: 2500000,
    totalClicks: 125000,
    averageCTR: 5.2,
    totalCampaigns: 450,
    activeCampaigns: 280,
    revenueGrowth: 15.3,
    impressionGrowth: 8.7
  };

  const revenueData = [
    { month: 'Jan', revenue: 8500, campaigns: 35 },
    { month: 'Feb', revenue: 12000, campaigns: 42 },
    { month: 'Mar', revenue: 15500, campaigns: 48 },
    { month: 'Apr', revenue: 18000, campaigns: 55 },
    { month: 'May', revenue: 22000, campaigns: 62 },
    { month: 'Jun', revenue: 25000, campaigns: 68 }
  ];

  const topPerformers = [
    { business: 'TechCorp Solutions', revenue: 8500, campaigns: 12, ctr: 6.8 },
    { business: 'Fashion Hub', revenue: 7200, campaigns: 8, ctr: 5.9 },
    { business: 'Food Paradise', revenue: 6800, campaigns: 15, ctr: 5.4 },
    { business: 'Auto Services', revenue: 5900, campaigns: 6, ctr: 7.2 },
    { business: 'Health Plus', revenue: 5200, campaigns: 9, ctr: 4.8 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/advertising-management" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Advertising Management
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Advertising Analytics</h1>
            <p className="text-gray-600">Comprehensive insights and performance metrics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="lastyear">Last Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">${overviewMetrics.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+{overviewMetrics.revenueGrowth}%</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Impressions</p>
              <p className="text-2xl font-bold">{(overviewMetrics.totalImpressions / 1000000).toFixed(1)}M</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-500">+{overviewMetrics.impressionGrowth}%</span>
              </div>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold">{(overviewMetrics.totalClicks / 1000).toFixed(0)}K</p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">CTR: {overviewMetrics.averageCTR}%</span>
              </div>
            </div>
            <MousePointer className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold">{overviewMetrics.activeCampaigns}</p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">of {overviewMetrics.totalCampaigns} total</span>
              </div>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Revenue & Campaign Growth</h3>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Top Performing Businesses</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <select 
                value={selectedMetric} 
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Metrics</option>
                <option value="revenue">Revenue</option>
                <option value="ctr">CTR</option>
                <option value="campaigns">Campaigns</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topPerformers.map((business, index) => (
              <div key={business.business} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{business.business}</h3>
                    <p className="text-sm text-gray-500">{business.campaigns} active campaigns</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold">${business.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{business.ctr}%</p>
                    <p className="text-sm text-gray-500">CTR</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    business.ctr > 6 ? 'bg-green-100 text-green-800' : 
                    business.ctr > 5 ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {business.ctr > 6 ? "Excellent" : business.ctr > 5 ? "Good" : "Average"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisingAnalytics;