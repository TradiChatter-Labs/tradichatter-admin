import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FinancialDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/financial/stats');
      const json = await res.json();
      if (json.success) setData(json);
      else setError(json.error || 'Failed to load');
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-700 font-medium">Failed to load financial data</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
      <button onClick={fetchData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform financial overview</p>
        </div>
        <button onClick={fetchData} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">₦{(data?.totalRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">In Escrow</h3>
          <p className="text-3xl font-bold text-purple-600">₦{(data?.escrowBalance || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Fees Collected</h3>
          <p className="text-3xl font-bold text-blue-600">₦{(data?.totalFees || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Transactions</h3>
          <p className="text-3xl font-bold text-gray-900">{(data?.totalTransactions || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200"><h3 className="text-lg font-medium text-gray-900">Escrow Statistics</h3></div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-blue-600">{data?.escrowStats?.active || 0}</p></div>
          <div><p className="text-sm text-gray-500">Completed</p><p className="text-2xl font-bold text-green-600">{data?.escrowStats?.completed || 0}</p></div>
          <div><p className="text-sm text-gray-500">Disputed</p><p className="text-2xl font-bold text-red-600">{data?.escrowStats?.disputed || 0}</p></div>
          <div><p className="text-sm text-gray-500">Total Value</p><p className="text-2xl font-bold text-purple-600">₦{(data?.escrowStats?.totalValue || 0).toLocaleString()}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data?.recentTransactions || []).length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No transactions found</td></tr>
              ) : (data?.recentTransactions || []).map((t, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{t.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₦{(t.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${t.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/escrow" className="text-blue-600 hover:text-blue-800 text-sm font-medium">→ Escrow Management</Link>
        <Link href="/payments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">→ Payments</Link>
      </div>
    </div>
  );
}
