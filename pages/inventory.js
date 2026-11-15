import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchInventory(); }, [filter]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (filter !== 'all') params.set('status', filter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/moderation/products?${params}`);
      const json = await res.json();
      if (json.success) { setProducts(json.products); setTotal(json.total); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    const res = await fetch('/api/moderation/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    const json = await res.json();
    if (json.success) fetchInventory();
  };

  const statusColor = (s) => ({
    active: 'text-green-600 bg-green-100',
    flagged: 'text-yellow-600 bg-yellow-100',
    suspended: 'text-orange-600 bg-orange-100',
    removed: 'text-red-600 bg-red-100',
    pending_review: 'text-blue-600 bg-blue-100',
  }[s] || 'text-gray-600 bg-gray-100');

  const inStock = products.filter(p => p.stock_quantity > 0).length;
  const lowStock = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= (p.min_stock || 10)).length;
  const outOfStock = products.filter(p => p.stock_quantity === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">Platform-wide product inventory overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-sm font-medium text-gray-500">Total Products</h3><p className="text-3xl font-bold text-blue-600">{total}</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-sm font-medium text-gray-500">In Stock</h3><p className="text-3xl font-bold text-green-600">{inStock}</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-sm font-medium text-gray-500">Low Stock</h3><p className="text-3xl font-bold text-yellow-600">{lowStock}</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-sm font-medium text-gray-500">Out of Stock</h3><p className="text-3xl font-bold text-red-600">{outOfStock}</p></div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {['all', 'flagged', 'pending_review', 'suspended', 'removed'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchInventory()} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
            <button onClick={fetchInventory} className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Search</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No products found{filter !== 'all' ? ` with status "${filter}"` : ''}.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.businesses?.business_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₦{(p.price || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{p.stock_quantity ?? '—'}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor(p.status)}`}>{p.status?.replace('_', ' ')}</span></td>
                    <td className="px-6 py-4 text-sm font-medium flex gap-2">
                      {p.status !== 'active' && <button onClick={() => handleAction(p.id, 'approve')} className="text-green-600 hover:text-green-800">Approve</button>}
                      {p.status === 'active' && <button onClick={() => handleAction(p.id, 'suspend')} className="text-orange-600 hover:text-orange-800">Suspend</button>}
                      {p.status !== 'removed' && <button onClick={() => handleAction(p.id, 'remove')} className="text-red-600 hover:text-red-800">Remove</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">← Back to Business Section</Link>
      </div>
    </div>
  );
}
