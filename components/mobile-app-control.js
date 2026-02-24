import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function MobileAppControl() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMobileAppData();
  }, []);

  const fetchMobileAppData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch('/api/mobile-app/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch users
      const usersRes = await fetch('/api/mobile-app/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // Fetch businesses
      const businessesRes = await fetch('/api/mobile-app/businesses');
      if (businessesRes.ok) {
        const businessesData = await businessesRes.json();
        setBusinesses(businessesData.businesses || []);
      }

    } catch (err) {
      setError('Failed to load mobile app data');
      console.error('Mobile app data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading mobile app data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mobile App Control</h1>
      
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Mobile Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.slice(0, 5).map((user, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium">{user.displayName || 'Anonymous'}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <Badge variant={user.disabled ? 'destructive' : 'default'}>
                  {user.disabled ? 'Disabled' : 'Active'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Businesses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {businesses.slice(0, 5).map((business, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium">{business.name}</div>
                  <div className="text-sm text-gray-500">{business.category}</div>
                </div>
                <Badge variant={business.status === 'active' ? 'default' : 'secondary'}>
                  {business.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={fetchMobileAppData} className="w-full">
        Refresh Data
      </Button>
    </div>
  );
}