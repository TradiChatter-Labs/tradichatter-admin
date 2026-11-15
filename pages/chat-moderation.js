import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, AlertTriangle, Eye, Ban, CheckCircle, Filter, Shield, Zap } from 'lucide-react';

const FLAG_KEYS = {
  spamDetection: 'chat_spam_detection',
  profanityFilter: 'chat_profanity_filter',
  linkBlocking: 'chat_link_blocking',
  imageModeration: 'chat_image_moderation',
  aiSentimentAnalysis: 'chat_ai_sentiment',
  fraudDetection: 'chat_fraud_detection',
};

export default function ChatModeration() {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [tableExists, setTableExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [flags, setFlags] = useState({});
  const [flagIds, setFlagIds] = useState({});
  const [savingFlag, setSavingFlag] = useState(null);

  useEffect(() => { fetchReports(); fetchFlags(); }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ filter, search });
      const res = await fetch(`/api/moderation/chat-reports?${params}`);
      const json = await res.json();
      if (json.success) {
        setReports(json.reports);
        setTotal(json.total);
        setTableExists(json.tableExists);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchFlags = async () => {
    try {
      const res = await fetch('/api/feature-flags');
      const json = await res.json();
      if (json.success) {
        const map = {};
        const ids = {};
        json.flags.forEach(f => {
          const localKey = Object.keys(FLAG_KEYS).find(k => FLAG_KEYS[k] === f.flag_key);
          if (localKey) { map[localKey] = f.enabled; ids[localKey] = f.id; }
        });
        setFlags(map);
        setFlagIds(ids);
      }
    } catch (e) { console.error(e); }
  };

  const toggleFlag = async (key) => {
    const id = flagIds[key];
    if (!id) return;
    const newVal = !flags[key];
    setSavingFlag(key);
    setFlags(prev => ({ ...prev, [key]: newVal }));
    try {
      await fetch('/api/feature-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: newVal }),
      });
    } catch (e) { setFlags(prev => ({ ...prev, [key]: !newVal })); }
    finally { setSavingFlag(null); }
  };

  const handleAction = async (id, action) => {
    const res = await fetch('/api/moderation/chat-reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    const json = await res.json();
    if (json.success) {
      setReports(reports.map(r => r.id === id ? { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' } : r));
      setSelectedReport(null);
    }
  };

  const severityColor = (s) => ({ critical: 'text-red-600 bg-red-100', high: 'text-orange-600 bg-orange-100', medium: 'text-yellow-600 bg-yellow-100' }[s] || 'text-gray-600 bg-gray-100');
  const statusColor = (s) => ({ pending: 'text-yellow-600 bg-yellow-100', resolved: 'text-green-600 bg-green-100', dismissed: 'text-gray-600 bg-gray-100' }[s] || 'text-gray-600 bg-gray-100');

  const pending = reports.filter(r => r.status === 'pending').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const critical = reports.filter(r => r.severity === 'critical').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Chat Moderation</h1>
        <p className="mt-1 text-sm text-gray-600">Review and moderate reported messages and user violations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Pending</p><p className="text-lg font-semibold">{pending}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Resolved</p><p className="text-lg font-semibold">{resolved}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Ban className="h-6 w-6 text-red-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Critical</p><p className="text-lg font-semibold">{critical}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Total</p><p className="text-lg font-semibold">{total}</p></div>
        </div>
      </div>

      {/* Moderation Controls — persisted to feature_flags */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center"><Shield className="h-5 w-5 mr-2 text-blue-600" />Auto-Moderation Controls</h3>
          <span className="text-xs text-gray-400">Changes saved to feature flags</span>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.keys(FLAG_KEYS).map(key => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              <button
                onClick={() => toggleFlag(key)}
                disabled={!flagIds[key] || savingFlag === key}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${flags[key] ? 'bg-green-500' : 'bg-gray-200'} ${!flagIds[key] ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${flags[key] ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
        {Object.keys(flagIds).length === 0 && (
          <p className="px-6 pb-4 text-xs text-amber-600">⚠ Flag keys not found in feature_flags table — add chat_spam_detection, chat_profanity_filter etc. to enable persistence.</p>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-3">
        <div className="flex-1 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search by user or message..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchReports()} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="all">All Reports</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <button onClick={fetchReports} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Search</button>
      </div>

      {/* Reports */}
      <div className="bg-white shadow rounded-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : !tableExists ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No chat reports yet</p>
            <p className="text-sm text-gray-400 mt-1">The chat_reports table doesn't exist yet. Reports will appear here once users start flagging messages.</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No reports found</p>
            <p className="text-sm text-gray-400 mt-1">{filter !== 'all' ? `No ${filter} reports.` : 'No chat reports have been submitted.'}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reports.map(report => (
              <li key={report.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {report.severity && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(report.severity)}`}>{report.severity}</span>}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(report.status)}`}>{report.status}</span>
                      <span className="text-xs text-gray-400">{report.created_at?.split('T')[0]}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Reason: {report.reason} | User: {report.reported_user_id}</p>
                    {report.message_content && <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">"{report.message_content}"</p>}
                    <p className="text-xs text-gray-400 mt-1">Reported by: {report.reporter_id}</p>
                  </div>
                  <div className="ml-4 flex gap-2 flex-shrink-0">
                    <button onClick={() => setSelectedReport(report)} className="px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />View
                    </button>
                    {report.status === 'pending' && (
                      <>
                        <button onClick={() => handleAction(report.id, 'resolve')} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />Resolve
                        </button>
                        <button onClick={() => handleAction(report.id, 'dismiss')} className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 flex items-center">
                          <Ban className="h-4 w-4 mr-1" />Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Report Details</h3>
              <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-500">Reported User:</span> <span>{selectedReport.reported_user_id}</span></div>
              <div><span className="font-medium text-gray-500">Reported By:</span> <span>{selectedReport.reporter_id}</span></div>
              <div><span className="font-medium text-gray-500">Reason:</span> <span>{selectedReport.reason}</span></div>
              {selectedReport.message_content && <div><span className="font-medium text-gray-500">Message:</span><p className="mt-1 bg-gray-50 p-2 rounded">{selectedReport.message_content}</p></div>}
              <div><span className="font-medium text-gray-500">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(selectedReport.status)}`}>{selectedReport.status}</span></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setSelectedReport(null)} className="px-4 py-2 border rounded-md text-sm">Close</button>
              {selectedReport.status === 'pending' && (
                <>
                  <button onClick={() => handleAction(selectedReport.id, 'resolve')} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Resolve</button>
                  <button onClick={() => handleAction(selectedReport.id, 'dismiss')} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">Dismiss</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/customer-section" className="text-blue-600 hover:text-blue-500 font-medium">← Back to Customer Section</Link>
      </div>
    </div>
  );
}
