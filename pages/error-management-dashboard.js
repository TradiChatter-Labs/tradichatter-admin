import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bug, AlertTriangle, CheckCircle, RefreshCw, Clock, Activity, Users, ShoppingCart, Zap, Server } from 'lucide-react';

export default function OperationsDashboard() {
  const [errorData, setErrorData] = useState(null);
  const [perfData, setPerfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [errRes, perfRes] = await Promise.all([
        fetch('/api/system/errors'),
        fetch('/api/system/performance'),
      ]);
      const [errJson, perfJson] = await Promise.all([errRes.json(), perfRes.json()]);
      if (errJson.success) setErrorData(errJson);
      if (perfJson.success) setPerfData(perfJson.data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch operations data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => ({
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  }[severity] || 'bg-gray-100 text-gray-800');

  const getStatusColor = (status) => ({
    active: 'bg-red-100 text-red-800',
    investigating: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
  }[status] || 'bg-gray-100 text-gray-800');

  const getServiceStatusColor = (status) => ({
    healthy: 'text-green-600',
    unhealthy: 'text-red-600',
    timeout: 'text-yellow-600',
    not_deployed: 'text-gray-400',
  }[status] || 'text-gray-500');

  const filteredErrors = (errorData?.errors || []).filter(e => {
    if (filter === 'all') return true;
    if (filter === 'critical') return e.severity === 'critical' || e.severity === 'high';
    if (filter === 'active') return e.status === 'active' || e.status === 'investigating';
    if (filter === 'resolved') return e.status === 'resolved';
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const summary = errorData?.summary || {};
  const escalations = errorData?.escalations || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Real system errors, service health, and AI escalation queue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchAll}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* ── Real Platform Metrics ─────────────────────────────────────────── */}
      {perfData && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <ShoppingCart className="h-7 w-7 text-blue-500" />
              <div className="ml-3">
                <p className="text-xs text-gray-500">Orders (24h)</p>
                <p className="text-xl font-semibold text-gray-900">{perfData.orders24h}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-7 w-7 text-indigo-500" />
              <div className="ml-3">
                <p className="text-xs text-gray-500">Total Users</p>
                <p className="text-xl font-semibold text-gray-900">{perfData.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <Zap className="h-7 w-7 text-yellow-500" />
              <div className="ml-3">
                <p className="text-xs text-gray-500">Active Escrow</p>
                <p className="text-xl font-semibold text-gray-900">{perfData.activeEscrow}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <Activity className="h-7 w-7 text-green-500" />
              <div className="ml-3">
                <p className="text-xs text-gray-500">Avg Latency</p>
                <p className={`text-xl font-semibold ${perfData.avgServiceLatencyMs > 2000 ? 'text-red-600' : perfData.avgServiceLatencyMs > 800 ? 'text-yellow-600' : 'text-gray-900'}`}>
                  {perfData.avgServiceLatencyMs > 0 ? `${perfData.avgServiceLatencyMs}ms` : '—'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <Server className="h-7 w-7 text-purple-500" />
              <div className="ml-3">
                <p className="text-xs text-gray-500">Services Up</p>
                <p className={`text-xl font-semibold ${perfData.healthyServices < perfData.deployedServices ? 'text-red-600' : 'text-gray-900'}`}>
                  {perfData.deployedServices > 0 ? `${perfData.healthyServices}/${perfData.deployedServices}` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Error Summary Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <Bug className="h-8 w-8 text-gray-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Errors</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">High / Critical</p>
              <p className="text-2xl font-semibold text-red-600">{(summary.critical || 0) + (summary.high || 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-yellow-600">{summary.active || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-green-600">{summary.resolved || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── System Errors Table ───────────────────────────────────────────── */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">System Errors</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="critical">High / Critical</option>
            <option value="active">Active Only</option>
            <option value="resolved">Resolved Only</option>
          </select>
        </div>

        {filteredErrors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-sm font-medium">No system errors found.</p>
            <p className="text-xs text-gray-400 mt-1">All services and backups are operating normally.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredErrors.map((error) => (
                  <tr key={error.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{error.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{error.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(error.status)}`}>
                        {error.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{error.message}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {error.lastOccurred ? new Date(error.lastOccurred).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── AI Escalation Queue (correctly labeled, NOT errors) ───────────── */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">AI Escalation Queue</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Customers waiting for a human agent — these are normal workflow handoffs, not errors.
              </p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
              {escalations.length} pending
            </span>
          </div>
        </div>

        {escalations.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-2" />
            <p className="text-sm">No pending escalations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {escalations.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{e.customerId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{e.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {e.createdAt ? new Date(e.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Service Latency Breakdown ─────────────────────────────────────── */}
      {perfData?.serviceLatencies?.length > 0 && (
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Service Latency</h3>
            <p className="text-xs text-gray-500 mt-0.5">Real response times from last health check.</p>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {perfData.serviceLatencies.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700 font-medium">{svc.name}</span>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${getServiceStatusColor(svc.status)}`}>
                    {svc.status === 'not_deployed' ? 'Not deployed' : svc.status}
                  </span>
                  {svc.status !== 'not_deployed' && (
                    <p className={`text-xs ${svc.latency > 2000 ? 'text-red-500' : svc.latency > 800 ? 'text-yellow-500' : 'text-gray-400'}`}>
                      {svc.latency}ms
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <Link href="/system-monitoring" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to System Monitoring
        </Link>
      </div>
    </div>
  );
}
