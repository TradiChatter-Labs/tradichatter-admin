import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

export default function CRMActivity() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crm');
      const json = await res.json();
      if (json.success) setData(json);
      else setError(json.error || 'Failed to load');
    } catch (e) { setError('Network error'); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-700">{error}</p>
      <button onClick={fetchData} className="mt-3 px-4 py-2 bg-red-600 text-white rounded text-sm">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Activity</h1>
          <p className="text-sm text-gray-500 mt-1">Customer relationship overview across all businesses — derived from orders</p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Refresh</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Businesses</p><p className="text-2xl font-bold">{data?.stats?.totalBusinesses || 0}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Users className="h-6 w-6 text-green-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Unique Customers</p><p className="text-2xl font-bold">{data?.stats?.totalUniqueCustomers || 0}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <ShoppingCart className="h-6 w-6 text-purple-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold">{data?.stats?.totalOrders || 0}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <DollarSign className="h-6 w-6 text-yellow-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Total Revenue</p><p className="text-xl font-bold">₦{(data?.stats?.totalRevenue || 0).toLocaleString()}</p></div>
        </div>
      </div>

      {/* Top Businesses by CRM Activity */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Businesses by Customer Activity</h3>
          <p className="text-sm text-gray-400 mt-0.5">Ranked by total orders. Customer counts derived from order records.</p>
        </div>
        {(data?.businesses || []).length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-200" />
            <p>No order data found. CRM activity will appear once businesses start receiving orders.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unique Customers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data?.businesses || []).map((b, i) => (
                <tr key={b.business_id} className={i < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 text-sm font-bold text-gray-500">{i + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.business_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{b.total_orders}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{b.unique_customers}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">₦{(b.total_revenue || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{b.last_order_at?.split('T')[0] || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/orders" className="text-blue-600 hover:text-blue-800 font-medium">→ Orders</Link>
        <Link href="/businesses" className="text-blue-600 hover:text-blue-800 font-medium">→ Businesses</Link>
      </div>
    </div>
  );
}
