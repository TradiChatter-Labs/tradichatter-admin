import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Shield, User, Calendar, DollarSign, FileText, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function EscrowDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [escrow, setEscrow] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => { if (id) fetchEscrow(id); }, [id]);

  const fetchEscrow = async (escrowId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/escrow?id=${escrowId}`);
      const json = await res.json();
      if (json.success && json.escrow) {
        setEscrow(json.escrow);
        setTimeline(json.timeline || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const callAction = async (endpoint, body) => {
    setActionLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (res.status === 403) {
        alert('This action is currently disabled — Delayed Payout feature is not yet approved.');
      } else if (json.success || res.ok) {
        await fetchEscrow(id);
        alert('Action completed successfully.');
      } else {
        alert(json.error || 'Action failed.');
      }
    } catch (e) { alert('Network error.'); }
    finally { setActionLoading(false); setShowConfirm(null); }
  };

  const statusColor = (s) => ({ active: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800', disputed: 'bg-red-100 text-red-800', refunded: 'bg-purple-100 text-purple-800' }[s] || 'bg-gray-100 text-gray-800');
  const timelineDot = (s) => ({ completed: 'bg-green-500', pending: 'bg-yellow-500', disputed: 'bg-red-500' }[s] || 'bg-gray-400');

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  if (!escrow) return (
    <div className="text-center py-12">
      <Shield className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Escrow not found</h3>
      <p className="mt-1 text-sm text-gray-500">The requested escrow transaction could not be found.</p>
      <div className="mt-6"><Link href="/escrow" className="text-blue-600 hover:text-blue-500 font-medium">← Back to Escrow Management</Link></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/escrow" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-6 w-6" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Escrow Details</h1>
            <p className="text-sm text-gray-500 font-mono">{escrow.id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor(escrow.status)}`}>{escrow.status?.toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><DollarSign className="h-5 w-5 mr-2" />Transaction Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Amount:</span><span className="font-medium">₦{(escrow.amount || 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Platform Fee:</span><span className="font-medium">₦{(escrow.platform_fee || 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Order ID:</span><span className="font-medium font-mono">{escrow.order_id || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment Ref:</span><span className="font-medium font-mono">{escrow.payment_reference || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Created:</span><span className="font-medium">{escrow.created_at?.split('T')[0]}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Release Date:</span><span className="font-medium">{escrow.release_date?.split('T')[0] || '—'}</span></div>
            {escrow.completed_at && <div className="flex justify-between"><span className="text-gray-500">Completed:</span><span className="font-medium text-green-600">{escrow.completed_at?.split('T')[0]}</span></div>}
          </div>
        </div>

        {/* Parties */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><User className="h-5 w-5 mr-2" />Parties</h3>
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Buyer</p>
            <p className="text-sm font-medium text-gray-900">{escrow.buyer_id || '—'}</p>
            {escrow.buyer && <p className="text-sm text-gray-500">{escrow.buyer.display_name}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Seller</p>
            <p className="text-sm font-medium text-gray-900">{escrow.seller_id || '—'}</p>
            {escrow.seller && <p className="text-sm text-gray-500">{escrow.seller.display_name}</p>}
          </div>
        </div>
      </div>

      {/* Description / Dispute */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center"><FileText className="h-5 w-5 mr-2" />Details</h3>
        <p className="text-gray-700 text-sm">{escrow.description || 'No description provided.'}</p>
        {escrow.dispute_reason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800">Dispute: {escrow.dispute_reason}</p>
            {escrow.disputed_at && <p className="text-xs text-red-500 mt-1">{escrow.disputed_at?.split('T')[0]}</p>}
          </div>
        )}
        {escrow.admin_action_reason && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Admin Note: {escrow.admin_action_reason}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><Calendar className="h-5 w-5 mr-2" />Timeline</h3>
        {timeline.length === 0 ? (
          <p className="text-sm text-gray-400">No audit trail entries found for this escrow.</p>
        ) : (
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-start">
                <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${timelineDot(item.status)}`}></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{item.action || item.event}</p>
                  <p className="text-xs text-gray-400">{item.created_at?.replace('T', ' ').slice(0, 16)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {escrow.status !== 'completed' && escrow.status !== 'refunded' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">
            ⚠ Escrow actions (release, refund, resolve) are currently frozen — Delayed Payout feature requires legal and operational approval before activation.
          </div>
          <div className="flex gap-3 flex-wrap">
            {escrow.status === 'active' && (
              <button onClick={() => setShowConfirm('release')} disabled={actionLoading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />Release Escrow
              </button>
            )}
            {escrow.status === 'disputed' && (
              <>
                <button onClick={() => setShowConfirm('resolve')} disabled={actionLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />Resolve Dispute
                </button>
                <button onClick={() => setShowConfirm('refund')} disabled={actionLoading} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center text-sm">
                  <XCircle className="h-4 w-4 mr-2" />Refund Buyer
                </button>
              </>
            )}
            <button onClick={() => callAction('/api/admin/escrow/contact-parties', { escrowId: escrow.id, buyerEmail: '', sellerEmail: '' })} disabled={actionLoading} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center text-sm">
              <MessageSquare className="h-4 w-4 mr-2" />Contact Parties
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Action</h3>
            <p className="text-gray-600 mb-6 text-sm">
              {showConfirm === 'resolve' && 'Resolve this dispute and return escrow to active status?'}
              {showConfirm === 'refund' && `Refund ₦${(escrow.amount || 0).toLocaleString()} to the buyer? This cannot be undone.`}
              {showConfirm === 'release' && `Release ₦${(escrow.amount || 0).toLocaleString()} to the seller?`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(null)} className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              <button
                onClick={() => callAction(`/api/admin/escrow/${showConfirm === 'resolve' ? 'resolve-dispute' : showConfirm === 'refund' ? 'refund' : 'release'}`, { escrowId: escrow.id, amount: escrow.amount })}
                disabled={actionLoading}
                className={`flex-1 px-4 py-2 rounded-lg text-white text-sm disabled:opacity-50 ${showConfirm === 'refund' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
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
