import Link from 'next/link';
import { Settings, MessageSquare, CreditCard, Eye, TrendingUp, Clock, ArrowLeft } from 'lucide-react';

export function AdminSecurity() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/security-management" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Management
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Admin Security (CRITICAL)</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Admin security monitoring details...</p>
      </div>
    </div>
  );
}

export function ChatMediaSecurity() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/security-management" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Management
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Chat & Media Security</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Chat and media security monitoring details...</p>
      </div>
    </div>
  );
}

export function PaymentsEscrowSecurity() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/security-management" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Management
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Escrow Security</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Payments and escrow security monitoring details...</p>
      </div>
    </div>
  );
}

export function LiveThreats() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/security-management" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Management
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Live Security Threats</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Real-time security threat monitoring...</p>
      </div>
    </div>
  );
}

export function SecurityReports() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/security-management" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Management
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Security Reports</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Security reports and analytics...</p>
      </div>
    </div>
  );
}

export function AuditHistory() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/security-management" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Security Management
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Security Audit History</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Historical security audit data...</p>
      </div>
    </div>
  );
}

export default AdminSecurity;