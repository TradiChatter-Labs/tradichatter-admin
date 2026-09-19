import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, CreditCard, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function SellerSubaccounts() {
  const [subaccounts, setSubaccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchSubaccounts(); }, []);

  const fetchSubaccounts = async () => {
    try {
      const res = await fetch('/api/seller-subaccounts');
      const json = await res.json();
      if (json.success) setSubaccounts(json.subaccounts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = subaccounts.filter(s => {
    const matchSearch = !searchTerm || s.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <Layout><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Subaccounts</h1>
          <p className="text-sm text-gray-500 mt-1">Flutterwave subaccounts for payment splits</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><CreditCard className="h-6 w-6 text-blue-600 mr-3" /><div><p className="text-sm text-gray-500">Total</p><p className="text-xl font-bold">{subaccounts.length}</p></div></div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><CheckCircle className="h-6 w-6 text-green-600 mr-3" /><div><p className="text-sm text-gray-500">Active</p><p className="text-xl font-bold">{subaccounts.filter(s => s.status === 'active').length}</p></div></div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center"><Clock className="h-6 w-6 text-yellow-600 mr-3" /><div><p className="text-sm text-gray-500">Pending</p><p className="text-xl font-bold">{subaccounts.filter(s => s.status !== 'active').length}</p></div></div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-full border rounded-md" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="border rounded-md px-3 py-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All</option><option value="active">Active</option><option value="pending">Pending</option>
          </select>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subaccount ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No subaccounts found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.business_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{s.sub_account_id || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.bank_code} - {s.account_number}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${s.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{s.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.created_at?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
