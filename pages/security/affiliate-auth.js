import Link from 'next/link';
import { TrendingUp, ArrowLeft } from 'lucide-react';

export default function AffiliateAuthSecurity() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/security-management" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Management
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Authentication Security</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Affiliate security monitoring details...</p>
      </div>
    </div>
  );
}