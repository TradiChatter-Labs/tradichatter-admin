import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, AlertTriangle, Eye, Ban, CheckCircle, Clock, Filter, Shield, Zap, TrendingUp, Users } from 'lucide-react';

export default function ChatModeration() {
  const [reports, setReports] = useState([
    {
      id: 1,
      messageId: 'msg_001',
      reportedBy: 'user123',
      reportedUser: 'trader456',
      reason: 'Spam',
      message: 'Buy now! Limited time offer! Contact me for amazing deals!!!',
      timestamp: '2024-01-15 14:30',
      status: 'pending',
      severity: 'medium'
    },
    {
      id: 2,
      messageId: 'msg_002',
      reportedBy: 'business789',
      reportedUser: 'customer101',
      reason: 'Harassment',
      message: 'You are terrible at business, nobody should buy from you',
      timestamp: '2024-01-15 13:45',
      status: 'pending',
      severity: 'high'
    },
    {
      id: 3,
      messageId: 'msg_003',
      reportedBy: 'user555',
      reportedUser: 'scammer999',
      reason: 'Fraud',
      message: 'Send money first, I will deliver later. Trust me 100%',
      timestamp: '2024-01-15 12:20',
      status: 'resolved',
      severity: 'critical'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [autoModerationEnabled, setAutoModerationEnabled] = useState(true);
  const [moderationRules, setModerationRules] = useState({
    spamDetection: true,
    profanityFilter: true,
    linkBlocking: false,
    imageModeration: true,
    aiSentimentAnalysis: true,
    fraudDetection: true,
    languageDetection: true,
    realTimeScanning: true
  });
  const [aiModerationStats, setAiModerationStats] = useState({
    messagesScanned: 15420,
    threatsBlocked: 89,
    spamFiltered: 234,
    fraudPrevented: 12,
    accuracyRate: 96.8
  });
  const [realTimeAlerts, setRealTimeAlerts] = useState([
    { id: 1, type: 'fraud', message: 'Potential fraud detected in chat #1234', time: '2 min ago' },
    { id: 2, type: 'spam', message: 'Spam burst detected from user @trader456', time: '5 min ago' }
  ]);

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  const handleAction = (reportId, action) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'approve' ? 'resolved' : 'dismissed' }
        : report
    ));
    setSelectedReport(null);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'dismissed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Chat Moderation</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and moderate reported messages and user violations.
        </p>
      </div>

      {/* Advanced Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending Reports</p>
              <p className="text-lg font-semibold text-gray-900">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-lg font-semibold text-gray-900">
                {reports.filter(r => r.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Ban className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Critical Reports</p>
              <p className="text-lg font-semibold text-gray-900">
                {reports.filter(r => r.severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-lg font-semibold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Auto-Moderated</p>
              <p className="text-lg font-semibold text-gray-900">156</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Detection Rate</p>
              <p className="text-lg font-semibold text-gray-900">94.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Moderation Dashboard */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">AI Moderation Dashboard</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{aiModerationStats.messagesScanned.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Messages Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{aiModerationStats.threatsBlocked}</div>
              <div className="text-sm text-gray-500">Threats Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{aiModerationStats.spamFiltered}</div>
              <div className="text-sm text-gray-500">Spam Filtered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{aiModerationStats.fraudPrevented}</div>
              <div className="text-sm text-gray-500">Fraud Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{aiModerationStats.accuracyRate}%</div>
              <div className="text-sm text-gray-500">Accuracy Rate</div>
            </div>
          </div>
          
          {/* Real-time Alerts */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Real-time Alerts</h4>
            <div className="space-y-2">
              {realTimeAlerts.map(alert => (
                <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg ${
                  alert.type === 'fraud' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center">
                    <AlertTriangle className={`h-4 w-4 mr-2 ${
                      alert.type === 'fraud' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <span className="text-sm text-gray-900">{alert.message}</span>
                  </div>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Moderation Controls */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Moderation Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Auto-Moderation</span>
                </div>
                <button
                  onClick={() => setAutoModerationEnabled(!autoModerationEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    autoModerationEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoModerationEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              
              <div className="space-y-3">
                {Object.entries(moderationRules).map(([rule, enabled]) => (
                  <div key={rule} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {rule.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <button
                      onClick={() => setModerationRules(prev => ({ ...prev, [rule]: !enabled }))}
                      className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        enabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        enabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="all">All Reports</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      if (confirm('Bulk approve all low-risk reports?')) {
                        alert('Low-risk reports have been approved.');
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Bulk approve low-risk reports
                  </button>
                  <button 
                    onClick={() => {
                      const csv = 'Date,Report ID,Action,User\nSample moderation log data';
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `moderation-logs-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Export moderation logs
                  </button>
                  <button 
                    onClick={() => alert('Spam keywords updated successfully.')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Update spam keywords
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <li key={report.id}>
              <div className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{report.timestamp}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">
                        Reason: {report.reason} | Reported User: {report.reportedUser}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                        "{report.message}"
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Reported by: {report.reportedBy}
                      </p>
                    </div>
                  </div>
                  <div className="ml-6 flex space-x-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(report.id, 'approve')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </button>
                        <button
                          onClick={() => handleAction(report.id, 'dismiss')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Report Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Message ID:</label>
                  <p className="text-sm text-gray-900">{selectedReport.messageId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reported User:</label>
                  <p className="text-sm text-gray-900">{selectedReport.reportedUser}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reported By:</label>
                  <p className="text-sm text-gray-900">{selectedReport.reportedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reason:</label>
                  <p className="text-sm text-gray-900">{selectedReport.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Message:</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedReport.message}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Severity:</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedReport.severity)}`}>
                    {selectedReport.severity}
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
                {selectedReport.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(selectedReport.id, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleAction(selectedReport.id, 'dismiss')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Customer Section */}
      <div className="mt-8">
        <Link href="/customer-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Customer Section
        </Link>
      </div>
    </div>
  );
}