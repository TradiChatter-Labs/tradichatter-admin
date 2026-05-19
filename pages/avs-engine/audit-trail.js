import { useState } from 'react';
import Link from 'next/link';
import { Shield, Search, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function AVSAuditTrail() {
  const [supplierId, setSupplierId] = useState('');
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAudit = async () => {
    if (!supplierId) { alert('Enter a supplier ID'); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/avs-engine/audit-trail?supplier_id=${supplierId}`);
      const json = await res.json();
      if (json.success) setAudit(json);
      else alert(json.error || 'Failed to fetch audit trail');
    } catch (err) { alert('Failed: ' + err.message); }
    finally { setLoading(false); }
  };

  const getEventIcon = (event) => {
    if (event?.type === 'approved' || event?.decision === 'approve') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (event?.type === 'rejected' || event?.decision === 'reject') return <XCircle className="h-4 w-4 text-red-500" />;
    if (event?.type === 'override') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AVS — Audit Trail</h1>
        <p className="text-sm text-gray-600">Full verification history for any supplier.</p>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Enter supplier ID..." value={supplierId} onChange={(e) => setSupplierId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchAudit()} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <button onClick={fetchAudit} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center">
            {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />} Search
          </button>
        </div>
      </div>

      {/* Results */}
      {audit && (
        <div className="space-y-6">
          {/* Supplier Summary */}
          {audit.supplier && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Supplier Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{audit.supplier.company_name || audit.supplier.name}</span></div>
                <div><span className="text-gray-500">Trust Score:</span> <span className="font-bold text-lg">{audit.supplier.trust_score || 0}</span></div>
                <div><span className="text-gray-500">Badge:</span> <span className="font-medium">{audit.supplier.badge || 'none'}</span></div>
                <div><span className="text-gray-500">Status:</span> <span className="font-medium">{audit.supplier.status || '—'}</span></div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Timeline</h3>
            {(audit.events || audit.trail || []).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No audit events found for this supplier.</p>
            ) : (
              <div className="space-y-4">
                {(audit.events || audit.trail || []).map((event, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 border-l-4 border-gray-200 hover:border-blue-400 transition-colors">
                    <div className="mt-0.5">{getEventIcon(event)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{event.type || event.action || event.event || 'Event'}</h4>
                        <span className="text-xs text-gray-400">{event.timestamp || event.created_at ? new Date(event.timestamp || event.created_at).toLocaleString() : ''}</span>
                      </div>
                      {event.details && <p className="text-sm text-gray-600 mt-1">{typeof event.details === 'string' ? event.details : JSON.stringify(event.details)}</p>}
                      {event.agent && <p className="text-xs text-gray-400 mt-1">Agent: {event.agent}</p>}
                      {event.score !== undefined && <p className="text-xs text-gray-400">Score: {event.score}</p>}
                      {event.admin_id && <p className="text-xs text-gray-400">Admin: {event.admin_id}</p>}
                      {event.reason && <p className="text-xs text-gray-500 italic mt-1">Reason: {event.reason}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agent Scores */}
          {audit.agent_scores && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Agent Scores (Last Verification)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.entries(audit.agent_scores).map(([agent, score]) => (
                  <div key={agent} className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 capitalize">{agent.replace('_', ' ')}</p>
                    <p className={`text-xl font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{score}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!audit && !loading && (
        <div className="text-center py-12 text-gray-500">
          <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p>Enter a supplier ID above to view their full verification audit trail.</p>
        </div>
      )}

      <div className="mt-6">
        <Link href="/avs-engine" className="text-red-600 hover:text-red-500 font-medium">← Back to Verification Queue</Link>
      </div>
    </div>
  );
}
