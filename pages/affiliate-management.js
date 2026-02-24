import { useState } from 'react';
import Link from 'next/link';
import { Users, CheckCircle, XCircle, Eye, Mail, Phone, Calendar } from 'lucide-react';

export default function AffiliateManagement() {
  const [affiliates, setAffiliates] = useState([
    {
      id: 'AF001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+234 801 234 5678',
      status: 'active',
      joinDate: '2024-01-10',
      totalEarnings: 45000,
      referrals: 12,
      conversionRate: 8.5
    },
    {
      id: 'AF002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+234 802 345 6789',
      status: 'pending',
      joinDate: '2024-01-15',
      totalEarnings: 0,
      referrals: 0,
      conversionRate: 0
    },
    {
      id: 'AF003',
      name: 'Mike Davis',
      email: 'mike@example.com',
      phone: '+234 803 456 7890',
      status: 'suspended',
      joinDate: '2023-12-20',
      totalEarnings: 23000,
      referrals: 8,
      conversionRate: 6.2
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);

  const handleStatusChange = (affiliateId, newStatus) => {
    setAffiliates(affiliates.map(affiliate => 
      affiliate.id === affiliateId 
        ? { ...affiliate, status: newStatus }
        : affiliate
    ));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && showModal) {
      setShowModal(false);
    }
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || affiliate.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage affiliate registrations, approvals, and account status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Total Affiliates</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">156</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Active</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">89</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Pending Approval</dt>
            <dd className="mt-1 text-2xl font-semibold text-yellow-600">12</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Suspended</dt>
            <dd className="mt-1 text-2xl font-semibold text-red-600">5</dd>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <input
              type="text"
              placeholder="Search affiliates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Affiliate List</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredAffiliates.map((affiliate) => (
            <li key={affiliate.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {affiliate.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{affiliate.name}</p>
                        <span className="ml-2 text-sm text-gray-500">#{affiliate.id}</span>
                      </div>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">{affiliate.email}</p>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">{affiliate.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₦{affiliate.totalEarnings.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{affiliate.referrals} referrals</p>
                    </div>
                    {getStatusBadge(affiliate.status)}
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">Joined: {affiliate.joinDate}</p>
                    <span className="mx-2 text-gray-300">•</span>
                    <p className="text-xs text-gray-500">Conversion: {affiliate.conversionRate}%</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedAffiliate(affiliate);
                        setShowModal(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                    >
                      <Eye className="h-3 w-3 inline mr-1" />
                      View Details
                    </button>
                    {affiliate.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => {
                            if (confirm(`Approve ${affiliate.name}?`)) {
                              handleStatusChange(affiliate.id, 'active');
                            }
                          }}
                          className="text-xs text-green-600 hover:text-green-500 font-medium"
                        >
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          Approve
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Reject ${affiliate.name}?`)) {
                              handleStatusChange(affiliate.id, 'suspended');
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-500 font-medium"
                        >
                          <XCircle className="h-3 w-3 inline mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    {affiliate.status === 'active' && (
                      <button 
                        onClick={() => {
                          if (confirm(`Suspend ${affiliate.name}?`)) {
                            handleStatusChange(affiliate.id, 'suspended');
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-500 font-medium"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Affiliate Detail Modal */}
      {showModal && selectedAffiliate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title" onKeyDown={handleKeyDown}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 id="modal-title" className="text-lg font-medium text-gray-900 mb-4">Affiliate Details</h3>
            <div className="space-y-3">
              <div><strong>ID:</strong> {selectedAffiliate.id}</div>
              <div><strong>Name:</strong> {selectedAffiliate.name}</div>
              <div><strong>Email:</strong> {selectedAffiliate.email}</div>
              <div><strong>Phone:</strong> {selectedAffiliate.phone}</div>
              <div><strong>Status:</strong> {getStatusBadge(selectedAffiliate.status)}</div>
              <div><strong>Join Date:</strong> {selectedAffiliate.joinDate}</div>
              <div><strong>Total Earnings:</strong> ₦{selectedAffiliate.totalEarnings.toLocaleString()}</div>
              <div><strong>Referrals:</strong> {selectedAffiliate.referrals}</div>
              <div><strong>Conversion Rate:</strong> {selectedAffiliate.conversionRate}%</div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {selectedAffiliate.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      if (confirm(`Approve ${selectedAffiliate.name}?`)) {
                        handleStatusChange(selectedAffiliate.id, 'active');
                        setShowModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Reject ${selectedAffiliate.name}?`)) {
                        handleStatusChange(selectedAffiliate.id, 'suspended');
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

      {/* Back to Affiliate Section */}
      <div className="mt-8">
        <Link href="/affiliate-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Affiliate Section
        </Link>
      </div>
    </div>
  );
}