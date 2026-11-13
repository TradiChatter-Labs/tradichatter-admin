import Link from 'next/link';
import { BarChart3, AlertTriangle } from 'lucide-react';

export default function AffiliateAnalytics() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Analyze affiliate performance, conversion rates, and revenue metrics.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6 flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-yellow-800">V2 Feature — Not Yet Active</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Affiliate analytics will be available once the affiliate system is enabled in V2.
            No affiliate activity has been recorded yet.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {['Total Referrals', 'Avg Conversion Rate', 'Total Revenue', 'Avg CTR'].map((label) => (
          <div key={label} className="bg-white overflow-hidden shadow rounded-lg p-5">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-400">—</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Performance Data</h3>
        </div>
        <div className="text-center py-16">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No data yet</p>
          <p className="text-xs text-gray-400 mt-1">Analytics will populate once affiliates are active in V2.</p>
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
