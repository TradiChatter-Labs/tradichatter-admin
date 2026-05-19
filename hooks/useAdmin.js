import { useState, useEffect } from 'react';

// Decodes admin info from the JWT stored in localStorage
// No API call, no context provider — just reads the token
export function useAdmin() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      setAdmin({
        id: payload.adminId,
        email: payload.email,
        name: payload.name,
        role: payload.role || 'viewer',
      });
    } catch (e) {
      setAdmin(null);
    }
  }, []);

  return admin;
}

export default useAdmin;
