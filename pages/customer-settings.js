import { useState } from 'react';
import Link from 'next/link';
import { Settings, User, Bell, Shield, Eye, Globe, Smartphone, ChevronDown, ChevronUp, Search, Check } from 'lucide-react';

export default function CustomerSettings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'Profile Settings': true,
    'Notification Preferences': true,
    'Privacy Settings': true,
    'Display Preferences': true,
    'Language & Region': true,
    'Device Management': true
  });
  const [selectedSettings, setSelectedSettings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [settingValues, setSettingValues] = useState({
    'Personal Information': { enabled: true, value: 'Full profile visible' },
    'Profile Picture': { enabled: true, value: 'Public' },
    'Contact Details': { enabled: false, value: 'Private' },
    'Email Notifications': { enabled: true, value: 'All notifications' },
    'Push Notifications': { enabled: true, value: 'Important only' },
    'SMS Alerts': { enabled: false, value: 'Disabled' },
    'Data Sharing': { enabled: false, value: 'Minimal sharing' },
    'Profile Visibility': { enabled: true, value: 'Friends only' },
    'Activity Status': { enabled: true, value: 'Online' },
    'Theme Settings': { enabled: true, value: 'Auto (System)' },
    'Font Size': { enabled: true, value: 'Medium' },
    'Language': { enabled: true, value: 'English' },
    'App Language': { enabled: true, value: 'English (US)' },
    'Currency': { enabled: true, value: 'NGN (₦)' },
    'Time Zone': { enabled: true, value: 'WAT (UTC+1)' },
    'Active Sessions': { enabled: true, value: '3 devices' },
    'Device History': { enabled: true, value: 'Last 30 days' },
    'Security Alerts': { enabled: true, value: 'All alerts' }
  });

  const toggleCategory = (categoryTitle) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle]
    }));
  };

  const toggleSettingSelection = (settingKey) => {
    setSelectedSettings(prev => 
      prev.includes(settingKey) 
        ? prev.filter(s => s !== settingKey)
        : [...prev, settingKey]
    );
  };

  const openSettingModal = (category, item) => {
    setCurrentSetting({ category, item });
    setShowModal(true);
  };

  const updateSettingValue = (key, newValue, enabled) => {
    setSettingValues(prev => ({
      ...prev,
      [key]: { value: newValue, enabled }
    }));
  };

  const bulkUpdateSettings = (action) => {
    if (action === 'enable') {
      selectedSettings.forEach(key => {
        setSettingValues(prev => ({ ...prev, [key]: { ...prev[key], enabled: true } }));
      });
    } else if (action === 'disable') {
      selectedSettings.forEach(key => {
        setSettingValues(prev => ({ ...prev, [key]: { ...prev[key], enabled: false } }));
      });
    }
    setSelectedSettings([]);
  };
  const settingsCategories = [
    {
      title: 'Profile Settings',
      description: 'Manage customer profile information and preferences',
      icon: User,
      color: 'bg-blue-500',
      items: ['Personal Information', 'Profile Picture', 'Contact Details']
    },
    {
      title: 'Notification Preferences',
      description: 'Control customer notification settings',
      icon: Bell,
      color: 'bg-yellow-500',
      items: ['Email Notifications', 'Push Notifications', 'SMS Alerts']
    },
    {
      title: 'Privacy Settings',
      description: 'Manage customer privacy and data preferences',
      icon: Shield,
      color: 'bg-green-500',
      items: ['Data Sharing', 'Profile Visibility', 'Activity Status']
    },
    {
      title: 'Display Preferences',
      description: 'Customize customer app appearance',
      icon: Eye,
      color: 'bg-purple-500',
      items: ['Theme Settings', 'Font Size', 'Language']
    },
    {
      title: 'Language & Region',
      description: 'Set customer language and regional preferences',
      icon: Globe,
      color: 'bg-indigo-500',
      items: ['App Language', 'Currency', 'Time Zone']
    },
    {
      title: 'Device Management',
      description: 'Manage customer connected devices',
      icon: Smartphone,
      color: 'bg-red-500',
      items: ['Active Sessions', 'Device History', 'Security Alerts']
    }
  ];

  const stats = [
    { label: 'Total Settings Modified', value: '1,847', change: '+5%' },
    { label: 'Privacy Updates', value: '234', change: '+12%' },
    { label: 'Language Changes', value: '89', change: '+8%' },
    { label: 'Theme Switches', value: '456', change: '+15%' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Settings Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage customer account preferences, privacy settings, and app configurations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
              <dd className="mt-1 flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                <div className="ml-2 text-sm font-semibold text-green-600">{stat.change}</div>
              </dd>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Bulk Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {selectedSettings.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => bulkUpdateSettings('enable')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Enable ({selectedSettings.length})
            </button>
            <button
              onClick={() => bulkUpdateSettings('disable')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Disable ({selectedSettings.length})
            </button>
            <button
              onClick={() => setSelectedSettings([])}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Settings Categories */}
      <div className="space-y-6">
        {settingsCategories
          .filter(category => 
            searchTerm === '' || 
            category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedCategories[category.title];
            const filteredItems = category.items.filter(item => 
              searchTerm === '' || item.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            return (
              <div key={category.title} className="bg-white overflow-hidden shadow rounded-lg">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCategory(category.title)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 ${category.color} rounded-md p-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-2">
                    {filteredItems.map((item, index) => {
                      const settingKey = item;
                      const setting = settingValues[settingKey];
                      const isSelected = selectedSettings.includes(settingKey);
                      
                      return (
                        <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded border">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSettingSelection(settingKey)}
                              className="mr-3 h-4 w-4 text-blue-600 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700">{item}</span>
                              <div className="text-xs text-gray-500">
                                {setting?.enabled ? '✓ Enabled' : '✗ Disabled'} • {setting?.value}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => openSettingModal(category.title, item)}
                            className="text-xs text-blue-600 hover:text-blue-500 font-medium px-3 py-1 border border-blue-200 rounded"
                          >
                            Manage
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => {
                if (confirm('Reset all customer settings? This action cannot be undone.')) {
                  alert('All customer settings have been reset.');
                }
              }}
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-sm font-medium text-blue-900">Reset All Settings</div>
              <div className="text-xs text-blue-600 mt-1">Bulk reset customer preferences</div>
            </button>
            <button 
              onClick={() => {
                const csv = 'Customer,Setting,Value\nSample data for export';
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `customer-settings-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-sm font-medium text-green-900">Export Settings</div>
              <div className="text-xs text-green-600 mt-1">Download settings data</div>
            </button>
            <button 
              onClick={() => alert('Privacy audit completed. All settings are compliant.')}
              className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-sm font-medium text-yellow-900">Privacy Audit</div>
              <div className="text-xs text-yellow-600 mt-1">Review privacy compliance</div>
            </button>
            <button 
              onClick={() => alert('Opening settings analytics dashboard...')}
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-sm font-medium text-purple-900">Settings Analytics</div>
              <div className="text-xs text-purple-600 mt-1">View usage patterns</div>
            </button>
          </div>
        </div>
      </div>

      {/* Setting Management Modal */}
      {showModal && currentSetting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Manage {currentSetting.item}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      checked={settingValues[currentSetting.item]?.enabled}
                      onChange={() => updateSettingValue(currentSetting.item, settingValues[currentSetting.item]?.value, true)}
                      className="mr-2"
                    />
                    Enabled
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      checked={!settingValues[currentSetting.item]?.enabled}
                      onChange={() => updateSettingValue(currentSetting.item, settingValues[currentSetting.item]?.value, false)}
                      className="mr-2"
                    />
                    Disabled
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                {currentSetting.item === 'Theme Settings' ? (
                  <select 
                    value={settingValues[currentSetting.item]?.value}
                    onChange={(e) => updateSettingValue(currentSetting.item, e.target.value, settingValues[currentSetting.item]?.enabled)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option>Auto (System)</option>
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                ) : currentSetting.item === 'Font Size' ? (
                  <select 
                    value={settingValues[currentSetting.item]?.value}
                    onChange={(e) => updateSettingValue(currentSetting.item, e.target.value, settingValues[currentSetting.item]?.enabled)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                ) : currentSetting.item === 'Profile Visibility' ? (
                  <select 
                    value={settingValues[currentSetting.item]?.value}
                    onChange={(e) => updateSettingValue(currentSetting.item, e.target.value, settingValues[currentSetting.item]?.enabled)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option>Public</option>
                    <option>Friends only</option>
                    <option>Private</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={settingValues[currentSetting.item]?.value}
                    onChange={(e) => updateSettingValue(currentSetting.item, e.target.value, settingValues[currentSetting.item]?.enabled)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  alert(`${currentSetting.item} updated successfully!`);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
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