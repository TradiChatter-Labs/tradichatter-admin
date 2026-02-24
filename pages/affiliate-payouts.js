import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Clock, CheckCircle, XCircle, DollarSign, Calendar, User } from 'lucide-react';

export default function AffiliatePayouts() {
  const [payouts, setPayouts] = useState([
    {
      id: 'P001',
      affiliateId: 'AF001',
      affiliateName: 'John Smith',
      amount: 45000,
      status: 'pending',
      requestDate: '2024-01-20',
      processedDate: null,
      paymentMethod: 'Bank Transfer',
      accountDetails: '****1234',
      commissions: 18
    },
    {
      id: 'P002',
      affiliateId: 'AF003',
      affiliateName: 'Mike Davis',
      amount: 23000,
      status: 'completed',
      requestDate: '2024-01-15',
      processedDate: '2024-01-18',
      paymentMethod: 'Bank Transfer',
      accountDetails: '****5678',
      commissions: 12
    },
    {
      id: 'P003',
      affiliateId: 'AF004',
      affiliateName: 'Lisa Wilson',
      amount: 38000,
      status: 'processing',
      requestDate: '2024-01-18',
      processedDate: null,
      paymentMethod: 'Mobile Money',
      accountDetails: '****9012',
      commissions: 15
    }
  ]);

  const [selectedPayouts, setSelectedPayouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const handlePayoutAction = (payoutId, action) => {
    setPayouts(payouts.map(payout => 
      payout.id === payoutId 
        ? { ...payout, status: action, processedDate: action === 'completed' ? new Date().toISOString().split('T')[0] : null }
        : payout
    ));
  };

  const handleBulkProcess = () => {
    if (selectedPayouts.length === 0) {
      alert('Please select payouts to process');
      return;
    }
    if (confirm(`Process ${selectedPayouts.length} selected payouts?`)) {
      setPayouts(payouts.map(payout => 
        selectedPayouts.includes(payout.id) && payout.status === 'pending'
          ? { ...payout, status: 'processing' }
          : payout
      ));
      setSelectedPayouts([]);
      alert('Selected payouts have been processed!');
    }
  };

  const handleExportReport = () => {
    const csvData = filteredPayouts.map(p => 
      `${p.id},${p.affiliateName},${p.amount},${p.status},${p.requestDate},${p.paymentMethod}`
    ).join('\n');
    const csvContent = `ID,Affiliate,Amount,Status,Date,Method\n${csvData}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    
    // Use secure download approach
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payout-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && showModal) {
      setShowModal(false);
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || payout.paymentMethod === paymentMethodFilter;
    const matchesDate = !dateFilter || payout.requestDate === dateFilter;
    return matchesStatus && matchesPaymentMethod && matchesDate;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    
    const icons = {
      pending: Clock,
      processing: DollarSign,
      completed: CheckCircle,
      failed: XCircle,
      cancelled: XCircle
    };
    
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalPending = filteredPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalProcessing = filteredPayouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = filteredPayouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  const handleSelectPayout = (payoutId) => {
    setSelectedPayouts(prev => 
      prev.includes(payoutId) 
        ? prev.filter(id => id !== payoutId)
        : [...prev, payoutId]
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Process affiliate payments and manage withdrawal requests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Pending Payouts</dt>
            <dd className="mt-1 text-2xl font-semibold text-yellow-600">₦{totalPending.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Processing</dt>
            <dd className="mt-1 text-2xl font-semibold text-blue-600">₦{totalProcessing.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Completed Today</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">₦{totalCompleted.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Total Requests</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">{payouts.length}</dd>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select 
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Payment Methods</option>
                {[...new Set(payouts.map(p => p.paymentMethod))].map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              />
            </div>
            <div className="flex space-x-2">
              {selectedPayouts.length > 0 && (
                <button
                  onClick={handleBulkProcess}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Process Selected ({selectedPayouts.length})
                </button>
              )}
              <button 
                onClick={handleExportReport}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Payout Requests</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredPayouts.map((payout) => (
            <li key={payout.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPayouts.includes(payout.id)}
                      onChange={() => handleSelectPayout(payout.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-4"
                    />
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">#{payout.id}</p>
                        <span className="ml-2 text-sm text-gray-500">-</span>
                        <p className="ml-2 text-sm font-medium text-gray-900">₦{payout.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center">
                          <User className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">{payout.affiliateName}</p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500">{payout.paymentMethod}</p>
                          <span className="mx-1 text-gray-300">•</span>
                          <p className="text-sm text-gray-500">{payout.accountDetails}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{payout.commissions} commissions</p>
                      <p className="text-sm text-gray-500">Avg: ₦{Math.round(payout.amount / payout.commissions).toLocaleString()}</p>
                    </div>
                    {getStatusBadge(payout.status)}
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">Requested: {payout.requestDate}</p>
                    </div>
                    {payout.processedDate && (
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">Processed: {payout.processedDate}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedPayout(payout);
                        setShowModal(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                    >
                      View Details
                    </button>
                    {payout.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => {
                            if (confirm('Approve this payout?')) {
                              handlePayoutAction(payout.id, 'processing');
                            }
                          }}
                          className="text-xs text-green-600 hover:text-green-500 font-medium"
                        >
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          Approve
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Reject this payout?')) {
                              handlePayoutAction(payout.id, 'cancelled');
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-500 font-medium"
                        >
                          <XCircle className="h-3 w-3 inline mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    {payout.status === 'processing' && (
                      <button 
                        onClick={() => {
                          if (confirm('Mark complete?')) {
                            handlePayoutAction(payout.id, 'completed');
                          }
                        }}
                        className="text-xs text-green-600 hover:text-green-500 font-medium"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Payout Summary */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payout Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">₦{totalPending.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Awaiting Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">₦{totalProcessing.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Currently Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₦{totalCompleted.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Completed Today</div>
          </div>
        </div>
      </div>

      {/* Payout Detail Modal */}
      {showModal && selectedPayout && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" role="dialog" aria-modal="true" aria-labelledby="payout-modal-title" onKeyDown={handleKeyDown}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 id="payout-modal-title" className="text-lg font-medium text-gray-900 mb-4">Payout Details</h3>
            <div className="space-y-3">
              <div><strong>ID:</strong> {selectedPayout.id}</div>
              <div><strong>Affiliate:</strong> {selectedPayout.affiliateName}</div>
              <div><strong>Amount:</strong> ₦{selectedPayout.amount.toLocaleString()}</div>
              <div><strong>Commissions:</strong> {selectedPayout.commissions}</div>
              <div><strong>Average:</strong> ₦{Math.round(selectedPayout.amount / selectedPayout.commissions).toLocaleString()}</div>
              <div><strong>Payment Method:</strong> {selectedPayout.paymentMethod}</div>
              <div><strong>Account:</strong> {selectedPayout.accountDetails}</div>
              <div><strong>Status:</strong> {getStatusBadge(selectedPayout.status)}</div>
              <div><strong>Request Date:</strong> {selectedPayout.requestDate}</div>
              {selectedPayout.processedDate && (
                <div><strong>Processed Date:</strong> {selectedPayout.processedDate}</div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {selectedPayout.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      if (confirm(`Approve payout for ${selectedPayout.affiliateName}?`)) {
                        handlePayoutAction(selectedPayout.id, 'processing');
                        setShowModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Reject payout for ${selectedPayout.affiliateName}?`)) {
                        handlePayoutAction(selectedPayout.id, 'cancelled');
                        setShowModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
              {selectedPayout.status === 'processing' && (
                <button
                  onClick={() => {
                    if (confirm(`Mark payout as complete for ${selectedPayout.affiliateName}?`)) {
                      handlePayoutAction(selectedPayout.id, 'completed');
                      setShowModal(false);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Mark Complete
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