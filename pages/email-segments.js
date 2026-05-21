import { useState, useEffect, useCallback } from 'react';
import { Users, Filter, Save, Trash2, Send, X, RefreshCw } from 'lucide-react';
import { resolveSegment, getSegments, createSegment, deleteSegment, sendCampaign, getEmailTemplates } from '@/lib/serviceConnector';

export default function EmailSegments() {
  const [segments, setSegments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    brand: '',
    plan: '',
    country: '',
    registered_after: '',
    registered_before: '',
    active_days: '',
  });

  const [sendForm, setSendForm] = useState({ name: '', subject: '', template_id: '', html_body: '' });

  const fetchSegments = useCallback(async () => {
    setLoading(true);
    const res = await getSegments();
    if (res.ok) setSegments(res.data.segments || []);
    const t = await getEmailTemplates();
    if (t.ok) setTemplates(t.data.templates || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSegments(); }, [fetchSegments]);

  const handleResolve = async () => {
    setResolving(true);
    setError('');
    const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
    if (cleanFilters.active_days) cleanFilters.active_days = parseInt(cleanFilters.active_days);
    const res = await resolveSegment(cleanFilters);
    setResolving(false);
    if (res.ok) setResolved(res.data);
    else setError(res.data?.detail || 'Failed to resolve segment');
  };

  const handleSave = async () => {
    const name = prompt('Segment name:');
    if (!name) return;
    const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
    if (cleanFilters.active_days) cleanFilters.active_days = parseInt(cleanFilters.active_days);
    const res = await createSegment({ name, filters: cleanFilters });
    if (res.ok) fetchSegments();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this segment?')) return;
    await deleteSegment(id);
    fetchSegments();
  };

  const handleLoadSegment = (segment) => {
    const f = segment.filters || {};
    setFilters({
      brand: f.brand || '',
      plan: f.plan || '',
      country: f.country || '',
      registered_after: f.registered_after || '',
      registered_before: f.registered_before || '',
      active_days: f.active_days ? String(f.active_days) : '',
    });
    setResolved(null);
  };

  const handleSendToSegment = async () => {
    if (!resolved || resolved.count === 0) return;
    if (!sendForm.name || !sendForm.subject) { setError('Campaign name and subject required'); return; }
    if (!sendForm.template_id && !sendForm.html_body) { setError('Select a template or provide HTML'); return; }

    setSending(true);
    const res = await sendCampaign({
      name: sendForm.name,
      brand: filters.brand || 'tradichatter',
      template_id: sendForm.template_id || undefined,
      subject: sendForm.subject,
      html_body: sendForm.template_id ? undefined : sendForm.html_body,
      recipients: resolved.emails,
    });
    setSending(false);
    if (res.ok) {
      setShowSendModal(false);
      setSendForm({ name: '', subject: '', template_id: '', html_body: '' });
      alert(`Campaign sent to ${resolved.count} recipients!`);
    } else {
      setError(res.data?.detail || 'Failed to send');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Users className="mr-3 h-8 w-8" /> Email Segments</h1>
        <p className="mt-1 text-sm text-gray-600">Build audience segments and send targeted campaigns</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Filter Builder */}
        <div className="col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center"><Filter className="h-5 w-5 mr-2" /> Filter Builder</h3>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm mb-4">{error}</div>}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Platform</label>
                <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="">All platforms</option>
                  <option value="tradichatter">TradiChatter</option>
                  <option value="sourcehub">SourceHub</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Plan</label>
                <select value={filters.plan} onChange={(e) => setFilters({ ...filters, plan: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="">All plans</option>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input type="text" value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="e.g. Nigeria" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Active in last N days</label>
                <input type="number" value={filters.active_days} onChange={(e) => setFilters({ ...filters, active_days: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="e.g. 30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registered after</label>
                <input type="date" value={filters.registered_after} onChange={(e) => setFilters({ ...filters, registered_after: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registered before</label>
                <input type="date" value={filters.registered_before} onChange={(e) => setFilters({ ...filters, registered_before: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={handleResolve} disabled={resolving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${resolving ? 'animate-spin' : ''}`} /> {resolving ? 'Resolving...' : 'Resolve Segment'}
              </button>
              <button onClick={handleSave} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center text-sm">
                <Save className="h-4 w-4 mr-2" /> Save Segment
              </button>
            </div>

            {/* Results */}
            {resolved && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{resolved.count} users matched</h4>
                  {resolved.count > 0 && (
                    <button onClick={() => setShowSendModal(true)} className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm">
                      <Send className="h-4 w-4 mr-1" /> Send to Segment
                    </button>
                  )}
                </div>
                {resolved.count > 0 && (
                  <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                    {resolved.emails.slice(0, 20).map((email, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 bg-white border rounded text-xs mr-1 mb-1">{email}</span>
                    ))}
                    {resolved.count > 20 && <span className="text-xs text-gray-500">...and {resolved.count - 20} more</span>}
                  </div>
                )}
                {resolved.count === 0 && <p className="text-sm text-gray-500">No users match these filters. Try adjusting your criteria.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Saved Segments */}
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Saved Segments</h3>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : segments.length === 0 ? (
              <p className="text-sm text-gray-500">No saved segments yet. Build a filter and save it.</p>
            ) : (
              <div className="space-y-2">
                {segments.map((seg) => (
                  <div key={seg.id} className="p-3 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => handleLoadSegment(seg)}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{seg.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(seg.id); }} className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(seg.filters || {}).map(([k, v]) => (
                        <span key={k} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{k}: {v}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send to Segment Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Send to {resolved?.count} recipients</h2>
              <button onClick={() => setShowSendModal(false)} className="p-2 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <input type="text" value={sendForm.name} onChange={(e) => setSendForm({ ...sendForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Segment campaign name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input type="text" value={sendForm.subject} onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Email subject" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Template</label>
                <select value={sendForm.template_id} onChange={(e) => setSendForm({ ...sendForm, template_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="">— Custom HTML —</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.brand})</option>)}
                </select>
              </div>
              {!sendForm.template_id && (
                <div>
                  <label className="block text-sm font-medium mb-1">HTML Body</label>
                  <textarea value={sendForm.html_body} onChange={(e) => setSendForm({ ...sendForm, html_body: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm" rows={5} placeholder="<h2>Hello!</h2>" />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button onClick={() => setShowSendModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm">Cancel</button>
              <button onClick={handleSendToSegment} disabled={sending} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                {sending ? 'Sending...' : `Send to ${resolved?.count} users`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
