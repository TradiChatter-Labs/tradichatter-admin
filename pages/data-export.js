import { useState } from 'react';
import Link from 'next/link';
import { Download, Search, Calendar, FileText, User, Database, ArrowLeft } from 'lucide-react';

export default function DataExport() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      userId: 'user123',
      email: 'john@example.com',
      requestType: 'full_export',
      status: 'completed',
      requestDate: '2024-01-20',
      completedDate: '2024-01-20',
      downloadUrl: '/exports/user123_export.zip'
    },
    {
      id: 2,
      userId: 'user456',
      email: 'jane@example.com',
      requestType: 'profile_data',
      status: 'processing',
      requestDate: '2024-01-19',
      completedDate: null,
      downloadUrl: null
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    userId: '',
    email: '',
    requestType: 'full_export'
  });

  const handleCreateRequest = async () => {
    if (!newRequest.userId || !newRequest.email) {
      alert('Please fill in all fields');
      return;
    }

    const request = {
      id: Date.now(),
      ...newRequest,
      status: 'processing',
      requestDate: new Date().toISOString().split('T')[0],
      completedDate: null,
      downloadUrl: null
    };

    setRequests([request, ...requests]);
    setNewRequest({ userId: '', email: '', requestType: 'full_export' });
    alert('Data export request created successfully');
  };

  const handleDownload = (url, userId) => {
    // Simulate download
    alert(`Downloading export for user ${userId}`);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/compliance-legal" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Compliance & Legal
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Download className="mr-3 h-8 w-8" />
          Data Export Tools
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          GDPR compliance data export and user data requests management
        </p>
      </div>

      {/* Create New Request */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Export Request</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              value={newRequest.userId}
              onChange={(e) => setNewRequest({...newRequest, userId: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={newRequest.email}
              onChange={(e) => setNewRequest({...newRequest, email: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Export Type</label>
            <select
              value={newRequest.requestType}
              onChange={(e) => setNewRequest({...newRequest, requestType: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full_export">Full Data Export</option>
              <option value="profile_data">Profile Data Only</option>
              <option value="messages">Messages & Chats</option>
              <option value="transactions">Transaction History</option>
              <option value="business_data">Business Data</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreateRequest}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Export Request
          </button>
        </div>
      </div>

      {/* Export Requests List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Export Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.userId}</div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.requestType.replace('_', ' ').toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      request.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.requestDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.completedDate || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'completed' && request.downloadUrl ? (
                      <button
                        onClick={() => handleDownload(request.downloadUrl, request.userId)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}