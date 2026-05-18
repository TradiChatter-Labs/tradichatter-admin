import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabaseAdmin';

export default function AIKillSwitch() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      // Fetch kill switch audit logs from admin_audit_logs
      const res = await fetch('/api/ai-agents?action=status');
      const json = await res.json();
      if (json.success) {
        setHistory(json.kill_switch_history || []);
      }
    } catch (err) {
      console.error('Fetch history error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Kill Switch History</h1>
        <p className="mt-1 text-sm text-gray-600">Audit trail of all kill switch activations and deactivations.</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h3 className="font-medium text-yellow-800">Kill Switch Policy</h3>
            <p className="text-sm text-yellow-700 mt-1">
              The kill switch immediately disables all 6 AI agents across all businesses. Use only in emergencies
              (AI generating harmful content, data leak, billing runaway). Every activation is permanently logged.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>No kill switch events recorded.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.map((event, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {event.action === 'activated' ? (
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      <span className={`text-sm font-medium ${event.action === 'activated' ? 'text-red-700' : 'text-green-700'}`}>
                        {event.action === 'activated' ? 'KILL SWITCH ON' : 'KILL SWITCH OFF'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{event.admin_id || event.admin_email || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{event.reason || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {event.timestamp ? new Date(event.timestamp).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6">
        <Link href="/ai-agents" className="text-purple-600 hover:text-purple-500 font-medium">← Back to AI Dashboard</Link>
      </div>
    </div>
  );
}
