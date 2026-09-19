import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Download } from 'lucide-react';

export default function DataExport() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({ user_id: '', email: '', request_type: 'full_export' });

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/data-export');
      const json = await res.json();
      if (json.success) setRequests(json.requests);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newRequest.user_id || !newRequest.email) return alert('Fill in all fields');
    const res = await fetch('/api/data-export', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    });
    const json = await res.json();
    if (json.success) { setRequests([json.request, ...requests]); setNewRequest({ user_id: '', email: '', request_type: 'full_export' }); }
  };

  if (loading) return <Layout><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
          <p className="text-sm text-gray-500 mt-1">GDPR compliance data export requests</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">New Export Request</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input placeholder="User ID" value={newRequest.user_id} onChange={e => setNewRequest({...newRequest, user_id: e.target.value})} className="border rounded-md px-3 py-2" />
            <input placeholder="Email" type="email" value={newRequest.email} onChange={e => setNewRequest({...newRequest, email: e.target.value})} className="border rounded-md px-3 py-2" />
            <select value={newRequest.request_type} onChange={e => setNewRequest({...newRequest, request_type: e.target.value})} className="border rounded-md px-3 py-2">
              <option value="full_export">Full Export</option><option value="profile_data">Profile Only</option><option value="messages">Messages</option><option value="transactions">Transactions</option>
            </select>
          </div>
          <button onClick={handleCreate} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">Create Request</button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b"><h3 className="text-lg font-medium">Export Requests</h3></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No export requests</td></tr>
              ) : requests.map(r => (
                <tr key={r.id}>
                  <td className="px-6 py-4"><div className="text-sm font-medium">{r.user_id}</div><div className="text-xs text-gray-500">{r.email}</div></td>
                  <td className="px-6 py-4 text-sm">{r.request_type?.replace('_', ' ')}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${r.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.created_at?.split('T')[0]}</td>
                  <td className="px-6 py-4 text-sm">{r.status === 'completed' && r.download_url ? <button className="text-blue-600 hover:text-blue-800 flex items-center"><Download className="h-4 w-4 mr-1" />Download</button> : <span className="text-gray-400">Pending</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
