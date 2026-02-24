import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Shield } from 'lucide-react';

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      // Basic JWT expiry check
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem('admin_token');
          router.push('/login');
          return;
        }
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('admin_token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    if (router.pathname !== '/login') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [router.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600 animate-pulse" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (router.pathname === '/login') {
    return children;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}