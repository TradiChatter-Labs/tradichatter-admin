import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Users, DollarSign, CheckCircle, Clock, Ban, RefreshCw, Gift } from 'lucide-react';

const DURATION_PRESETS = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: '180 days', value: 180 },
  { label: '365 days', value: 365 },
];

function GrantModal({ target, onClose, onSuccess }) {
  const [plan, setPlan] = useState('business');
  const [durationDays, setDurationDays] = useState(30);
  const [customDays, setCustomDays] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const effectiveDays = useCustom ? Number(customDays) : durationDays;

  const expiryPreview = () => {
    if (!effectiveDays || isNaN(effectiveDays)) return '—';
    const d = new Date();
    d.setDate(d.getDate() + effectiveDays);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSubmit = async () => {
    setError('');
    if (!reason.trim() || reason.trim().length < 3) {
      setError('Reason is required (min 3 characters).');
      return;
    }
    if (!effectiveDays || isNaN(effectiveDays) || effectiveDays < 1 || effectiveDays > 365) {
      setError('Duration must be between 1 and 365 days.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/subscriptions/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: target.business_id,
          businessName: target.businesses?.name || target.business_id,
          plan,
          durationDays: effectiveDays,
          reason: reason.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || 'Grant failed. Please try again.');
        return;
      }
      onSuccess(json);
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Grant Subscription</h2>
          </div>
          <button onClick={onClose} className="text-purple-200 hover:text-white text-xl leading-none">&times;</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Business */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Business</label>
            <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
              {target.businesses?.name || target.business_id?.slice(0, 16) + '…'}
            </p>
          </div>

          {/* Plan */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="business">Business — ₦12,500/mo</option>
              <option value="premium">Premium — ₦22,000/mo</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Duration</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {DURATION_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => { setDurationDays(p.value); setUseCustom(false); }}
                  className={`px-2 py-2 text-xs rounded-md border font-medium transition-colors ${
                    !useCustom && durationDays === p.value
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="365"
                placeholder="Custom days"
                value={customDays}
                onChange={(e) => { setCustomDays(e.target.value); setUseCustom(true); }}
                onFocus={() => setUseCustom(true)}
                className={`flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  useCustom ? 'border-purple-500' : 'border-gray-300'
                }`}
              />
              <span className="text-xs text-gray-500 whitespace-nowrap">1–365 days</span>
            </div>
          </div>

          {/* Expiry preview */}
          <div className="bg-purple-50 border border-purple-200 rounded-md px-3 py-2 flex justify-between items-center">
            <span className="text-xs text-purple-700 font-medium">Expires on</span>
            <span className="text-sm font-bold text-purple-900">{expiryPreview()}</span>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Compensation for downtime, partnership deal, beta tester..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Granting…</>
            ) : (
              <><Gift className="h-4 w-4" /> Confirm Grant</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [grantTarget, setGrantTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { fetchSubscriptions(); }, [filter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/subscriptions?${params}`);
      const json = await res.json();
      if (json.success) {
        setSubscriptions(json.subscriptions);
        setTotal(json.total);
      }
    } catch (err) {
      console.error('Fetch subscriptions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus, reason = '') => {
    if (!confirm(`Change subscription to ${newStatus}?`)) return;
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, reason }),
      });
      const json = await res.json();
      if (json.success) fetchSubscriptions();
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  const handleGrantSuccess = (result) => {
    setGrantTarget(null);
    const expiry = new Date(result.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    setSuccessMsg(`✅ ${result.plan.charAt(0).toUpperCase() + result.plan.slice(1)} plan granted for ${result.durationDays} days — expires ${expiry}`);
    fetchSubscriptions();
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-blue-100 text-blue-800',
      expired: 'bg-red-100 text-red-800',
      grace: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filtered = subscriptions.filter(sub => {
    if (!searchTerm) return true;
    const name = sub.businesses?.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const trialCount = subscriptions.filter(s => s.status === 'trial').length;
  const revenue = subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.amount || 7500), 0);

  return (
    <div>
      {grantTarget && (
        <GrantModal
          target={grantTarget}
          onClose={() => setGrantTarget(null)}
          onSuccess={handleGrantSuccess}
        />
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        <p className="mt-1 text-sm text-gray-600">Monitor, manage, and grant subscriptions to businesses.</p>
      </div>

      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-300 text-green-800 text-sm rounded-lg font-medium">
          {successMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-xl font-bold text-green-600">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Trial</p>
              <p className="text-xl font-bold text-blue-600">{trialCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-xl font-bold">₦{revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <Crown className="h-5 w-5 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Conversion</p>
              <p className="text-xl font-bold">{total > 0 ? Math.round((activeCount / total) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search businesses..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="grace">Grace</option>
          <option value="expired">Expired</option>
        </select>
        <button onClick={fetchSubscriptions} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No subscriptions found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {sub.businesses?.name || sub.business_id?.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                    <span>{sub.plan || 'premium'}</span>
                    {sub.businesses?.admin_granted_by && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                        <Gift className="h-3 w-3" /> Admin Grant
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      {/* Grant button — always available */}
                      <button
                        onClick={() => setGrantTarget(sub)}
                        title="Grant subscription"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Gift className="h-4 w-4" />
                      </button>
                      {sub.status === 'active' && (
                        <button
                          onClick={() => handleStatusChange(sub.id, 'expired', 'Admin suspended')}
                          title="Suspend"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      {(sub.status === 'expired' || sub.status === 'cancelled') && (
                        <button
                          onClick={() => handleStatusChange(sub.id, 'active')}
                          title="Reactivate"
                          className="text-green-600 hover:text-green-800"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}
