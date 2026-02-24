import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MoreVertical, Ban, CheckCircle, XCircle } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+234 801 234 5678',
      status: 'active',
      userType: 'customer',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      kycStatus: 'verified'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@business.com',
      phone: '+234 802 345 6789',
      status: 'active',
      userType: 'business',
      joinDate: '2024-01-10',
      lastActive: '2024-01-19',
      kycStatus: 'pending'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+234 803 456 7890',
      status: 'suspended',
      userType: 'customer',
      joinDate: '2024-01-05',
      lastActive: '2024-01-18',
      kycStatus: 'rejected'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesType = filterType === 'all' || user.userType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const KYCBadge = ({ status }) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage all users, their status, and KYC verification.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
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
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="customer">Customer</option>
          <option value="business">Business</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="ml-2">
                        <StatusBadge status={user.status} />
                      </div>
                      <div className="ml-2">
                        <KYCBadge status={user.kycStatus} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-900 capitalize">{user.userType}</div>
                    <div className="text-sm text-gray-500">Joined: {user.joinDate}</div>
                    <div className="text-sm text-gray-500">Last active: {user.lastActive}</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(user.id, 'suspended')}
                        className="text-red-600 hover:text-red-900"
                        title="Suspend User"
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(user.id, 'active')}
                        className="text-green-600 hover:text-green-900"
                        title="Activate User"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No users found matching your criteria.</div>
        </div>
      )}

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
            <div className="space-y-3">
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Phone:</strong> {selectedUser.phone}</div>
              <div><strong>Type:</strong> {selectedUser.userType}</div>
              <div><strong>Status:</strong> <StatusBadge status={selectedUser.status} /></div>
              <div><strong>KYC Status:</strong> <KYCBadge status={selectedUser.kycStatus} /></div>
              <div><strong>Join Date:</strong> {selectedUser.joinDate}</div>
              <div><strong>Last Active:</strong> {selectedUser.lastActive}</div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const newStatus = selectedUser.status === 'active' ? 'suspended' : 'active';
                  handleStatusChange(selectedUser.id, newStatus);
                  setShowModal(false);
                }}
                className={`px-4 py-2 rounded-md ${
                  selectedUser.status === 'active' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
              </button>
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