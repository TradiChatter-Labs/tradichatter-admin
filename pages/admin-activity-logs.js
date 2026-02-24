import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Filter, Download, Eye, Search } from 'lucide-react';

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState([
    {
      id: 'LOG-001',
      adminId: 'ADM-001',
      adminName: 'Super Admin',
      action: 'USER_CREATED',
      target: 'user:USR-12345',
      details: 'Created new user account for john@example.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2024-01-25T10:30:00Z',
      severity: 'info'
    },
    {
      id: 'LOG-002',
      adminId: 'ADM-002',
      adminName: 'John Manager',
      action: 'PAYMENT_APPROVED',
      target: 'payment:PAY-67890',
      details: 'Approved withdrawal request for ₦50,000',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2024-01-25T09:45:00Z',
      severity: 'high'
    },
    {
      id: 'LOG-003',
      adminId: 'ADM-003',
      adminName: 'Sarah Support',
      action: 'USER_SUSPENDED',
      target: 'user:USR-54321',
      details: 'Suspended user account due to policy violation',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      timestamp: '2024-01-25T08:15:00Z',
      severity: 'critical'
    }
  ]);

  const [filters, setFilters] = useState({
    adminId: '',
    action: '',
    severity: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const actionTypes = [
    'USER_CREATED', 'USER_UPDATED', 'USER_SUSPENDED', 'USER_DELETED',
    'BUSINESS_APPROVED', 'BUSINESS_REJECTED', 'BUSINESS_SUSPENDED',
    'PAYMENT_APPROVED', 'PAYMENT_REJECTED', 'WITHDRAWAL_PROCESSED',
    'ADMIN_CREATED', 'ADMIN_UPDATED', 'ADMIN_DELETED',
    'SYSTEM_CONFIG_CHANGED', 'FEATURE_FLAG_TOGGLED'
  ];

  const severityColors = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const filteredLogs = logs.filter(log => {
    return (
      (!filters.adminId || log.adminId === filters.adminId) &&
      (!filters.action || log.action === filters.action) &&
      (!filters.severity || log.severity === filters.severity) &&
      (!filters.search || 
        log.details.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.adminName.toLowerCase().includes(filters.search.toLowerCase())
      )
    );
  });

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Admin', 'Action', 'Target', 'Details', 'IP Address', 'Severity'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.adminName,
        log.action,
        log.target,
        log.details,
        log.ipAddress,
        log.severity
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: logs.length,
    today: logs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString()).length,
    critical: logs.filter(log => log.severity === 'critical').length,
    admins: [...new Set(logs.map(log => log.adminId))].length
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Activity Logs</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor and audit all administrative actions performed on the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Total Activities</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Today</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.today}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-red-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Critical Actions</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.critical}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Active Admins</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.admins}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            onClick={exportLogs}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.action}
            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
          >
            <option value="">All Actions</option>
            {actionTypes.map(action => (
              <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
            ))}
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.severity}
            onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
          >
            <option value="">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
          />
          
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
          />
          
          <button
            onClick={() => setFilters({ adminId: '', action: '', severity: '', dateFrom: '', dateTo: '', search: '' })}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{log.adminName}</div>
                  <div className="text-sm text-gray-500">{log.adminId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{log.details}</div>
                  <div className="text-sm text-gray-500">Target: {log.target}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[log.severity]}`}>
                    {log.severity.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activity logs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}