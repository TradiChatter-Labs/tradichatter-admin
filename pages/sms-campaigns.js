import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MessageSquare, Send } from 'lucide-react';

const COMMS_URL = process.env.NEXT_PUBLIC_COMMS_SERVICE_URL || '';
const COMMS_KEY = process.env.COMMS_API_KEY || '';

export default function SmsCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState('compose');
  const [form, setForm] = useState({ message: '', user_type: '', active_mode: '' });
  const [result, setResult] = useState(null);

  useEffect(() => { fetchCampaigns(); }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${COMMS_URL}/api/sms/campaigns`, { headers: { 'X-API-Key': COMMS_KEY } });
      const json = await res.json();
      setCampaigns(json.campaigns || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSend = async () => {
    if (!form.message) return alert('Message required');
    if (form.message.length > 160) return alert('SMS must be 160 characters or less');
    setSending(true);
    setResult(null);
    try {
      const segment_filters = {};
      if (form.user_type) segment_filters.user_type = form.user_type;
      if (form.active_mode) segment_filters.active_mode = form.active_mode;

      const res = await fetch(`${COMMS_URL}/api/sms/campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': COMMS_KEY },
        body: JSON.stringify({ message: form.message, segment_filters })
      });
      const json = await res.json();
      setResult(json);
      if (json.campaign_id) fetchCampaigns();
    } catch (e) { setResult({ error: e.message }); }
    finally { setSending(false); }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SMS Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Send SMS to users via Termii</p>
        </div>

        <div className="flex space-x-2 border-b">
          <button onClick={() => setTab('compose')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'compose' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>Compose</button>
          <button onClick={() => setTab('history')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>Campaign History</button>
        </div>

        {tab === 'compose' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-gray-400">({form.message.length}/160)</span></label>
              <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} className={`w-full border rounded-md px-3 py-2 ${form.message.length > 160 ? 'border-red-500' : ''}`} rows="3" placeholder="SMS message (max 160 chars)..." maxLength={160} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type (optional)</label>
                <select value={form.user_type} onChange={e => setForm({...form, user_type: e.target.value})} className="w-full border rounded-md px-3 py-2">
                  <option value="">All users</option>
                  <option value="seller">Sellers</option>
                  <option value="customer">Customers</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Active Mode (optional)</label>
                <select value={form.active_mode} onChange={e => setForm({...form, active_mode: e.target.value})} className="w-full border rounded-md px-3 py-2">
                  <option value="">Any</option>
                  <option value="buyer">Buyer mode</option>
                  <option value="seller">Seller mode</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              <strong>Provider:</strong> Termii • <strong>Sender ID:</strong> TradiChat • <strong>Channel:</strong> Generic
            </div>

            <button onClick={handleSend} disabled={sending || form.message.length > 160} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center">
              <Send className="h-4 w-4 mr-2" />{sending ? 'Sending...' : 'Send SMS Campaign'}
            </button>

            {result && (
              <div className={`p-4 rounded-lg ${result.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {result.error ? `Error: ${result.error}` : `Sent to ${result.sent} of ${result.total_recipients} users`}
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaigns.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No SMS campaigns yet</td></tr>
                ) : campaigns.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 text-sm">{c.message?.slice(0, 60)}{c.message?.length > 60 ? '...' : ''}</td>
                    <td className="px-6 py-4 text-sm">{c.total_recipients}</td>
                    <td className="px-6 py-4 text-sm">{c.sent_count || 0}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${c.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{c.status}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
