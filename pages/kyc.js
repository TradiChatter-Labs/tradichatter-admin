import { useState, useEffect } from 'react';
import { UserCheck, RefreshCw, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

export default function KYCPage() {
  const [kyc, setKyc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchKYC(); }, [statusFilter]);

  const fetchKYC = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/kyc?${params}`);
      const json = await res.json();
      if (json.success) { setKyc(json.kyc); setTotal(json.total); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleVerify = async (id, status) => {
    const reason = status === 'rejected' ? prompt('Rejection reason:') : '';
    if (status === 'rejected' && !reason) return;
    if (!confirm(`${status} this KYC application?`)) return;
    await fetch('/api/kyc', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status, reason }) });
    fetchKYC();
  };

  const getStatusColor = (status) => {
    const colors = { verified: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', rejected: 'bg-red-100 text-red-800', submitted: 'bg-blue-100 text-blue-800' };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
        <p className="text-sm text-gray-600">Business identity verification applications.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{total}</p></div>
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">{kyc.filter(k => k.verification_status === 'pending' || k.verification_status === 'submitted').length}</p></div>
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Verified</p><p className="text-2xl font-bold text-green-600">{kyc.filter(k => k.verification_status === 'verified').length}</p></div>
        <div className="bg-white shadow rounded-lg p-4"><p className="text-sm text-gray-500">Rejected</p><p className="text-2xl font-bold text-red-600">{kyc.filter(k => k.verification_status === 'rejected').length}</p></div>
      </div>

      <div className="flex gap-4 mb-6">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={fetchKYC} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : kyc.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No KYC applications found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BVN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trust Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kyc.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{k.businesses?.business_name || k.business_id?.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{k.kyc_tier || '—'}</td>
                  <td className="px-6 py-4">{k.nin_verified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-gray-300" />}</td>
                  <td className="px-6 py-4">{k.bvn_verified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-gray-300" />}</td>
                  <td className="px-6 py-4">{k.address_verified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-gray-300" />}</td>
                  <td className="px-6 py-4 text-sm font-medium">{k.trust_score || 0}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(k.verification_status)}`}>{k.verification_status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{k.submitted_at ? new Date(k.submitted_at).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {(k.verification_status === 'pending' || k.verification_status === 'submitted') && (
                      <>
                        <button onClick={() => handleVerify(k.id, 'verified')} className="text-green-600 hover:text-green-800 font-medium">Approve</button>
                        <button onClick={() => handleVerify(k.id, 'rejected')} className="text-red-600 hover:text-red-800 font-medium">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
