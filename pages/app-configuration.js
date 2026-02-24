import { useState } from 'react';
import { useRouter } from 'next/router';
import { Settings, Save, RefreshCw, DollarSign, Clock, Users, Percent, ArrowLeft } from 'lucide-react';

export default function AppConfiguration() {
  const router = useRouter();
  const [config, setConfig] = useState({
    // Pricing Configuration
    platformCommission: 5.0,
    escrowFee: 2.5,
    withdrawalFee: 1.0,
    minimumWithdrawal: 1000,
    maximumWithdrawal: 500000,
    
    // Trial & Subscription
    trialPeriodDays: 14,
    basicPlanPrice: 2500,
    premiumPlanPrice: 5000,
    businessPlanPrice: 10000,
    
    // Limits & Restrictions
    maxProductsPerBusiness: 100,
    maxOrdersPerDay: 50,
    maxChatRoomsPerUser: 20,
    maxFileUploadSize: 10, // MB
    
    // Business Settings
    kycRequiredAmount: 50000,
    autoApproveBusinesses: false,
    requireBusinessVerification: true,
    
    // User Settings
    maxAccountsPerDevice: 3,
    sessionTimeoutMinutes: 60,
    passwordExpiryDays: 90,
    
    // Notification Settings
    enablePushNotifications: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    
    // Feature Limits
    maxAffiliateCommission: 15.0,
    referralBonusAmount: 500,
    groupBuyingMinUsers: 5,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 1000 // requests per hour
  });

  const [activeTab, setActiveTab] = useState('pricing');

  const updateConfig = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveConfiguration = () => {
    // API call to save configuration
    alert('Configuration saved successfully!');
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset to default values?')) {
      // Reset logic here
      alert('Configuration reset to defaults');
    }
  };

  const tabs = [
    { id: 'pricing', name: 'Pricing & Fees', icon: DollarSign },
    { id: 'trials', name: 'Trials & Plans', icon: Clock },
    { id: 'limits', name: 'Limits & Security', icon: Users },
    { id: 'features', name: 'Feature Settings', icon: Settings }
  ];

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
          App Configuration Panel
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure pricing, limits, trials, and system settings
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={saveConfiguration}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </button>
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Pricing & Fees Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Pricing & Fee Configuration</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Platform Commission (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.platformCommission}
                    onChange={(e) => updateConfig('platformCommission', parseFloat(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Escrow Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.escrowFee}
                    onChange={(e) => updateConfig('escrowFee', parseFloat(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Withdrawal Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.withdrawalFee}
                    onChange={(e) => updateConfig('withdrawalFee', parseFloat(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Minimum Withdrawal (₦)</label>
                  <input
                    type="number"
                    value={config.minimumWithdrawal}
                    onChange={(e) => updateConfig('minimumWithdrawal', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Trials & Plans Tab */}
          {activeTab === 'trials' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Trial Periods & Subscription Plans</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trial Period (Days)</label>
                  <input
                    type="number"
                    value={config.trialPeriodDays}
                    onChange={(e) => updateConfig('trialPeriodDays', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Basic Plan Price (₦/month)</label>
                  <input
                    type="number"
                    value={config.basicPlanPrice}
                    onChange={(e) => updateConfig('basicPlanPrice', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Premium Plan Price (₦/month)</label>
                  <input
                    type="number"
                    value={config.premiumPlanPrice}
                    onChange={(e) => updateConfig('premiumPlanPrice', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Plan Price (₦/month)</label>
                  <input
                    type="number"
                    value={config.businessPlanPrice}
                    onChange={(e) => updateConfig('businessPlanPrice', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Limits & Security Tab */}
          {activeTab === 'limits' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Limits & Security Settings</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Products per Business</label>
                  <input
                    type="number"
                    value={config.maxProductsPerBusiness}
                    onChange={(e) => updateConfig('maxProductsPerBusiness', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={config.sessionTimeoutMinutes}
                    onChange={(e) => updateConfig('sessionTimeoutMinutes', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">KYC Required Amount (₦)</label>
                  <input
                    type="number"
                    value={config.kycRequiredAmount}
                    onChange={(e) => updateConfig('kycRequiredAmount', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">API Rate Limit (requests/hour)</label>
                  <input
                    type="number"
                    value={config.apiRateLimit}
                    onChange={(e) => updateConfig('apiRateLimit', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.autoApproveBusinesses}
                    onChange={(e) => updateConfig('autoApproveBusinesses', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Auto-approve new businesses</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.requireBusinessVerification}
                    onChange={(e) => updateConfig('requireBusinessVerification', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Require business verification</label>
                </div>
              </div>
            </div>
          )}

          {/* Feature Settings Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Feature Configuration</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Affiliate Commission (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.maxAffiliateCommission}
                    onChange={(e) => updateConfig('maxAffiliateCommission', parseFloat(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Referral Bonus Amount (₦)</label>
                  <input
                    type="number"
                    value={config.referralBonusAmount}
                    onChange={(e) => updateConfig('referralBonusAmount', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">System Toggles</h4>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.maintenanceMode}
                    onChange={(e) => updateConfig('maintenanceMode', e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Maintenance Mode</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.enablePushNotifications}
                    onChange={(e) => updateConfig('enablePushNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Enable Push Notifications</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.debugMode}
                    onChange={(e) => updateConfig('debugMode', e.target.checked)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Debug Mode</label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}