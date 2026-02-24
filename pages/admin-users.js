import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, Edit, Trash2, Shield, Eye, EyeOff, Key } from 'lucide-react';

// Consistent date formatting to prevent hydration errors
const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export default function AdminUsers() {
  const [admins, setAdmins] = useState([
    {
      id: 'ADM-001',
      name: 'Super Admin',
      email: 'admin@tradichatter.com',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-25T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      permissions: ['all']
    },
    {
      id: 'ADM-002',
      name: 'John Manager',
      email: 'john@tradichatter.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-24T15:45:00Z',
      createdAt: '2024-01-10T00:00:00Z',
      permissions: ['users', 'businesses', 'payments']
    },
    {
      id: 'ADM-003',
      name: 'Sarah Support',
      email: 'sarah@tradichatter.com',
      role: 'support',
      status: 'active',
      lastLogin: '2024-01-25T09:15:00Z',
      createdAt: '2024-01-15T00:00:00Z',
      permissions: ['users', 'support']
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'support',
    permissions: []
  });

  const roles = {
    super_admin: { name: 'Super Admin', color: 'bg-red-100 text-red-800', permissions: ['all'] },
    manager: { name: 'Manager', color: 'bg-blue-100 text-blue-800', permissions: ['users', 'businesses', 'payments', 'analytics'] },
    support: { name: 'Support', color: 'bg-green-100 text-green-800', permissions: ['users', 'support'] },
    moderator: { name: 'Moderator', color: 'bg-yellow-100 text-yellow-800', permissions: ['users', 'moderation'] },
    affiliate_manager: { name: 'Affiliate Manager', color: 'bg-purple-100 text-purple-800', permissions: ['affiliates', 'analytics', 'payments'] },
    business_manager: { name: 'Business Manager', color: 'bg-indigo-100 text-indigo-800', permissions: ['businesses', 'orders', 'kyc', 'analytics'] },
    customer_manager: { name: 'Customer Manager', color: 'bg-teal-100 text-teal-800', permissions: ['users', 'support', 'reviews', 'moderation'] }
  };

  const allPermissions = [
    { id: 'users', name: 'User Management' },
    { id: 'businesses', name: 'Business Management' },
    { id: 'payments', name: 'Payment Management' },
    { id: 'analytics', name: 'Analytics Access' },
    { id: 'support', name: 'Customer Support' },
    { id: 'moderation', name: 'Content Moderation' },
    { id: 'system', name: 'System Configuration' },
    { id: 'affiliates', name: 'Affiliate Management' },
    { id: 'orders', name: 'Order Management' },
    { id: 'kyc', name: 'KYC Verification' },
    { id: 'reviews', name: 'Review Management' }
  ];

  const handleCreateAdmin = () => {
    const newAdmin = {
      id: `ADM-${String(admins.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      permissions: formData.role === 'super_admin' ? ['all'] : formData.permissions
    };

    setAdmins(prev => [...prev, newAdmin]);
    setShowCreateModal(false);
    setFormData({ name: '', email: '', role: 'support', permissions: [] });
    alert('Admin user created successfully!');
  };

  const handleEditAdmin = () => {
    setAdmins(prev => prev.map(admin => 
      admin.id === selectedAdmin.id 
        ? { ...admin, ...formData, permissions: formData.role === 'super_admin' ? ['all'] : formData.permissions }
        : admin
    ));
    setShowEditModal(false);
    setSelectedAdmin(null);
    setFormData({ name: '', email: '', role: 'support', permissions: [] });
    alert('Admin user updated successfully!');
  };

  const handleDeleteAdmin = (adminId) => {
    if (confirm('Are you sure you want to delete this admin user?')) {
      setAdmins(prev => prev.filter(admin => admin.id !== adminId));
      alert('Admin user deleted successfully!');
    }
  };

  const handleStatusToggle = (adminId) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === 'active' ? 'suspended' : 'active' }
        : admin
    ));
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions.includes('all') ? [] : admin.permissions
    });
    setShowEditModal(true);
  };

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'active').length,
    suspended: admins.filter(a => a.status === 'suspended').length,
    superAdmins: admins.filter(a => a.role === 'super_admin').length
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin User Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage admin accounts, roles, and permissions for platform access.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Total Admins</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Active</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <EyeOff className="h-6 w-6 text-red-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Suspended</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.suspended}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Key className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Super Admins</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.superAdmins}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Admin User
        </button>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                    <div className="text-xs text-gray-400">{admin.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roles[admin.role]?.color}`}>
                    {roles[admin.role]?.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(admin.lastLogin)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(admin)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleStatusToggle(admin.id)}
                    className={`mr-3 ${admin.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                    title={admin.status === 'active' ? 'Suspend' : 'Activate'}
                  >
                    {admin.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {admin.role !== 'super_admin' && (
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Admin User</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value, permissions: [] }))}
                >
                  {Object.entries(roles).map(([key, role]) => (
                    <option key={key} value={key}>{role.name}</option>
                  ))}
                </select>
                
                {formData.role !== 'super_admin' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Permissions</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {allPermissions.map(permission => (
                        <label key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={formData.permissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({ ...prev, permissions: [...prev.permissions, permission.id] }));
                              } else {
                                setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission.id) }));
                              }
                            }}
                          />
                          <span className="text-sm">{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateAdmin}
                  disabled={!formData.name || !formData.email}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Create Admin
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', email: '', role: 'support', permissions: [] });
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

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Admin User</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value, permissions: [] }))}
                >
                  {Object.entries(roles).map(([key, role]) => (
                    <option key={key} value={key}>{role.name}</option>
                  ))}
                </select>
                
                {formData.role !== 'super_admin' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Permissions</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {allPermissions.map(permission => (
                        <label key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={formData.permissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({ ...prev, permissions: [...prev.permissions, permission.id] }));
                              } else {
                                setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission.id) }));
                              }
                            }}
                          />
                          <span className="text-sm">{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleEditAdmin}
                  disabled={!formData.name || !formData.email}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Update Admin
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAdmin(null);
                    setFormData({ name: '', email: '', role: 'support', permissions: [] });
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
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}