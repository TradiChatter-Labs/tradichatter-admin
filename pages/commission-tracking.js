import { useState } from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, Calendar, User, Eye } from 'lucide-react';

export default function CommissionTracking() {
  const [commissions, setCommissions] = useState([
    {
      id: 'C001',
      affiliateId: 'AF001',
      affiliateName: 'John Smith',
      referralId: 'R123',
      customerName: 'Alice Brown',
      orderValue: 25000,
      commissionRate: 10,
      commissionAmount: 2500,
      status: 'paid',
      date: '2024-01-15',
      paymentDate: '2024-01-20'
    },
    {
      id: 'C002',
      affiliateId: 'AF001',
      affiliateName: 'John Smith',
      referralId: 'R124',
      customerName: 'Bob Wilson',
      orderValue: 15000,
      commissionRate: 10,
      commissionAmount: 1500,
      status: 'pending',
      date: '2024-01-18',
      paymentDate: null
    },
    {
      id: 'C003',
      affiliateId: 'AF003',
      affiliateName: 'Mike Davis',
      referralId: 'R125',
      customerName: 'Carol Johnson',
      orderValue: 30000,
      commissionRate: 8,
      commissionAmount: 2400,
      status: 'processing',
      date: '2024-01-16',
      paymentDate: null
    }
  ]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAffiliate, setFilterAffiliate] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);

  const handleProcessPayment = (commissionId) => {
    setCommissions(commissions.map(commission => 
      commission.id === commissionId 
        ? { ...commission, status: 'paid', paymentDate: new Date().toISOString().split('T')[0] }
        : commission
    ));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && showModal) {
      setShowModal(false);
    }
  };

  const filteredCommissions = commissions.filter(commission => {
    const matchesStatus = filterStatus === 'all' || commission.status === filterStatus;
    const matchesAffiliate = filterAffiliate === 'all' || commission.affiliateName === filterAffiliate;
    const matchesDate = !filterDate || commission.date === filterDate;
    return matchesStatus && matchesAffiliate && matchesDate;
  });

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalCommissions = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const paidCommissions = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Commission Tracking</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track affiliate commissions and earnings across all referrals.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Total Commissions</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">₦{totalCommissions.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Paid Out</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">₦{paidCommissions.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Pending</dt>
            <dd className="mt-1 text-2xl font-semibold text-yellow-600">₦{pendingCommissions.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Avg Commission</dt>
            <dd className="mt-1 text-2xl font-semibold text-blue-600">₦{Math.round(totalCommissions / commissions.length).toLocaleString()}</dd>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
            </select>
            <select 
              value={filterAffiliate}
              onChange={(e) => setFilterAffiliate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Affiliates</option>
              {[...new Set(commissions.map(c => c.affiliateName))].map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Commission History</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredCommissions.map((commission) => (
            <li key={commission.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">#{commission.id}</p>
                        <span className="ml-2 text-sm text-gray-500">-</span>
                        <p className="ml-2 text-sm font-medium text-gray-900">₦{commission.commissionAmount.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center">
                          <User className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">{commission.affiliateName}</p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500">Customer: {commission.customerName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₦{commission.orderValue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{commission.commissionRate}% rate</p>
                    </div>
                    {getStatusBadge(commission.status)}
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">Order: {commission.date}</p>
                    </div>
                    {commission.paymentDate && (
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">Paid: {commission.paymentDate}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">Referral: {commission.referralId}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedCommission(commission);
                        setShowModal(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                    >
                      <Eye className="h-3 w-3 inline mr-1" />
                      View Details
                    </button>
                    {commission.status === 'pending' && (
                      <button 
                        onClick={() => {
                          if (confirm('Process payment for this commission?')) {
                            handleProcessPayment(commission.id);
                          }
                        }}
                        className="text-xs text-green-600 hover:text-green-500 font-medium"
                      >
                        Process Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Commission Detail Modal */}
      {showModal && selectedCommission && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" role="dialog" aria-modal="true" aria-labelledby="commission-modal-title" onKeyDown={handleKeyDown}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 id="commission-modal-title" className="text-lg font-medium text-gray-900 mb-4">Commission Details</h3>
            <div className="space-y-3">
              <div><strong>Commission ID:</strong> {selectedCommission.id}</div>
              <div><strong>Affiliate:</strong> {selectedCommission.affiliateName}</div>
              <div><strong>Customer:</strong> {selectedCommission.customerName}</div>
              <div><strong>Referral ID:</strong> {selectedCommission.referralId}</div>
              <div><strong>Order Value:</strong> ₦{selectedCommission.orderValue.toLocaleString()}</div>
              <div><strong>Commission Rate:</strong> {selectedCommission.commissionRate}%</div>
              <div><strong>Commission Amount:</strong> ₦{selectedCommission.commissionAmount.toLocaleString()}</div>
              <div><strong>Status:</strong> {getStatusBadge(selectedCommission.status)}</div>
              <div><strong>Order Date:</strong> {selectedCommission.date}</div>
              {selectedCommission.paymentDate && (
                <div><strong>Payment Date:</strong> {selectedCommission.paymentDate}</div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {selectedCommission.status === 'pending' && (
                <button
                  onClick={() => {
                    handleProcessPayment(selectedCommission.id);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Process Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to Affiliate Section */}
      <div className="mt-8">
        <Link href="/affiliate-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Affiliate Section
        </Link>
      </div>
    </div>
  );
}