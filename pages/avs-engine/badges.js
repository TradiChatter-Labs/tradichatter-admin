import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, RefreshCw, Award, Search } from 'lucide-react';

const BADGE_TIERS = [
  { badge: 'none', minScore: 0, minOrders: 0, minDays: 0, maxDispute: '—', color: 'bg-gray-100 text-gray-600' },
  { badge: 'verified', minScore: 70, minOrders: 0, minDays: 0, maxDispute: '15%', color: 'bg-blue-100 text-blue-700' },
  { badge: 'gold_verified', minScore: 80, minOrders: 10, minDays: 60, maxDispute: '5%', color: 'bg-yellow-100 text-yellow-700' },
  { badge: 'elite', minScore: 90, minOrders: 50, minDays: 180, maxDispute: '2%', color: 'bg-purple-100 text-purple-700' },
];

export default function AVSBadges() {
  const [supplierId, setSupplierId] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const evaluateBadge = async () => {
    if (!supplierId) { alert('Enter a supplier ID'); return; }
    setEvaluating(true);
    setResult(null);
    try {
      const res = await fetch('/api/avs-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'evaluate-badge', supplier_id: supplierId }),
      });
      const json = await res.json();
      if (json.success) setResult(json);
      else alert('Evaluation failed: ' + (json.error || 'Unknown error'));
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AVS — Badge Management</h1>
        <p className="mt-1 text-sm text-gray-600">View badge progression rules and evaluate individual suppliers.</p>
      </div>

      {/* Badge Tiers */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Badge Progression Tiers</h3>
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase">
              <th className="pb-3">Badge</th>
              <th className="pb-3">Min Score</th>
              <th className="pb-3">Min Orders</th>
              <th className="pb-3">Min Days</th>
              <th className="pb-3">Max Dispute Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {BADGE_TIERS.map((tier) => (
              <tr key={tier.badge}>
                <td className="py-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${tier.color}`}>
                    {tier.badge === 'none' ? 'No Badge' : tier.badge.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-700">{tier.minScore}</td>
                <td className="py-3 text-sm text-gray-700">{tier.minOrders}</td>
                <td className="py-3 text-sm text-gray-700">{tier.minDays}</td>
                <td className="py-3 text-sm text-gray-700">{tier.maxDispute}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-4">Badges are re-evaluated daily. Suppliers can be upgraded or downgraded automatically.</p>
      </div>

      {/* Manual Evaluation */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluate Supplier Badge</h3>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter supplier ID..."
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && evaluateBadge()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={evaluateBadge}
            disabled={evaluating}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
          >
            {evaluating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Award className="h-4 w-4 mr-2" />}
            Evaluate
          </button>
        </div>

        {result && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-2">Evaluation Result</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Current Badge:</span> <span className="font-medium">{result.current_badge || 'none'}</span></div>
              <div><span className="text-gray-500">New Badge:</span> <span className="font-medium">{result.new_badge || 'none'}</span></div>
              <div><span className="text-gray-500">Trust Score:</span> <span className="font-medium">{result.trust_score || 0}</span></div>
              <div><span className="text-gray-500">Total Orders:</span> <span className="font-medium">{result.total_orders || 0}</span></div>
              <div><span className="text-gray-500">Days Active:</span> <span className="font-medium">{result.days_active || 0}</span></div>
              <div><span className="text-gray-500">Dispute Rate:</span> <span className="font-medium">{result.dispute_rate || '0%'}</span></div>
            </div>
            {result.upgraded && <p className="mt-2 text-green-600 font-medium">✅ Badge upgraded!</p>}
            {result.downgraded && <p className="mt-2 text-red-600 font-medium">⚠️ Badge downgraded</p>}
            {!result.upgraded && !result.downgraded && <p className="mt-2 text-gray-500">No change in badge level.</p>}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href="/avs-engine" className="text-red-600 hover:text-red-500 font-medium">← Back to Verification Queue</Link>
      </div>
    </div>
  );
}
