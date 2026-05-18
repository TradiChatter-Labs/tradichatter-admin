import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Server, CheckCircle, AlertTriangle, XCircle, RefreshCw, Clock } from 'lucide-react';

export default function SystemMonitoring() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/system/health');
      const json = await res.json();
      if (json.success) {
        setHealth(json.data);
        setLastRefresh(new Date());
      }
    } catch (err) {
      console.error('Health fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'healthy') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'timeout' || status === 'degraded') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBg = (status) => {
    if (status === 'healthy') return 'bg-green-50 border-green-200';
    if (status === 'timeout' || status === 'degraded') return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getOverallBg = (status) => {
    if (status === 'healthy') return 'bg-green-100 text-green-800';
    if (status === 'degraded') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
          <p className="mt-1 text-sm text-gray-600">
            Real-time health status of all TradiChatter microservices.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-xs text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button onClick={fetchHealth} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      {health && (
        <>
          {/* Overall Status */}
          <div className="mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getOverallBg(health.overallStatus)}`}>
              {getStatusIcon(health.overallStatus)}
              <span className="ml-2">
                System: {health.overallStatus?.toUpperCase()} — {health.healthyServices}/{health.totalServices} services healthy
              </span>
            </div>
            <span className="ml-4 text-sm text-gray-500">Uptime: {health.uptime}</span>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {health.services && Object.entries(health.services).map(([key, svc]) => (
              <div key={key} className={`border rounded-lg p-5 ${getStatusBg(svc.status)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {getStatusIcon(svc.status)}
                    <h3 className="ml-2 font-medium text-gray-900">{svc.name}</h3>
                  </div>
                  <span className="text-xs text-gray-500">{svc.latency}ms</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${svc.status === 'healthy' ? 'text-green-700' : svc.status === 'timeout' ? 'text-yellow-700' : 'text-red-700'}`}>
                      {svc.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Latency</span>
                    <span className={`font-medium ${svc.latency < 200 ? 'text-green-700' : svc.latency < 1000 ? 'text-yellow-700' : 'text-red-700'}`}>
                      {svc.latency}ms
                    </span>
                  </div>
                  {svc.error && (
                    <div className="text-xs text-red-600 mt-2 bg-red-100 p-2 rounded">
                      Error: {svc.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Database & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Database</h3>
              <div className="flex items-center">
                {getStatusIcon(health.databaseStatus)}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Supabase: {health.databaseStatus}
                </span>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Stats</h3>
              {health.stats && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Users:</span> <span className="font-medium">{health.stats.totalUsers}</span></div>
                  <div><span className="text-gray-500">Businesses:</span> <span className="font-medium">{health.stats.totalBusinesses}</span></div>
                  <div><span className="text-gray-500">Orders:</span> <span className="font-medium">{health.stats.totalOrders}</span></div>
                  <div><span className="text-gray-500">Premium:</span> <span className="font-medium">{health.stats.premiumSubscriptions}</span></div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
