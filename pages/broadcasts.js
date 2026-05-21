import { useState, useEffect, useCallback } from 'react';
import { Send, Users, Clock, CheckCircle, XCircle, Eye, Mail, X, AlertCircle, ShieldOff } from 'lucide-react';
import { useRouter } from 'next/router';
import { getCampaigns, getCampaign, sendCampaign, cancelCampaign, getEmailTemplates } from '@/lib/serviceConnector';
import { callService } from '@/lib/serviceConnector';

export default function Broadcasts() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [detailCampaign, setDetailCampaign] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('campaigns');
  const [suppressed, setSuppressed] = useState([]);

  const [form, setForm] = useState({
    name: '',
    brand: 'tradichatter',
    template_id: '',
    subject: '',
    html_body: '',
    recipients_text: '',
    scheduled_at: '',
    drip_hours: '',
  });

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    const res = await getCampaigns();
    if (res.ok) setCampaigns(res.data.campaigns || []);
    setLoading(false);
  }, []);

  const fetchTemplates = useCallback(async () => {
    const res = await getEmailTemplates();
    if (res.ok) setTemplates(res.data.templates || []);
  }, []);

  useEffect(() => { fetchCampaigns(); fetchTemplates(); }, [fetchCampaigns, fetchTemplates]);

  const fetchSuppressed = async () => {
    const res = await callService('communication', '/api/preferences/suppressed');
    if (res.ok) setSuppressed(res.data.suppressed || []);
  };

  const handleTemplateSelect = (templateId) => {
    const tmpl = templates.find(t => t.id === templateId);
    if (tmpl) {
      setForm({ ...form, template_id: templateId, subject: tmpl.subject, html_body: tmpl.html_body, brand: tmpl.brand });
    } else {
      setForm({ ...form, template_id: '', html_body: '' });
    }
  };

  const handleSend = async () => {
    const recipients = form.recipients_text.split(/[\n,;]+/).map(e => e.trim()).filter(e => e.includes('@'));
    if (recipients.length === 0) { setError('Enter at least one valid email address'); return; }
    if (!form.subject) { setError('Subject is required'); return; }
    if (!form.template_id && !form.html_body) { setError('Select a template or provide HTML body'); return; }
    if (!form.name) { setError('Campaign name is required'); return; }

    setError('');
    setSending(true);

    const payload = {
      name: form.name,
      brand: form.brand,
      template_id: form.template_id || undefined,
      subject: form.subject,
      html_body: form.template_id ? undefined : form.html_body,
      recipients,
      scheduled_at: form.scheduled_at || undefined,
      drip_hours: form.drip_hours ? parseFloat(form.drip_hours) : undefined,
    };

    const res = await sendCampaign(payload);
    setSending(false);

    if (res.ok) {
      setShowComposer(false);
      setForm({ name: '', brand: 'tradichatter', template_id: '', subject: '', html_body: '', recipients_text: '', scheduled_at: '', drip_hours: '' });
      fetchCampaigns();
    } else {
      setError(res.data?.detail || 'Failed to send campaign');
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this scheduled campaign?')) return;
    const res = await cancelCampaign(id);
    if (res.ok) fetchCampaigns();
  };

  const handleViewDetail = async (id) => {
    const res = await getCampaign(id);
    if (res.ok) setDetailCampaign(res.data);
  };

  const getStatusColor = (status) => {
    const map = { completed: 'bg-green-100 text-green-800', processing: 'bg-yellow-100 text-yellow-800', scheduled: 'bg-blue-100 text-blue-800', cancelled: 'bg-gray-100 text-gray-800', draft: 'bg-gray-100 text-gray-600' };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Mail className="mr-3 h-8 w-8" /> Email Campaigns</h1>
          <p className="mt-1 text-sm text-gray-600">Send targeted emails to users via the Communication Service</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => { setActiveTab('suppressed'); fetchSuppressed(); }} className={`px-3 py-2 rounded-md text-sm ${activeTab === 'suppressed' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            <ShieldOff className="h-4 w-4 inline mr-1" /> Suppressed
          </button>
          <button onClick={() => setActiveTab('campaigns')} className={`px-3 py-2 rounded-md text-sm ${activeTab === 'campaigns' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            Campaigns
          </button>
          <button onClick={() => setShowComposer(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <Send className="mr-2 h-4 w-4" /> New Campaign
          </button>
        </div>
      </div>

      {/* Campaign History */}
      {activeTab === 'campaigns' && (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign History</h3>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600">Create your first email campaign to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <div key={c.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{c.name}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(c.status)}`}>{c.status}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.brand === 'tradichatter' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>{c.brand}</span>
                      </div>
                      <p className="text-sm text-gray-600">{c.subject}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center"><Users className="h-3 w-3 mr-1" />{c.total_recipients} recipients</span>
                        <span className="flex items-center"><CheckCircle className="h-3 w-3 mr-1 text-green-500" />{c.sent} sent</span>
                        {c.failed > 0 && <span className="flex items-center"><XCircle className="h-3 w-3 mr-1 text-red-500" />{c.failed} failed</span>}
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleViewDetail(c.id)} className="p-2 text-gray-400 hover:text-blue-600" title="View details"><Eye className="h-4 w-4" /></button>
                      {c.status === 'scheduled' && (
                        <button onClick={() => handleCancel(c.id)} className="p-2 text-gray-400 hover:text-red-600" title="Cancel"><XCircle className="h-4 w-4" /></button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Suppressed Emails Tab */}
      {activeTab === 'suppressed' && (
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><ShieldOff className="h-5 w-5 mr-2" /> Suppressed Emails</h3>
            <p className="text-sm text-gray-600 mb-4">Emails that are blocked from receiving campaigns (unsubscribed or hard-bounced).</p>
            {suppressed.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">No suppressed emails.</p>
            ) : (
              <div className="space-y-2">
                {suppressed.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-mono text-sm">{s.email}</span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${s.reason === 'unsubscribed' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{s.reason}</span>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {showComposer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">New Email Campaign</h2>
              <button onClick={() => setShowComposer(false)} className="p-2 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center"><AlertCircle className="h-4 w-4 mr-2" />{error}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="January Promo" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="tradichatter">TradiChatter</option>
                    <option value="sourcehub">SourceHub</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule (optional)</label>
                  <input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : '' })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Drip over hours (optional)</label>
                  <input type="number" step="0.5" min="0" value={form.drip_hours} onChange={(e) => setForm({ ...form, drip_hours: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 2 (spread over 2 hours)" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Template (optional)</label>
                <select value={form.template_id} onChange={(e) => handleTemplateSelect(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">— Custom HTML —</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.brand})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Your subject line" />
              </div>

              {!form.template_id && (
                <div>
                  <label className="block text-sm font-medium mb-1">HTML Body</label>
                  <textarea value={form.html_body} onChange={(e) => setForm({ ...form, html_body: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm" rows={8} placeholder="<h2>Hello!</h2><p>Your message here...</p>" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Recipients (one email per line, or comma-separated)</label>
                <textarea value={form.recipients_text} onChange={(e) => setForm({ ...form, recipients_text: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" rows={5} placeholder={"user1@example.com\nuser2@example.com\nuser3@example.com"} />
                <p className="text-xs text-gray-500 mt-1">
                  {form.recipients_text.split(/[\n,;]+/).filter(e => e.trim().includes('@')).length} valid emails detected
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t bg-gray-50 space-x-2">
              <button onClick={() => setShowComposer(false)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-white text-sm">Cancel</button>
              <button onClick={handleSend} disabled={sending} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm">
                <Send className="h-4 w-4 mr-2" /> {sending ? 'Sending...' : form.scheduled_at ? 'Schedule Campaign' : 'Send Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {detailCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-bold">{detailCampaign.name}</h2>
              <button onClick={() => setDetailCampaign(null)} className="p-2 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Brand:</span> <span className="font-medium">{detailCampaign.brand}</span></div>
                <div><span className="text-gray-500">Status:</span> <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(detailCampaign.status)}`}>{detailCampaign.status}</span></div>
                <div><span className="text-gray-500">Subject:</span> <span className="font-medium">{detailCampaign.subject}</span></div>
                <div><span className="text-gray-500">Created:</span> <span className="font-medium">{new Date(detailCampaign.created_at).toLocaleString()}</span></div>
              </div>

              {detailCampaign.recipient_stats && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Stats</h4>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold">{detailCampaign.total_recipients}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-700">{detailCampaign.recipient_stats.sent}</div>
                      <div className="text-xs text-gray-500">Sent</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-lg font-bold text-yellow-700">{detailCampaign.recipient_stats.pending}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-lg font-bold text-red-700">{detailCampaign.recipient_stats.failed}</div>
                      <div className="text-xs text-gray-500">Failed</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-lg font-bold text-purple-700">{detailCampaign.recipient_stats.bounced || 0}</div>
                      <div className="text-xs text-gray-500">Bounced</div>
                    </div>
                  </div>
                </div>
              )}

              {detailCampaign.scheduled_at && (
                <div className="text-sm"><span className="text-gray-500">Scheduled for:</span> <span className="font-medium">{new Date(detailCampaign.scheduled_at).toLocaleString()}</span></div>
              )}
              {detailCampaign.completed_at && (
                <div className="text-sm"><span className="text-gray-500">Completed:</span> <span className="font-medium">{new Date(detailCampaign.completed_at).toLocaleString()}</span></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
