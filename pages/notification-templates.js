import { useState } from 'react';
import { useRouter } from 'next/router';
import { Mail, MessageSquare, Bell, Eye, Edit, Save, X, Plus, ArrowLeft } from 'lucide-react';

export default function NotificationTemplates() {
  const router = useRouter();
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Email',
      type: 'email',
      category: 'user_onboarding',
      subject: 'Welcome to TradiChatter!',
      content: 'Welcome {{user_name}}! Your account has been created successfully.',
      variables: ['user_name', 'app_name'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Business Approved',
      type: 'push',
      category: 'business_management',
      subject: 'Business Approved',
      content: 'Congratulations! Your business {{business_name}} has been approved.',
      variables: ['business_name', 'approval_date'],
      status: 'active'
    },
    {
      id: 3,
      name: 'Payment Received',
      type: 'sms',
      category: 'payments',
      subject: 'Payment Confirmation',
      content: 'Payment of ₦{{amount}} received for {{service}}.',
      variables: ['amount', 'service', 'transaction_id'],
      status: 'active'
    },
    {
      id: 4,
      name: 'Order Shipped',
      type: 'push',
      category: 'orders',
      subject: 'Order Shipped',
      content: 'Your order #{{order_id}} has been shipped and is on its way!',
      variables: ['order_id', 'tracking_number'],
      status: 'active'
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  const templateTypes = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'push', label: 'Push Notification', icon: Bell },
    { value: 'sms', label: 'SMS', icon: MessageSquare }
  ];

  const categories = [
    'user_onboarding',
    'business_management', 
    'payments',
    'orders',
    'reviews',
    'system_alerts',
    'marketing'
  ];

  const availableVariables = [
    'user_name', 'business_name', 'amount', 'service', 'app_name', 
    'approval_date', 'transaction_id', 'order_id', 'tracking_number',
    'review_rating', 'product_name', 'customer_name'
  ];

  const handleEdit = (template) => {
    setEditingTemplate({ ...template });
    setPreviewMode(false);
  };

  const handleSave = () => {
    if (editingTemplate.id) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    } else {
      setTemplates([...templates, { ...editingTemplate, id: Date.now() }]);
    }
    setEditingTemplate(null);
    alert('Template saved successfully!');
  };

  const handlePreview = (template) => {
    setEditingTemplate(template);
    setPreviewMode(true);
  };

  const renderPreview = () => {
    if (!editingTemplate) return null;

    let previewContent = editingTemplate.content;
    editingTemplate.variables?.forEach(variable => {
      previewContent = previewContent.replace(`{{${variable}}}`, `[${variable.toUpperCase()}]`);
    });

    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-2">Preview</h4>
        {editingTemplate.type === 'email' && (
          <div className="bg-white border rounded p-3">
            <div className="text-sm text-gray-600 mb-1">Subject: {editingTemplate.subject}</div>
            <div className="text-sm">{previewContent}</div>
          </div>
        )}
        {editingTemplate.type === 'push' && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 max-w-sm">
            <div className="font-medium text-sm">{editingTemplate.subject}</div>
            <div className="text-sm text-gray-700">{previewContent}</div>
          </div>
        )}
        {editingTemplate.type === 'sms' && (
          <div className="bg-green-50 border border-green-200 rounded p-3 max-w-sm">
            <div className="text-sm font-mono">{previewContent}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push('/system-configuration')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to System Configuration
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Mail className="mr-3 h-8 w-8" />
          Notification Templates
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage system notification templates for emails, push notifications, and SMS
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('variables')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'variables'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Variables
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'templates' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Notification Templates ({templates.length})
                </h3>
                <button
                  onClick={() => setEditingTemplate({ 
                    name: '', type: 'email', category: 'user_onboarding', 
                    subject: '', content: '', variables: [], status: 'active' 
                  })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </button>
              </div>

              <div className="space-y-4">
                {templates.map((template) => {
                  const TypeIcon = templateTypes.find(t => t.value === template.type)?.icon || Mail;
                  return (
                    <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <TypeIcon className="h-5 w-5 text-gray-500" />
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-gray-600">{template.subject}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                template.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {template.status}
                              </span>
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {template.category.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePreview(template)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(template)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Variables</h3>
              <p className="text-sm text-gray-600 mb-6">
                Use these variables in your templates by wrapping them in double curly braces: {`{{variable_name}}`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableVariables.map(variable => (
                  <div key={variable} className="p-3 border rounded bg-gray-50">
                    <code className="text-sm font-mono text-blue-600">{`{{${variable}}}`}</code>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {variable.replace('_', ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Preview Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {previewMode ? 'Preview Template' : editingTemplate.id ? 'Edit Template' : 'Create Template'}
              </h2>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {previewMode ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{editingTemplate.name}</h3>
                  <div className="flex space-x-2 mb-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {editingTemplate.type}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {editingTemplate.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                {renderPreview()}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Template Name</label>
                    <input
                      type="text"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={editingTemplate.type}
                      onChange={(e) => setEditingTemplate({...editingTemplate, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {templateTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={editingTemplate.category}
                      onChange={(e) => setEditingTemplate({...editingTemplate, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={editingTemplate.status}
                      onChange={(e) => setEditingTemplate({...editingTemplate, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subject line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template content. Use {{variable_name}} for dynamic content."
                    rows={6}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setPreviewMode(true)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}