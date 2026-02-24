import { useState } from 'react';
import { useRouter } from 'next/router';
import { Shield, ArrowLeft, Search, Eye, Trash2, AlertTriangle } from 'lucide-react';

export default function ContentTakedown() {
  const router = useRouter();
  const [content, setContent] = useState([
    {
      id: 1,
      type: 'message',
      content: 'Selling fake designer bags at cheap prices! Contact me now!',
      user: 'scammer123',
      business: null,
      timestamp: '2024-01-15T10:30:00',
      status: 'active',
      violations: ['Counterfeit goods', 'Spam'],
      reportCount: 5
    },
    {
      id: 2,
      type: 'business',
      content: 'Fake Electronics Store - We sell original Apple products at 50% off!',
      user: 'fakestore',
      business: 'Fake Electronics Store',
      timestamp: '2024-01-14T15:20:00',
      status: 'active',
      violations: ['Fraudulent business', 'Misleading claims'],
      reportCount: 12
    },
    {
      id: 3,
      type: 'review',
      content: 'This business is terrible and the owner is a criminal!',
      user: 'angry_customer',
      business: 'Legitimate Store',
      timestamp: '2024-01-13T09:45:00',
      status: 'removed',
      violations: ['Defamation', 'False accusations'],
      reportCount: 3
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContent, setSelectedContent] = useState(null);

  const takedownContent = (contentId, reason) => {
    setContent(content.map(item => 
      item.id === contentId ? { ...item, status: 'removed', takedownReason: reason } : item
    ));
    setSelectedContent(null);
    alert('Content has been taken down successfully!');
  };

  const restoreContent = (contentId) => {
    setContent(content.map(item => 
      item.id === contentId ? { ...item, status: 'active' } : item
    ));
    alert('Content has been restored successfully!');
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="mr-3 h-8 w-8" />
          Content Takedown Tools
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Remove inappropriate content and manage policy violations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="message">Messages</option>
            <option value="business">Businesses</option>
            <option value="review">Reviews</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="removed">Removed</option>
          </select>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Content Items ({filteredContent.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredContent.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {item.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      {item.reportCount} reports
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-2">{item.content}</p>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    User: {item.user} {item.business && `| Business: ${item.business}`} | 
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-600">
                      Violations: {item.violations.join(', ')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedContent(item)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {item.status === 'active' ? (
                    <button
                      onClick={() => takedownContent(item.id, 'Policy violation')}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => restoreContent(item.id)}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Content Details</h2>
              <button
                onClick={() => setSelectedContent(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <p className="text-sm text-gray-900 capitalize">{selectedContent.type}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedContent.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="text-sm text-gray-900">{selectedContent.user}</p>
                </div>
                {selectedContent.business && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business</label>
                    <p className="text-sm text-gray-900">{selectedContent.business}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Violations</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedContent.violations.map((violation, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                      {violation}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Report Count</label>
                <p className="text-sm text-gray-900">{selectedContent.reportCount} reports</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                <p className="text-sm text-gray-900">{new Date(selectedContent.timestamp).toLocaleString()}</p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                {selectedContent.status === 'active' ? (
                  <>
                    <button
                      onClick={() => setSelectedContent(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => takedownContent(selectedContent.id, 'Manual review - policy violation')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Take Down Content
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => restoreContent(selectedContent.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Restore Content
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}