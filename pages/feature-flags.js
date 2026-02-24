import { useState } from 'react';
import { useRouter } from 'next/router';
import { Settings, ToggleLeft, ToggleRight, Save, RefreshCw, ArrowLeft } from 'lucide-react';

export default function FeatureFlags() {
  const router = useRouter();
  const [flags, setFlags] = useState([
    { id: 'voice_calls', name: 'Voice Calls', description: 'Enable voice calling feature', enabled: true, category: 'Communication' },
    { id: 'video_calls', name: 'Video Calls', description: 'Enable video calling feature', enabled: false, category: 'Communication' },
    { id: 'group_buying', name: 'Group Buying', description: 'Enable group buying feature', enabled: true, category: 'Commerce' },
    { id: 'affiliate_program', name: 'Affiliate Program', description: 'Enable affiliate marketing program', enabled: true, category: 'Marketing' },
    { id: 'ai_recommendations', name: 'AI Recommendations', description: 'Enable AI-powered product recommendations (User AI Feature)', enabled: false, category: 'AI' },
    { id: 'dark_mode', name: 'Dark Mode', description: 'Enable dark mode theme', enabled: true, category: 'UI' },
    { id: 'push_notifications', name: 'Push Notifications', description: 'Enable push notifications', enabled: true, category: 'Notifications' },
    { id: 'escrow_payments', name: 'Escrow Payments', description: 'Enable escrow payment system', enabled: true, category: 'Payments' },
    { id: 'kyc_verification', name: 'KYC Verification', description: 'Enable KYC verification for businesses', enabled: true, category: 'Security' },
    { id: 'maintenance_mode', name: 'Maintenance Mode', description: 'Put app in maintenance mode', enabled: false, category: 'System' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(flags.map(flag => flag.category))];

  const filteredFlags = flags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || flag.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFlag = (id) => {
    setFlags(flags.map(flag => 
      flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
    ));
  };

  const saveChanges = () => {
    // API call to save feature flags
    alert('Feature flags updated successfully!');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Communication': 'bg-blue-100 text-blue-800',
      'Commerce': 'bg-green-100 text-green-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'AI': 'bg-orange-100 text-orange-800',
      'UI': 'bg-indigo-100 text-indigo-800',
      'Notifications': 'bg-yellow-100 text-yellow-800',
      'Payments': 'bg-red-100 text-red-800',
      'Security': 'bg-gray-100 text-gray-800',
      'System': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push('/system-configuration')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to System Configuration
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="mr-3 h-8 w-8" />
          Feature Flags Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Control feature availability across the platform
        </p>
      </div>

      {/* AI Feature Classification Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">AI Feature Classification</h3>
        <p className="text-sm text-blue-700">
          AI flags here control <strong>User AI Features</strong> only (business chatbots, invoice generation).
          These do NOT control Platform AI Agent behavior.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Feature Flags List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Feature Flags ({filteredFlags.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredFlags.map((flag) => (
            <div key={flag.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="text-lg font-medium text-gray-900 mr-3">
                      {flag.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(flag.category)}`}>
                      {flag.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{flag.description}</p>
                  <div className="flex items-center text-sm">
                    <span className={`font-medium ${flag.enabled ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {flag.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                
                <div className="ml-6">
                  <button
                    onClick={() => toggleFlag(flag.id)}
                    className={`p-2 rounded-full transition-colors ${
                      flag.enabled 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {flag.enabled ? (
                      <ToggleRight className="h-8 w-8" />
                    ) : (
                      <ToggleLeft className="h-8 w-8" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {flags.filter(f => f.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Enabled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {flags.filter(f => !f.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Disabled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {flags.length}
            </div>
            <div className="text-sm text-gray-600">Total Features</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {categories.length - 1}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
}