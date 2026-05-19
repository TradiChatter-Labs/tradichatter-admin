import { useState, useEffect } from 'react';
import { BarChart3, Users, Store, ShoppingCart, DollarSign, TrendingUp, Crown, Shield, RefreshCw } from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      if (json.success) setStats(json.stats);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!stats) return <div className="text-center py-12 text-gray-500">Failed to load analytics.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600">Platform-wide metrics and growth data.</p>
        </div>
        <button onClick={fetchAnalytics} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Users */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center"><Users className="h-5 w-5 mr-2 text-blue-500" /> Users</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold">{stats.users.total}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Active</p><p className="text-xl font-bold text-green-600">{stats.users.active}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">New (30d)</p><p className="text-xl font-bold text-blue-600">{stats.users.new_30d}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">New (7d)</p><p className="text-xl font-bold text-purple-600">{stats.users.new_7d}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Sellers</p><p className="text-xl font-bold">{stats.users.sellers}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Buyers</p><p className="text-xl font-bold">{stats.users.buyers}</p></div>
        </div>
      </div>

      {/* Businesses */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center"><Store className="h-5 w-5 mr-2 text-green-500" /> Businesses</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold">{stats.businesses.total}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Active</p><p className="text-xl font-bold text-green-600">{stats.businesses.active}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Verified</p><p className="text-xl font-bold text-blue-600">{stats.businesses.verified}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Premium</p><p className="text-xl font-bold text-purple-600">{stats.businesses.premium}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">New (30d)</p><p className="text-xl font-bold text-orange-600">{stats.businesses.new_30d}</p></div>
        </div>
      </div>

      {/* Orders & Revenue */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center"><ShoppingCart className="h-5 w-5 mr-2 text-orange-500" /> Orders & Revenue</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Total Orders</p><p className="text-xl font-bold">{stats.orders.total}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Completed</p><p className="text-xl font-bold text-green-600">{stats.orders.completed}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Pending</p><p className="text-xl font-bold text-yellow-600">{stats.orders.pending}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Total Revenue</p><p className="text-xl font-bold text-green-600">₦{stats.orders.total_revenue.toLocaleString()}</p></div>
          <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Revenue (30d)</p><p className="text-xl font-bold text-blue-600">₦{stats.orders.revenue_30d.toLocaleString()}</p></div>
        </div>
      </div>

      {/* Subscriptions & Escrow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center"><Crown className="h-5 w-5 mr-2 text-purple-500" /> Subscriptions</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold">{stats.subscriptions.total}</p></div>
            <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Active</p><p className="text-xl font-bold text-green-600">{stats.subscriptions.active}</p></div>
            <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Trial</p><p className="text-xl font-bold text-blue-600">{stats.subscriptions.trial}</p></div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center"><Shield className="h-5 w-5 mr-2 text-red-500" /> Escrow</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold">{stats.escrow.total}</p></div>
            <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Active</p><p className="text-xl font-bold text-blue-600">{stats.escrow.active}</p></div>
            <div className="bg-white shadow rounded-lg p-4"><p className="text-xs text-gray-500">Held</p><p className="text-xl font-bold text-orange-600">₦{stats.escrow.total_held.toLocaleString()}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
