import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, RefreshCw, Search, Bot, User } from 'lucide-react';

export default function AIConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessFilter, setBusinessFilter] = useState('');
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedConvo, setSelectedConvo] = useState(null);

  useEffect(() => { fetchConversations(); }, [offset, businessFilter]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ action: 'conversations', limit: 50, offset });
      if (businessFilter) params.set('business_id', businessFilter);
      const res = await fetch(`/api/ai-agents?${params}`);
      const json = await res.json();
      if (json.success) {
        setConversations(json.conversations || []);
        setTotal(json.total || 0);
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAgentColor = (agent) => {
    const colors = {
      sales: 'text-blue-600 bg-blue-50',
      support: 'text-green-600 bg-green-50',
      marketing: 'text-purple-600 bg-purple-50',
      followup: 'text-orange-600 bg-orange-50',
      recommendation: 'text-teal-600 bg-teal-50',
      lead: 'text-red-600 bg-red-50',
    };
    return colors[agent] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Conversation Logs</h1>
        <p className="mt-1 text-sm text-gray-600">View all AI agent conversations across businesses.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by business ID..."
            value={businessFilter}
            onChange={(e) => setBusinessFilter(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchConversations()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button onClick={fetchConversations} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      <div className="flex gap-6">
        {/* Conversation List */}
        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No conversations found. Ensure AI Agent Service is running.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((convo) => (
                <div
                  key={convo.id}
                  onClick={() => setSelectedConvo(convo)}
                  className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${selectedConvo?.id === convo.id ? 'bg-purple-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getAgentColor(convo.agent_type)}`}>
                        {convo.agent_type}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{convo.business_name || convo.business_id?.slice(0, 8)}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {convo.created_at ? new Date(convo.created_at).toLocaleString() : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">{convo.last_message || convo.summary || '—'}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    <span>{convo.message_count || 0} messages</span>
                    <span>{convo.response_time_ms || 0}ms avg</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 50 && (
            <div className="flex justify-between items-center px-6 py-3 border-t">
              <button disabled={offset === 0} onClick={() => setOffset(o => Math.max(0, o - 50))} className="text-sm text-blue-600 disabled:opacity-50">← Previous</button>
              <span className="text-xs text-gray-500">{offset + 1}–{Math.min(offset + 50, total)} of {total}</span>
              <button disabled={offset + 50 >= total} onClick={() => setOffset(o => o + 50)} className="text-sm text-blue-600 disabled:opacity-50">Next →</button>
            </div>
          )}
        </div>

        {/* Conversation Detail */}
        {selectedConvo && (
          <div className="w-96 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">Conversation Detail</h3>
              <p className="text-xs text-gray-500">{selectedConvo.agent_type} agent • {selectedConvo.business_name || selectedConvo.business_id?.slice(0, 8)}</p>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto space-y-3">
              {(selectedConvo.messages || []).map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'assistant' ? 'bg-purple-50 text-gray-800' : 'bg-blue-50 text-gray-800'
                  }`}>
                    <div className="flex items-center gap-1 mb-1">
                      {msg.role === 'assistant' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      <span className="text-xs font-medium">{msg.role === 'assistant' ? 'AI' : 'Customer'}</span>
                    </div>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              {(!selectedConvo.messages || selectedConvo.messages.length === 0) && (
                <p className="text-sm text-gray-400 text-center">Message details not available in summary view</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href="/ai-agents" className="text-purple-600 hover:text-purple-500 font-medium">← Back to AI Dashboard</Link>
      </div>
    </div>
  );
}
