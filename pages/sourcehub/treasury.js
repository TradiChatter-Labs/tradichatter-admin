import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, ArrowUpRight, ArrowDownRight, Wallet, AlertTriangle } from 'lucide-react';

export default function SourceHubTreasury() {
  const [treasury, setTreasury] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchTreasury(); }, []);

  const fetchTreasury = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sourcehub/treasury');
      const json = await res.json();
      if (json.success) setTreasury(json);
    } catch (err) {
      console.error('Fetch treasury error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTreasuryAction = async (action, details = {}) => {
    if (!confirm(`Execute ${action}?`)) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/sourcehub/treasury', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...details }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`${action} executed successfully`);
        fetchTreasury();
      } else {
        alert('Failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Action failed: ' + err.message);
    } finally {
      setActionLoading(false);
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SourceHub — Treasury & Escrow</h1>
          <p className="mt-1 text-sm text-gray-600">Platform treasury, escrow balances, payouts, and fee structure.</p>
        </div>
        <button onClick={fetchTreasury} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Treasury Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Platform Balance</p>
              <p className="text-2xl font-bold">${(treasury?.platform_balance || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Escrow Held</p>
              <p className="text-2xl font-bold text-yellow-600">${(treasury?.escrow_held || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <ArrowUpRight className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Payouts</p>
              <p className="text-2xl font-bold text-green-600">${(treasury?.total_payouts || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <ArrowDownRight className="h-5 w-5 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Fees Collected</p>
              <p className="text-2xl font-bold text-purple-600">${(treasury?.fees_collected || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Structure</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Buyer Escrow Fee</p>
            <p className="text-xl font-bold text-blue-600">{treasury?.fee_structure?.buyer_escrow || '3%'}</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Supplier Commission</p>
            <p className="text-xl font-bold text-green-600">{treasury?.fee_structure?.supplier_commission || '3-8%'}</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Logistics Handling</p>
            <p className="text-xl font-bold text-orange-600">{treasury?.fee_structure?.logistics || '$15-25'}</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">FX Spread</p>
            <p className="text-xl font-bold text-purple-600">{treasury?.fee_structure?.fx_spread || '1.5%'}</p>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Treasury Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleTreasuryAction('sweep')}
            disabled={actionLoading}
            className="flex items-center justify-center px-4 py-3 border-2 border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-50"
          >
            <Wallet className="h-5 w-5 mr-2 text-blue-600" />
            <span className="font-medium text-blue-700">Run Sweep</span>
          </button>
          <button
            onClick={() => handleTreasuryAction('batch-payout')}
            disabled={actionLoading}
            className="flex items-center justify-center px-4 py-3 border-2 border-green-200 rounded-lg hover:bg-green-50 disabled:opacity-50"
          >
            <ArrowUpRight className="h-5 w-5 mr-2 text-green-600" />
            <span className="font-medium text-green-700">Batch Payout</span>
          </button>
          <button
            onClick={() => handleTreasuryAction('reconcile')}
            disabled={actionLoading}
            className="flex items-center justify-center px-4 py-3 border-2 border-purple-200 rounded-lg hover:bg-purple-50 disabled:opacity-50"
          >
            <RefreshCw className="h-5 w-5 mr-2 text-purple-600" />
            <span className="font-medium text-purple-700">Reconcile</span>
          </button>
        </div>
      </div>

      {/* Pending Payouts */}
      {treasury?.pending_payouts && treasury.pending_payouts.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pending Payouts</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {treasury.pending_payouts.map((payout, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{payout.supplier_name || payout.supplier_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${(payout.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payout.currency || 'USD'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payout.method || 'Payoneer'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{payout.requested_at ? new Date(payout.requested_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
