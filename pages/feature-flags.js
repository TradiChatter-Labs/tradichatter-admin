import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Settings, ToggleLeft, ToggleRight, Save, ArrowLeft, Loader2 } from 'lucide-react';

export default function FeatureFlags() {
  const router = useRouter();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => { fetchFlags(); }, []);

  const fetchFlags = async () => {
    try {
      const res = await fetch('/api/feature-flags');
      const json = await res.json();
      if (json.success) setFlags(json.flags);
    } catch (err) {
      console.error('Failed to fetch flags:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (flag) => {
    setSaving(flag.id);
    try {
      const res = await fetch('/api/feature-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: flag.id, enabled: !flag.enabled }),
      });
      const json = await res.json();
      if (json.success) {
        setFlags(flags.map(f => f.id === flag.id ? { ...f, enabled: !f.enabled } : f));
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setSaving(null);
    }
  };

  const categories = ['All', ...new Set(flags.map(f => f.category))];

  const filteredFlags = flags.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat) => {
    const colors = {
      communication: 'bg-blue-100 text-blue-800',
      commerce: 'bg-green-100 text-green-800',
      marketing: 'bg-purple-100 text-purple-800',
      ai: 'bg-orange-100 text-orange-800',
      ui: 'bg-indigo-100 text-indigo-800',
      notifications: 'bg-yellow-100 text-yellow-800',
      payments: 'bg-red-100 text-red-800',
      security: 'bg-gray-100 text-gray-800',
      system: 'bg-pink-100 text-pink-800',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => router.push('/system-configuration')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to System Configuration
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="mr-3 h-7 w-7" /> Feature Flags
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Control feature availability across all platforms. Changes are persisted and synced to mobile/web apps.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Flags List */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {filteredFlags.map((flag) => (
          <div key={flag.id} className="p-5 hover:bg-gray-50 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-base font-medium text-gray-900">{flag.name}</h4>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(flag.category)}`}>
                  {flag.category}
                </span>
              </div>
              <p className="text-sm text-gray-500">{flag.description}</p>
              {flag.updated_at && (
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {new Date(flag.updated_at).toLocaleString()}
                  {flag.updated_by && ` by ${flag.updated_by}`}
                </p>
              )}
            </div>
            <button
              onClick={() => toggleFlag(flag)}
              disabled={saving === flag.id}
              className={`p-2 rounded-full transition-colors ${
                flag.enabled ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {saving === flag.id ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : flag.enabled ? (
                <ToggleRight className="h-7 w-7" />
              ) : (
                <ToggleLeft className="h-7 w-7" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{flags.filter(f => f.enabled).length}</div>
            <div className="text-sm text-gray-600">Enabled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{flags.filter(f => !f.enabled).length}</div>
            <div className="text-sm text-gray-600">Disabled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{flags.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
}
