import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CreditCard, ShoppingCart, Users, Eye, Trash2, Search, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system/notifications-summary?limit=100');
      const json = await res.json();
      if (json.success) {
        setNotifications(json.notifications || []);
        setSystemAlerts(json.systemAlerts || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id) => {
    await fetch('/api/system/notifications-summary', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'read' } : n));
  };

  const markAllAsRead = async () => {
    await fetch('/api/system/notifications-summary', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
  };

  const deleteNotification = async (id) => {
    await fetch('/api/system/notifications-summary', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const typeIcon = (type) => ({ security: '🔒', payment: '💳', order: '📦', user: '👤', system: '⚙️', kyc: '🪪', backup: '💾', escalation: '💬' }[type] || '🔔');
  const priorityColor = (p) => ({ high: 'bg-red-100 text-red-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-green-100 text-green-800' }[p] || 'bg-gray-100 text-gray-800');

  const formatTime = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  const filtered = notifications.filter(n => {
    const matchFilter = filter === 'all' || n.type === filter || (filter === 'unread' && n.status !== 'read');
    const matchSearch = !search || n.message?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unread = notifications.filter(n => n.status !== 'read').length;
  const highPriority = notifications.filter(n => n.priority === 'high').length;
  const today = notifications.filter(n => Date.now() - new Date(n.created_at).getTime() < 86400000).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Bell className="mr-3 h-8 w-8" />Admin Notifications</h1>
        <p className="mt-1 text-sm text-gray-600">System alerts, security events, and platform notifications.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-5 flex items-center"><Bell className="h-6 w-6 text-blue-600" /><div className="ml-3"><p className="text-sm text-gray-500">Total</p><p className="text-lg font-semibold">{notifications.length}</p></div></div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center"><Eye className="h-6 w-6 text-red-600" /><div className="ml-3"><p className="text-sm text-gray-500">Unread</p><p className="text-lg font-semibold">{unread}</p></div></div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center"><AlertTriangle className="h-6 w-6 text-yellow-600" /><div className="ml-3"><p className="text-sm text-gray-500">High Priority</p><p className="text-lg font-semibold">{highPriority}</p></div></div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center"><CheckCircle className="h-6 w-6 text-green-600" /><div className="ml-3"><p className="text-sm text-gray-500">Today</p><p className="text-lg font-semibold">{today}</p></div></div>
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">System Alerts — Action Required</h3>
          <div className="space-y-2">
            {systemAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between">
                <span className="text-sm text-amber-700">{alert.message}</span>
                <Link href={alert.href} className="text-xs text-amber-600 underline hover:text-amber-800">View →</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="security">Security</option>
            <option value="payment">Payments</option>
            <option value="order">Orders</option>
            <option value="user">Users</option>
            <option value="system">System</option>
          </select>
        </div>
        <button onClick={markAllAsRead} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center">
          <Eye className="h-4 w-4 mr-2" />Mark All Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Notifications ({filtered.length})</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{search || filter !== 'all' ? 'No notifications match your filter.' : 'All caught up! No notifications.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filtered.map(n => (
              <div key={n.id} className={`p-4 flex items-start justify-between ${n.status !== 'read' ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{typeIcon(n.type)}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {n.priority && <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColor(n.priority)}`}>{n.priority}</span>}
                      {n.status !== 'read' && <span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span>}
                    </div>
                    <p className={`text-sm ${n.status !== 'read' ? 'font-medium text-blue-900' : 'text-gray-900'}`}>{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTime(n.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-1 ml-4 flex-shrink-0">
                  {n.status !== 'read' && (
                    <button onClick={() => markAsRead(n.id)} className="p-2 text-gray-400 hover:text-blue-600" title="Mark as read"><Eye className="h-4 w-4" /></button>
                  )}
                  <button onClick={() => deleteNotification(n.id)} className="p-2 text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
