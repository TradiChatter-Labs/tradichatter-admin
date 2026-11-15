import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, CheckCircle, AlertTriangle, Clock, Package } from 'lucide-react';

export default function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => { fetchDeliveries(); }, [filter]);

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/delivery?filter=${filter}&limit=50`);
      const json = await res.json();
      if (json.success) {
        setDeliveries(json.deliveries);
        setTotal(json.total);
        setStats(json.stats);
      } else {
        setError(json.error || 'Failed to load');
      }
    } catch (e) { setError('Network error'); }
    finally { setLoading(false); }
  };

  const statusColor = (s) => ({
    pending:    'bg-yellow-100 text-yellow-800',
    booked:     'bg-blue-100 text-blue-800',
    picked_up:  'bg-purple-100 text-purple-800',
    in_transit: 'bg-orange-100 text-orange-800',
    delivered:  'bg-green-100 text-green-800',
    failed:     'bg-red-100 text-red-800',
  }[s] || 'bg-gray-100 text-gray-800');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
          <p className="text-sm text-gray-500 mt-1">Platform-wide delivery tracking across all businesses</p>
        </div>
        <button onClick={fetchDeliveries} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Refresh</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Package className="h-6 w-6 text-blue-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{stats.total || 0}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Clock className="h-6 w-6 text-yellow-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{stats.pending || 0}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Truck className="h-6 w-6 text-orange-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">In Transit</p><p className="text-2xl font-bold">{stats.in_transit || 0}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Delivered</p><p className="text-2xl font-bold">{stats.delivered || 0}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Failed</p><p className="text-2xl font-bold">{stats.failed || 0}</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'booked', 'in_transit', 'delivered', 'failed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : deliveries.length === 0 ? (
          <div className="p-12 text-center">
            <Truck className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No deliveries found</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter !== 'all' ? `No ${filter.replace('_', ' ')} deliveries.` : 'Deliveries will appear here once sellers start arranging them via the mobile app.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map(d => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">#{d.id?.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{d.businesses?.business_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{d.customer_name || d.customer_id?.slice(0, 8) || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">{d.delivery_provider || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor(d.delivery_status)}`}>
                        {d.delivery_status?.replace('_', ' ') || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{d.delivery_fee ? `₦${d.delivery_fee.toLocaleString()}` : '—'}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">{d.delivery_tracking_number || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{d.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {total > 50 && (
              <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">Showing 50 of {total} deliveries</div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/orders" className="text-blue-600 hover:text-blue-800 font-medium">→ All Orders</Link>
        <Link href="/financial" className="text-blue-600 hover:text-blue-800 font-medium">→ Financial Dashboard</Link>
      </div>
    </div>
  );
}
