import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const WithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  useEffect(() => {
    filterWithdrawals();
  }, [withdrawals, searchQuery, statusFilter]);

  const loadWithdrawals = () => {
    const mockWithdrawals = [
      {
        id: 'WD001',
        userId: 'user123',
        userName: 'John Doe',
        amount: 500000,
        method: 'Bank Transfer',
        accountDetails: '**** 1234',
        status: 'pending',
        requestDate: '2024-01-15',
        processedDate: null,
        fees: 5000,
        netAmount: 495000
      },
      {
        id: 'WD002',
        userId: 'user456',
        userName: 'Jane Smith',
        amount: 1200000,
        method: 'PayPal',
        accountDetails: 'jane@email.com',
        status: 'approved',
        requestDate: '2024-01-14',
        processedDate: '2024-01-15',
        fees: 12000,
        netAmount: 1188000
      },
      {
        id: 'WD003',
        userId: 'user789',
        userName: 'Mike Johnson',
        amount: 300000,
        method: 'Crypto',
        accountDetails: '1A1z...Nx7B',
        status: 'rejected',
        requestDate: '2024-01-13',
        processedDate: '2024-01-14',
        fees: 0,
        netAmount: 300000,
        rejectionReason: 'Insufficient verification'
      }
    ];
    setWithdrawals(mockWithdrawals);
  };

  const filterWithdrawals = () => {
    let filtered = withdrawals;

    if (searchQuery) {
      filtered = filtered.filter(withdrawal =>
        withdrawal.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(withdrawal => withdrawal.status === statusFilter);
    }

    setFilteredWithdrawals(filtered);
  };

  const handleStatusUpdate = (withdrawalId, newStatus) => {
    if (confirm(`Are you sure you want to ${newStatus} this withdrawal?`)) {
      setWithdrawals(prev => prev.map(w => 
        w.id === withdrawalId 
          ? { ...w, status: newStatus, processedDate: new Date().toISOString().split('T')[0] }
          : w
      ));
      setModalVisible(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Withdrawals Management</h1>
          <p className="text-gray-600 mt-2">Manage user withdrawal requests and payments</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search withdrawals..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Withdrawal ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {withdrawal.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{withdrawal.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.requestDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedWithdrawal(withdrawal);
                          setModalVisible(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Details
                      </button>
                      {withdrawal.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(withdrawal.id, 'approved')}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(withdrawal.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {modalVisible && selectedWithdrawal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Withdrawal Details</h3>
                  <button
                    onClick={() => setModalVisible(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">ID:</span>
                    <span>{selectedWithdrawal.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">User:</span>
                    <span>{selectedWithdrawal.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span>₦{selectedWithdrawal.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fees:</span>
                    <span>₦{selectedWithdrawal.fees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Net Amount:</span>
                    <span>₦{selectedWithdrawal.netAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Method:</span>
                    <span>{selectedWithdrawal.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Account:</span>
                    <span>{selectedWithdrawal.accountDetails}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`font-semibold ${getStatusColor(selectedWithdrawal.status).split(' ')[0]}`}>
                      {selectedWithdrawal.status.toUpperCase()}
                    </span>
                  </div>
                  {selectedWithdrawal.rejectionReason && (
                    <div className="flex justify-between">
                      <span className="font-medium">Rejection Reason:</span>
                      <span>{selectedWithdrawal.rejectionReason}</span>
                    </div>
                  )}
                </div>

                {selectedWithdrawal.status === 'pending' && (
                  <div className="flex justify-center space-x-4 mt-6">
                    <button
                      onClick={() => handleStatusUpdate(selectedWithdrawal.id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedWithdrawal.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
};

export default WithdrawalsPage;