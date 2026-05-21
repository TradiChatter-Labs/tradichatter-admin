import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Mail, Eye, Edit, Save, X, Plus, ArrowLeft, Trash2, Send, Code } from 'lucide-react';
import { getEmailTemplates, createEmailTemplate, updateEmailTemplate, deleteEmailTemplate, previewEmailTemplate, sendEmail } from '@/lib/serviceConnector';

export default function NotificationTemplates() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [sendTestModal, setSendTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [brandFilter, setBrandFilter] = useState('');
  const [error, setError] = useState('');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const res = await getEmailTemplates(brandFilter || undefined);
    if (res.ok) setTemplates(res.data.templates || []);
    setLoading(false);
  }, [brandFilter]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleCreate = () => {
    setEditingTemplate({
      brand: 'tradichatter',
      name: '',
      subject: '',
      html_body: '',
      variables: [],
    });
    setPreviewMode(false);
    setPreviewHtml('');
  };

  const handleEdit = (template) => {
    setEditingTemplate({ ...template });
    setPreviewMode(false);
    setPreviewHtml('');
  };

  const handleSave = async () => {
    if (!editingTemplate.name || !editingTemplate.subject || !editingTemplate.html_body) {
      setError('Name, subject, and HTML body are required');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      brand: editingTemplate.brand,
      name: editingTemplate.name,
      subject: editingTemplate.subject,
      html_body: editingTemplate.html_body,
      variables: editingTemplate.variables || [],
    };

    let res;
    if (editingTemplate.id) {
      res = await updateEmailTemplate(editingTemplate.id, payload);
    } else {
      res = await createEmailTemplate(payload);
    }

    setSaving(false);
    if (res.ok) {
      setEditingTemplate(null);
      fetchTemplates();
    } else {
      setError(res.data?.detail || 'Failed to save template');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    const res = await deleteEmailTemplate(id);
    if (res.ok) fetchTemplates();
  };

  const handlePreview = async () => {
    if (!editingTemplate.html_body) return;
    const res = await previewEmailTemplate({
      brand: editingTemplate.brand,
      html_body: editingTemplate.html_body,
      variables: Object.fromEntries((editingTemplate.variables || []).map(v => [v, `[${v.toUpperCase()}]`])),
    });
    if (res.ok && res.data.success) {
      setPreviewHtml(res.data.html);
      setPreviewMode(true);
    } else {
      setError(res.data?.error || 'Preview failed');
    }
  };

  const handleSendTest = async () => {
    if (!testEmail || !editingTemplate) return;
    setSaving(true);
    const res = await sendEmail({
      brand: editingTemplate.brand,
      to: testEmail,
      subject: `[TEST] ${editingTemplate.subject}`,
      html: editingTemplate.html_body,
      variables: Object.fromEntries((editingTemplate.variables || []).map(v => [v, `[${v.toUpperCase()}]`])),
      priority: 'individual',
    });
    setSaving(false);
    setSendTestModal(false);
    if (res.ok) alert('Test email sent!');
    else alert('Failed to send test email');
  };

  const addVariable = () => {
    const name = prompt('Variable name (e.g. user_name):');
    if (name && !editingTemplate.variables.includes(name)) {
      setEditingTemplate({ ...editingTemplate, variables: [...editingTemplate.variables, name] });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button onClick={() => router.push('/system-configuration')} className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to System Configuration
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Mail className="mr-3 h-8 w-8" /> Email Templates
        </h1>
        <p className="mt-1 text-sm text-gray-600">Manage email templates used by the Communication Service</p>
      </div>

      {/* Filters + Actions */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All Brands</option>
              <option value="tradichatter">TradiChatter</option>
              <option value="sourcehub">SourceHub</option>
            </select>
            <span className="text-sm text-gray-500">{templates.length} templates</span>
          </div>
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm">
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </button>
        </div>
      </div>

      {/* Template List */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
              <p className="text-gray-600 mb-4">Create your first email template to get started.</p>
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Template</button>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${template.brand === 'tradichatter' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                        {template.brand}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                    {template.variables?.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Code className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{template.variables.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(template)} className="p-2 text-gray-400 hover:text-blue-600" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(template.id)} className="p-2 text-gray-400 hover:text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingTemplate.id ? 'Edit Template' : 'Create Template'}</h2>
              <button onClick={() => setEditingTemplate(null)} className="p-2 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

              {previewMode ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Preview</h3>
                    <button onClick={() => setPreviewMode(false)} className="text-sm text-blue-600 hover:underline">← Back to editor</button>
                  </div>
                  <div className="border rounded-lg overflow-hidden" style={{ height: '500px' }}>
                    <iframe srcDoc={previewHtml} className="w-full h-full" title="Email Preview" sandbox="" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <select value={editingTemplate.brand} onChange={(e) => setEditingTemplate({ ...editingTemplate, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="tradichatter">TradiChatter</option>
                        <option value="sourcehub">SourceHub</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Template Name</label>
                      <input type="text" value={editingTemplate.name} onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. welcome_email" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject Line</label>
                      <input type="text" value={editingTemplate.subject} onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Welcome to TradiChatter!" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium">HTML Body</label>
                      <span className="text-xs text-gray-500">Use {'{{variable_name}}'} for dynamic content</span>
                    </div>
                    <textarea value={editingTemplate.html_body} onChange={(e) => setEditingTemplate({ ...editingTemplate, html_body: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm" rows={14} placeholder="<h2>Hello {{first_name}}</h2>..." />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Variables</label>
                      <button onClick={addVariable} className="text-xs text-blue-600 hover:underline">+ Add variable</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(editingTemplate.variables || []).map((v, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm font-mono flex items-center">
                          {`{{${v}}}`}
                          <button onClick={() => setEditingTemplate({ ...editingTemplate, variables: editingTemplate.variables.filter((_, idx) => idx !== i) })} className="ml-1 text-gray-400 hover:text-red-500">×</button>
                        </span>
                      ))}
                      {(!editingTemplate.variables || editingTemplate.variables.length === 0) && <span className="text-sm text-gray-400">No variables defined</span>}
                    </div>
                  </div>
                </>
              )}
            </div>

            {!previewMode && (
              <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                <button onClick={() => setSendTestModal(true)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-white flex items-center text-sm" disabled={!editingTemplate.html_body}>
                  <Send className="h-4 w-4 mr-2" /> Send Test
                </button>
                <div className="flex items-center space-x-2">
                  <button onClick={handlePreview} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-white flex items-center text-sm" disabled={!editingTemplate.html_body}>
                    <Eye className="h-4 w-4 mr-2" /> Preview
                  </button>
                  <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm">
                    <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Template'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Send Test Modal */}
      {sendTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Send Test Email</h3>
            <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4" placeholder="your@email.com" />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setSendTestModal(false)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleSendTest} disabled={saving || !testEmail} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {saving ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
