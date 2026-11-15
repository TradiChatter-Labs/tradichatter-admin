import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users, Store, ShoppingCart, CreditCard, BarChart3, Settings, Shield,
  MessageSquare, Bell, UserCheck, Package, Menu, X, DollarSign, LogOut,
  Activity, Bot, Globe, Truck, ChevronDown, ChevronRight, Mail, Send, Filter,
  AlertTriangle, Star, FileText, Smartphone, Database, UserX, Search,
} from 'lucide-react';

// ── Route label map for breadcrumbs ──────────────────────────────────────
const ROUTE_LABELS = {
  '/': 'Dashboard',
  '/users': 'Users', '/businesses': 'Businesses', '/orders': 'Orders',
  '/escrow': 'Escrow', '/payments': 'Payments', '/invoices': 'Invoices',
  '/subscription-management': 'Subscriptions', '/kyc': 'KYC',
  '/inventory': 'Inventory', '/call-management': 'Call Management',
  '/product-moderation': 'Product Moderation', '/reviews-management': 'Reviews',
  '/chat-moderation': 'Chat Moderation', '/user-suspension': 'User Suspension',
  '/sourcehub': 'SourceHub', '/sourcehub/suppliers': 'Suppliers',
  '/sourcehub/orders': 'Wholesale Orders', '/sourcehub/treasury': 'Escrow & Treasury',
  '/sourcehub/disputes': 'Disputes', '/sourcehub/logistics': 'Logistics',
  '/ai-agents': 'AI Agent Dashboard', '/ai-agents/conversations': 'AI Conversations',
  '/ai-agents/knowledge-base': 'AI Knowledge Base', '/ai-agents/kill-switch': 'AI Kill Switch',
  '/voice-translation': 'Voice Translation', '/voice-controls': 'Voice Controls',
  '/avs-engine': 'Verification Queue', '/avs-engine/badges': 'Badge Management',
  '/avs-engine/weights': 'Weight Tuning', '/avs-engine/audit-trail': 'Audit Trail',
  '/affiliate-management': 'Management', '/affiliate-analytics': 'Analytics',
  '/affiliate-settings': 'Program Settings', '/advertising-management': 'Advertising',
  '/notification-templates': 'Email Templates', '/broadcasts': 'Email Campaigns',
  '/email-segments': 'Email Segments', '/push-notifications': 'Push Notifications',
  '/sms-campaigns': 'SMS', '/feature-flags': 'Feature Flags',
  '/financial': 'Financial', '/security-management': 'Security',
  '/admin-users': 'Admin Users', '/team-management': 'Team Management',
  '/seller-subaccounts': 'Seller Subaccounts', '/notifications': 'Admin Alerts',
  '/admin-activity-logs': 'Audit Logs', '/data-export': 'Data Export',
  '/backup-restore': 'Backup & Restore', '/mobile-control': 'Mobile Control',
  '/maintenance-mode': 'Maintenance', '/settings': 'Settings',
  '/system-monitoring': 'System Monitoring', '/analytics': 'Analytics',
  '/error-management-dashboard': 'Error Tracking',
  '/crm-activity': 'CRM Activity',
  '/group-buying': 'Group Buying',
  '/delivery-management': 'Delivery Management',
  '/withdrawals': 'Withdrawals',
};

const SECTION_LABELS = {
  'sourcehub': 'SourceHub (B2B)',
  'ai-agents': 'AI Systems',
  'avs-engine': 'AVS Engine',
};

const navGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: BarChart3 },
      { name: 'System Monitoring', href: '/system-monitoring', icon: Activity },
      { name: 'Error Tracking', href: '/error-management-dashboard', icon: AlertTriangle },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ]
  },
  {
    label: 'TradiChatter App',
    items: [
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Businesses', href: '/businesses', icon: Store },
      { name: 'Orders', href: '/orders', icon: ShoppingCart },
      { name: 'Escrow', href: '/escrow', icon: Shield },
      { name: 'Payments', href: '/payments', icon: CreditCard },
      { name: 'Invoices', href: '/invoices', icon: FileText },
      { name: 'Subscriptions', href: '/subscription-management', icon: CreditCard },
      { name: 'KYC', href: '/kyc', icon: UserCheck },
      { name: 'Inventory', href: '/inventory', icon: Package },
      { name: 'Call Management', href: '/call-management', icon: Globe },
      { name: 'CRM Activity', href: '/crm-activity', icon: Users },
      { name: 'Group Buying', href: '/group-buying', icon: ShoppingCart },
      { name: 'Delivery Management', href: '/delivery-management', icon: Truck },
    ]
  },
  {
    label: 'Moderation',
    items: [
      { name: 'Product Moderation', href: '/product-moderation', icon: Package },
      { name: 'Reviews', href: '/reviews-management', icon: Star },
      { name: 'Chat Moderation', href: '/chat-moderation', icon: MessageSquare },
      { name: 'User Suspension', href: '/user-suspension', icon: UserX },
    ]
  },
  {
    label: 'SourceHub (B2B)',
    items: [
      { name: 'Suppliers', href: '/sourcehub/suppliers', icon: Truck },
      { name: 'Wholesale Orders', href: '/sourcehub/orders', icon: ShoppingCart },
      { name: 'Escrow & Treasury', href: '/sourcehub/treasury', icon: DollarSign },
      { name: 'Disputes', href: '/sourcehub/disputes', icon: Shield },
      { name: 'Logistics', href: '/sourcehub/logistics', icon: Truck },
    ]
  },
  {
    label: 'AI Systems',
    items: [
      { name: 'AI Agent Dashboard', href: '/ai-agents', icon: Bot },
      { name: 'AI Conversations', href: '/ai-agents/conversations', icon: MessageSquare },
      { name: 'AI Knowledge Base', href: '/ai-agents/knowledge-base', icon: Bot },
      { name: 'AI Kill Switch', href: '/ai-agents/kill-switch', icon: Shield },
      { name: 'Voice Translation', href: '/voice-translation', icon: Globe },
      { name: 'Voice Controls', href: '/voice-controls', icon: Settings },
    ]
  },
  {
    label: 'AVS Engine',
    items: [
      { name: 'Verification Queue', href: '/avs-engine', icon: UserCheck },
      { name: 'Badge Management', href: '/avs-engine/badges', icon: Shield },
      { name: 'Weight Tuning', href: '/avs-engine/weights', icon: Settings },
      { name: 'Audit Trail', href: '/avs-engine/audit-trail', icon: BarChart3 },
    ]
  },
  {
    label: 'Affiliates (V2)',
    items: [
      { name: 'Management', href: '/affiliate-management', icon: Users },
      { name: 'Analytics', href: '/affiliate-analytics', icon: BarChart3 },
      { name: 'Program Settings', href: '/affiliate-settings', icon: Settings },
    ]
  },
  {
    label: 'Marketing & Comms',
    items: [
      { name: 'Advertising', href: '/advertising-management', icon: BarChart3 },
      { name: 'Email Templates', href: '/notification-templates', icon: Mail },
      { name: 'Email Campaigns', href: '/broadcasts', icon: Send },
      { name: 'Email Segments', href: '/email-segments', icon: Filter },
      { name: 'Push Notifications', href: '/push-notifications', icon: Smartphone },
      { name: 'SMS', href: '/sms-campaigns', icon: MessageSquare },
    ]
  },
  {
    label: 'Configuration',
    items: [
      { name: 'Feature Flags', href: '/feature-flags', icon: Settings },
      { name: 'Financial', href: '/financial', icon: DollarSign },
      { name: 'Security', href: '/security-management', icon: Shield },
      { name: 'Admin Users', href: '/admin-users', icon: Users },
      { name: 'Team Management', href: '/team-management', icon: Users },
      { name: 'Seller Subaccounts', href: '/seller-subaccounts', icon: Store },
      { name: 'Admin Alerts', href: '/notifications', icon: Bell },
      { name: 'Audit Logs', href: '/admin-activity-logs', icon: BarChart3 },
      { name: 'Data Export', href: '/data-export', icon: Database },
      { name: 'Backup & Restore', href: '/backup-restore', icon: Database },
      { name: 'Mobile Control', href: '/mobile-control', icon: Smartphone },
      { name: 'Withdrawals', href: '/withdrawals', icon: DollarSign },
      { name: 'Maintenance', href: '/maintenance-mode', icon: Settings },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  },
];

// ── NavGroup ──────────────────────────────────────────────────────────────
function NavGroup({ group, router }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600"
      >
        <span>{group.label}</span>
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
      {open && (
        <nav className="space-y-0.5 px-2">
          {group.items.map((item) => {
            const Icon = item.icon;
            // Fix: exact match for '/', prefix match for all others
            const active = item.href === '/'
              ? router.pathname === '/'
              : router.pathname === item.href || router.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-2 py-1.5 text-sm font-medium rounded-md ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-4 w-4 ${active ? 'text-blue-500' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────
function Breadcrumb({ pathname }) {
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Dashboard', href: '/' }];

  // Build intermediate crumbs for nested paths like /sourcehub/orders
  if (segments.length > 1 && SECTION_LABELS[segments[0]]) {
    crumbs.push({ label: SECTION_LABELS[segments[0]], href: `/${segments[0]}` });
  }
  crumbs.push({ label: ROUTE_LABELS[pathname] || segments[segments.length - 1], href: pathname });

  return (
    <nav className="flex items-center space-x-1 text-xs text-gray-500 mb-4">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center">
          {i > 0 && <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />}
          {i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="hover:text-blue-600 hover:underline">{crumb.label}</Link>
          ) : (
            <span className="text-gray-700 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ── Global Search ─────────────────────────────────────────────────────────
function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  const search = useCallback(async (q) => {
    if (q.length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search/global?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch { setResults(null); }
    finally { setLoading(false); }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
  };

  const handleNavigate = (href) => {
    setOpen(false);
    setQuery('');
    setResults(null);
    router.push(href);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasResults = results && (results.users?.length || results.businesses?.length || results.orders?.length || results.escalations?.length);

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search users, businesses, orders..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        {loading && <div className="absolute right-3 top-2.5 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
      </div>

      {open && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {!hasResults && !loading && (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">No results for "{query}"</div>
          )}

          {results?.users?.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase bg-gray-50 border-b">Users</div>
              {results.users.map(u => (
                <button key={u.id} onClick={() => handleNavigate('/users')} className="w-full flex items-center px-4 py-2.5 hover:bg-blue-50 text-left">
                  <Users className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{u.display_name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{u.phone} · {u.user_type}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results?.businesses?.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase bg-gray-50 border-b border-t">Businesses</div>
              {results.businesses.map(b => (
                <button key={b.id} onClick={() => handleNavigate('/businesses')} className="w-full flex items-center px-4 py-2.5 hover:bg-blue-50 text-left">
                  <Store className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{b.business_name}</div>
                    <div className="text-xs text-gray-500">{b.city}, {b.state} · {b.subscription_status || 'free'}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results?.orders?.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase bg-gray-50 border-b border-t">Orders</div>
              {results.orders.map(o => (
                <button key={o.id} onClick={() => handleNavigate('/orders')} className="w-full flex items-center px-4 py-2.5 hover:bg-blue-50 text-left">
                  <ShoppingCart className="h-4 w-4 text-orange-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Order #{o.id?.slice(0, 8)}</div>
                    <div className="text-xs text-gray-500">₦{(o.total_amount || 0).toLocaleString()} · {o.status}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results?.escalations?.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase bg-gray-50 border-b border-t">Escalations</div>
              {results.escalations.map(e => (
                <button key={e.id} onClick={() => handleNavigate('/ai-agents')} className="w-full flex items-center px-4 py-2.5 hover:bg-blue-50 text-left">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{e.customer_id?.slice(0, 16)}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{e.customer_message?.slice(0, 60)}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Notifications Bell ────────────────────────────────────────────────────
function NotificationsBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ unreadCount: 0, notifications: [], systemAlerts: [] });
  const [marking, setMarking] = useState(false);
  const wrapperRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/system/notifications-summary');
      const json = await res.json();
      if (json.success) setData(json);
    } catch { /* silent fail */ }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAsRead = async (id) => {
    // Optimistic update — decrement immediately
    setData(prev => ({
      ...prev,
      unreadCount: Math.max(0, prev.unreadCount - 1),
      notifications: prev.notifications.map(n => n.id === id ? { ...n, status: 'read' } : n),
    }));
    try {
      await fetch('/api/system/notifications-summary', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch { /* silent — optimistic already applied */ }
  };

  const markAllAsRead = async () => {
    setMarking(true);
    // Optimistic update
    setData(prev => ({
      ...prev,
      unreadCount: 0,
      notifications: prev.notifications.map(n => ({ ...n, status: 'read' })),
    }));
    try {
      await fetch('/api/system/notifications-summary', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
    } catch { /* silent */ }
    finally { setMarking(false); }
  };

  const timeAgo = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const handleNotificationClick = (n) => {
    if (n.status !== 'read') markAsRead(n.id);
    setOpen(false);
    if (n.href) router.push(n.href);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {data.unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {data.unreadCount > 9 ? '9+' : data.unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Notifications</span>
            {data.unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={marking}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                {marking ? 'Marking...' : 'Mark all read'}
              </button>
            )}
          </div>

          {/* Action Required — system alerts, no badge contribution */}
          {data.systemAlerts?.length > 0 && (
            <div>
              <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                Action Required
              </div>
              {data.systemAlerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => { setOpen(false); if (alert.href) router.push(alert.href); }}
                  className="w-full px-4 py-2.5 text-left hover:bg-amber-50 border-b border-gray-50"
                >
                  <p className="text-sm text-gray-800 leading-snug">{alert.message}</p>
                </button>
              ))}
            </div>
          )}

          {/* Recent notifications — DB rows with unread dots */}
          <div>
            {data.systemAlerts?.length > 0 && (
              <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                Recent
              </div>
            )}
            {data.notifications.length === 0 ? (
              <div className="px-4 py-5 text-sm text-gray-400 text-center">No recent notifications</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {data.notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-2.5"
                  >
                    <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      n.status !== 'read' ? 'bg-blue-500' : 'bg-transparent'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${
                        n.status !== 'read' ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.created_at)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100">
            <button
              onClick={() => { setOpen(false); router.push('/notifications'); }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────
export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('admin_token');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">TradiChatter Admin</h1>
        <button
          onClick={handleLogout}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-md"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-gray-300">
        {navGroups.map((group) => (
          <NavGroup key={group.label} group={group} router={router} />
        ))}
      </div>
      <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-400">
        Admin v2.2 — Streamlined
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white h-full">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button onClick={() => setSidebarOpen(false)} className="ml-1 flex h-10 w-10 items-center justify-center rounded-full">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header bar — search + bell */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden -ml-1 p-1.5 text-gray-500 hover:text-gray-900 rounded-md"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Global search */}
          <GlobalSearch />

          {/* Notifications bell */}
          <NotificationsBell />

          {/* Logout on mobile */}
          <button
            onClick={handleLogout}
            className="lg:hidden p-1.5 text-gray-400 hover:text-red-600 rounded-md"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <Breadcrumb pathname={router.pathname} />
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
