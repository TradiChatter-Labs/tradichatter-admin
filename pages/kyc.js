import { useState } from 'react';
import Link from 'next/link';
import { Search, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

export default function KYCVerification() {
  const [kycRequests, setKycRequests] = useState([
    {
      id: 1,
      businessName: 'Tech Solutions Ltd',
      ownerName: 'Emeka Obi',
      email: 'emeka@techsolutions.com',
      phone: '+234 802 345 6789',
      status: 'pending',
      submissionDate: '2024-01-19',
      documents: ['CAC Certificate', 'Tax ID', 'Bank Statement'],
      businessType: 'Technology'
    },
    {
      id: 2,
      businessName: 'Fashion Hub',
      ownerName: 'Aisha Mohammed',
      email: 'aisha@fashionhub.com',
      phone: '+234 803 456 7890',
      status: 'rejected',
      submissionDate: '2024-01-15',
      documents: ['CAC Certificate', 'Tax ID'],
      businessType: 'Fashion & Clothing',
      rejectionReason: 'Incomplete bank statement'
    },
    {
      id: 3,
      businessName: 'Green Farm Ltd',
      ownerName: 'Ibrahim Yusuf',
      email: 'ibrahim@greenfarm.com',
      phone: '+234 804 567 8901',
      status: 'approved',
      submissionDate: '2024-01-10',
      documents: ['CAC Certificate', 'Tax ID', 'Bank Statement', 'Utility Bill'],
      businessType: 'Agriculture'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = kycRequests.filter(request => {
    const matchesSearch = request.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id, newStatus, reason = '') => {
    setKycRequests(requests => 
      requests.map(request => 
        request.id === id 
          ? { ...request, status: newStatus, rejectionReason: reason }
          : request
      )
    );
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle
    };
    
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and verify business KYC documents and information.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search KYC requests..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* KYC Requests */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <li key={request.id}>
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{request.businessName}</div>
                        <div className="ml-2">
                          <StatusBadge status={request.status} />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{request.ownerName}</div>
                      <div className="text-sm text-gray-500">{request.email} • {request.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-900">{request.businessType}</div>
                      <div className="text-sm text-gray-500">Submitted: {request.submissionDate}</div>
                      <div className="text-sm text-gray-500">{request.documents.length} documents</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              if (confirm('Approve this KYC request?')) {
                                handleStatusChange(request.id, 'approved');
                              }
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Approve KYC"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Enter rejection reason:');
                              if (reason) {
                                handleStatusChange(request.id, 'rejected', reason);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Reject KYC"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {request.status === 'rejected' && request.rejectionReason && (
                  <div className="mt-2 ml-14">
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      Rejection reason: {request.rejectionReason}
                    </div>
                  </div>
                )}
                
                <div className="mt-2 ml-14">
                  <div className="text-sm text-gray-500">
                    Documents: {request.documents.join(', ')}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No KYC requests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No KYC requests match your current search criteria.
          </p>
        </div>
      )}

      {/* KYC Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">KYC Request Details</h3>
            <div className="space-y-3">
              <div><strong>Business:</strong> {selectedRequest.businessName}</div>
              <div><strong>Owner:</strong> {selectedRequest.ownerName}</div>
              <div><strong>Email:</strong> {selectedRequest.email}</div>
              <div><strong>Phone:</strong> {selectedRequest.phone}</div>
              <div><strong>Business Type:</strong> {selectedRequest.businessType}</div>
              <div><strong>Status:</strong> <StatusBadge status={selectedRequest.status} /></div>
              <div><strong>Submission Date:</strong> {selectedRequest.submissionDate}</div>
              <div><strong>Documents:</strong>
                <ul className="list-disc list-inside mt-1">
                  {selectedRequest.documents.map((doc, index) => (
                    <li key={index} className="text-sm text-gray-600">{doc}</li>
                  ))}
                </ul>
              </div>
              {selectedRequest.rejectionReason && (
                <div><strong>Rejection Reason:</strong> <span className="text-red-600">{selectedRequest.rejectionReason}</span></div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, 'approved');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Enter rejection reason:');
                      if (reason) {
                        handleStatusChange(selectedRequest.id, 'rejected', reason);
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

      {/* Back to Business Section */}
      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}