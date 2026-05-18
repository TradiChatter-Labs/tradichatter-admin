import { useState, useEffect } from 'react';
import { Globe, RefreshCw, Activity, CheckCircle, XCircle, Mic, Volume2, Clock } from 'lucide-react';

export default function VoiceTranslation() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [infoRes, statsRes] = await Promise.all([
        fetch('/api/voice-translation'),
        fetch('/api/voice-translation?action=stats'),
      ]);
      const infoJson = await infoRes.json();
      const statsJson = await statsRes.json();
      if (infoJson.success) setData(infoJson);
      if (statsJson.success) setStats(statsJson);
    } catch (err) {
      console.error('Fetch voice data error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const pipelineStages = [
    { name: 'STT (Speech-to-Text)', provider: 'Whisper (local)', fallback: 'OpenAI Whisper API', icon: Mic },
    { name: 'Translation', provider: 'Google Translate', fallback: 'OpenAI GPT-4o-mini', icon: Globe },
    { name: 'TTS (Text-to-Speech)', provider: 'AWS Polly', fallback: 'Subtitle-only mode', icon: Volume2 },
  ];

  const languages = [
    { code: 'en', name: 'English', voice: true, subtitles: true, latency: '—' },
    { code: 'fr', name: 'French', voice: true, subtitles: true, latency: '1-2s' },
    { code: 'zh', name: 'Chinese', voice: true, subtitles: true, latency: '1-2s' },
    { code: 'ha', name: 'Hausa', voice: true, subtitles: true, latency: '2-3s' },
    { code: 'yo', name: 'Yoruba', voice: false, subtitles: true, latency: 'subtitle-only' },
    { code: 'ig', name: 'Igbo', voice: false, subtitles: true, latency: 'subtitle-only' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice & Video Translation</h1>
          <p className="mt-1 text-sm text-gray-600">Monitor the real-time translation pipeline for calls.</p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Service Health */}
      <div className={`mb-6 p-4 rounded-lg border ${data?.health?.status === 'healthy' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center">
          {data?.health?.status === 'healthy' ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mr-3" />
          )}
          <span className="font-medium text-gray-900">
            Voice Translation Service: {data?.health?.status || 'unknown'}
          </span>
          {data?.health?.error && <span className="ml-3 text-sm text-red-600">{data.health.error}</span>}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-teal-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Translations Today</p>
                <p className="text-2xl font-bold">{stats.translations_today || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Avg Latency</p>
                <p className="text-2xl font-bold">{stats.avg_latency_ms || 0}ms</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Active Streams</p>
                <p className="text-2xl font-bold text-green-600">{stats.active_streams || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <Mic className="h-5 w-5 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Fallback Rate</p>
                <p className="text-2xl font-bold">{stats.fallback_rate || '0%'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Stages */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Translation Pipeline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div key={stage.name} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon className="h-5 w-5 text-teal-500 mr-2" />
                  <h4 className="font-medium text-gray-900">{stage.name}</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Primary:</span>
                    <span className="font-medium text-gray-700">{stage.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fallback:</span>
                    <span className="text-gray-600">{stage.fallback}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Language Support */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Language Support</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voice Output</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtitles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latency Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {languages.map((lang) => (
              <tr key={lang.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{lang.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-700">{lang.code}</td>
                <td className="px-6 py-4">
                  {lang.voice ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </td>
                <td className="px-6 py-4">
                  {lang.subtitles ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{lang.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
