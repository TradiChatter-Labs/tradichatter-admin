import Link from 'next/link';
import { Users, ArrowLeft } from 'lucide-react';

export default function CustomerAuthSecurity() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/security-management" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Management
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Customer Authentication Security</h1>
        <p className="mt-1 text-sm text-gray-600">Monitor customer OTP, device trust, and account security</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-blue-500 mr-3" />
          <h2 className="text-lg font-medium">Customer Security Alerts</h2>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-red-400 bg-red-50 p-4">
            <p className="text-red-800">18 failed OTP attempts detected in the last hour</p>
          </div>
          <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="text-yellow-800">4 suspicious device logins flagged</p>
          </div>
        </div>
      </div>
    </div>
  );
}