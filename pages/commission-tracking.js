import Link from 'next/link';
import { BarChart3, Clock } from 'lucide-react';

export default function CommissionTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Commission Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">Track affiliate and seller commissions</p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-4">
            <BarChart3 className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Commission Tracking — V2</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Detailed commission tracking with per-seller breakdowns, payout history, and dispute resolution is coming in V2.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-flex mx-auto">
          <Clock className="h-4 w-4" />
          <span>Planned for V2 release</span>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/affiliate-management" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            → Affiliate Management
          </Link>
          <Link href="/affiliate-analytics" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            → Affiliate Analytics
          </Link>
          <Link href="/financial" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            → Financial Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
