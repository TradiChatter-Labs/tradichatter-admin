import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle, XCircle, Clock, Shield, Zap } from 'lucide-react';

const PROVIDER_FLAGS = {
  cac: 'kyc_cac_enabled',
  bvn: 'kyc_bvn_enabled',
  nin: 'kyc_nin_enabled',
};

export default function EnhancedKYC() {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, byType: {} });
  const [flags, setFlags] = useState({});
  const [flagIds, setFlagIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingFlag, setSavingFlag] = useState(null);

  useEffect(() => { fetchStats(); fetchFlags(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kyc');
      const json = await res.json();
      if (json.success) {
        const all = json.kyc || [];
        const byType = {};
        all.forEach(k => {
          const t = k.verification_type || 'other';
          if (!byType[t]) byType[t] = { total: 0, approved: 0 };
          byType[t].total++;
          if (k.verification_status === 'approved') byType[t].approved++;
        });
        setStats({
          total: all.length,
          approved: all.filter(k => k.verification_status === 'approved').length,
          pending: all.filter(k => ['pending', 'submitted'].includes(k.verification_status)).length,
          rejected: all.filter(k => k.verification_status === 'rejected').length,
          byType,
        });
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
          const localKey = Object.keys(PROVIDER_FLAGS).find(k => PROVIDER_FLAGS[k] === f.flag_key);
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

  const successRate = (type) => {
    const t = stats.byType[type];
    if (!t || t.total === 0) return '—';
    return `${((t.approved / t.total) * 100).toFixed(1)}%`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">KYC Document Viewer</h1>
        <p className="mt-1 text-sm text-gray-600">Verification provider status, real KYC counts, and provider controls.</p>
      </div>

      {/* Real Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Shield className="h-6 w-6 text-blue-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Total</p><p className="text-lg font-semibold">{loading ? '…' : stats.total}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Approved</p><p className="text-lg font-semibold">{loading ? '…' : stats.approved}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <Clock className="h-6 w-6 text-yellow-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Pending</p><p className="text-lg font-semibold">{loading ? '…' : stats.pending}</p></div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center">
          <XCircle className="h-6 w-6 text-red-600" />
          <div className="ml-3"><p className="text-sm text-gray-500">Rejected</p><p className="text-lg font-semibold">{loading ? '…' : stats.rejected}</p></div>
        </div>
      </div>

      {/* Verification Providers — persisted to feature_flags */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Verification Providers</h3>
          <span className="text-xs text-gray-400">Toggles saved to feature flags</span>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.keys(PROVIDER_FLAGS).map(key => (
            <div key={key} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 uppercase">{key}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${flags[key] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                  {flags[key] ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-3">
                Success Rate: {successRate(key)}
                <span className="ml-2 text-xs text-gray-400">({stats.byType[key]?.total || 0} records)</span>
              </div>
              <button
                onClick={() => toggleFlag(key)}
                disabled={!flagIds[key] || savingFlag === key}
                className={`text-xs px-3 py-1 rounded font-medium ${flags[key] ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} disabled:opacity-40`}
              >
                {savingFlag === key ? 'Saving…' : flags[key] ? 'Disable' : 'Enable'}
              </button>
              {!flagIds[key] && <p className="text-xs text-amber-500 mt-1">Add {PROVIDER_FLAGS[key]} to feature_flags to enable control.</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Per-type breakdown */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Verification Breakdown by Type</h3>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : Object.keys(stats.byType).length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No KYC records found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(stats.byType).map(([type, data]) => (
                  <tr key={type}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 uppercase">{type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{data.total}</td>
                    <td className="px-4 py-3 text-sm text-green-600">{data.approved}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{data.total > 0 ? `${((data.approved / data.total) * 100).toFixed(1)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/kyc" className="text-blue-600 hover:text-blue-500 font-medium text-sm">→ KYC Management</Link>
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium text-sm">← Back to Business Section</Link>
      </div>
    </div>
  );
}
