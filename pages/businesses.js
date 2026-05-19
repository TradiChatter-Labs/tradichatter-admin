import { useState, useEffect } from 'react';
import { Store, Search, RefreshCw, CheckCircle, XCircle, Shield, Ban } from 'lucide-react';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchBusinesses(); }, [page, statusFilter]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/businesses?${params}`);
      const json = await res.json();
      if (json.success) { setBusinesses(json.businesses); setTotal(json.total); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    if (!confirm(`${action} this business?`)) return;
    await fetch('/api/businesses', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) });
    fetchBusinesses();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
        <p className="text-sm text-gray-600">All registered businesses on the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{total}</p></div>
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-green-600">{businesses.filter(b => b.is_active).length}</p></div>
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Verified</p><p className="text-2xl font-bold text-blue-600">{businesses.filter(b => b.is_verified).length}</p></div>
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Premium</p><p className="text-2xl font-bold text-purple-600">{businesses.filter(b => b.subscription_status === 'active').length}</p></div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search businesses..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchBusinesses()} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="verified">Verified</option>
        </select>
        <button onClick={fetchBusinesses} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {businesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{biz.business_name}</div><div className="text-xs text-gray-500">{biz.city}, {biz.state}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-700">{biz.category || '—'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${biz.subscription_status === 'active' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>{biz.subscription_status || 'free'}</span></td>
                  <td className="px-6 py-4">{biz.is_verified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-gray-300" />}</td>
                  <td className="px-6 py-4">{biz.is_active ? <span className="text-green-600 text-sm">Active</span> : <span className="text-red-600 text-sm">Inactive</span>}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{biz.created_at ? new Date(biz.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {!biz.is_verified && <button onClick={() => handleAction(biz.id, 'verify')} className="text-blue-600 hover:text-blue-800" title="Verify"><Shield className="h-4 w-4 inline" /></button>}
                    {biz.is_active ? <button onClick={() => handleAction(biz.id, 'deactivate')} className="text-red-600 hover:text-red-800" title="Deactivate"><Ban className="h-4 w-4 inline" /></button> : <button onClick={() => handleAction(biz.id, 'activate')} className="text-green-600 hover:text-green-800" title="Activate"><CheckCircle className="h-4 w-4 inline" /></button>}
                  </td>
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
