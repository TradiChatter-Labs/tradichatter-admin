import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

const UserSuspension = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [suspensions, setSuspensions] = useState([]);
  const [suspensionForm, setSuspensionForm] = useState({
    userId: '',
    type: 'warning',
    duration: '1',
    reason: '',
    notes: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
    fetchSuspensions();
  }, []);

  const fetchUsers = async () => {
    setUsers([
      { id: 1, username: 'user123', email: 'user@example.com', status: 'active', violations: 2 },
      { id: 2, username: 'trader456', email: 'trader@example.com', status: 'suspended', violations: 5 },
      { id: 3, username: 'business789', email: 'biz@example.com', status: 'banned', violations: 8 }
    ]);
  };

  const fetchSuspensions = async () => {
    setSuspensions([
      {
        id: 1,
        userId: 2,
        username: 'trader456',
        type: 'suspension',
        reason: 'Spam messaging',
        duration: '7 days',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        status: 'active',
        adminId: 'admin1'
      },
      {
        id: 2,
        userId: 3,
        username: 'business789',
        type: 'ban',
        reason: 'Fraudulent business practices',
        duration: 'permanent',
        startDate: '2024-01-10',
        endDate: null,
        status: 'active',
        adminId: 'admin2'
      }
    ]);
  };

  const handleSuspension = async (e) => {
    e.preventDefault();
    
    const newSuspension = {
      id: Date.now(),
      userId: parseInt(suspensionForm.userId),
      username: users.find(u => u.id === parseInt(suspensionForm.userId))?.username,
      type: suspensionForm.type,
      reason: suspensionForm.reason,
      duration: suspensionForm.type === 'ban' ? 'permanent' : `${suspensionForm.duration} days`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: suspensionForm.type === 'ban' ? null : 
        new Date(Date.now() + parseInt(suspensionForm.duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      adminId: 'current_admin',
      notes: suspensionForm.notes
    };

    setSuspensions([...suspensions, newSuspension]);
    
    setUsers(users.map(user => 
      user.id === parseInt(suspensionForm.userId) 
        ? { ...user, status: suspensionForm.type === 'ban' ? 'banned' : 'suspended' }
        : user
    ));

    setSuspensionForm({ userId: '', type: 'warning', duration: '1', reason: '', notes: '' });
    setShowForm(false);
  };

  const liftSuspension = async (suspensionId) => {
    const suspension = suspensions.find(s => s.id === suspensionId);
    
    setSuspensions(suspensions.map(s => 
      s.id === suspensionId ? { ...s, status: 'lifted' } : s
    ));
    
    setUsers(users.map(user => 
      user.id === suspension.userId ? { ...user, status: 'active' } : user
    ));
  };

  const filteredSuspensions = suspensions.filter(suspension => {
    if (filter === 'all') return true;
    return suspension.status === filter;
  });

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
            <h1 className="text-2xl font-bold">User Suspension & Ban Management</h1>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowForm(true)}
          >
            New Action
          </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Active Users</h3>
            <div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Suspended</h3>
            <div className="text-2xl font-bold text-orange-600">{users.filter(u => u.status === 'suspended').length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Banned</h3>
            <div className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'banned').length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Total Actions</h3>
            <div className="text-2xl font-bold">{suspensions.length}</div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">User Action</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              <form onSubmit={handleSuspension}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">User</label>
                  <select 
                    value={suspensionForm.userId}
                    onChange={(e) => setSuspensionForm({...suspensionForm, userId: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select User</option>
                    {users.filter(u => u.status === 'active').map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Action Type</label>
                  <select 
                    value={suspensionForm.type}
                    onChange={(e) => setSuspensionForm({...suspensionForm, type: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="warning">Warning</option>
                    <option value="suspension">Temporary Suspension</option>
                    <option value="ban">Permanent Ban</option>
                  </select>
                </div>

                {suspensionForm.type === 'suspension' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Duration (days)</label>
                    <input 
                      type="number"
                      value={suspensionForm.duration}
                      onChange={(e) => setSuspensionForm({...suspensionForm, duration: e.target.value})}
                      className="w-full p-2 border rounded"
                      min="1"
                      max="365"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Reason</label>
                  <select 
                    value={suspensionForm.reason}
                    onChange={(e) => setSuspensionForm({...suspensionForm, reason: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Reason</option>
                    <option value="Spam messaging">Spam messaging</option>
                    <option value="Inappropriate content">Inappropriate content</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Fraudulent activity">Fraudulent activity</option>
                    <option value="Terms violation">Terms violation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <textarea 
                    value={suspensionForm.notes}
                    onChange={(e) => setSuspensionForm({...suspensionForm, notes: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Apply Action
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-4">
          <button 
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All Actions
          </button>
          <button 
            className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`px-4 py-2 rounded ${filter === 'lifted' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('lifted')}
          >
            Lifted
          </button>
        </div>

        {/* Suspensions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuspensions.map(suspension => (
                <tr key={suspension.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{suspension.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suspension.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      suspension.type === 'suspension' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {suspension.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{suspension.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{suspension.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{suspension.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{suspension.endDate || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suspension.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {suspension.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {suspension.status === 'active' && (
                      <button 
                        className="text-green-600 hover:text-green-800"
                        onClick={() => liftSuspension(suspension.id)}
                      >
                        Lift
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default UserSuspension;