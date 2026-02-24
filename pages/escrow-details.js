import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Shield, User, Calendar, DollarSign, FileText, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

export default function EscrowDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (id) {
      fetchEscrowDetails(id);
    }
  }, [id]);

  const fetchEscrowDetails = async (escrowId) => {
    try {
      // Mock detailed escrow data
      const mockData = {
        'ESC001': {
          id: 'ESC001',
          buyerName: 'John Doe',
          buyerEmail: 'john@example.com',
          buyerPhone: '+234 801 234 5678',
          sellerName: 'Tech Store Lagos',
          sellerEmail: 'info@techstore.com',
          sellerPhone: '+234 802 345 6789',
          amount: 45000,
          status: 'active',
          createdAt: '2024-01-15',
          releaseDate: '2024-01-22',
          description: 'iPhone 13 Pro Max',
          orderId: 'ORD-2024-001',
          paymentMethod: 'Bank Transfer',
          escrowFee: 450,
          timeline: [
            { date: '2024-01-15 10:30', event: 'Escrow created', status: 'completed' },
            { date: '2024-01-15 10:35', event: 'Payment received from buyer', status: 'completed' },
            { date: '2024-01-16 14:20', event: 'Seller confirmed order', status: 'completed' },
            { date: '2024-01-20 09:15', event: 'Item shipped', status: 'completed' },
            { date: '2024-01-22 16:00', event: 'Scheduled for release', status: 'pending' }
          ]
        },
        'ESC002': {
          id: 'ESC002',
          buyerName: 'Jane Smith',
          buyerEmail: 'jane@example.com',
          buyerPhone: '+234 803 456 7890',
          sellerName: 'Fashion Hub',
          sellerEmail: 'info@fashionhub.com',
          sellerPhone: '+234 804 567 8901',
          amount: 25000,
          status: 'disputed',
          createdAt: '2024-01-14',
          releaseDate: '2024-01-21',
          description: 'Designer Handbag',
          orderId: 'ORD-2024-002',
          paymentMethod: 'Card Payment',
          escrowFee: 250,
          disputeReason: 'Item not as described',
          disputeDate: '2024-01-20',
          timeline: [
            { date: '2024-01-14 11:00', event: 'Escrow created', status: 'completed' },
            { date: '2024-01-14 11:05', event: 'Payment received from buyer', status: 'completed' },
            { date: '2024-01-15 16:30', event: 'Seller confirmed order', status: 'completed' },
            { date: '2024-01-18 12:45', event: 'Item delivered', status: 'completed' },
            { date: '2024-01-20 14:20', event: 'Dispute raised by buyer', status: 'disputed' }
          ]
        },
        'ESC003': {
          id: 'ESC003',
          buyerName: 'Mike Johnson',
          buyerEmail: 'mike@example.com',
          buyerPhone: '+234 805 678 9012',
          sellerName: 'Food Corner',
          sellerEmail: 'info@foodcorner.com',
          sellerPhone: '+234 806 789 0123',
          amount: 12000,
          status: 'completed',
          createdAt: '2024-01-10',
          releaseDate: '2024-01-17',
          description: 'Catering Service',
          orderId: 'ORD-2024-003',
          paymentMethod: 'Mobile Money',
          escrowFee: 120,
          completedDate: '2024-01-17',
          timeline: [
            { date: '2024-01-10 09:00', event: 'Escrow created', status: 'completed' },
            { date: '2024-01-10 09:10', event: 'Payment received from buyer', status: 'completed' },
            { date: '2024-01-12 08:30', event: 'Service confirmed by seller', status: 'completed' },
            { date: '2024-01-15 18:00', event: 'Service delivered', status: 'completed' },
            { date: '2024-01-17 10:00', event: 'Escrow released to seller', status: 'completed' }
          ]
        }
      };

      setEscrow(mockData[escrowId] || null);
    } catch (error) {
      console.error('Error fetching escrow details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle dispute resolution
  const handleResolveDispute = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/admin/escrow/resolve-dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          escrowId: escrow.id,
          resolution: 'admin_resolved'
        })
      });
      
      if (response.ok) {
        setEscrow(prev => ({
          ...prev,
          status: 'active',
          timeline: [...prev.timeline, {
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            event: 'Dispute resolved by admin',
            status: 'completed'
          }]
        }));
        alert('Dispute resolved successfully!');
      }
    } catch (error) {
      alert('Failed to resolve dispute.');
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  };

  // Handle buyer refund
  const handleRefundBuyer = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/admin/escrow/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          escrowId: escrow.id,
          amount: escrow.amount + escrow.escrowFee
        })
      });
      
      if (response.ok) {
        setEscrow(prev => ({
          ...prev,
          status: 'refunded',
          timeline: [...prev.timeline, {
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            event: 'Refund processed to buyer',
            status: 'completed'
          }]
        }));
        alert('Refund processed successfully!');
      }
    } catch (error) {
      alert('Failed to process refund.');
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  };

  // Handle contacting parties
  const handleContactParties = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/admin/escrow/contact-parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          escrowId: escrow.id,
          buyerEmail: escrow.buyerEmail,
          sellerEmail: escrow.sellerEmail
        })
      });
      
      if (response.ok) {
        setEscrow(prev => ({
          ...prev,
          timeline: [...prev.timeline, {
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            event: 'Admin contacted both parties',
            status: 'completed'
          }]
        }));
        alert('Communication sent successfully!');
      }
    } catch (error) {
      alert('Failed to send communication.');
    } finally {
      setActionLoading(false);
    }
  };

  const showConfirmation = (action) => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  // Handle escrow release
  const handleReleaseEscrow = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/admin/escrow/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          escrowId: escrow.id,
          amount: escrow.amount
        })
      });
      
      if (response.ok) {
        setEscrow(prev => ({
          ...prev,
          status: 'completed',
          completedDate: new Date().toISOString().slice(0, 10),
          timeline: [...prev.timeline, {
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            event: 'Escrow released to seller',
            status: 'completed'
          }]
        }));
        alert('Escrow released successfully!');
      }
    } catch (error) {
      alert('Failed to release escrow.');
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  };

  const executeAction = () => {
    switch (confirmAction) {
      case 'resolve':
        handleResolveDispute();
        break;
      case 'refund':
        handleRefundBuyer();
        break;
      case 'release':
        handleReleaseEscrow();
        break;
      default:
        setShowConfirmModal(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimelineStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'disputed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Escrow not found</h3>
        <p className="mt-1 text-sm text-gray-500">The requested escrow transaction could not be found.</p>
        <div className="mt-6">
          <Link href="/escrow" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Escrow Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/escrow" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Escrow Details - {escrow.id}</h1>
            <p className="text-sm text-gray-600">View and manage escrow transaction details</p>
          </div>
        </div>
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(escrow.status)}`}>
          {escrow.status.toUpperCase()}
        </span>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Transaction Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Escrow ID:</span>
              <span className="text-sm font-medium text-gray-900">{escrow.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Order ID:</span>
              <span className="text-sm font-medium text-gray-900">{escrow.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Amount:</span>
              <span className="text-sm font-medium text-gray-900">₦{escrow.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Escrow Fee:</span>
              <span className="text-sm font-medium text-gray-900">₦{escrow.escrowFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Payment Method:</span>
              <span className="text-sm font-medium text-gray-900">{escrow.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Created:</span>
              <span className="text-sm font-medium text-gray-900">{escrow.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Release Date:</span>
              <span className="text-sm font-medium text-gray-900">{escrow.releaseDate}</span>
            </div>
            {escrow.completedDate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Completed:</span>
                <span className="text-sm font-medium text-green-600">{escrow.completedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Parties Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Parties Information
          </h3>
          
          {/* Buyer */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Buyer</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">{escrow.buyerName}</p>
              <p className="text-sm text-gray-500">{escrow.buyerEmail}</p>
              <p className="text-sm text-gray-500">{escrow.buyerPhone}</p>
            </div>
          </div>

          {/* Seller */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Seller</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">{escrow.sellerName}</p>
              <p className="text-sm text-gray-500">{escrow.sellerEmail}</p>
              <p className="text-sm text-gray-500">{escrow.sellerPhone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product/Service Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Product/Service Details
        </h3>
        <p className="text-gray-700">{escrow.description}</p>
        
        {escrow.disputeReason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Dispute Information</h4>
            <p className="text-sm text-red-700">Reason: {escrow.disputeReason}</p>
            <p className="text-sm text-red-600">Date: {escrow.disputeDate}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Transaction Timeline
        </h3>
        <div className="space-y-4">
          {escrow.timeline.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${getTimelineStatusColor(item.status)}`}></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{item.event}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {escrow.status !== 'completed' && escrow.status !== 'refunded' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
          <div className="flex space-x-4">
            {escrow.status === 'active' && (
              <button 
                onClick={() => showConfirmation('release')}
                disabled={actionLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {actionLoading ? 'Processing...' : 'Release Escrow'}
              </button>
            )}
            {escrow.status === 'disputed' && (
              <>
                <button 
                  onClick={() => showConfirmation('resolve')}
                  disabled={actionLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {actionLoading ? 'Processing...' : 'Resolve Dispute'}
                </button>
                <button 
                  onClick={() => showConfirmation('refund')}
                  disabled={actionLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {actionLoading ? 'Processing...' : 'Refund Buyer'}
                </button>
              </>
            )}
            <button 
              onClick={handleContactParties}
              disabled={actionLoading}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {actionLoading ? 'Sending...' : 'Contact Parties'}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmAction === 'resolve' && 'Are you sure you want to resolve this dispute? This will change the status back to active.'}
              {confirmAction === 'refund' && `Are you sure you want to refund ₦${(escrow.amount + escrow.escrowFee).toLocaleString()} to the buyer? This action cannot be undone.`}
              {confirmAction === 'release' && `Are you sure you want to release ₦${escrow.amount.toLocaleString()} to the seller?`}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={actionLoading}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                disabled={actionLoading}
                className={`flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50 ${
                  confirmAction === 'refund' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}