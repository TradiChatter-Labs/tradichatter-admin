import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Server, Database, Wifi, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Shield, Bug, Key, HardDrive } from 'lucide-react';

export default function SystemMonitoring() {
  const [systemStats, setSystemStats] = useState(null);
  const [errorReports, setErrorReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      const [healthRes, errorsRes, performanceRes, backupRes] = await Promise.all([
        fetch('/api/system/health'),
        fetch('/api/system/errors'),
        fetch('/api/system/performance'),
        fetch('/api/system/backup')
      ]);

      const [health, errors, performance, backup] = await Promise.all([
        healthRes.json(),
        errorsRes.json(),
        performanceRes.json(),
        backupRes.json()
      ]);

      setSystemStats({
        ...health.data,
        backupStatus: backup.data.status,
        lastBackup: backup.data.lastBackup
      });
      setErrorReports(errors.data.errors);
      setAlerts(errors.data.alerts);
      setPerformanceData(performance.data.metrics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch system data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!systemStats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load system data</p>
        <button 
          onClick={fetchSystemData}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      healthy: 'text-green-600 bg-green-100',
      warning: 'text-yellow-600 bg-yellow-100',
      critical: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    return status === 'healthy' ? CheckCircle : AlertTriangle;
  };

  const handleBackupOperation = async (operation) => {
    try {
      const response = await fetch('/api/system/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation })
      });
      const result = await response.json();
      if (result.success) {
        alert(`${operation} operation initiated successfully`);
        fetchSystemData(); // Refresh data
      }
    } catch (error) {
      alert(`Failed to ${operation}: ${error.message}`);
    }
  };

  const handleSecurityAudit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/system/security-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'full_audit',
          includeVulnerabilityScans: true,
          includePermissionAudit: true,
          includeNetworkScan: true
        })
      });
      const result = await response.json();
      if (result.success) {
        alert(`Security audit initiated. Audit ID: ${result.auditId}`);
        // Open security management interface
        window.open('/security-audit-dashboard', '_blank');
        fetchSystemData();
      }
    } catch (error) {
      alert(`Security audit failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewErrorReports = () => {
    // Open comprehensive error management interface
    window.open('/error-management-dashboard', '_blank');
  };

  const handleManageAPILimits = () => {
    // Open API management interface
    window.open('/api-management-dashboard', '_blank');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor system performance, uptime, and health metrics.
        </p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Server className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Server Status</dt>
                <dd className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(systemStats.serverStatus)}`}>
                  {systemStats.serverStatus}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Database className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Database</dt>
                <dd className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(systemStats.databaseStatus)}`}>
                  {systemStats.databaseStatus}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Wifi className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">API Status</dt>
                <dd className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(systemStats.apiStatus)}`}>
                  {systemStats.apiStatus}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Uptime</dt>
                <dd className="text-lg font-medium text-gray-900">{systemStats.uptime}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error/Crash Reporting Dashboard */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Error & Crash Reports</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Application</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count (24h)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Occurred</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {errorReports.map((error) => (
                  <tr key={error.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{error.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{error.app}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{error.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.lastOccurred}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Security & System Controls */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Security Audit & System Controls</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Security Score</p>
                  <p className="text-2xl font-bold text-red-600">{systemStats.securityScore}%</p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <div className="mt-2 space-y-1">
                <button 
                  onClick={handleSecurityAudit}
                  className="w-full text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Run Security Audit
                </button>
                <button 
                  onClick={() => window.open('/security-management', '_blank')}
                  className="w-full text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                >
                  Security Dashboard
                </button>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Total Errors</p>
                  <p className="text-2xl font-bold text-yellow-600">{systemStats.crashReports}</p>
                </div>
                <Bug className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-2 space-y-1">
                <button 
                  onClick={handleViewErrorReports}
                  className="w-full text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  View Error Reports
                </button>
                <button 
                  onClick={() => window.open('/error-analytics', '_blank')}
                  className="w-full text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200"
                >
                  Error Analytics
                </button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">API Usage</p>
                  <p className="text-2xl font-bold text-blue-600">{systemStats.apiLimits}</p>
                </div>
                <Key className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2 space-y-1">
                <button 
                  onClick={handleManageAPILimits}
                  className="w-full text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Manage API Limits
                </button>
                <button 
                  onClick={() => window.open('/api-analytics', '_blank')}
                  className="w-full text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                >
                  API Analytics
                </button>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Backup Status</p>
                  <p className="text-sm font-bold text-green-600 capitalize">{systemStats.backupStatus}</p>
                </div>
                <HardDrive className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2 space-y-1">
                <button 
                  onClick={() => handleBackupOperation('backup')}
                  className="w-full text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Start Backup
                </button>
                <button 
                  onClick={() => window.open('/backup-management', '_blank')}
                  className="w-full text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                >
                  Backup Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Response Time</dt>
            <dd className="text-2xl font-semibold text-gray-900">{systemStats.responseTime}</dd>
            <div className="flex items-center text-sm text-green-600">
              <TrendingDown className="h-4 w-4 mr-1" />
              -12ms from yesterday
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Active Users</dt>
            <dd className="text-2xl font-semibold text-gray-900">{systemStats.activeUsers.toLocaleString()}</dd>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8% from yesterday
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Error Rate</dt>
            <dd className="text-2xl font-semibold text-gray-900">{systemStats.errorRate}</dd>
            <div className="flex items-center text-sm text-green-600">
              <TrendingDown className="h-4 w-4 mr-1" />
              -0.01% from yesterday
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Throughput</dt>
            <dd className="text-2xl font-semibold text-gray-900">{systemStats.throughput}</dd>
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +15% from yesterday
            </div>
          </div>
        </div>
      </div>

      {/* Additional System Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Security Threats</dt>
            <dd className="text-2xl font-semibold text-red-600">{systemStats.securityThreats}</dd>
            <div className="flex items-center text-sm text-red-600">
              <Shield className="h-4 w-4 mr-1" />
              Requires attention
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">API Calls (24h)</dt>
            <dd className="text-2xl font-semibold text-gray-900">{systemStats.apiCalls}</dd>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8% from yesterday
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Storage Used</dt>
            <dd className="text-2xl font-semibold text-gray-900">{systemStats.storageUsed}</dd>
            <div className="flex items-center text-sm text-yellow-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Approaching limit
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Crash Reports</dt>
            <dd className="text-2xl font-semibold text-gray-900">{systemStats.crashReports}</dd>
            <div className="flex items-center text-sm text-blue-600">
              <Bug className="h-4 w-4 mr-1" />
              Last 7 days
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <div key={alert.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className={`h-5 w-5 mr-3 ${alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Performance Trends</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4 text-center">
            {performanceData.map((data, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">{data.time}</div>
                <div className="mt-2">
                  <div className="text-xs text-gray-500">CPU</div>
                  <div className="text-sm font-semibold">{data.cpu}%</div>
                </div>
                <div className="mt-1">
                  <div className="text-xs text-gray-500">Memory</div>
                  <div className="text-sm font-semibold">{data.memory}%</div>
                </div>
                <div className="mt-1">
                  <div className="text-xs text-gray-500">Requests</div>
                  <div className="text-sm font-semibold">{data.requests}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}