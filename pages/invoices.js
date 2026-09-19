import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchInvoices(); }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      const json = await res.json();
      if (json.success) setInvoices(json.invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => filter === 'all' || inv.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-sm text-gray-500 mt-1">{invoices.length} total invoices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold text-blue-600">{invoices.length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Paid</p><p className="text-2xl font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">{invoices.filter(i => i.status === 'pending').length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Total Value</p><p className="text-2xl font-bold text-purple-600">₦{invoices.reduce((s, i) => s + (i.total || 0), 0).toLocaleString()}</p></div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex space-x-2">
            {['all', 'paid', 'pending', 'overdue'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No invoices found</td></tr>
                ) : filteredInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.id?.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{inv.business_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{inv.customer_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₦{(inv.total || 0).toLocaleString()}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inv.status)}`}>{inv.status}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{inv.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
