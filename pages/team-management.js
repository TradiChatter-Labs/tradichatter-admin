import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, UserPlus, Shield, Clock, Eye, Settings } from 'lucide-react';

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    // Mock data
    setTeams([
      {
        id: 1,
        businessName: "Tech Solutions Ltd",
        teamSize: 12,
        roles: ["Admin", "Manager", "Staff"],
        activeMembers: 10,
        pendingInvites: 2
      },
      {
        id: 2,
        businessName: "Food Corner",
        teamSize: 5,
        roles: ["Owner", "Chef", "Cashier"],
        activeMembers: 5,
        pendingInvites: 0
      }
    ]);
    setLoading(false);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage business teams, roles, and permissions across the platform.
        </p>
      </div>

      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-2xl font-bold">{teams.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold">{teams.reduce((sum, team) => sum + team.activeMembers, 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Invites</p>
              <p className="text-2xl font-bold">{teams.reduce((sum, team) => sum + team.pendingInvites, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Business Teams</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{team.businessName}</h3>
                  <p className="text-sm text-gray-600">
                    {team.teamSize} members • {team.activeMembers} active
                  </p>
                  <div className="flex gap-2 mt-2">
                    {team.roles.map((role) => (
                      <span key={role} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowModal(true);
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Team
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Managing roles for ${team.businessName}`);
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Manage Roles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedTeam ? 'Team Details' : 'Invite Team Member'}
            </h3>
            {selectedTeam ? (
              <div className="space-y-3">
                <div><strong>Business:</strong> {selectedTeam.businessName}</div>
                <div><strong>Team Size:</strong> {selectedTeam.teamSize}</div>
                <div><strong>Active Members:</strong> {selectedTeam.activeMembers}</div>
                <div><strong>Pending Invites:</strong> {selectedTeam.pendingInvites}</div>
                <div><strong>Roles:</strong> {selectedTeam.roles.join(', ')}</div>
              </div>
            ) : (
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Select Role</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Select Business</option>
                  {teams.map(team => (
                    <option key={team.id}>{team.businessName}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTeam(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                {selectedTeam ? 'Close' : 'Cancel'}
              </button>
              {!selectedTeam && (
                <button
                  onClick={() => {
                    alert('Invitation sent!');
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send Invite
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}