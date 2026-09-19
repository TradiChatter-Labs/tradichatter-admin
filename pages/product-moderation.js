import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Package, Flag, CheckCircle, XCircle, Clock, Search, Ban } from 'lucide-react';

export default function ProductModeration() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/moderation/products');
      const json = await res.json();
      if (json.success) setProducts(json.products);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    if (!confirm(`${action} this product?`)) return;
    const res = await fetch('/api/moderation/products', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action })
    });
    const json = await res.json();
    if (json.success) setProducts(products.map(p => p.id === id ? { ...p, status: action === 'approve' ? 'active' : action === 'remove' ? 'removed' : 'suspended' } : p));
  };

  const filtered = products.filter(p => {
    const matchSearch = !searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <Layout><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Moderation</h1>
          <p className="text-sm text-gray-500 mt-1">Review flagged and reported products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><Flag className="h-5 w-5 text-red-600 mr-3" /><div><p className="text-sm text-gray-500">Flagged</p><p className="text-xl font-bold">{products.filter(p => p.status === 'flagged').length}</p></div></div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><Clock className="h-5 w-5 text-yellow-600 mr-3" /><div><p className="text-sm text-gray-500">Pending Review</p><p className="text-xl font-bold">{products.filter(p => p.status === 'pending_review').length}</p></div></div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><Ban className="h-5 w-5 text-gray-600 mr-3" /><div><p className="text-sm text-gray-500">Removed</p><p className="text-xl font-bold">{products.filter(p => p.status === 'removed').length}</p></div></div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><CheckCircle className="h-5 w-5 text-green-600 mr-3" /><div><p className="text-sm text-gray-500">Total</p><p className="text-xl font-bold">{products.length}</p></div></div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2 w-full border rounded-md" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="border rounded-md px-3 py-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All</option><option value="flagged">Flagged</option><option value="pending_review">Pending</option><option value="suspended">Suspended</option><option value="removed">Removed</option>
          </select>
        </div>

        <div className="bg-white shadow rounded-lg divide-y">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No flagged products found</div>
          ) : filtered.map(product => (
            <div key={product.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center"><Package className="h-6 w-6 text-gray-500" /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.businesses?.business_name || 'Unknown business'} • ₦{(product.price || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'flagged' ? 'bg-red-100 text-red-800' : product.status === 'removed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>{product.status}</span>
                  {(product.status === 'flagged' || product.status === 'pending_review') && (
                    <div className="flex space-x-1">
                      <button onClick={() => handleAction(product.id, 'approve')} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                      <button onClick={() => handleAction(product.id, 'remove')} className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Remove</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
