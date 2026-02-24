import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FinancialDashboard() {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // Mock financial data - replace with actual API call
      const mockData = {
        totalBalance: 2480000,
        availableBalance: 1250000,
        pendingBalance: 450000,
        escrowBalance: 780000,
        totalTransactions: 1247,
        totalWithdrawals: 89,
        totalFees: 139500,
        recentTransactions: [
          { id: 'TXN001', type: 'Payment', amount: 25000, status: 'Completed', date: '2024-01-15' },
          { id: 'TXN002', type: 'Withdrawal', amount: -15000, status: 'Processing', date: '2024-01-14' },
          { id: 'TXN003', type: 'Escrow Release', amount: 45000, status: 'Completed', date: '2024-01-13' }
        ],
        escrowStats: {
          active: 45,
          completed: 234,
          disputed: 3,
          totalValue: 780000
        },
        withdrawalStats: {
          pending: 12,
          completed: 77,
          totalAmount: 4500000
        }
      };
      setFinancialData(mockData);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
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
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">💰 Financial Dashboard</h1>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Export Report
        </button>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-green-600">₦{financialData?.totalBalance?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Available</h3>
          <p className="text-3xl font-bold text-blue-600">₦{financialData?.availableBalance?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">₦{financialData?.pendingBalance?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">In Escrow</h3>
          <p className="text-3xl font-bold text-purple-600">₦{financialData?.escrowBalance?.toLocaleString()}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-gray-900">{financialData?.totalTransactions?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Withdrawals</h3>
          <p className="text-3xl font-bold text-gray-900">{financialData?.totalWithdrawals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Fees Collected</h3>
          <p className="text-3xl font-bold text-green-600">₦{financialData?.totalFees?.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Transactions */}
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
              {financialData?.recentTransactions?.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{Math.abs(transaction.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escrow & Withdrawal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">🛡️ Escrow Statistics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Active Escrows</p>
                <p className="text-2xl font-bold text-blue-600">{financialData?.escrowStats?.active}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{financialData?.escrowStats?.completed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Disputed</p>
                <p className="text-2xl font-bold text-red-600">{financialData?.escrowStats?.disputed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">₦{financialData?.escrowStats?.totalValue?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">💸 Withdrawal Statistics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{financialData?.withdrawalStats?.pending}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{financialData?.withdrawalStats?.completed}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">₦{financialData?.withdrawalStats?.totalAmount?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}