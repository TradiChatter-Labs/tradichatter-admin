import { useState } from 'react';
import { useRouter } from 'next/router';
import { Settings, ArrowLeft, Plus, Edit, Trash2, Power, Save } from 'lucide-react';

export default function ModerationRules() {
  const router = useRouter();
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Spam Detection',
      type: 'automated',
      category: 'spam',
      description: 'Detects repetitive messages and promotional content',
      enabled: true,
      severity: 'medium',
      action: 'flag',
      keywords: ['buy now', 'limited time', 'click here', 'free money'],
      threshold: 3
    },
    {
      id: 2,
      name: 'Inappropriate Language',
      type: 'keyword',
      category: 'language',
      description: 'Filters offensive and inappropriate language',
      enabled: true,
      severity: 'high',
      action: 'block',
      keywords: ['offensive1', 'offensive2', 'inappropriate'],
      threshold: 1
    },
    {
      id: 3,
      name: 'Scam Prevention',
      type: 'pattern',
      category: 'fraud',
      description: 'Identifies potential scam patterns and fraudulent content',
      enabled: true,
      severity: 'high',
      action: 'block',
      keywords: ['send money', 'wire transfer', 'urgent payment'],
      threshold: 2
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'keyword',
    category: 'spam',
    description: '',
    enabled: true,
    severity: 'medium',
    action: 'flag',
    keywords: [],
    threshold: 1
  });

  const toggleRule = (ruleId) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (ruleId) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  const saveRule = () => {
    if (editingRule) {
      setRules(rules.map(rule => 
        rule.id === editingRule.id ? { ...newRule, id: editingRule.id } : rule
      ));
    } else {
      setRules([...rules, { ...newRule, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingRule(null);
    setNewRule({
      name: '',
      type: 'keyword',
      category: 'spam',
      description: '',
      enabled: true,
      severity: 'medium',
      action: 'flag',
      keywords: [],
      threshold: 1
    });
  };

  const editRule = (rule) => {
    setEditingRule(rule);
    setNewRule(rule);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push('/content-moderation')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content Moderation
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="mr-3 h-8 w-8" />
              Moderation Rules
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Configure automated spam detection and content filtering rules
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Active Rules ({rules.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {rules.map((rule) => (
            <div key={rule.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-medium text-gray-900">{rule.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rule.severity === 'high' ? 'bg-red-100 text-red-800' :
                      rule.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Type: {rule.type} | Category: {rule.category} | Action: {rule.action} | Threshold: {rule.threshold}
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Keywords: </span>
                    <span className="text-xs text-gray-700">{rule.keywords.join(', ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`p-2 rounded ${
                      rule.enabled ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => editRule(rule)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Rule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingRule ? 'Edit Rule' : 'Add New Rule'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule({...newRule, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="keyword">Keyword</option>
                    <option value="pattern">Pattern</option>
                    <option value="automated">Automated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="spam">Spam</option>
                    <option value="language">Language</option>
                    <option value="fraud">Fraud</option>
                    <option value="harassment">Harassment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={newRule.severity}
                    onChange={(e) => setNewRule({...newRule, severity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <select
                    value={newRule.action}
                    onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="flag">Flag for Review</option>
                    <option value="block">Block Content</option>
                    <option value="warn">Warn User</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={newRule.keywords.join(', ')}
                  onChange={(e) => setNewRule({...newRule, keywords: e.target.value.split(', ').filter(k => k.trim())})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
                <input
                  type="number"
                  min="1"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({...newRule, threshold: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newRule.enabled}
                  onChange={(e) => setNewRule({...newRule, enabled: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Enable this rule</label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveRule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}