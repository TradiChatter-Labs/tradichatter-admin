import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Search, Filter, Download, Eye, Shield } from 'lucide-react';

export default function FinancialAuditTrails() {
  const router = useRouter();
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUDIT-001',
      timestamp: '2024-01-20 14:30:15',
      action: 'Payment Processed',
      entity: 'Transaction',
      entityId: 'TXN-001',
      userId: 'admin@tradichatter.com',
      userRole: 'Admin',
      details: 'Payment of ₦25,000 processed for Order ORD-2024-001',
      ipAddress: '192.168.1.100',
      severity: 'info'
    },
    {
      id: 'AUDIT-002',
      timestamp: '2024-01-20 13:45:22',
      action: 'Fee Configuration Changed',
      entity: 'Platform Settings',
      entityId: 'FEE-CONFIG',
      userId: 'admin@tradichatter.com',
      userRole: 'Admin',
      details: 'Transaction fee changed from 2.0% to 2.5%',
      ipAddress: '192.168.1.100',
      severity: 'warning'
    },
    {
      id: 'AUDIT-003',
      timestamp: '2024-01-20 12:15:08',
      action: 'Refund Processed',
      entity: 'Transaction',
      entityId: 'TXN-002',
      userId: 'support@tradichatter.com',
      userRole: 'Support',
      details: 'Refund of ₦15,000 processed for disputed transaction',
      ipAddress: '192.168.1.105',
      severity: 'critical'
    },
    {
      id: 'AUDIT-004',
      timestamp: '2024-01-20 11:30:45',
      action: 'Withdrawal Approved',
      entity: 'Withdrawal',
      entityId: 'WTH-001',
      userId: 'finance@tradichatter.com',
      userRole: 'Finance',
      details: 'Withdrawal of ₦50,000 approved for Business ID: BUS-001',
      ipAddress: '192.168.1.102',
      severity: 'info'
    }
  ]);

  const [filters, setFilters] = useState({
    action: 'all',
    severity: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });

  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = filters.action === 'all' || log.action.toLowerCase().includes(filters.action.toLowerCase());
    const matchesSeverity = filters.severity === 'all' || log.severity === filters.severity;
    const matchesSearch = !filters.searchTerm || 
      log.details.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesAction && matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (severity) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[severity]}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="mr-3 h-8 w-8" />
              Financial Audit Trails
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Complete audit log of all financial operations and changes
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export Audit Log
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Critical Events</h3>
          <p className="text-2xl font-bold text-red-600">
            {auditLogs.filter(log => log.severity === 'critical').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Warning Events</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {auditLogs.filter(log => log.severity === 'warning').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Info Events</h3>
          <p className="text-2xl font-bold text-blue-600">
            {auditLogs.filter(log => log.severity === 'info').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.action}
                onChange={(e) => setFilters({...filters, action: e.target.value})}
              >
                <option value="all">All Actions</option>
                <option value="payment">Payment</option>
                <option value="refund">Refund</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="configuration">Configuration</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.severity}
                onChange={(e) => setFilters({...filters, severity: e.target.value})}
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Audit Log Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getSeverityIcon(log.severity)}
                      <span className="ml-2 text-sm font-medium text-gray-900">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.userId}</div>
                      <div className="text-sm text-gray-500">{log.userRole}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.entity}</div>
                      <div className="text-sm text-gray-500">{log.entityId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </div>
                    <div className="text-sm text-gray-500">IP: {log.ipAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSeverityBadge(log.severity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No audit logs match your current search criteria.
          </p>
        </div>
      )}
    </div>
  );
}