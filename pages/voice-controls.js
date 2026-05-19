import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, RefreshCw, ToggleLeft, ToggleRight, Loader2, Mic, Volume2 } from 'lucide-react';

export default function VoiceControls() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/voice-translation/controls');
      const json = await res.json();
      if (json.success) setConfig(json);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleLanguage = async (lang, currentEnabled) => {
    setToggling(lang);
    try {
      await fetch('/api/voice-translation/controls', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_language', language: lang, enabled: !currentEnabled }),
      });
      fetchConfig();
    } catch (err) { alert('Failed: ' + err.message); }
    finally { setToggling(null); }
  };

  const switchProvider = async (provider) => {
    if (!confirm(`Switch to ${provider}?`)) return;
    try {
      await fetch('/api/voice-translation/controls', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch_provider', provider }),
      });
      fetchConfig();
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const languages = config?.languages || [
    { code: 'en', name: 'English', voice: true, subtitles: true, enabled: true },
    { code: 'fr', name: 'French', voice: true, subtitles: true, enabled: true },
    { code: 'zh', name: 'Chinese', voice: true, subtitles: true, enabled: true },
    { code: 'ha', name: 'Hausa', voice: true, subtitles: true, enabled: true },
    { code: 'yo', name: 'Yoruba', voice: false, subtitles: true, enabled: true },
    { code: 'ig', name: 'Igbo', voice: false, subtitles: true, enabled: true },
  ];

  const providers = {
    stt: [
      { id: 'whisper_local', name: 'Whisper (Local)', tier: 'Primary' },
      { id: 'openai_whisper', name: 'OpenAI Whisper API', tier: 'Fallback' },
    ],
    translate: [
      { id: 'google_translate', name: 'Google Translate', tier: 'Primary' },
      { id: 'openai_gpt4', name: 'OpenAI GPT-4o-mini', tier: 'Fallback' },
    ],
    tts: [
      { id: 'aws_polly', name: 'AWS Polly', tier: 'Primary' },
      { id: 'subtitle_only', name: 'Subtitle-only mode', tier: 'Fallback' },
    ],
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice Service Controls</h1>
          <p className="text-sm text-gray-600">Enable/disable languages and switch translation providers.</p>
        </div>
        <button onClick={fetchConfig} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Language Controls */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Language Controls</h3>
        <div className="divide-y divide-gray-200">
          {languages.map((lang) => (
            <div key={lang.code} className="py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-gray-900">{lang.name}</h4>
                  <span className="text-xs font-mono text-gray-400">{lang.code}</span>
                  {lang.voice && <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Voice</span>}
                  {lang.subtitles && <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Subtitles</span>}
                  {!lang.voice && <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">Subtitle-only</span>}
                </div>
              </div>
              <button
                onClick={() => toggleLanguage(lang.code, lang.enabled !== false)}
                disabled={toggling === lang.code}
                className={`p-2 rounded-full ${lang.enabled !== false ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
              >
                {toggling === lang.code ? <Loader2 className="h-5 w-5 animate-spin" /> : lang.enabled !== false ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Provider Controls */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Provider Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(providers).map(([stage, providerList]) => (
            <div key={stage} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                {stage === 'stt' && <Mic className="h-4 w-4 mr-2 text-teal-500" />}
                {stage === 'translate' && <Globe className="h-4 w-4 mr-2 text-teal-500" />}
                {stage === 'tts' && <Volume2 className="h-4 w-4 mr-2 text-teal-500" />}
                {stage.toUpperCase()}
              </h4>
              <div className="space-y-2">
                {providerList.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.tier}</p>
                    </div>
                    {p.tier === 'Fallback' && (
                      <button onClick={() => switchProvider(p.id)} className="text-xs px-2 py-1 border border-teal-300 text-teal-700 rounded hover:bg-teal-50">
                        Promote
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Link href="/voice-translation" className="text-teal-600 hover:text-teal-500 font-medium">← Back to Voice Dashboard</Link>
      </div>
    </div>
  );
}
