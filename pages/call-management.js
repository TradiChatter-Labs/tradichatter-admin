import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Video, Clock, Users, AlertTriangle, Eye, Ban, Mic, MicOff, Volume2, VolumeX, Settings, Shield, Zap } from 'lucide-react';

export default function CallManagement() {
  const [calls, setCalls] = useState([
    {
      id: 'CALL-001',
      type: 'voice',
      caller: 'John Doe',
      callee: 'Tech Solutions Ltd',
      duration: '5:23',
      status: 'completed',
      startTime: '2024-01-20 14:30',
      endTime: '2024-01-20 14:35',
      quality: 'good',
      aiTranslation: true,
      recordingEnabled: true,
      location: 'Lagos, Nigeria'
    },
    {
      id: 'CALL-002',
      type: 'video',
      caller: 'Jane Smith',
      callee: 'Fashion Hub',
      duration: '12:45',
      status: 'ongoing',
      startTime: '2024-01-20 13:15',
      endTime: null,
      quality: 'excellent',
      aiTranslation: false,
      recordingEnabled: false,
      location: 'Abuja, Nigeria'
    },
    {
      id: 'CALL-003',
      type: 'voice',
      caller: 'Mike Johnson',
      callee: 'Green Farm Ltd',
      duration: '0:00',
      status: 'failed',
      startTime: '2024-01-20 12:00',
      endTime: null,
      quality: 'poor',
      aiTranslation: false,
      recordingEnabled: true,
      location: 'Kano, Nigeria'
    },
    {
      id: 'CALL-004',
      type: 'video',
      caller: 'Sarah Wilson',
      callee: 'Beauty Store',
      duration: '8:12',
      status: 'ongoing',
      startTime: '2024-01-20 15:45',
      endTime: null,
      quality: 'good',
      aiTranslation: true,
      recordingEnabled: true,
      location: 'Port Harcourt, Nigeria'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiToolsSettings, setAiToolsSettings] = useState({
    autoTranslation: true,
    sentimentAnalysis: true,
    callRecording: false,
    realTimeModeration: true
  });
  const [voiceTranslationSettings, setVoiceTranslationSettings] = useState({
    enabled: true,
    languages: ['en', 'yo', 'ig', 'ha', 'fr'],
    accuracy: 'high',
    realTimeTranslation: true
  });

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.caller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.callee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || call.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      missed: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getQualityColor = (quality) => {
    const colors = {
      excellent: 'text-green-600',
      good: 'text-blue-600',
      fair: 'text-yellow-600',
      poor: 'text-red-600'
    };
    return colors[quality] || 'text-gray-600';
  };

  const stats = {
    total: calls.length,
    completed: calls.filter(c => c.status === 'completed').length,
    ongoing: calls.filter(c => c.status === 'ongoing').length,
    failed: calls.filter(c => c.status === 'failed').length,
    avgDuration: '8:34',
    aiTranslationActive: calls.filter(c => c.aiTranslation && c.status === 'ongoing').length,
    recordingsActive: calls.filter(c => c.recordingEnabled && c.status === 'ongoing').length
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Call Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor and manage voice/video calls across the platform.
        </p>
      </div>

      {/* AI Tools Administration */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">AI Tools Administration</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">AI Features Control</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" checked={aiToolsSettings.autoTranslation} onChange={(e) => setAiToolsSettings({...aiToolsSettings, autoTranslation: e.target.checked})} className="mr-3" />
                  <span className="text-sm">Auto Translation</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={aiToolsSettings.sentimentAnalysis} onChange={(e) => setAiToolsSettings({...aiToolsSettings, sentimentAnalysis: e.target.checked})} className="mr-3" />
                  <span className="text-sm">Sentiment Analysis</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={aiToolsSettings.callRecording} onChange={(e) => setAiToolsSettings({...aiToolsSettings, callRecording: e.target.checked})} className="mr-3" />
                  <span className="text-sm">AI Call Recording</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={aiToolsSettings.realTimeModeration} onChange={(e) => setAiToolsSettings({...aiToolsSettings, realTimeModeration: e.target.checked})} className="mr-3" />
                  <span className="text-sm">Real-time Moderation</span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Voice Translation Controls</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" checked={voiceTranslationSettings.enabled} onChange={(e) => setVoiceTranslationSettings({...voiceTranslationSettings, enabled: e.target.checked})} className="mr-3" />
                  <span className="text-sm">Enable Voice Translation</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accuracy Level</label>
                  <select value={voiceTranslationSettings.accuracy} onChange={(e) => setVoiceTranslationSettings({...voiceTranslationSettings, accuracy: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="high">High Accuracy</option>
                    <option value="medium">Medium Accuracy</option>
                    <option value="fast">Fast Processing</option>
                  </select>
                </div>
                <label className="flex items-center">
                  <input type="checkbox" checked={voiceTranslationSettings.realTimeTranslation} onChange={(e) => setVoiceTranslationSettings({...voiceTranslationSettings, realTimeTranslation: e.target.checked})} className="mr-3" />
                  <span className="text-sm">Real-time Translation</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Call Controls */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Real-time Call Controls</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Shield className="h-5 w-5 mr-2 text-red-600" />
              Emergency Termination
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              AI Translation Override
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Volume2 className="h-5 w-5 mr-2 text-blue-600" />
              Sound Settings Control
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Settings className="h-5 w-5 mr-2 text-gray-600" />
              Global Call Settings
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Total Calls</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Completed</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Failed</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.failed}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Video className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Ongoing</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.ongoing}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Avg Duration</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.avgDuration}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Zap className="h-6 w-6 text-indigo-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">AI Translation</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.aiTranslationActive}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search calls..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Calls</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
          <option value="failed">Failed</option>
          <option value="missed">Missed</option>
        </select>
      </div>

      {/* Calls Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Features</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCalls.map((call) => (
              <tr key={call.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {call.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {call.type === 'voice' ? (
                    <Phone className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Video className="h-5 w-5 text-purple-600" />
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{call.caller}</div>
                  <div className="text-gray-500">→ {call.callee}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {call.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(call.status)}`}>
                    {call.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getQualityColor(call.quality)}`}>
                    {call.quality}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {call.aiTranslation ? (
                      <Zap className="h-4 w-4 text-blue-600" title="AI Translation Active" />
                    ) : (
                      <Zap className="h-4 w-4 text-gray-300" title="AI Translation Inactive" />
                    )}
                    {call.recordingEnabled ? (
                      <Mic className="h-4 w-4 text-red-600" title="Recording Active" />
                    ) : (
                      <MicOff className="h-4 w-4 text-gray-300" title="Recording Inactive" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" title="View Details">
                    <Eye className="h-4 w-4" />
                  </button>
                  {call.status === 'ongoing' && (
                    <button className="text-yellow-600 hover:text-yellow-900 mr-3" title="Monitor Live">
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                  <button className="text-red-600 hover:text-red-900" title="Terminate/Block">
                    <Ban className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <Link href="/customer-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Customer Section
        </Link>
      </div>
    </div>
  );
}