import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Users, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, Ban, Eye, RefreshCw, Gift } from 'lucide-react';

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 'SUB-001',
      businessId: 'BIZ-001',
      businessName: 'Tech Solutions Ltd',
      ownerName: 'John Doe',
      ownerEmail: 'john@techsolutions.com',
      status: 'active',
      plan: 'premium',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      amount: 7500,
      paymentMethod: 'paystack',
      lastPayment: '2024-01-15',
      autoRenew: true,
      trialUsed: true
    },
    {
      id: 'SUB-002',
      businessId: 'BIZ-002',
      businessName: 'Fashion Hub',
      ownerName: 'Jane Smith',
      ownerEmail: 'jane@fashionhub.com',
      status: 'trial',
      plan: 'trial',
      startDate: '2024-01-20',
      endDate: '2024-02-04',
      amount: 0,
      paymentMethod: null,
      lastPayment: null,
      autoRenew: false,
      trialUsed: true,
      daysRemaining: 8
    },
    {
      id: 'SUB-003',
      businessId: 'BIZ-003',
      businessName: 'Green Farm Ltd',
      ownerName: 'Mike Johnson',
      ownerEmail: 'mike@greenfarm.com',
      status: 'expired',
      plan: 'premium',
      startDate: '2023-12-01',
      endDate: '2024-01-01',
      amount: 7500,
      paymentMethod: 'paystack',
      lastPayment: '2023-12-01',
      autoRenew: false,
      trialUsed: true
    },
    {
      id: 'SUB-004',
      businessId: 'BIZ-004',
      businessName: 'Beauty Store',
      ownerName: 'Sarah Wilson',
      ownerEmail: 'sarah@beautystore.com',
      status: 'grace',
      plan: 'premium',
      startDate: '2024-01-01',
      endDate: '2024-01-18',
      amount: 7500,
      paymentMethod: 'paystack',
      lastPayment: '2024-01-01',
      autoRenew: true,
      trialUsed: true,
      hoursRemaining: 6
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || sub.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-blue-100 text-blue-800',
      expired: 'bg-red-100 text-red-800',
      grace: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: CheckCircle,
      trial: Clock,
      expired: Ban,
      grace: AlertTriangle,
      cancelled: Ban
    };
    return icons[status] || Ban;
  };

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    trial: subscriptions.filter(s => s.status === 'trial').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
    grace: subscriptions.filter(s => s.status === 'grace').length,
    monthlyRevenue: subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0),
    conversionRate: Math.round((subscriptions.filter(s => s.status === 'active').length / subscriptions.filter(s => s.trialUsed).length) * 100)
  };

  const handleStatusChange = (subscriptionId, newStatus) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
    ));
  };

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const handleRefund = (subscriptionId) => {
    if (confirm('Are you sure you want to process a refund for this subscription?')) {
      alert(`Refund processed for subscription ${subscriptionId}`);
      // Add actual refund logic here
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor and manage all business subscriptions, trials, and billing.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
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
              <Clock className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Trial</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.trial}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Grace</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.grace}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Monthly Revenue</dt>
                <dd className="text-lg font-medium text-gray-900">₦{stats.monthlyRevenue.toLocaleString()}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Crown className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Conversion</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.conversionRate}%</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search businesses..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Subscriptions</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="grace">Grace Period</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubscriptions.map((subscription) => {
              const StatusIcon = getStatusIcon(subscription.status);
              return (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{subscription.businessName}</div>
                      <div className="text-sm text-gray-500">{subscription.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{subscription.ownerName}</div>
                      <div className="text-sm text-gray-500">{subscription.ownerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StatusIcon className="h-4 w-4 mr-2" />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </div>
                    {subscription.status === 'trial' && subscription.daysRemaining && (
                      <div className="text-xs text-gray-500 mt-1">{subscription.daysRemaining} days left</div>
                    )}
                    {subscription.status === 'grace' && subscription.hoursRemaining && (
                      <div className="text-xs text-red-500 mt-1">{subscription.hoursRemaining}h left</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscription.plan === 'trial' ? 'Free Trial' : 'Premium'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscription.amount > 0 ? `₦${subscription.amount.toLocaleString()}` : 'Free'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3" 
                      title="View Details"
                      onClick={() => handleViewDetails(subscription)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {subscription.status === 'active' && (
                      <button 
                        className="text-yellow-600 hover:text-yellow-900 mr-3" 
                        title="Suspend"
                        onClick={() => handleStatusChange(subscription.id, 'expired')}
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    )}
                    {subscription.status === 'expired' && (
                      <button 
                        className="text-green-600 hover:text-green-900 mr-3" 
                        title="Reactivate"
                        onClick={() => handleStatusChange(subscription.id, 'active')}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                    {subscription.amount > 0 && (
                      <button 
                        className="text-red-600 hover:text-red-900" 
                        title="Refund"
                        onClick={() => handleRefund(subscription.id)}
                      >
                        <DollarSign className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Subscription Controls */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Subscription Controls</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Current Price</h4>
              <p className="text-2xl font-bold text-blue-600">₦7,500</p>
              <p className="text-xs text-blue-600">per month</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">Trial Period</h4>
              <p className="text-2xl font-bold text-green-600">7</p>
              <p className="text-xs text-green-600">days free</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Grace Period</h4>
              <p className="text-2xl font-bold text-yellow-600">12</p>
              <p className="text-xs text-yellow-600">hours after expiry</p>
            </div>
          </div>
          
          {/* Admin Actions */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Admin Actions</h4>
            <Link 
              href="/bonus-subscription"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <Gift className="h-4 w-4 mr-2" />
              Manage Bonus Subscriptions
            </Link>
          </div>
        </div>
      </div>

      {/* Subscription Details Modal */}
      {showDetailsModal && selectedSubscription && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Subscription Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Name</label>
                  <p className="text-sm text-gray-900">{selectedSubscription.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Owner</label>
                  <p className="text-sm text-gray-900">{selectedSubscription.ownerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{selectedSubscription.ownerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subscription ID</label>
                  <p className="text-sm text-gray-900">{selectedSubscription.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className={`text-sm font-medium ${selectedSubscription.status === 'active' ? 'text-green-600' : selectedSubscription.status === 'expired' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {selectedSubscription.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Plan</label>
                  <p className="text-sm text-gray-900">{selectedSubscription.plan === 'trial' ? 'Free Trial' : 'Premium'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-sm text-gray-900">{selectedSubscription.amount > 0 ? `₦${selectedSubscription.amount.toLocaleString()}` : 'Free'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedSubscription.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <p className="text-sm text-gray-900">{selectedSubscription.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Auto Renew</label>
                  <p className="text-sm text-gray-900">{selectedSubscription.autoRenew ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedSubscription(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}