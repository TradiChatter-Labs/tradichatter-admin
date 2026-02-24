import { useState } from 'react';
import Link from 'next/link';
import { Package, Flag, Eye, Ban, CheckCircle, XCircle, Clock, AlertTriangle, Search, Filter } from 'lucide-react';

export default function ProductModeration() {
  const [flaggedProducts, setFlaggedProducts] = useState([
    {
      id: 1,
      productId: 'prod_001',
      productName: 'iPhone 14 Pro Max - Original',
      businessName: 'Tech Solutions Ltd',
      businessId: 'biz_123',
      flaggedBy: 'user456',
      flagReason: 'Counterfeit Product',
      flagDetails: 'Product images show signs of being fake. Price too low for genuine product.',
      flaggedDate: '2024-01-20',
      status: 'pending',
      severity: 'high',
      price: 450000,
      category: 'Electronics',
      images: ['/products/iphone1.jpg', '/products/iphone2.jpg'],
      reportCount: 3,
      autoFlagScore: 85
    },
    {
      id: 2,
      productId: 'prod_002',
      productName: 'Miracle Weight Loss Pills',
      businessName: 'Health Store',
      businessId: 'biz_456',
      flaggedBy: 'system',
      flagReason: 'Prohibited Content',
      flagDetails: 'Product contains medical claims without proper certification.',
      flaggedDate: '2024-01-19',
      status: 'pending',
      severity: 'critical',
      price: 15000,
      category: 'Health',
      images: ['/products/pills1.jpg'],
      reportCount: 7,
      autoFlagScore: 95
    },
    {
      id: 3,
      productId: 'prod_003',
      productName: 'Designer Handbag - Luxury',
      businessName: 'Fashion Hub',
      businessId: 'biz_789',
      flaggedBy: 'user789',
      flagReason: 'Copyright Violation',
      flagDetails: 'Using branded logos without authorization.',
      flaggedDate: '2024-01-18',
      status: 'resolved',
      severity: 'medium',
      price: 85000,
      category: 'Fashion',
      images: ['/products/bag1.jpg'],
      reportCount: 2,
      autoFlagScore: 70
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [autoFlaggingEnabled, setAutoFlaggingEnabled] = useState(true);
  const [flaggingRules, setFlaggingRules] = useState({
    priceAnomalyDetection: true,
    imageAnalysis: true,
    textAnalysis: true,
    brandProtection: true,
    categoryMismatch: true,
    duplicateDetection: true
  });
  const [autoFlagStats, setAutoFlagStats] = useState({
    productsScanned: 2847,
    autoFlagged: 156,
    falsePositives: 12,
    accuracy: 92.3,
    avgProcessingTime: '0.8s'
  });

  const filteredProducts = flaggedProducts.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || product.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleProductAction = (productId, action) => {
    setFlaggedProducts(products => 
      products.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              status: action === 'approve' ? 'resolved' : 
                     action === 'remove' ? 'removed' : 
                     action === 'suspend' ? 'suspended' : product.status
            }
          : product
      )
    );
    setShowProductModal(false);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'removed': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatusBadge = ({ status }) => {
    const icons = { 
      pending: Clock, 
      resolved: CheckCircle, 
      removed: XCircle, 
      suspended: Ban 
    };
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Product & Content Moderation</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review flagged products, manage violations, and maintain platform quality standards.
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-5 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Flag className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Flagged Products</p>
              <p className="text-lg font-semibold text-gray-900">{flaggedProducts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <p className="text-lg font-semibold text-gray-900">
                {flaggedProducts.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Critical Issues</p>
              <p className="text-lg font-semibold text-gray-900">
                {flaggedProducts.filter(p => p.severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Ban className="h-6 w-6 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Removed</p>
              <p className="text-lg font-semibold text-gray-900">
                {flaggedProducts.filter(p => p.status === 'removed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-lg font-semibold text-gray-900">
                {flaggedProducts.filter(p => p.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Automated Flagging System */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Automated Flagging System</h3>
            <button
              onClick={() => setAutoFlaggingEnabled(!autoFlaggingEnabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                autoFlaggingEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                autoFlaggingEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{autoFlagStats.productsScanned.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Products Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{autoFlagStats.autoFlagged}</div>
              <div className="text-sm text-gray-500">Auto-Flagged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{autoFlagStats.falsePositives}</div>
              <div className="text-sm text-gray-500">False Positives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{autoFlagStats.accuracy}%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{autoFlagStats.avgProcessingTime}</div>
              <div className="text-sm text-gray-500">Avg Processing</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Detection Rules</h4>
              <div className="space-y-2">
                {Object.entries(flaggingRules).map(([rule, enabled]) => (
                  <div key={rule} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {rule.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <button
                      onClick={() => setFlaggingRules(prev => ({ ...prev, [rule]: !enabled }))}
                      className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        enabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        enabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  Bulk approve low-risk flags
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  Export flagged products
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  Update detection models
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• 23 products auto-flagged in last hour</div>
                <div>• 5 false positives corrected</div>
                <div>• Brand protection rule updated</div>
                <div>• 12 duplicate products detected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products or businesses..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="removed">Removed</option>
          <option value="suspended">Suspended</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Flagged Products List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                        <StatusBadge status={product.status} />
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(product.severity)}`}>
                          {product.severity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{product.businessName}</div>
                      <div className="text-sm text-gray-500">
                        ₦{product.price.toLocaleString()} • {product.category}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Flagged: {product.flagReason} • Reports: {product.reportCount} • Score: {product.autoFlagScore}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </button>
                    
                    {product.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleProductAction(product.id, 'approve')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleProductAction(product.id, 'remove')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Product Review</h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Product Details</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product Name:</label>
                    <p className="text-sm text-gray-900">{selectedProduct.productName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business:</label>
                    <p className="text-sm text-gray-900">{selectedProduct.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Price:</label>
                    <p className="text-sm text-gray-900">₦{selectedProduct.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category:</label>
                    <p className="text-sm text-gray-900">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Auto-Flag Score:</label>
                    <p className="text-sm text-gray-900">{selectedProduct.autoFlagScore}%</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Flag Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Flagged By:</label>
                    <p className="text-sm text-gray-900">{selectedProduct.flaggedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reason:</label>
                    <p className="text-sm text-gray-900">{selectedProduct.flagReason}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Details:</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedProduct.flagDetails}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Report Count:</label>
                    <p className="text-sm text-gray-900">{selectedProduct.reportCount}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Severity:</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedProduct.severity)}`}>
                      {selectedProduct.severity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Product Images</h4>
              <div className="grid grid-cols-3 gap-4">
                {selectedProduct.images.map((image, index) => (
                  <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                    <div className="text-center">
                      <Package className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="text-xs text-gray-500 mt-1">Image {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {selectedProduct.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleProductAction(selectedProduct.id, 'approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve Product
                  </button>
                  <button
                    onClick={() => handleProductAction(selectedProduct.id, 'suspend')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Suspend Product
                  </button>
                  <button
                    onClick={() => handleProductAction(selectedProduct.id, 'remove')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove Product
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/content-moderation" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Content Moderation
        </Link>
      </div>
    </div>
  );
}