import { useState } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, CheckCircle, XCircle, Edit, Plus } from 'lucide-react';

export default function AdvertisingPolicies() {
  const [policies, setPolicies] = useState([
    {
      id: 'POL001',
      title: 'Prohibited Content',
      description: 'No adult content, violence, or illegal products',
      category: 'Content Guidelines',
      status: 'active',
      violations: 12,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'POL002', 
      title: 'Misleading Claims',
      description: 'No false pricing, fake reviews, or deceptive practices',
      category: 'Truth in Advertising',
      status: 'active',
      violations: 8,
      lastUpdated: '2024-01-10'
    },
    {
      id: 'POL003',
      title: 'Image Quality Standards',
      description: 'Minimum resolution 800x600, no blurry or pixelated images',
      category: 'Technical Requirements',
      status: 'active',
      violations: 3,
      lastUpdated: '2024-01-20'
    },
    {
      id: 'POL004',
      title: 'Targeting Restrictions',
      description: 'No discrimination based on protected characteristics',
      category: 'Targeting Guidelines',
      status: 'under_review',
      violations: 1,
      lastUpdated: '2024-01-18'
    }
  ]);

  const [violations, setViolations] = useState([
    {
      id: 'VIO001',
      campaignId: 'AD004',
      businessName: 'Electronics Store',
      policyId: 'POL002',
      policyTitle: 'Misleading Claims',
      description: 'Campaign claimed "50% off" but actual discount was only 20%',
      severity: 'high',
      status: 'resolved',
      reportedAt: '2024-01-19',
      resolvedAt: '2024-01-19'
    },
    {
      id: 'VIO002',
      campaignId: 'AD005',
      businessName: 'Fashion Store',
      policyId: 'POL003',
      policyTitle: 'Image Quality Standards',
      description: 'Product images were below minimum resolution requirements',
      severity: 'medium',
      status: 'pending',
      reportedAt: '2024-01-20'
    }
  ]);

  const [activeTab, setActiveTab] = useState('policies');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({ title: '', description: '', category: '' });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Advertising Policies</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage advertising policies, monitor violations, and maintain platform standards.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <dt className="text-sm font-medium text-gray-500">Active Policies</dt>
              <dd className="text-2xl font-semibold text-gray-900">{policies.filter(p => p.status === 'active').length}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <dt className="text-sm font-medium text-gray-500">Total Violations</dt>
              <dd className="text-2xl font-semibold text-red-600">{violations.length}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <dt className="text-sm font-medium text-gray-500">Pending Reviews</dt>
              <dd className="text-2xl font-semibold text-orange-600">{violations.filter(v => v.status === 'pending').length}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <dt className="text-sm font-medium text-gray-500">Resolved</dt>
              <dd className="text-2xl font-semibold text-green-600">{violations.filter(v => v.status === 'resolved').length}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('policies')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'policies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Policies
            </button>
            <button
              onClick={() => setActiveTab('violations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'violations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Violations
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'policies' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Policy Management</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Policy
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Policy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Violations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{policy.title}</div>
                        <div className="text-sm text-gray-500">{policy.description}</div>
                        <div className="text-xs text-gray-400">ID: {policy.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{policy.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{policy.violations}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status)}`}>
                        {policy.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button 
                        onClick={() => {
                          setSelectedPolicy(policy);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'violations' && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Policy Violations</h2>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Violation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Policy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {violations.map((violation) => (
                  <tr key={violation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Campaign: {violation.campaignId}</div>
                        <div className="text-sm text-gray-500">{violation.description}</div>
                        <div className="text-xs text-gray-400">Reported: {violation.reportedAt}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{violation.businessName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{violation.policyTitle}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(violation.severity)}`}>
                        {violation.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(violation.status)}`}>
                        {violation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {violation.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-900">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Policy</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newPolicy.title}
                  onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newPolicy.category}
                  onChange={(e) => setNewPolicy({...newPolicy, category: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select Category</option>
                  <option value="Content Guidelines">Content Guidelines</option>
                  <option value="Truth in Advertising">Truth in Advertising</option>
                  <option value="Technical Requirements">Technical Requirements</option>
                  <option value="Targeting Guidelines">Targeting Guidelines</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewPolicy({ title: '', description: '', category: '' });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newPolicy.title && newPolicy.description && newPolicy.category) {
                    const policy = {
                      id: `POL${String(policies.length + 1).padStart(3, '0')}`,
                      ...newPolicy,
                      status: 'active',
                      violations: 0,
                      lastUpdated: new Date().toISOString().split('T')[0]
                    };
                    setPolicies([...policies, policy]);
                    setShowAddModal(false);
                    setNewPolicy({ title: '', description: '', category: '' });
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Policy Modal */}
      {showEditModal && selectedPolicy && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Policy</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={selectedPolicy.title}
                  onChange={(e) => setSelectedPolicy({...selectedPolicy, title: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={selectedPolicy.description}
                  onChange={(e) => setSelectedPolicy({...selectedPolicy, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={selectedPolicy.category}
                  onChange={(e) => setSelectedPolicy({...selectedPolicy, category: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Content Guidelines">Content Guidelines</option>
                  <option value="Truth in Advertising">Truth in Advertising</option>
                  <option value="Technical Requirements">Technical Requirements</option>
                  <option value="Targeting Guidelines">Targeting Guidelines</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedPolicy.status}
                  onChange={(e) => setSelectedPolicy({...selectedPolicy, status: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="under_review">Under Review</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedPolicy(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPolicies(policies.map(p => 
                    p.id === selectedPolicy.id 
                      ? { ...selectedPolicy, lastUpdated: new Date().toISOString().split('T')[0] }
                      : p
                  ));
                  setShowEditModal(false);
                  setSelectedPolicy(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/advertising-management" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Advertising Management
        </Link>
      </div>
    </div>
  );
}