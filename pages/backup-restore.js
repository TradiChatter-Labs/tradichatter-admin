import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Database, RefreshCw, RotateCcw, CheckCircle, XCircle, Clock, AlertTriangle, HardDrive } from 'lucide-react';

export default function BackupRestore() {
  const router = useRouter();
  const [backups, setBackups] = useState([]);
  const [storageBytes, setStorageBytes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [restoreModal, setRestoreModal] = useState(null); // backup object or null
  const [confirmation, setConfirmation] = useState('');
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [nextBackupIn, setNextBackupIn] = useState('');

  useEffect(() => {
    const calcCountdown = () => {
      const now = new Date();
      const next = new Date();
      next.setUTCHours(0, 0, 0, 0);
      if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
      const diff = next - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setNextBackupIn(`${h}h ${m}m`);
    };
    calcCountdown();
    const t = setInterval(calcCountdown, 60000);
    return () => clearInterval(t);
  }, []);

  const fetchBackups = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/system/backup', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setBackups(data.backups || []);
        setStorageBytes(data.total_storage_bytes || 0);
      }
    } catch (err) {
      console.error('Failed to fetch backups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
    // Poll every 15s to catch running → completed transitions
    const interval = setInterval(fetchBackups, 15000);
    return () => clearInterval(interval);
  }, [fetchBackups]);

  const handleTriggerBackup = async () => {
    if (triggering) return;
    setTriggering(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/system/backup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '✅ Backup started — this may take a few minutes. The list will update automatically.' });
        setTimeout(fetchBackups, 5000);
      } else {
        setMessage({ type: 'error', text: `❌ Failed to start backup: ${data.error || 'Unknown error'}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Network error — could not trigger backup.' });
    } finally {
      setTriggering(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreModal || confirmation !== 'CONFIRM') return;
    setRestoring(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('admin_token');
      let adminId = 'admin';
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        adminId = payload.id || payload.sub || 'admin';
      } catch { /* use default */ }

      const res = await fetch('/api/system/backup', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backup_log_id: restoreModal.id,
          admin_id: adminId,
          confirmation: 'CONFIRM',
        }),
      });
      const data = await res.json();
      setRestoreModal(null);
      setConfirmation('');
      if (data.success) {
        setMessage({ type: 'success', text: '✅ Restore started — the system will enter maintenance mode briefly. You will be notified when complete.' });
        setTimeout(fetchBackups, 10000);
      } else {
        setMessage({ type: 'error', text: `❌ Restore failed: ${data.error || 'Unknown error'}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Network error — could not start restore.' });
    } finally {
      setRestoring(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    }) + ' UTC';
  };

  const formatDuration = (ms) => {
    if (!ms) return '—';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  const StatusBadge = ({ status }) => {
    const map = {
      completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Completed' },
      running:   { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3 mr-1 animate-spin" />, label: 'Running' },
      failed:    { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3 mr-1" />, label: 'Failed' },
    };
    const s = map[status] || map.failed;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
        {s.icon}{s.label}
      </span>
    );
  };

  const lastBackup = backups.find(b => b.status === 'completed');
  const hasRunning = backups.some(b => b.status === 'running');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Database className="mr-3 h-7 w-7 text-blue-600" />
            Backup & Restore
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Daily automated backups to Cloudflare R2. Restore any backup with full audit trail.
          </p>
        </div>
        <button
          onClick={handleTriggerBackup}
          disabled={triggering || hasRunning}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${triggering ? 'animate-spin' : ''}`} />
          {triggering ? 'Starting...' : hasRunning ? 'Backup Running...' : 'Run Backup Now'}
        </button>
      </div>

      {/* Message banner */}
      {message.text && (
        <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Backup</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {lastBackup ? formatDate(lastBackup.completed_at) : 'Never'}
          </p>
          {lastBackup && <StatusBadge status={lastBackup.status} />}
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Backup Size</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {lastBackup ? formatBytes(lastBackup.size_bytes) : '—'}
          </p>
          <p className="text-xs text-gray-400 mt-1">{lastBackup?.backup_type || '—'}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
            <HardDrive className="h-3 w-3 mr-1" /> R2 Storage Used
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{formatBytes(storageBytes)}</p>
          <p className="text-xs text-gray-400 mt-1">{backups.filter(b => b.status === 'completed').length} backups stored</p>
        </div>
      </div>

      {/* Schedule info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Schedule:</strong> Daily at 00:00 UTC (Cloudflare Worker cron) &nbsp;|&nbsp;
        Weekly copies on Sundays &nbsp;|&nbsp; Monthly copies on 1st of month &nbsp;|&nbsp;
        Retention: 30 days daily · 12 weeks weekly · 12 months monthly
        {nextBackupIn && (
          <span className="ml-2 font-medium">&nbsp;|&nbsp; ⏱ Next backup in {hasRunning ? '⏳ running now' : nextBackupIn}</span>
        )}
      </div>

      {/* Backup history table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Backup History</h3>
          <button onClick={fetchBackups} className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : backups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No backups yet. Run your first backup above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Date', 'Type', 'Tier', 'Size', 'Duration', 'Triggered By', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {backups.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatDate(b.created_at)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{b.backup_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{b.tier}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatBytes(b.size_bytes)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDuration(b.duration_ms)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.triggered_by}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                      {b.status === 'failed' && b.error_message && (
                        <p className="text-xs text-red-600 mt-1 max-w-xs truncate" title={b.error_message}>{b.error_message}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {b.status === 'completed' ? (
                        <button
                          onClick={() => { setRestoreModal(b); setConfirmation(''); }}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" /> Restore
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restore confirmation modal */}
      {restoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
              <h2 className="text-lg font-bold text-gray-900">Restore Backup</h2>
            </div>

            <div className="bg-gray-50 rounded p-3 mb-4 text-sm text-gray-700 space-y-1">
              <p><strong>Date:</strong> {formatDate(restoreModal.created_at)}</p>
              <p><strong>Size:</strong> {formatBytes(restoreModal.size_bytes)}</p>
              <p><strong>Type:</strong> {restoreModal.backup_type}</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-sm text-red-800 font-medium">⚠️ This will overwrite ALL live data.</p>
              <p className="text-xs text-red-700 mt-1">
                The system will enter maintenance mode during restore. This cannot be undone.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <strong>CONFIRM</strong> to proceed
              </label>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="CONFIRM"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setRestoreModal(null); setConfirmation(''); }}
                disabled={restoring}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                disabled={confirmation !== 'CONFIRM' || restoring}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {restoring ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Restoring...</>
                ) : (
                  <><RotateCcw className="h-4 w-4 mr-2" /> Start Restore</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
