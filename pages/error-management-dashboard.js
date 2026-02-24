import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bug, AlertTriangle, TrendingUp, Filter, Download, RefreshCw } from 'lucide-react';

export default function ErrorManagementDashboard() {
  const [errorData, setErrorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchErrorData();
  }, [filter]);

  const fetchErrorData = async () => {
    try {
      // Simulate fetching error data
      setErrorData({
        summary: {
          total: 156,
          critical: 3,
          resolved: 142,
          pending: 11
        },
        errors: [
          {
            id: 'ERR001',
            type: 'Database Connection',
            severity: 'critical',
            count: 23,
            lastOccurred: '2024-01-15 15:45:00',
            status: 'active',
            app: 'Mobile App',
            message: 'Connection timeout to primary database'
          },
          {
            id: 'ERR002',
            type: 'API Rate Limit',
            severity: 'high',
            count: 45,
            lastOccurred: '2024-01-15 15:30:00',
            status: 'investigating',
            app: 'Admin Portal',
            message: 'Rate limit exceeded for payment API'
          },
          {
            id: 'ERR003',
            type: 'Memory Leak',
            severity: 'medium',
            count: 12,
            lastOccurred: '2024-01-15 14:20:00',
            status: 'resolved',
            app: 'Backend Service',
            message: 'Memory usage exceeding threshold'
          }
        ],
        trends: {
          daily: [12, 15, 8, 23, 19, 11, 7],
          weekly: [89, 76, 92, 156, 134, 98, 87]
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch error data:', error);
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-red-100 text-red-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Error Management Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor, analyze, and resolve application errors and crashes.
        </p>
      </div>

      {/* Error Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Bug className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Errors</p>
                <p className="text-2xl font-semibold text-gray-900">{errorData.summary.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Critical</p>
                <p className="text-2xl font-semibold text-red-600">{errorData.summary.critical}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-semibold text-green-600">{errorData.summary.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-yellow-600">{errorData.summary.pending}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Error Reports</h3>
            <div className="flex space-x-3">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Errors</option>
                <option value="critical">Critical Only</option>
                <option value="active">Active Only</option>
                <option value="resolved">Resolved Only</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button 
                onClick={fetchErrorData}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Application</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Occurred</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {errorData.errors.map((error) => (
                <tr key={error.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{error.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{error.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(error.severity)}`}>
                      {error.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{error.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{error.app}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(error.status)}`}>
                      {error.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.lastOccurred}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-green-600 hover:text-green-900">Resolve</button>
                    <button className="text-red-600 hover:text-red-900">Escalate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Trends */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Error Trends</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Daily Errors (Last 7 Days)</h4>
              <div className="flex items-end space-x-2 h-32">
                {errorData.trends.daily.map((count, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-blue-500 w-8 rounded-t"
                      style={{ height: `${(count / Math.max(...errorData.trends.daily)) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Weekly Errors (Last 7 Weeks)</h4>
              <div className="flex items-end space-x-2 h-32">
                {errorData.trends.weekly.map((count, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-red-500 w-8 rounded-t"
                      style={{ height: `${(count / Math.max(...errorData.trends.weekly)) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/system-monitoring" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to System Monitoring
        </Link>
      </div>
    </div>
  );
}