import Link from 'next/link';
import { Info, DollarSign } from 'lucide-react';

export default function Withdrawals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
        <p className="text-sm text-gray-500 mt-1">Platform fund custody model</p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-4">
            <Info className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">TradiChatter Does Not Hold User Funds</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-6">
          TradiChatter is a marketplace platform. Payments flow directly between buyers and sellers via Flutterwave. 
          Affiliate commissions are paid directly by sellers — the platform never holds or custodies user funds outside of active escrow transactions.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 max-w-md mx-auto text-left mb-8">
          <p className="text-sm font-semibold text-blue-800 mb-3">How money moves on TradiChatter:</p>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Buyer pays → funds held in <strong>Escrow</strong> until delivery confirmed</li>
            <li>• Escrow released → seller receives payment via Flutterwave split</li>
            <li>• Affiliate commissions → paid directly by sellers, not by the platform</li>
            <li>• Platform fee → collected at point of transaction, not held</li>
          </ul>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/escrow" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <DollarSign className="h-4 w-4" />
            Escrow Management
          </Link>
          <Link href="/payments" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Payment History
          </Link>
          <Link href="/financial" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Financial Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
