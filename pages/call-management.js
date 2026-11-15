import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Video, Clock, AlertTriangle, Eye, Ban, Mic, MicOff, Volume2, Settings, Shield, Zap } from 'lucide-react';

const AI_FLAG_KEYS = {
  autoTranslation: 'call_auto_translation',
  sentimentAnalysis: 'call_sentiment_analysis',
  callRecording: 'call_recording_enabled',
  realTimeModeration: 'call_realtime_moderation',
};

export default function CallManagement() {
  const [calls, setCalls] = useState([]);
  const [total, setTotal] = useState(0);
  const [tableExists, setTableExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [flags, setFlags] = useState({});
  const [flagIds, setFlagIds] = useState({});
  const [savingFlag, setSavingFlag] = useState(null);

  useEffect(() => { fetchCalls(); fetchFlags(); }, [filter]);

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ filter, search });
      const res = await fetch(`/api/calls?${params}`);
      const json = await res.json();
      if (json.success) { setCalls(json.calls); setTotal(json.total); setTableExists(json.tableExists); }
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
          const localKey = Object.keys(AI_FLAG_KEYS).find(k => AI_FLAG_KEYS[k] === f.flag_key);
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

  const statusColor = (s) => ({ completed: 'bg-green-100 text-green-800', ongoing: 'bg-blue-100 text-blue-800', failed: 'bg-red-100 text-red-800', missed: 'bg-yellow-100 text-yellow-800' }[s] || 'bg-gray-100 text-gray-800');
  const qualityColor = (q) => ({ excellent: 'text-green-600', good: 'text-blue-600', fair: 'text-yellow-600', poor: 'text-red-600' }[q] || 'text-gray-600');

  const completed = calls.filter(c => c.status === 'completed').length;
  const ongoing = calls.filter(c => c.status === 'ongoing').length;
  const failed = calls.filter(c => c.status === 'failed').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Call Management</h1>
        <p className="mt-1 text-sm text-gray-600">Monitor and manage voice/video calls across the platform.</p>
      </div>

      {/* AI Tools Administration — persisted to feature_flags */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center"><Zap className="h-5 w-5 mr-2 text-purple-600" />AI Tools Administration</h3>
          <span className="text-xs text-gray-400">Changes saved to feature flags</span>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.keys(AI_FLAG_KEYS).map(key => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!flags[key]}
                onChange={() => toggleFlag(key)}
                disabled={!flagIds[key] || savingFlag === key}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
            </label>
          ))}
        </div>
        {Object.keys(flagIds).length === 0 && (
          <p className="px-6 pb-4 text-xs text-amber-600">⚠ Flag keys not found — add call_auto_translation, call_sentiment_analysis etc. to feature_flags to enable persistence.</p>
        )}
      </div>

      {/* Real-time Controls */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Real-time Call Controls</h3>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={() => alert('Emergency termination requires Voice Translation service.')} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            <Shield className="h-4 w-4 mr-2 text-red-600" />Emergency Termination
          </button>
          <button onClick={() => alert('AI Translation Override requires Voice Translation service.')} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            <Zap className="h-4 w-4 mr-2 text-purple-600" />AI Translation Override
          </button>
          <button onClick={() => alert('Sound settings require Voice Translation service.')} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            <Volume2 className="h-4 w-4 mr-2 text-blue-600" />Sound Settings
          </button>
          <Link href="/voice-controls" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            <Settings className="h-4 w-4 mr-2 text-gray-600" />Global Call Settings
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Phone className="h-6 w-6 text-blue-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Total</p><p className="text-lg font-semibold">{total}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Phone className="h-6 w-6 text-green-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Completed</p><p className="text-lg font-semibold">{completed}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Video className="h-6 w-6 text-blue-500" />
          <div className="ml-3"><p className="text-sm text-gray-500">Ongoing</p><p className="text-lg font-semibold">{ongoing}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Failed</p><p className="text-lg font-semibold">{failed}</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-3">
        <input type="text" placeholder="Search calls..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchCalls()} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="all">All Calls</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
          <option value="failed">Failed</option>
          <option value="missed">Missed</option>
        </select>
        <button onClick={fetchCalls} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Search</button>
      </div>

      {/* Calls Table */}
      <div className="bg-white shadow rounded-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : !tableExists ? (
          <div className="p-12 text-center">
            <Phone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No call logs yet</p>
            <p className="text-sm text-gray-400 mt-1">The call_logs table doesn't exist yet. Call records will appear here once the voice feature is active.</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No calls found</p>
            <p className="text-sm text-gray-400 mt-1">{filter !== 'all' ? `No ${filter} calls.` : 'No call records yet.'}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {calls.map(call => (
                <tr key={call.id}>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{call.id?.slice(0, 8)}</td>
                  <td className="px-6 py-4">{call.call_type === 'video' ? <Video className="h-5 w-5 text-purple-600" /> : <Phone className="h-5 w-5 text-blue-600" />}</td>
                  <td className="px-6 py-4 text-sm"><div>{call.caller_id}</div><div className="text-gray-400">→ {call.callee_id}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-900">{call.duration_seconds ? `${Math.floor(call.duration_seconds / 60)}:${String(call.duration_seconds % 60).padStart(2, '0')}` : '—'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor(call.status)}`}>{call.status}</span></td>
                  <td className="px-6 py-4 text-sm"><span className={qualityColor(call.quality)}>{call.quality || '—'}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {call.ai_translation ? <Zap className="h-4 w-4 text-blue-500" title="AI Translation" /> : <Zap className="h-4 w-4 text-gray-200" />}
                      {call.recording_enabled ? <Mic className="h-4 w-4 text-red-500" title="Recording" /> : <MicOff className="h-4 w-4 text-gray-200" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-3"><Eye className="h-4 w-4" /></button>
                    <button className="text-red-600 hover:text-red-900"><Ban className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8">
        <Link href="/customer-section" className="text-blue-600 hover:text-blue-500 font-medium">← Back to Customer Section</Link>
      </div>
    </div>
  );
}
