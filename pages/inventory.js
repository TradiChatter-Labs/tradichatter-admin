import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState('add');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = [
        { id: 1, name: 'Product A', sku: 'PA001', stock: 150, minStock: 50, price: 25990, status: 'in_stock' },
        { id: 2, name: 'Product B', sku: 'PB002', stock: 25, minStock: 50, price: 45500, status: 'low_stock' },
        { id: 3, name: 'Product C', sku: 'PC003', stock: 0, minStock: 20, price: 15750, status: 'out_of_stock' },
      ];
      setProducts(mockData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <button 
            onClick={() => {
              setSelectedProduct(null);
              setModalType('add');
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                All Products
              </button>
              <button
                onClick={() => setFilter('in_stock')}
                className={`px-4 py-2 rounded-lg ${filter === 'in_stock' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                In Stock
              </button>
              <button
                onClick={() => setFilter('low_stock')}
                className={`px-4 py-2 rounded-lg ${filter === 'low_stock' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Low Stock
              </button>
              <button
                onClick={() => setFilter('out_of_stock')}
                className={`px-4 py-2 rounded-lg ${filter === 'out_of_stock' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Out of Stock
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.minStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => {
                          setSelectedProduct(product);
                          setModalType('edit');
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Delete ${product.name}?`)) {
                            setProducts(products.filter(p => p.id !== product.id));
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Low Stock Items</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {products.filter(p => p.status === 'low_stock').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Out of Stock</h3>
            <p className="text-3xl font-bold text-red-600">
              {products.filter(p => p.status === 'out_of_stock').length}
            </p>
          </div>
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalType === 'add' ? 'Add Product' : 'Edit Product'}
              </h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Product Name" 
                  defaultValue={selectedProduct?.name || ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input 
                  type="text" 
                  placeholder="SKU" 
                  defaultValue={selectedProduct?.sku || ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input 
                  type="number" 
                  placeholder="Stock Quantity" 
                  defaultValue={selectedProduct?.stock || ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input 
                  type="number" 
                  placeholder="Minimum Stock" 
                  defaultValue={selectedProduct?.minStock || ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input 
                  type="number" 
                  placeholder="Price" 
                  defaultValue={selectedProduct?.price || ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save product logic here
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {modalType === 'add' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back to Business Section */}
        <div className="mt-8">
          <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Business Section
          </Link>
        </div>
      </div>
  );
}