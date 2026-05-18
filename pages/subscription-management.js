import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Users, DollarSign, CheckCircle, Clock, Ban, Eye, RefreshCw, AlertTriangle } from 'lucide-react';

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        <p className="mt-1 text-sm text-gray-600">Monitor and manage all business subscriptions.</p>
      </div>

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
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">{sub.plan || 'premium'}</td>
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
                  <td className="px-6 py-4 text-sm space-x-2">
                    {sub.status === 'active' && (
                      <button onClick={() => handleStatusChange(sub.id, 'expired', 'Admin suspended')} className="text-red-600 hover:text-red-800">
                        <Ban className="h-4 w-4 inline" />
                      </button>
                    )}
                    {(sub.status === 'expired' || sub.status === 'cancelled') && (
                      <button onClick={() => handleStatusChange(sub.id, 'active')} className="text-green-600 hover:text-green-800">
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

      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}
