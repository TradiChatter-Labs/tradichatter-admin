import { useState } from 'react';
import Link from 'next/link';
import { Search, CreditCard, DollarSign, AlertTriangle, CheckCircle, XCircle, Eye, Download } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([
    {
      id: 'PAY-001',
      orderId: 'ORD-2024-001',
      businessName: 'Tech Solutions Ltd',
      customerName: 'John Doe',
      amount: 25000,
      currency: 'NGN',
      status: 'completed',
      method: 'paystack',
      date: '2024-01-19',
      escrowStatus: 'released',
      fees: 750
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-2024-002',
      businessName: 'Fashion Hub',
      customerName: 'Jane Smith',
      amount: 15000,
      currency: 'NGN',
      status: 'pending',
      method: 'flutterwave',
      date: '2024-01-19',
      escrowStatus: 'held',
      fees: 450
    },
    {
      id: 'PAY-003',
      orderId: 'ORD-2024-003',
      businessName: 'Green Farm Ltd',
      customerName: 'Mike Johnson',
      amount: 8500,
      currency: 'NGN',
      status: 'failed',
      method: 'paystack',
      date: '2024-01-18',
      escrowStatus: 'none',
      fees: 0,
      failureReason: 'Insufficient funds'
    }
  ]);

  const [disputes, setDisputes] = useState([
    {
      id: 'DIS-001',
      paymentId: 'PAY-001',
      orderId: 'ORD-2024-001',
      customerName: 'John Doe',
      businessName: 'Tech Solutions Ltd',
      amount: 25000,
      reason: 'Product not delivered',
      status: 'open',
      date: '2024-01-20',
      priority: 'high'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('payments');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const StatusBadge = ({ status, type = 'payment' }) => {
    const paymentColors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };

    const disputeColors = {
      open: 'bg-red-100 text-red-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    
    const colors = type === 'payment' ? paymentColors : disputeColors;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleRefund = (paymentId) => {
    setPayments(payments => 
      payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'refunded' }
          : payment
      )
    );
  };

  const handleDisputeStatus = (disputeId, newStatus) => {
    setDisputes(disputes => 
      disputes.map(dispute => 
        dispute.id === disputeId 
          ? { ...dispute, status: newStatus }
          : dispute
      )
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor transactions, handle disputes, and manage payment operations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">₦48,500</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">1</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Failed</dt>
                  <dd className="text-lg font-medium text-gray-900">1</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Disputes</dt>
                  <dd className="text-lg font-medium text-gray-900">1</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'disputes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Disputes
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {activeTab === 'payments' && (
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        )}

        <button 
          onClick={() => {
            const data = activeTab === 'payments' ? filteredPayments : filteredDisputes;
            const csv = activeTab === 'payments' 
              ? 'ID,Business,Customer,Amount,Status,Method,Date\n' + data.map(p => `${p.id},${p.businessName},${p.customerName},${p.amount},${p.status},${p.method},${p.date}`).join('\n')
              : 'ID,Business,Customer,Amount,Reason,Status,Date\n' + data.map(d => `${d.id},${d.businessName},${d.customerName},${d.amount},${d.reason},${d.status},${d.date}`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Content */}
      {activeTab === 'payments' ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <li key={payment.id}>
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                          <div className="ml-2">
                            <StatusBadge status={payment.status} />
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{payment.businessName} → {payment.customerName}</div>
                        <div className="text-sm text-gray-500">Order: {payment.orderId}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                        <div className="text-sm text-gray-500">{payment.method} • {payment.date}</div>
                        <div className="text-sm text-gray-500">Fees: {formatCurrency(payment.fees)}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowPaymentModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        
                        {payment.status === 'completed' && (
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to process a refund for this payment?')) {
                                handleRefund(payment.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Process Refund"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {payment.status === 'failed' && payment.failureReason && (
                    <div className="mt-2 ml-14">
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        Failure reason: {payment.failureReason}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 ml-14">
                    <div className="text-sm text-gray-500">
                      Escrow: {payment.escrowStatus}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredDisputes.map((dispute) => (
              <li key={dispute.id}>
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{dispute.id}</div>
                          <div className="ml-2">
                            <StatusBadge status={dispute.status} type="dispute" />
                          </div>
                          {dispute.priority === 'high' && (
                            <div className="ml-2">
                              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                High Priority
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{dispute.customerName} vs {dispute.businessName}</div>
                        <div className="text-sm text-gray-500">Reason: {dispute.reason}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(dispute.amount)}</div>
                        <div className="text-sm text-gray-500">Payment: {dispute.paymentId}</div>
                        <div className="text-sm text-gray-500">Date: {dispute.date}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedDispute(dispute);
                            setShowDisputeModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        
                        {dispute.status === 'open' && (
                          <>
                            <button
                              onClick={() => {
                                if (confirm('Start investigation for this dispute?')) {
                                  handleDisputeStatus(dispute.id, 'investigating');
                                }
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Start Investigation"
                            >
                              <AlertTriangle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Mark this dispute as resolved?')) {
                                  handleDisputeStatus(dispute.id, 'resolved');
                                }
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Resolve Dispute"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {((activeTab === 'payments' && filteredPayments.length === 0) || 
        (activeTab === 'disputes' && filteredDisputes.length === 0)) && (
        <div className="text-center py-12">
          {activeTab === 'payments' ? (
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          ) : (
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No {activeTab} found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No {activeTab} match your current search criteria.
          </p>
        </div>
      )}

      {/* Payment Detail Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div><strong>Payment ID:</strong> {selectedPayment.id}</div>
              <div><strong>Order ID:</strong> {selectedPayment.orderId}</div>
              <div><strong>Business:</strong> {selectedPayment.businessName}</div>
              <div><strong>Customer:</strong> {selectedPayment.customerName}</div>
              <div><strong>Amount:</strong> {formatCurrency(selectedPayment.amount)}</div>
              <div><strong>Status:</strong> <StatusBadge status={selectedPayment.status} /></div>
              <div><strong>Method:</strong> {selectedPayment.method}</div>
              <div><strong>Date:</strong> {selectedPayment.date}</div>
              <div><strong>Fees:</strong> {formatCurrency(selectedPayment.fees)}</div>
              <div><strong>Escrow:</strong> {selectedPayment.escrowStatus}</div>
              {selectedPayment.failureReason && (
                <div><strong>Failure Reason:</strong> <span className="text-red-600">{selectedPayment.failureReason}</span></div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {selectedPayment.status === 'completed' && (
                <button
                  onClick={() => {
                    if (confirm('Process refund for this payment?')) {
                      handleRefund(selectedPayment.id);
                      setShowPaymentModal(false);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Process Refund
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dispute Detail Modal */}
      {showDisputeModal && selectedDispute && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dispute Details</h3>
            <div className="space-y-3">
              <div><strong>Dispute ID:</strong> {selectedDispute.id}</div>
              <div><strong>Payment ID:</strong> {selectedDispute.paymentId}</div>
              <div><strong>Order ID:</strong> {selectedDispute.orderId}</div>
              <div><strong>Customer:</strong> {selectedDispute.customerName}</div>
              <div><strong>Business:</strong> {selectedDispute.businessName}</div>
              <div><strong>Amount:</strong> {formatCurrency(selectedDispute.amount)}</div>
              <div><strong>Reason:</strong> {selectedDispute.reason}</div>
              <div><strong>Status:</strong> <StatusBadge status={selectedDispute.status} type="dispute" /></div>
              <div><strong>Priority:</strong> <span className={selectedDispute.priority === 'high' ? 'text-red-600' : 'text-gray-600'}>{selectedDispute.priority}</span></div>
              <div><strong>Date:</strong> {selectedDispute.date}</div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {selectedDispute.status === 'open' && (
                <>
                  <button
                    onClick={() => {
                      handleDisputeStatus(selectedDispute.id, 'investigating');
                      setShowDisputeModal(false);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Start Investigation
                  </button>
                  <button
                    onClick={() => {
                      handleDisputeStatus(selectedDispute.id, 'resolved');
                      setShowDisputeModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Resolve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to Business Section */}
      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}