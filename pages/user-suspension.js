import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function UserSuspension() {
  const [suspensions, setSuspensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: '', username: '', type: 'suspension', duration: '7', reason: '', notes: '' });

  useEffect(() => { fetchSuspensions(); }, []);

  const fetchSuspensions = async () => {
    try {
      const res = await fetch('/api/moderation/suspensions');
      const json = await res.json();
      if (json.success) setSuspensions(json.suspensions);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/moderation/suspensions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: form.userId, username: form.username, type: form.type, reason: form.reason, notes: form.notes, duration: form.duration })
    });
    const json = await res.json();
    if (json.success) { setSuspensions([json.suspension, ...suspensions]); setShowForm(false); setForm({ userId: '', username: '', type: 'suspension', duration: '7', reason: '', notes: '' }); }
  };

  const liftSuspension = async (id) => {
    const res = await fetch('/api/moderation/suspensions', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const json = await res.json();
    if (json.success) setSuspensions(suspensions.map(s => s.id === id ? { ...s, status: 'lifted' } : s));
  };

  const filtered = suspensions.filter(s => filter === 'all' || s.status === filter);

  if (loading) return <Layout><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-gray-900">User Suspension & Bans</h1><p className="text-sm text-gray-500 mt-1">Manage user access restrictions</p></div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm" onClick={() => setShowForm(true)}>New Action</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Active Suspensions</p><p className="text-2xl font-bold text-red-600">{suspensions.filter(s => s.status === 'active').length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Lifted</p><p className="text-2xl font-bold text-green-600">{suspensions.filter(s => s.status === 'lifted').length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Total Actions</p><p className="text-2xl font-bold">{suspensions.length}</p></div>
        </div>

        <div className="flex space-x-2">
          {['all', 'active', 'lifted'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded text-sm ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No suspensions found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td className="px-6 py-4 text-sm">{s.username || s.user_id?.slice(0, 8)}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${s.type === 'ban' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>{s.type}</span></td>
                  <td className="px-6 py-4 text-sm">{s.reason}</td>
                  <td className="px-6 py-4 text-sm">{s.duration}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${s.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{s.status}</span></td>
                  <td className="px-6 py-4 text-sm">{s.status === 'active' && <button onClick={() => liftSuspension(s.id)} className="text-green-600 hover:text-green-800 text-sm">Lift</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">New Suspension</h2><button onClick={() => setShowForm(false)} className="text-gray-500">×</button></div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input placeholder="User ID" value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} className="w-full p-2 border rounded" required />
                <input placeholder="Username (optional)" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full p-2 border rounded" />
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-2 border rounded">
                  <option value="warning">Warning</option><option value="suspension">Suspension</option><option value="ban">Permanent Ban</option>
                </select>
                {form.type === 'suspension' && <input type="number" placeholder="Duration (days)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full p-2 border rounded" min="1" />}
                <select value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="w-full p-2 border rounded" required>
                  <option value="">Select Reason</option><option value="Spam">Spam</option><option value="Harassment">Harassment</option><option value="Fraud">Fraud</option><option value="Terms violation">Terms violation</option><option value="Other">Other</option>
                </select>
                <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full p-2 border rounded" rows="2" />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Apply</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
