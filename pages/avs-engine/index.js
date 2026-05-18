import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye, UserCheck } from 'lucide-react';

export default function AVSEngine() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overrideModal, setOverrideModal] = useState(null);
  const [overrideForm, setOverrideForm] = useState({ decision: 'approve', reason: '' });
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewsRes, accuracyRes] = await Promise.all([
        fetch('/api/avs-engine?action=pending'),
        fetch('/api/avs-engine?action=accuracy'),
      ]);
      const reviewsJson = await reviewsRes.json();
      const accuracyJson = await accuracyRes.json();
      if (reviewsJson.success) setReviews(reviewsJson.reviews || []);
      if (accuracyJson.success) setAccuracy(accuracyJson);
    } catch (err) {
      console.error('Fetch AVS data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = async () => {
    if (!overrideForm.reason) { alert('Reason is required'); return; }
    try {
      const res = await fetch('/api/avs-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'override',
          supplier_id: overrideModal.supplier_id,
          decision: overrideForm.decision,
          reason: overrideForm.reason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setOverrideModal(null);
        setOverrideForm({ decision: 'approve', reason: '' });
        fetchData();
      } else {
        alert('Override failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const getRiskColor = (level) => {
    const colors = { low: 'text-green-600', medium: 'text-yellow-600', high: 'text-red-600' };
    return colors[level] || 'text-gray-600';
  };

  const getRecommendationColor = (rec) => {
    const colors = {
      approve: 'bg-green-100 text-green-800',
      review: 'bg-yellow-100 text-yellow-800',
      reject: 'bg-red-100 text-red-800',
    };
    return colors[rec] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AVS Engine — Verification Queue</h1>
          <p className="mt-1 text-sm text-gray-600">Review AI-scored supplier verifications and override decisions.</p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Accuracy Stats */}
      {accuracy && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">Model Accuracy</p>
            <p className="text-2xl font-bold text-green-600">{accuracy.overall_accuracy || 0}%</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">Total Verified</p>
            <p className="text-2xl font-bold">{accuracy.total_verified || 0}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">{reviews.length}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">False Positive Rate</p>
            <p className="text-2xl font-bold text-red-600">{accuracy.false_positive_rate || 0}%</p>
          </div>
        </div>
      )}

      {/* Pending Reviews */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pending Reviews ({reviews.length})</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>No pending reviews. All verifications processed.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trust Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Recommendation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.id || review.supplier_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{review.company_name || review.supplier_name}</div>
                    <div className="text-xs text-gray-500">{review.supplier_id?.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-lg font-bold ${
                      (review.trust_score || 0) >= 80 ? 'text-green-600' :
                      (review.trust_score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {review.trust_score || 0}
                    </span>
                    <span className="text-sm text-gray-400">/100</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${getRiskColor(review.risk_level)}`}>
                      {review.risk_level || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecommendationColor(review.recommendation)}`}>
                      {review.recommendation || 'review'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => setOverrideModal(review)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Override
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-6 flex gap-4">
        <Link href="/avs-engine/badges" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">
          Badge Management →
        </Link>
        <Link href="/avs-engine/weights" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">
          Weight Tuning →
        </Link>
      </div>

      {/* Override Modal */}
      {overrideModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Override Verification Decision</h3>
            <p className="text-sm text-gray-500 mb-4">
              Supplier: {overrideModal.company_name || overrideModal.supplier_id?.slice(0, 8)} •
              AI Score: {overrideModal.trust_score}/100 •
              AI says: {overrideModal.recommendation}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Decision</label>
                <select
                  value={overrideForm.decision}
                  onChange={(e) => setOverrideForm({ ...overrideForm, decision: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="approve">Approve</option>
                  <option value="reject">Reject</option>
                  <option value="review">Request More Info</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <textarea
                  value={overrideForm.reason}
                  onChange={(e) => setOverrideForm({ ...overrideForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Why are you overriding the AI decision?"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setOverrideModal(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleOverride} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Submit Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
