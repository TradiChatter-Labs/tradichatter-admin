import { useState, useEffect } from 'react';
import { CreditCard, Search, RefreshCw, DollarSign, TrendingUp } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchPayments(); }, [page, statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/payments?${params}`);
      const json = await res.json();
      if (json.success) { setPayments(json.payments); setTotal(json.total); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const totalPaid = payments.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + (p.total_amount || 0), 0);
  const totalFees = payments.reduce((sum, p) => sum + (p.platform_commission_cents || 0) + (p.escrow_fee_cents || 0), 0) / 100;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-600">All payment transactions across the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4"><div className="flex items-center"><DollarSign className="h-5 w-5 text-green-500 mr-2" /><div><p className="text-sm text-gray-500">Total Paid (this page)</p><p className="text-2xl font-bold text-green-600">₦{totalPaid.toLocaleString()}</p></div></div></div>
        <div className="bg-white shadow rounded-lg p-4"><div className="flex items-center"><TrendingUp className="h-5 w-5 text-purple-500 mr-2" /><div><p className="text-sm text-gray-500">Platform Fees</p><p className="text-2xl font-bold text-purple-600">₦{totalFees.toLocaleString()}</p></div></div></div>
        <div className="bg-white shadow rounded-lg p-4"><div className="flex items-center"><CreditCard className="h-5 w-5 text-blue-500 mr-2" /><div><p className="text-sm text-gray-500">Total Transactions</p><p className="text-2xl font-bold">{total}</p></div></div></div>
      </div>

      <div className="flex gap-4 mb-6">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <button onClick={fetchPayments} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{p.payment_reference?.slice(0, 12) || p.id?.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{p.business_name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{p.customer_name || '—'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₦{(p.total_amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{p.payment_method || '—'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.payment_status === 'paid' ? 'bg-green-100 text-green-800' : p.payment_status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.payment_status || 'pending'}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-700">₦{((p.platform_commission_cents || 0) / 100).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
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
