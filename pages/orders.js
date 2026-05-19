import { useState, useEffect } from 'react';
import { ShoppingCart, Search, RefreshCw, DollarSign } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/orders?${params}`);
      const json = await res.json();
      if (json.success) { setOrders(json.orders); setTotal(json.total); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getStatusColor = (status) => {
    const colors = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800', delivered: 'bg-green-100 text-green-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', refunded: 'bg-purple-100 text-purple-800' };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-600">All orders across the retail platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold">{total}</p></div>
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p></div>
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Completed</p><p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'completed' || o.status === 'delivered').length}</p></div>
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Revenue (this page)</p><p className="text-2xl font-bold text-blue-600">₦{totalRevenue.toLocaleString()}</p></div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search by business or customer..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchOrders()} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{order.id?.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.business_name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.customer_name || '—'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₦{(order.total_amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></td>
                  <td className="px-6 py-4"><span className={`text-xs ${order.payment_status === 'paid' ? 'text-green-600' : 'text-gray-500'}`}>{order.payment_status || 'unpaid'}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {total > 50 && (
        <div className="flex justify-between items-center mt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-md disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {Math.ceil(total / 50)}</span>
          <button disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-md disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
