import { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, RefreshCw, Ban, CheckCircle, XCircle } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => { fetchUsers(); }, [page, typeFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (search) params.set('search', search);
      if (typeFilter) params.set('user_type', typeFilter);
      const res = await fetch(`/api/users?${params}`);
      const json = await res.json();
      if (json.success) { setUsers(json.users); setTotal(json.total); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    if (!confirm(`${action} this user?`)) return;
    const reason = action === 'suspend' ? prompt('Reason:') : '';
    if (action === 'suspend' && !reason) return;
    await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action, reason }) });
    fetchUsers();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-600">All registered users across the platform.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search by name, phone, email..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchUsers()} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
          <option value="">All Types</option>
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
          <option value="business">Business</option>
        </select>
        <button onClick={fetchUsers} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.display_name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.phone || '—'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{user.user_type || 'user'}</span></td>
                  <td className="px-6 py-4">
                    {user.is_deleted ? <span className="flex items-center text-red-600 text-sm"><XCircle className="h-4 w-4 mr-1" />Suspended</span> : <span className="flex items-center text-green-600 text-sm"><CheckCircle className="h-4 w-4 mr-1" />Active</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.is_deleted ? (
                      <button onClick={() => handleAction(user.id, 'reactivate')} className="text-green-600 hover:text-green-800 font-medium">Reactivate</button>
                    ) : (
                      <button onClick={() => handleAction(user.id, 'suspend')} className="text-red-600 hover:text-red-800 font-medium">Suspend</button>
                    )}
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
          <span className="text-sm text-gray-600">Page {page} of {Math.ceil(total / 50)} ({total} users)</span>
          <button disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-md disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
