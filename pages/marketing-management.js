import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Target, TrendingUp, Users, Calendar, BarChart3, Plus, Eye, Edit, Play, Pause } from 'lucide-react';

export default function MarketingManagement() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Summer Sale 2024', status: 'Active', reach: '2.5K', conversions: '156', budget: '₦50K' },
    { id: 2, name: 'New Business Onboarding', status: 'Paused', reach: '1.2K', conversions: '89', budget: '₦30K' },
    { id: 3, name: 'Customer Retention', status: 'Active', reach: '3.1K', conversions: '234', budget: '₦75K' }
  ]);

  const toggleCampaignStatus = (id) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: campaign.status === 'Active' ? 'Paused' : 'Active' }
        : campaign
    ));
  };

  const stats = [
    { name: 'Active Campaigns', value: '12', icon: Target },
    { name: 'Total Reach', value: '15.2K', icon: Users },
    { name: 'Conversion Rate', value: '8.5%', icon: TrendingUp },
    { name: 'Marketing Budget', value: '₦250K', icon: BarChart3 }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Marketing Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Oversee marketing campaigns, promotions, and business advertising efforts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Marketing Campaigns</h3>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reach</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.reach}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.conversions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.budget}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                        <button 
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            // Edit logic here
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => toggleCampaignStatus(campaign.id)}
                          className={campaign.status === 'Active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                        >
                          {campaign.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedCampaign ? 'Campaign Details' : 'Create New Campaign'}
            </h3>
            {selectedCampaign ? (
              <div className="space-y-3">
                <div><strong>Name:</strong> {selectedCampaign.name}</div>
                <div><strong>Status:</strong> {selectedCampaign.status}</div>
                <div><strong>Reach:</strong> {selectedCampaign.reach}</div>
                <div><strong>Conversions:</strong> {selectedCampaign.conversions}</div>
                <div><strong>Budget:</strong> {selectedCampaign.budget}</div>
              </div>
            ) : (
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Campaign Name" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Select Campaign Type</option>
                  <option>Promotional</option>
                  <option>Awareness</option>
                  <option>Retention</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Budget (e.g., ₦50K)" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <textarea 
                  placeholder="Campaign Description" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                />
              </div>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedCampaign(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                {selectedCampaign ? 'Close' : 'Cancel'}
              </button>
              {!selectedCampaign && (
                <button
                  onClick={() => {
                    alert('Campaign created!');
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back Navigation */}
      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}