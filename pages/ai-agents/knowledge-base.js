import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bot, Search, RefreshCw, Plus, Trash2, Edit, Save } from 'lucide-react';

export default function AIKnowledgeBase() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessFilter, setBusinessFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ business_id: '', content: '', category: 'product' });
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => { fetchKnowledge(); }, [businessFilter]);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (businessFilter) params.set('business_id', businessFilter);
      const res = await fetch(`/api/ai-agents/knowledge-base?${params}`);
      const json = await res.json();
      if (json.success) setEntries(json.entries || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!newEntry.business_id || !newEntry.content) { alert('Business ID and content required'); return; }
    try {
      const res = await fetch('/api/ai-agents/knowledge-base', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEntry, action: 'add' }),
      });
      const json = await res.json();
      if (json.success) { setShowAddModal(false); setNewEntry({ business_id: '', content: '', category: 'product' }); fetchKnowledge(); }
      else alert(json.error || 'Failed');
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const handleDelete = async (knowledgeId, businessId) => {
    if (!confirm('Delete this knowledge entry?')) return;
    await fetch('/api/ai-agents/knowledge-base', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', knowledge_id: knowledgeId, business_id: businessId }),
    });
    fetchKnowledge();
  };

  const handleUpdate = async (knowledgeId, businessId) => {
    await fetch('/api/ai-agents/knowledge-base', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', knowledge_id: knowledgeId, business_id: businessId, content: editContent }),
    });
    setEditingId(null);
    fetchKnowledge();
  };

  const getCategoryColor = (cat) => {
    const colors = { product: 'bg-blue-100 text-blue-800', faq: 'bg-green-100 text-green-800', policy: 'bg-purple-100 text-purple-800', greeting: 'bg-orange-100 text-orange-800' };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Knowledge Base</h1>
          <p className="text-sm text-gray-600">View and manage what the AI knows about each business.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" /> Add Entry
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Filter by business ID..." value={businessFilter} onChange={(e) => setBusinessFilter(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchKnowledge()} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <button onClick={fetchKnowledge} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bot className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>No knowledge entries found. {!businessFilter && 'Enter a business ID to filter.'}</p>
            <p className="text-xs mt-1">Ensure AI Agent Service is running and has knowledge base data.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {entries.map((entry) => (
              <div key={entry.id} className="p-5 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(entry.category)}`}>{entry.category}</span>
                      <span className="text-xs text-gray-400 font-mono">Business: {entry.business_id?.slice(0, 8)}</span>
                    </div>
                    {editingId === entry.id ? (
                      <div className="flex gap-2">
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" rows={2} />
                        <button onClick={() => handleUpdate(entry.id, entry.business_id)} className="text-green-600 hover:text-green-800"><Save className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700">{entry.content}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{entry.created_at ? new Date(entry.created_at).toLocaleString() : ''}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => { setEditingId(entry.id); setEditContent(entry.content); }} className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(entry.id, entry.business_id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Knowledge Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business ID</label>
                <input type="text" value={newEntry.business_id} onChange={(e) => setNewEntry({ ...newEntry, business_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="UUID of the business" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={newEntry.category} onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="product">Product Info</option>
                  <option value="faq">FAQ</option>
                  <option value="policy">Policy</option>
                  <option value="greeting">Greeting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea value={newEntry.content} onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={4} placeholder="Knowledge content the AI will use..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link href="/ai-agents" className="text-purple-600 hover:text-purple-500 font-medium">← Back to AI Dashboard</Link>
      </div>
    </div>
  );
}
