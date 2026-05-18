import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, CheckCircle, XCircle, AlertTriangle, Eye, Ban, RefreshCw, Search, Shield } from 'lucide-react';

export default function SourceHubSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => { fetchSuppliers(); }, [filter, page]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (filter !== 'all') params.set('status', filter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/sourcehub/suppliers?${params}`);
      const json = await res.json();
      if (json.success) {
        setSuppliers(json.suppliers || []);
        setTotal(json.total || 0);
      }
    } catch (err) {
      console.error('Fetch suppliers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (supplierId, action, reason = '') => {
    const confirmMsg = action === 'suspend' ? 'Suspend this supplier?' : `${action} this supplier?`;
    if (!confirm(confirmMsg)) return;

    if (action === 'suspend' && !reason) {
      reason = prompt('Enter suspension reason:');
      if (!reason) return;
    }

    try {
      const res = await fetch('/api/sourcehub/suppliers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_id: supplierId, action, reason }),
      });
      const json = await res.json();
      if (json.success) fetchSuppliers();
      else alert('Action failed: ' + (json.error || 'Unknown error'));
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getBadgeColor = (badge) => {
    const colors = {
      elite: 'bg-purple-100 text-purple-800',
      gold_verified: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      none: 'bg-gray-100 text-gray-500',
    };
    return colors[badge] || 'bg-gray-100 text-gray-500';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SourceHub — Supplier Management</h1>
        <p className="mt-1 text-sm text-gray-600">Manage B2B suppliers, verification status, and trust scores.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Total Suppliers</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{suppliers.filter(s => s.status === 'active' || s.status === 'verified').length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">{suppliers.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Suspended</p>
          <p className="text-2xl font-bold text-red-600">{suppliers.filter(s => s.status === 'suspended').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchSuppliers()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={fetchSuppliers} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No suppliers found. Ensure SourceHub service is running on port 8300.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trust Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{supplier.company_name || supplier.name}</div>
                    <div className="text-xs text-gray-500">{supplier.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{supplier.country || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${
                      (supplier.trust_score || 0) >= 80 ? 'text-green-600' :
                      (supplier.trust_score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {supplier.trust_score || 0}/100
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(supplier.badge || 'none')}`}>
                      {supplier.badge || 'none'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{supplier.total_orders || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {supplier.created_at ? new Date(supplier.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-1">
                    {supplier.status === 'pending' && (
                      <button onClick={() => handleAction(supplier.id, 'approve')} className="text-green-600 hover:text-green-800" title="Approve">
                        <CheckCircle className="h-4 w-4 inline" />
                      </button>
                    )}
                    {supplier.status !== 'suspended' && (
                      <button onClick={() => handleAction(supplier.id, 'suspend')} className="text-red-600 hover:text-red-800" title="Suspend">
                        <Ban className="h-4 w-4 inline" />
                      </button>
                    )}
                    {supplier.status === 'suspended' && (
                      <button onClick={() => handleAction(supplier.id, 'reactivate')} className="text-green-600 hover:text-green-800" title="Reactivate">
                        <RefreshCw className="h-4 w-4 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
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
