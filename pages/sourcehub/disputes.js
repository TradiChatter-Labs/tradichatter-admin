import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export default function SourceHubDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [total, setTotal] = useState(0);
  const [resolveModal, setResolveModal] = useState(null);
  const [resolution, setResolution] = useState({ winner: 'buyer', reason: '', refund_amount: 0 });

  useEffect(() => { fetchDisputes(); }, [filter]);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/sourcehub/disputes?${params}`);
      const json = await res.json();
      if (json.success) {
        setDisputes(json.disputes || []);
        setTotal(json.total || 0);
      }
    } catch (err) {
      console.error('Fetch disputes error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolution.reason) { alert('Reason is required'); return; }
    try {
      const res = await fetch('/api/sourcehub/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispute_id: resolveModal.id,
          resolution: 'resolved',
          winner: resolution.winner,
          reason: resolution.reason,
          refund_amount: resolution.refund_amount,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResolveModal(null);
        setResolution({ winner: 'buyer', reason: '', refund_amount: 0 });
        fetchDisputes();
      } else {
        alert('Resolution failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      escalated: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SourceHub — Disputes</h1>
        <p className="mt-1 text-sm text-gray-600">Review and resolve B2B order disputes between buyers and suppliers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Total Disputes</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Open</p>
          <p className="text-2xl font-bold text-red-600">{disputes.filter(d => d.status === 'open' || d.status === 'pending').length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{disputes.filter(d => d.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>
        <button onClick={fetchDisputes} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : disputes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No disputes found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{dispute.id?.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{dispute.order_id?.slice(0, 8) || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{dispute.buyer_name || dispute.buyer_id?.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{dispute.supplier_name || dispute.supplier_id?.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{dispute.reason || '—'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${(dispute.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispute.status)}`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {(dispute.status === 'open' || dispute.status === 'pending' || dispute.status === 'escalated') && (
                      <button
                        onClick={() => setResolveModal(dispute)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Resolve Modal */}
      {resolveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resolve Dispute</h3>
            <p className="text-sm text-gray-500 mb-4">Dispute: {resolveModal.id?.slice(0, 8)} — ${(resolveModal.amount || 0).toLocaleString()}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Winner</label>
                <select
                  value={resolution.winner}
                  onChange={(e) => setResolution({ ...resolution, winner: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="buyer">Buyer (refund)</option>
                  <option value="supplier">Supplier (release funds)</option>
                  <option value="split">Split</option>
                </select>
              </div>
              {(resolution.winner === 'buyer' || resolution.winner === 'split') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount ($)</label>
                  <input
                    type="number"
                    value={resolution.refund_amount}
                    onChange={(e) => setResolution({ ...resolution, refund_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    max={resolveModal.amount}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <textarea
                  value={resolution.reason}
                  onChange={(e) => setResolution({ ...resolution, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Explain the resolution decision..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setResolveModal(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleResolve} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
