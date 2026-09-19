import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Users, UserPlus, Shield, Clock } from 'lucide-react';

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ business_id: '', email: '', role: 'staff', name: '' });

  useEffect(() => { fetchTeams(); }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const json = await res.json();
      if (json.success) setTeams(json.teams);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/teams', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inviteForm)
    });
    const json = await res.json();
    if (json.success) { fetchTeams(); setShowInvite(false); setInviteForm({ business_id: '', email: '', role: 'staff', name: '' }); }
  };

  const totalMembers = teams.reduce((s, t) => s + t.members.length, 0);
  const activeMembers = teams.reduce((s, t) => s + t.members.filter(m => m.status === 'active').length, 0);
  const pendingInvites = teams.reduce((s, t) => s + t.members.filter(m => m.status === 'pending').length, 0);

  if (loading) return <Layout><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-gray-900">Team Management</h1><p className="text-sm text-gray-500 mt-1">Business teams and roles</p></div>
          <button onClick={() => setShowInvite(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center"><UserPlus className="h-4 w-4 mr-2" />Invite Member</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><Users className="h-6 w-6 text-blue-600 mr-3" /><div><p className="text-sm text-gray-500">Total Members</p><p className="text-xl font-bold">{totalMembers}</p></div></div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><Shield className="h-6 w-6 text-green-600 mr-3" /><div><p className="text-sm text-gray-500">Active</p><p className="text-xl font-bold">{activeMembers}</p></div></div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><Clock className="h-6 w-6 text-orange-600 mr-3" /><div><p className="text-sm text-gray-500">Pending Invites</p><p className="text-xl font-bold">{pendingInvites}</p></div></div>
        </div>

        <div className="space-y-4">
          {teams.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No teams found</div>
          ) : teams.map(team => (
            <div key={team.business_id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">{team.business_name}</h3>
                <span className="text-sm text-gray-500">{team.members.length} members</span>
              </div>
              <div className="space-y-2">
                {team.members.map(m => (
                  <div key={m.id} className="flex items-center justify-between py-2 border-t">
                    <div><p className="text-sm font-medium">{m.name || m.email}</p><p className="text-xs text-gray-500">{m.email}</p></div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{m.role}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {showInvite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Invite Member</h2><button onClick={() => setShowInvite(false)} className="text-gray-500">×</button></div>
              <form onSubmit={handleInvite} className="space-y-4">
                <input placeholder="Business ID" value={inviteForm.business_id} onChange={e => setInviteForm({...inviteForm, business_id: e.target.value})} className="w-full p-2 border rounded" required />
                <input placeholder="Email" type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} className="w-full p-2 border rounded" required />
                <input placeholder="Name" value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} className="w-full p-2 border rounded" />
                <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} className="w-full p-2 border rounded">
                  <option value="staff">Staff</option><option value="manager">Manager</option><option value="admin">Admin</option>
                </select>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowInvite(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send Invite</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
