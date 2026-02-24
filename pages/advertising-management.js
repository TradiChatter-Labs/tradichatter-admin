import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, TrendingUp, DollarSign, Eye, CheckCircle, XCircle, Pause, Play, BarChart3, Users, AlertTriangle } from 'lucide-react';

export default function AdvertisingManagement() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 'AD001',
      businessName: 'Tech Solutions Ltd',
      businessId: 'BUS001',
      title: 'Premium Rice Sale - 20% Off',
      description: 'High quality rice at discounted prices for limited time',
      budget: 50000,
      spent: 12500,
      duration: 7,
      status: 'pending_approval',
      adType: 'sponsored_message',
      targetAge: '25-35',
      targetLocation: 'Lagos',
      impressions: 0,
      clicks: 0,
      conversions: 0,
      createdAt: '2024-01-20',
      submittedAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 'AD002',
      businessName: 'Fashion Hub',
      businessId: 'BUS002',
      title: 'New Fashion Collection Launch',
      description: 'Trendy clothes for modern professionals',
      budget: 75000,
      spent: 45000,
      duration: 14,
      status: 'active',
      adType: 'discovery_banner',
      targetAge: '18-30',
      targetLocation: 'All Nigeria',
      impressions: 15420,
      clicks: 892,
      conversions: 45,
      createdAt: '2024-01-15',
      approvedAt: '2024-01-15T14:20:00Z'
    },
    {
      id: 'AD003',
      businessName: 'Food Corner',
      businessId: 'BUS003',
      title: 'Fast Food Delivery Service',
      description: 'Quick and delicious meals delivered to your door',
      budget: 30000,
      spent: 30000,
      duration: 10,
      status: 'completed',
      adType: 'promoted_business',
      targetAge: 'all',
      targetLocation: 'Abuja',
      impressions: 8950,
      clicks: 456,
      conversions: 23,
      createdAt: '2024-01-10',
      completedAt: '2024-01-20T18:00:00Z'
    },
    {
      id: 'AD004',
      businessName: 'Electronics Store',
      businessId: 'BUS004',
      title: 'Smartphone Sale Event',
      description: 'Latest smartphones at unbeatable prices',
      budget: 100000,
      spent: 25000,
      duration: 21,
      status: 'rejected',
      adType: 'sponsored_message',
      targetAge: '20-40',
      targetLocation: 'Lagos',
      impressions: 0,
      clicks: 0,
      conversions: 0,
      createdAt: '2024-01-18',
      rejectedAt: '2024-01-19T09:15:00Z',
      rejectionReason: 'Misleading pricing claims'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const stats = {
    total: campaigns.length,
    pending: campaigns.filter(c => c.status === 'pending_approval').length,
    active: campaigns.filter(c => c.status === 'active').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    rejected: campaigns.filter(c => c.status === 'rejected').length,
    totalRevenue: campaigns.reduce((sum, c) => sum + (c.spent * 0.1), 0), // 10% platform fee
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0)
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true;
    return campaign.status === filter;
  });

  const handleApprove = (campaignId) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, status: 'active', approvedAt: new Date().toISOString() }
        : c
    ));
    setShowModal(false);
  };

  const handleReject = (campaignId, reason) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, status: 'rejected', rejectedAt: new Date().toISOString(), rejectionReason: reason }
        : c
    ));
    setShowModal(false);
  };

  const handlePause = (campaignId) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, status: 'paused', pausedAt: new Date().toISOString() }
        : c
    ));
  };

  const handleResume = (campaignId) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, status: 'active', resumedAt: new Date().toISOString() }
        : c
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdTypeLabel = (type) => {
    switch (type) {
      case 'sponsored_message': return '💬 Sponsored Message';
      case 'discovery_banner': return '🔍 Discovery Banner';
      case 'promoted_business': return '⭐ Promoted Business';
      default: return type;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Advertising Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage business advertisements, approve campaigns, and monitor advertising performance.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Campaigns</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.total}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Pending Approval</dt>
                <dd className="text-2xl font-semibold text-yellow-600">{stats.pending}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Active Campaigns</dt>
                <dd className="text-2xl font-semibold text-green-600">{stats.active}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Platform Revenue</dt>
                <dd className="text-2xl font-semibold text-purple-600">₦{stats.totalRevenue.toLocaleString()}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalImpressions.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Impressions</div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalClicks.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Clicks</div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">₦{stats.totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Ad Spend</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Link href="/advertising-analytics" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </Link>
        <Link href="/advertising-policies" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center">
          <Target className="h-4 w-4 mr-2" />
          Manage Policies
        </Link>
        <Link href="/advertising-revenue" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
          <DollarSign className="h-4 w-4 mr-2" />
          Revenue Reports
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-2">
        {['all', 'pending_approval', 'active', 'paused', 'completed', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                    <div className="text-sm text-gray-500">{getAdTypeLabel(campaign.adType)}</div>
                    <div className="text-xs text-gray-400">ID: {campaign.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{campaign.businessName}</div>
                  <div className="text-xs text-gray-500">Target: {campaign.targetAge}, {campaign.targetLocation}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">₦{campaign.budget.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Spent: ₦{campaign.spent.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{campaign.impressions.toLocaleString()} impressions</div>
                  <div className="text-xs text-gray-500">{campaign.clicks} clicks • {campaign.conversions} conversions</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {campaign.status === 'pending_approval' && (
                      <>
                        <button
                          onClick={() => handleApprove(campaign.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(campaign.id, 'Policy violation')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    {campaign.status === 'active' && (
                      <button
                        onClick={() => handlePause(campaign.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    )}
                    
                    {campaign.status === 'paused' && (
                      <button
                        onClick={() => handleResume(campaign.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Campaign Detail Modal */}
      {showModal && selectedCampaign && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Campaign Title:</label>
                  <p className="text-sm text-gray-900">{selectedCampaign.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description:</label>
                  <p className="text-sm text-gray-900">{selectedCampaign.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Business:</label>
                  <p className="text-sm text-gray-900">{selectedCampaign.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Budget & Spend:</label>
                  <p className="text-sm text-gray-900">₦{selectedCampaign.budget.toLocaleString()} budget, ₦{selectedCampaign.spent.toLocaleString()} spent</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Performance:</label>
                  <p className="text-sm text-gray-900">{selectedCampaign.impressions.toLocaleString()} impressions, {selectedCampaign.clicks} clicks</p>
                </div>
                {selectedCampaign.rejectionReason && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rejection Reason:</label>
                    <p className="text-sm text-red-600">{selectedCampaign.rejectionReason}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
                {selectedCampaign.status === 'pending_approval' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedCampaign.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedCampaign.id, 'Policy violation')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
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