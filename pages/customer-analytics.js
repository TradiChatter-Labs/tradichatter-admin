import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerAnalytics() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    setStats({
      totalCustomers: 1250,
      activeCustomers: 890,
      newCustomers: 45,
      avgOrderValue: 85500
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Total Customers</dt>
            <dd className="mt-1 text-3xl font-bold text-gray-900">{stats.totalCustomers}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Active Customers</dt>
            <dd className="mt-1 text-3xl font-bold text-gray-900">{stats.activeCustomers}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">New This Month</dt>
            <dd className="mt-1 text-3xl font-bold text-gray-900">{stats.newCustomers}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Avg Order Value</dt>
            <dd className="mt-1 text-3xl font-bold text-gray-900">₦{stats.avgOrderValue?.toLocaleString()}</dd>
          </div>
        </div>
      </div>

      {/* Back to Customer Section */}
      <div className="mt-8">
        <Link href="/customer-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Customer Section
        </Link>
      </div>
    </div>
  );
}