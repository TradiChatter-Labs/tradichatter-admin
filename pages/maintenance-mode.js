import { useState } from 'react';
import { useRouter } from 'next/router';
import { Calendar, Clock, AlertTriangle, Settings, Users, Wrench, Plus, X, ArrowLeft } from 'lucide-react';

export default function MaintenanceMode() {
  const router = useRouter();
  const [maintenanceConfig, setMaintenanceConfig] = useState({
    enabled: false,
    title: 'System Maintenance',
    message: 'We are currently performing scheduled maintenance. Please check back soon.',
    startTime: '',
    endTime: '',
    allowedIPs: ['192.168.1.1', '10.0.0.1'],
    allowAdminAccess: true,
    showCountdown: true,
    redirectUrl: '',
    contactEmail: 'support@tradichatter.com'
  });

  const [scheduledMaintenance, setScheduledMaintenance] = useState([
    {
      id: 1,
      title: 'Database Migration',
      startTime: '2024-01-15T02:00:00',
      endTime: '2024-01-15T04:00:00',
      status: 'scheduled',
      description: 'Migrating to new database infrastructure'
    },
    {
      id: 2,
      title: 'Security Updates',
      startTime: '2024-01-20T01:00:00',
      endTime: '2024-01-20T02:30:00',
      status: 'scheduled',
      description: 'Installing critical security patches'
    }
  ]);

  const [newIP, setNewIP] = useState('');
  const [showNewMaintenanceModal, setShowNewMaintenanceModal] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  const handleToggleMaintenance = () => {
    const newStatus = !maintenanceConfig.enabled;
    setMaintenanceConfig({
      ...maintenanceConfig,
      enabled: newStatus
    });
    
    if (newStatus) {
      alert('⚠️ MAINTENANCE MODE ACTIVATED - Users are now blocked from accessing the application!');
    } else {
      alert('✅ Maintenance mode disabled - Application is now accessible to users');
    }
  };

  const addAllowedIP = () => {
    if (newIP && !maintenanceConfig.allowedIPs.includes(newIP)) {
      setMaintenanceConfig({
        ...maintenanceConfig,
        allowedIPs: [...maintenanceConfig.allowedIPs, newIP]
      });
      setNewIP('');
    }
  };

  const removeAllowedIP = (ip) => {
    setMaintenanceConfig({
      ...maintenanceConfig,
      allowedIPs: maintenanceConfig.allowedIPs.filter(allowedIP => allowedIP !== ip)
    });
  };

  const scheduleNewMaintenance = () => {
    if (newMaintenance.title && newMaintenance.startTime && newMaintenance.endTime) {
      setScheduledMaintenance([
        ...scheduledMaintenance,
        {
          ...newMaintenance,
          id: Date.now(),
          status: 'scheduled'
        }
      ]);
      setNewMaintenance({ title: '', description: '', startTime: '', endTime: '' });
      setShowNewMaintenanceModal(false);
      alert('Maintenance scheduled successfully!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <Wrench className="mr-3 h-8 w-8" />
          Maintenance Mode Control
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Control system maintenance and scheduled downtime
        </p>
      </div>

      {/* Status Alert */}
      {maintenanceConfig.enabled && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Maintenance Mode Active</h3>
              <p className="text-sm text-red-700">
                The application is currently in maintenance mode. Regular users cannot access the system.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Maintenance Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Maintenance Settings
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {/* Toggle Switch */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Enable Maintenance Mode</label>
                <p className="text-xs text-gray-500">Block user access to the application</p>
              </div>
              <button
                onClick={handleToggleMaintenance}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  maintenanceConfig.enabled ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    maintenanceConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Title</label>
              <input
                type="text"
                value={maintenanceConfig.title}
                onChange={(e) => setMaintenanceConfig({...maintenanceConfig, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter maintenance title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
              <textarea
                value={maintenanceConfig.message}
                onChange={(e) => setMaintenanceConfig({...maintenanceConfig, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter message to display to users"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={maintenanceConfig.startTime}
                  onChange={(e) => setMaintenanceConfig({...maintenanceConfig, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={maintenanceConfig.endTime}
                  onChange={(e) => setMaintenanceConfig({...maintenanceConfig, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow Admin Access</label>
                  <p className="text-xs text-gray-500">Admins can still access the system</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceConfig.allowAdminAccess}
                  onChange={(e) => setMaintenanceConfig({...maintenanceConfig, allowAdminAccess: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Show Countdown</label>
                  <p className="text-xs text-gray-500">Display countdown timer to users</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceConfig.showCountdown}
                  onChange={(e) => setMaintenanceConfig({...maintenanceConfig, showCountdown: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={maintenanceConfig.contactEmail}
                onChange={(e) => setMaintenanceConfig({...maintenanceConfig, contactEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="support@tradichatter.com"
              />
            </div>

            <button
              onClick={handleToggleMaintenance}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                maintenanceConfig.enabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {maintenanceConfig.enabled ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
            </button>
          </div>
        </div>

        {/* Allowed IPs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Allowed IP Addresses
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              IP addresses that can access the system during maintenance
            </p>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter IP address (e.g., 192.168.1.1)"
              />
              <button
                onClick={addAllowedIP}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {maintenanceConfig.allowedIPs.map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono text-gray-800">{ip}</code>
                  <button
                    onClick={() => removeAllowedIP(ip)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {maintenanceConfig.allowedIPs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No allowed IPs configured</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scheduled Maintenance */}
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Scheduled Maintenance
          </h3>
          <button
            onClick={() => setShowNewMaintenanceModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Schedule Maintenance
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {scheduledMaintenance.map((maintenance) => (
              <div key={maintenance.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{maintenance.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(maintenance.status)}`}>
                    {maintenance.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{maintenance.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(maintenance.startTime).toLocaleString()}
                  </div>
                  <span>→</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(maintenance.endTime).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {scheduledMaintenance.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No scheduled maintenance</p>
            </div>
          )}
        </div>
      </div>

      {/* New Maintenance Modal */}
      {showNewMaintenanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Schedule New Maintenance</h2>
              <button
                onClick={() => setShowNewMaintenanceModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newMaintenance.title}
                  onChange={(e) => setNewMaintenance({...newMaintenance, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter maintenance title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newMaintenance.description}
                  onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter maintenance description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={newMaintenance.startTime}
                  onChange={(e) => setNewMaintenance({...newMaintenance, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={newMaintenance.endTime}
                  onChange={(e) => setNewMaintenance({...newMaintenance, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowNewMaintenanceModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={scheduleNewMaintenance}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}