import { useState } from 'react';
import { useRouter } from 'next/router';
import { Flag, Eye, Check, X, ArrowLeft, MessageSquare, Store, Star } from 'lucide-react';

export default function ReportedContent() {
  const router = useRouter();
  const [reports, setReports] = useState([
    {
      id: 1,
      type: 'message',
      content: 'This is spam content trying to sell fake products...',
      reporter: 'user123',
      reported: 'spammer456',
      reason: 'Spam/Scam',
      status: 'pending',
      timestamp: '2024-01-15T10:30:00',
      severity: 'high'
    },
    {
      id: 2,
      type: 'business',
      content: 'Fake Electronics Store - selling counterfeit items',
      reporter: 'customer789',
      reported: 'fakestore',
      reason: 'Fraudulent Business',
      status: 'pending',
      timestamp: '2024-01-15T09:15:00',
      severity: 'high'
    },
    {
      id: 3,
      type: 'review',
      content: 'Terrible service, worst experience ever...',
      reporter: 'business_owner',
      reported: 'angry_customer',
      reason: 'Inappropriate Language',
      status: 'reviewed',
      timestamp: '2024-01-14T16:45:00',
      severity: 'medium'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  const handleAction = (reportId, action) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: action } : report
    ));
    setSelectedReport(null);
    alert(`Report ${action === 'approved' ? 'approved' : 'dismissed'} successfully!`);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'business': return Store;
      case 'review': return Star;
      default: return Flag;
    }
  };

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push('/content-moderation')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content Moderation
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Flag className="mr-3 h-8 w-8" />
          Reported Content Review
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and moderate flagged messages, businesses, and reviews
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Reports ({filteredReports.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => {
            const TypeIcon = getTypeIcon(report.type);
            return (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TypeIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          report.severity === 'high' ? 'bg-red-100 text-red-800' :
                          report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{report.content}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        Reported by: {report.reporter} | Against: {report.reported} | Reason: {report.reason}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(report.id, 'approved')}
                          className="p-2 text-green-600 hover:text-green-800"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction(report.id, 'dismissed')}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="text-sm text-gray-900 capitalize">{selectedReport.type}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedReport.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reporter</label>
                  <p className="text-sm text-gray-900">{selectedReport.reporter}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reported User/Business</label>
                  <p className="text-sm text-gray-900">{selectedReport.reported}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <p className="text-sm text-gray-900">{selectedReport.reason}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                <p className="text-sm text-gray-900">{new Date(selectedReport.timestamp).toLocaleString()}</p>
              </div>

              {selectedReport.status === 'pending' && (
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => handleAction(selectedReport.id, 'dismissed')}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleAction(selectedReport.id, 'approved')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Take Action
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}