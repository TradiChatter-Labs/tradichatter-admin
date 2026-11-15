import Link from 'next/link';
import { ShoppingCart, Clock } from 'lucide-react';

export default function GroupBuying() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Group Buying</h1>
        <p className="text-sm text-gray-500 mt-1">Bulk offer coordination across buyers</p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-4">
            <ShoppingCart className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Group Buying — V2</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-4">
          Group buying allows sellers to create bulk offers that activate when enough buyers join. The feature exists in the mobile app as a prototype using local demo data.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto mb-6 text-left text-sm text-amber-700">
          <p className="font-semibold mb-1">Why no admin data yet?</p>
          <p>The mobile app's group buying feature currently runs on in-memory demo data — no backend tables exist yet. Admin monitoring will be built in V2 once the feature is wired to Supabase.</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-flex mx-auto">
          <Clock className="h-4 w-4" />
          <span>Planned for V2 release</span>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">→ Orders</Link>
          <Link href="/financial" className="text-blue-600 hover:text-blue-800 text-sm font-medium">→ Financial Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
