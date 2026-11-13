import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AlertTriangle, Settings, Wrench, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';

export default function MaintenanceMode() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [title, setTitle] = useState('System Maintenance');
  const [message, setMessage] = useState('We are currently performing scheduled maintenance. Please check back soon.');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [lastUpdatedBy, setLastUpdatedBy] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => { fetchStatus(); }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system/maintenance');
      const json = await res.json();
      if (json.success) {
        setEnabled(json.enabled);
        setTitle(json.title);
        setMessage(json.message);
        setLastUpdated(json.updated_at);
        setLastUpdatedBy(json.updated_by);
      }
    } catch (err) {
      console.error('Fetch maintenance status error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const newEnabled = !enabled;
    const confirmMsg = newEnabled
      ? '⚠️ Enable maintenance mode? Users will be blocked from accessing the app.'
      : 'Disable maintenance mode? Users will regain access.';
    if (!confirm(confirmMsg)) return;

    setSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      let adminId = 'admin';
      try {
        const token = localStorage.getItem('admin_token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          adminId = payload.id || payload.sub || 'admin';
        }
      } catch { /* use default */ }

      const res = await fetch('/api/system/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled, title, message, admin_id: adminId }),
      });
      const json = await res.json();
      if (json.success) {
        setEnabled(newEnabled);
        setLastUpdated(new Date().toISOString());
        setLastUpdatedBy(adminId);
        setStatusMsg({
          type: 'success',
          text: newEnabled
            ? '⚠️ Maintenance mode ENABLED — users are now blocked.'
            : '✅ Maintenance mode disabled — app is accessible.',
        });
      } else {
        setStatusMsg({ type: 'error', text: `Failed: ${json.error || 'Unknown error'}` });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: `Network error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/system/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, title, message }),
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg({ type: 'success', text: '✅ Configuration saved.' });
      } else {
        setStatusMsg({ type: 'error', text: `Failed: ${json.error}` });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: `Network error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Wrench className="mr-3 h-8 w-8" /> Maintenance Mode Control
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Toggle writes directly to the <code className="text-xs bg-gray-100 px-1 rounded">system_config</code> table — the same table the restore service reads.
        </p>
      </div>

      {/* Current Status Banner */}
      <div className={`mb-6 p-4 rounded-lg border ${enabled ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {enabled
              ? <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
              : <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            }
            <div>
              <h3 className={`text-sm font-semibold ${enabled ? 'text-red-800' : 'text-green-800'}`}>
                Maintenance Mode: {enabled ? 'ACTIVE' : 'Inactive'}
              </h3>
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Last changed: {new Date(lastUpdated).toLocaleString()}
                  {lastUpdatedBy && ` by ${lastUpdatedBy}`}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`px-4 py-2 text-sm font-medium rounded-md text-white disabled:opacity-50 ${
              enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {saving ? (
              <span className="flex items-center"><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Saving...</span>
            ) : enabled ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
          </button>
        </div>
      </div>

      {/* Status message */}
      {statusMsg.text && (
        <div className={`mb-6 p-4 rounded-md text-sm ${statusMsg.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {statusMsg.text}
        </div>
      )}

      {/* Config */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Settings className="mr-2 h-5 w-5" /> Maintenance Message Config
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message shown to users</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <button
            onClick={handleSaveConfig}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            Save Config
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <strong>Note:</strong> Enabling maintenance mode writes <code className="text-xs bg-yellow-100 px-1 rounded">maintenance_mode.enabled = true</code> to the <code className="text-xs bg-yellow-100 px-1 rounded">system_config</code> table.
        The backup restore service reads this same key to block user traffic during restores.
      </div>
    </div>
  );
}
