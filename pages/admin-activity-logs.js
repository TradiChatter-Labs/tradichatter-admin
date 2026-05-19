import { useState, useEffect } from 'react';
import { BarChart3, Search, RefreshCw, Filter } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  useEffect(() => { fetchLogs(); }, [page, actionFilter, entityFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (actionFilter) params.set('action', actionFilter);
      if (entityFilter) params.set('entity_type', entityFilter);
      const res = await fetch(`/api/audit-logs?${params}`);
      const json = await res.json();
      if (json.success) { setLogs(json.logs); setTotal(json.total); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getActionColor = (action) => {
    if (action?.includes('DELETE') || action?.includes('SUSPEND') || action?.includes('KILL')) return 'bg-red-100 text-red-800';
    if (action?.includes('CREATE') || action?.includes('ENABLE') || action?.includes('APPROVE')) return 'bg-green-100 text-green-800';
    if (action?.includes('UPDATE') || action?.includes('CHANGE')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-sm text-gray-600">Complete trail of all admin actions across the platform.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Filter by action..." value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchLogs()} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
          <option value="">All Entities</option>
          <option value="user">Users</option>
          <option value="business">Businesses</option>
          <option value="escrow">Escrow</option>
          <option value="subscription">Subscriptions</option>
          <option value="feature_flag">Feature Flags</option>
          <option value="ai_agent">AI Agents</option>
          <option value="ai_knowledge">AI Knowledge</option>
          <option value="supplier">Suppliers</option>
          <option value="admin_user">Admin Users</option>
          <option value="business_kyc">KYC</option>
        </select>
        <button onClick={fetchLogs} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No audit logs found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>{log.action}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>{log.entity_type || '—'}</div>
                    <div className="text-xs text-gray-400 font-mono">{log.entity_id?.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">{log.admin_id?.slice(0, 8) || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{log.details ? JSON.stringify(log.details).slice(0, 60) : '—'}</td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-mono">{log.ip_address || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{log.created_at ? new Date(log.created_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {total > 50 && (
        <div className="flex justify-between items-center mt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-md disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {Math.ceil(total / 50)} ({total} logs)</span>
          <button disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-md disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
