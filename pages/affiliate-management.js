import Link from 'next/link';
import { Users, AlertTriangle } from 'lucide-react';

export default function AffiliateManagement() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage affiliate registrations, approvals, and account status.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6 flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-yellow-800">V2 Feature — Not Yet Active</h3>
          <p className="text-sm text-yellow-700 mt-1">
            The affiliate system is feature-flagged OFF. All affiliate infrastructure exists but is inactive.
            It will be enabled in V2 after legal, operational, and payment provider approvals are complete.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        {['Total Affiliates', 'Active', 'Pending Approval', 'Suspended'].map((label) => (
          <div key={label} className="bg-white overflow-hidden shadow rounded-lg p-5">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-400">—</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Affiliate List</h3>
        </div>
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No affiliates yet</p>
          <p className="text-xs text-gray-400 mt-1">Affiliate registration opens in V2.</p>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/affiliate-settings" className="text-blue-600 hover:text-blue-500 font-medium text-sm">
          View V2 Launch Checklist →
        </Link>
      </div>
    </div>
  );
}
