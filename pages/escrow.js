import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, DollarSign, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export default function EscrowManagement() {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchEscrows(); }, [filter]);

  const fetchEscrows = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/escrow?${params}`);
      const json = await res.json();
      if (json.success) {
        setEscrows(json.escrows);
        setTotal(json.total);
      }
    } catch (err) {
      console.error('Fetch escrows error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status, notes = '') => {
    if (!confirm(`Are you sure you want to ${status} this escrow?`)) return;
    try {
      const res = await fetch('/api/escrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, admin_notes: notes }),
      });
      const json = await res.json();
      if (json.success) fetchEscrows();
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-blue-100 text-blue-800',
      funded: 'bg-blue-100 text-blue-800',
      released: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const activeCount = escrows.filter(e => ['active', 'funded'].includes(e.status)).length;
  const disputedCount = escrows.filter(e => e.status === 'disputed').length;
  const totalValue = escrows.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Escrow Management</h1>
        <button onClick={fetchEscrows} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Disputed</p>
              <p className="text-2xl font-bold text-red-600">{disputedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-green-600">₦{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'funded', 'disputed', 'released', 'completed', 'refunded'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : escrows.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No escrows found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {escrows.map((escrow) => (
                <tr key={escrow.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{escrow.id?.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{escrow.buyer_id?.slice(0, 8) || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{escrow.seller_id?.slice(0, 8) || '—'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₦{(escrow.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(escrow.status)}`}>
                      {escrow.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {escrow.created_at ? new Date(escrow.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {escrow.status === 'disputed' && (
                      <button onClick={() => handleAction(escrow.id, 'released', 'Admin resolved dispute')} className="text-green-600 hover:text-green-800 font-medium">
                        Release
                      </button>
                    )}
                    {['active', 'funded'].includes(escrow.status) && (
                      <button onClick={() => handleAction(escrow.id, 'released')} className="text-green-600 hover:text-green-800 font-medium">
                        Release
                      </button>
                    )}
                    {['active', 'funded', 'disputed'].includes(escrow.status) && (
                      <button onClick={() => handleAction(escrow.id, 'refunded', 'Admin refund')} className="text-red-600 hover:text-red-800 font-medium">
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}
