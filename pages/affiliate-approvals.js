import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, CheckCircle, XCircle, Eye, Mail, Phone, Calendar, FileText } from 'lucide-react';

export default function AffiliateApprovals() {
  const [applications, setApplications] = useState([
    {
      id: 'APP001',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+234 802 345 6789',
      status: 'pending',
      applicationDate: '2024-01-15',
      experience: '2 years in digital marketing',
      referralSource: 'Google Search',
      expectedEarnings: '₦50,000/month',
      socialMedia: '@sarahmarketing'
    },
    {
      id: 'APP002',
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+234 803 456 7890',
      status: 'pending',
      applicationDate: '2024-01-18',
      experience: 'New to affiliate marketing',
      referralSource: 'Facebook Ad',
      expectedEarnings: '₦30,000/month',
      socialMedia: '@davidwilson'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleApplicationAction = (appId, action, reason = '') => {
    setApplications(applications.map(app => 
      app.id === appId 
        ? { ...app, status: action, processedDate: new Date().toISOString().split('T')[0], rejectionReason: reason }
        : app
    ));
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Registration Approval</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and approve new affiliate applications.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500">Pending Applications</dt>
          <dd className="mt-1 text-2xl font-semibold text-yellow-600">
            {applications.filter(a => a.status === 'pending').length}
          </dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500">Approved Today</dt>
          <dd className="mt-1 text-2xl font-semibold text-green-600">3</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500">Total Applications</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{applications.length}</dd>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Affiliate Applications</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {applications.map((application) => (
            <li key={application.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{application.name}</p>
                        <span className="ml-2 text-sm text-gray-500">#{application.id}</span>
                      </div>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">{application.email}</p>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">{application.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{application.expectedEarnings}</p>
                      <p className="text-sm text-gray-500">Expected earnings</p>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">Applied: {application.applicationDate}</p>
                    </div>
                    <p className="text-xs text-gray-500">Source: {application.referralSource}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowModal(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                    >
                      <Eye className="h-3 w-3 inline mr-1" />
                      View Details
                    </button>
                    {application.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => {
                            if (confirm(`Approve ${application.name}?`)) {
                              handleApplicationAction(application.id, 'approved');
                            }
                          }}
                          className="text-xs text-green-600 hover:text-green-500 font-medium"
                        >
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          Approve
                        </button>
                        <button 
                          onClick={() => {
                            const reason = prompt('Rejection reason:');
                            if (reason) {
                              handleApplicationAction(application.id, 'rejected', reason);
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-500 font-medium"
                        >
                          <XCircle className="h-3 w-3 inline mr-1" />
                          Reject
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

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
            <div className="space-y-3">
              <div><strong>Name:</strong> {selectedApplication.name}</div>
              <div><strong>Email:</strong> {selectedApplication.email}</div>
              <div><strong>Phone:</strong> {selectedApplication.phone}</div>
              <div><strong>Experience:</strong> {selectedApplication.experience}</div>
              <div><strong>Referral Source:</strong> {selectedApplication.referralSource}</div>
              <div><strong>Expected Earnings:</strong> {selectedApplication.expectedEarnings}</div>
              <div><strong>Social Media:</strong> {selectedApplication.socialMedia}</div>
              <div><strong>Application Date:</strong> {selectedApplication.applicationDate}</div>
              <div><strong>Status:</strong> {getStatusBadge(selectedApplication.status)}</div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {selectedApplication.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApplicationAction(selectedApplication.id, 'approved');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Rejection reason:');
                      if (reason) {
                        handleApplicationAction(selectedApplication.id, 'rejected', reason);
                        setShowModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/affiliate-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Affiliate Section
        </Link>
      </div>
    </div>
  );
}