import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, Clock, Users, Search, Plus, Eye, AlertCircle, CheckCircle } from 'lucide-react';

export default function BonusSubscription() {
  const [users, setUsers] = useState([
    {
      id: 'USER-001',
      businessName: 'Tech Solutions Ltd',
      ownerName: 'John Doe',
      email: 'john@techsolutions.com',
      currentStatus: 'active',
      bonusStatus: null,
      phone: '+234-801-234-5678'
    },
    {
      id: 'USER-002', 
      businessName: 'Fashion Hub',
      ownerName: 'Jane Smith',
      email: 'jane@fashionhub.com',
      currentStatus: 'trial',
      bonusStatus: { duration: 7, unit: 'days', daysRemaining: 3, grantedBy: 'Admin', reason: 'Customer service' },
      phone: '+234-802-345-6789'
    },
    {
      id: 'USER-003',
      businessName: 'Green Farm Ltd', 
      ownerName: 'Mike Johnson',
      email: 'mike@greenfarm.com',
      currentStatus: 'expired',
      bonusStatus: null,
      phone: '+234-803-456-7890'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [grantForm, setGrantForm] = useState({
    duration: '',
    unit: 'days',
    reason: ''
  });
  const [logs, setLogs] = useState([
    {
      id: '1',
      action: 'grant',
      userId: 'USER-002',
      businessName: 'Fashion Hub',
      duration: 7,
      unit: 'days',
      grantedBy: 'Admin',
      reason: 'Customer service',
      timestamp: '2024-01-25T10:30:00Z'
    },
    {
      id: '2', 
      action: 'grant',
      userId: 'USER-004',
      businessName: 'Beauty Store',
      duration: 1,
      unit: 'months',
      grantedBy: 'Admin',
      reason: 'Promotional campaign',
      timestamp: '2024-01-24T15:45:00Z'
    }
  ]);

  const filteredUsers = users.filter(user => 
    user.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGrantBonus = async () => {
    if (!selectedUser || !grantForm.duration) return;

    try {
      // Simulate API call
      const newBonus = {
        duration: parseInt(grantForm.duration),
        unit: grantForm.unit,
        daysRemaining: calculateDaysRemaining(parseInt(grantForm.duration), grantForm.unit),
        grantedBy: 'Admin',
        reason: grantForm.reason,
        grantedAt: new Date().toISOString()
      };

      // Update user
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, bonusStatus: newBonus }
          : user
      ));

      // Add to logs
      const newLog = {
        id: Date.now().toString(),
        action: 'grant',
        userId: selectedUser.id,
        businessName: selectedUser.businessName,
        duration: parseInt(grantForm.duration),
        unit: grantForm.unit,
        grantedBy: 'Admin',
        reason: grantForm.reason,
        timestamp: new Date().toISOString()
      };
      setLogs(prev => [newLog, ...prev]);

      // Reset form
      setShowGrantModal(false);
      setSelectedUser(null);
      setGrantForm({ duration: '', unit: 'days', reason: '' });

      alert('Bonus subscription granted successfully! User has been notified.');
    } catch (error) {
      alert('Error granting bonus subscription');
    }
  };

  const calculateDaysRemaining = (duration, unit) => {
    switch (unit) {
      case 'days': return duration;
      case 'weeks': return duration * 7;
      case 'months': return duration * 30;
      default: return duration;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-blue-100 text-blue-800', 
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    totalUsers: users.length,
    activeBonuses: users.filter(u => u.bonusStatus?.daysRemaining > 0).length,
    totalGranted: logs.length,
    thisMonth: logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonus Subscription Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Grant bonus premium access to users and track admin actions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Total Users</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Gift className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Active Bonuses</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.activeBonuses}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Total Granted</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalGranted}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-yellow-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">This Month</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.thisMonth}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.businessName}</div>
                    <div className="text-sm text-gray-500">{user.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.ownerName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.currentStatus)}`}>
                    {user.currentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.bonusStatus ? (
                    <div>
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          {user.bonusStatus.daysRemaining} days left
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.bonusStatus.duration} {user.bonusStatus.unit} granted
                      </div>
                      {user.bonusStatus.reason && (
                        <div className="text-xs text-gray-400">
                          Reason: {user.bonusStatus.reason}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No bonus</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowGrantModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Grant Bonus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Action Logs */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            Admin Action Log
          </h3>
          <p className="text-sm text-gray-600">Track all bonus subscription grants for accountability</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border-l-4 border-blue-400 bg-blue-50 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Granted {log.duration} {log.unit} to {log.businessName}
                    </p>
                    <p className="text-sm text-blue-600">
                      By: {log.grantedBy} • User ID: {log.userId}
                    </p>
                    {log.reason && (
                      <p className="text-sm text-blue-600">
                        Reason: {log.reason}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-blue-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grant Bonus Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Grant Bonus Subscription
              </h3>
              
              {selectedUser && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium">{selectedUser.businessName}</p>
                  <p className="text-sm text-gray-600">{selectedUser.ownerName}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Duration"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    value={grantForm.duration}
                    onChange={(e) => setGrantForm(prev => ({ ...prev, duration: e.target.value }))}
                    min="1"
                  />
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    value={grantForm.unit}
                    onChange={(e) => setGrantForm(prev => ({ ...prev, unit: e.target.value }))}
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
                
                <textarea
                  placeholder="Reason (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                  value={grantForm.reason}
                  onChange={(e) => setGrantForm(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGrantBonus}
                  disabled={!grantForm.duration}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Grant Bonus
                </button>
                <button
                  onClick={() => {
                    setShowGrantModal(false);
                    setSelectedUser(null);
                    setGrantForm({ duration: '', unit: 'days', reason: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/subscription-management" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Subscription Management
        </Link>
      </div>
    </div>
  );
}