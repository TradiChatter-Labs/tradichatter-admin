import { useRouter } from 'next/router';
import { useAdmin } from '../hooks/useAdmin';
import { canAccessPage, canWrite } from '../lib/rbac';
import { ShieldAlert } from 'lucide-react';

// Drop this into any restricted page: <AccessGuard requiredRole="admin">...</AccessGuard>
// Or use without props to just block viewers from writing
export default function AccessGuard({ children, requiredRole, writeOnly }) {
  const admin = useAdmin();
  const router = useRouter();

  // Still loading admin info from token
  if (!admin) return null;

  // Check page-level access
  if (requiredRole && !canAccessPage(admin.role, router.pathname)) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShieldAlert className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-gray-600">Your role ({admin.role}) does not have permission to view this page.</p>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Write-only guard (hides write actions for viewers)
  if (writeOnly && !canWrite(admin.role)) {
    return null;
  }

  return children;
}
