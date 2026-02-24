import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EscrowManagement() {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEscrows();
  }, []);

  const fetchEscrows = async () => {
    try {
      // Mock escrow data - replace with actual API call
      const mockData = [
        { 
          id: 'ESC001', 
          buyerName: 'John Doe', 
          sellerName: 'Tech Store Lagos',
          amount: 45000, 
          status: 'active', 
          createdAt: '2024-01-15',
          releaseDate: '2024-01-22',
          description: 'iPhone 13 Pro Max'
        },
        { 
          id: 'ESC002', 
          buyerName: 'Jane Smith', 
          sellerName: 'Fashion Hub',
          amount: 25000, 
          status: 'disputed', 
          createdAt: '2024-01-14',
          releaseDate: '2024-01-21',
          description: 'Designer Handbag'
        },
        { 
          id: 'ESC003', 
          buyerName: 'Mike Johnson', 
          sellerName: 'Food Corner',
          amount: 12000, 
          status: 'completed', 
          createdAt: '2024-01-10',
          releaseDate: '2024-01-17',
          description: 'Catering Service'
        }
      ];
      setEscrows(mockData);
    } catch (error) {
      console.error('Error fetching escrows:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEscrows = escrows.filter(escrow => {
    if (filter === 'all') return true;
    return escrow.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResolveDispute = (escrowId) => {
    if (confirm('Resolve this dispute? This action cannot be undone.')) {
      setEscrows(escrows.map(e => 
        e.id === escrowId ? { ...e, status: 'completed' } : e
      ));
    }
  };

  const handleReleaseEscrow = (escrowId) => {
    if (confirm('Release this escrow to the seller?')) {
      setEscrows(escrows.map(e => 
        e.id === escrowId ? { ...e, status: 'completed' } : e
      ));
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
        <h1 className="text-2xl font-bold text-gray-900">🛡️ Escrow Management</h1>
        <button 
          onClick={() => {
            const csv = 'Escrow ID,Buyer,Seller,Amount,Description,Status,Release Date\n' + 
              escrows.map(e => `${e.id},${e.buyerName},${e.sellerName},${e.amount},${e.description},${e.status},${e.releaseDate}`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `escrow-report-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Escrows</h3>
          <p className="text-3xl font-bold text-blue-600">{escrows.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active</h3>
          <p className="text-3xl font-bold text-blue-600">
            {escrows.filter(esc => esc.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Disputed</h3>
          <p className="text-3xl font-bold text-red-600">
            {escrows.filter(esc => esc.status === 'disputed').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-green-600">
            ₦{escrows.reduce((sum, esc) => sum + esc.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All Escrows
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('disputed')}
              className={`px-4 py-2 rounded-lg ${filter === 'disputed' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Disputed
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escrow ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Release Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEscrows.map((escrow) => (
                <tr key={escrow.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {escrow.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {escrow.buyerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {escrow.sellerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{escrow.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {escrow.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(escrow.status)}`}>
                      {escrow.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {escrow.releaseDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {escrow.status === 'disputed' && (
                      <button 
                        onClick={() => handleResolveDispute(escrow.id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        Resolve
                      </button>
                    )}
                    {escrow.status === 'active' && (
                      <button 
                        onClick={() => handleReleaseEscrow(escrow.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Release
                      </button>
                    )}
                    <Link href={`/escrow-details?id=${escrow.id}`} className="text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back to Business Section */}
      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}