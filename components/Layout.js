import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users, Store, ShoppingCart, CreditCard, BarChart3, Settings, Shield,
  MessageSquare, Bell, UserCheck, Package, Menu, X, DollarSign, LogOut,
  Activity, Bot, Globe, Truck, ChevronDown, ChevronRight
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: BarChart3 },
      { name: 'System Monitoring', href: '/system-monitoring', icon: Activity },
    ]
  },
  {
    label: 'Retail App',
    items: [
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Businesses', href: '/businesses', icon: Store },
      { name: 'Orders', href: '/orders', icon: ShoppingCart },
      { name: 'Escrow', href: '/escrow', icon: Shield },
      { name: 'Payments', href: '/payments', icon: CreditCard },
      { name: 'Subscriptions', href: '/subscription-management', icon: CreditCard },
      { name: 'KYC', href: '/kyc', icon: UserCheck },
      { name: 'Inventory', href: '/inventory', icon: Package },
      { name: 'Chat Moderation', href: '/chat-moderation', icon: MessageSquare },
      { name: 'Call Management', href: '/call-management', icon: Globe },
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
      { name: 'AI Kill Switch', href: '/ai-agents/kill-switch', icon: Shield },
      { name: 'Voice Translation', href: '/voice-translation', icon: Globe },
    ]
  },
  {
    label: 'AVS Engine',
    items: [
      { name: 'Verification Queue', href: '/avs-engine', icon: UserCheck },
      { name: 'Badge Management', href: '/avs-engine/badges', icon: Shield },
      { name: 'Weight Tuning', href: '/avs-engine/weights', icon: Settings },
    ]
  },
  {
    label: 'Marketing & Affiliates',
    items: [
      { name: 'Affiliates', href: '/affiliate-management', icon: DollarSign },
      { name: 'Advertising', href: '/advertising-management', icon: BarChart3 },
      { name: 'Notifications', href: '/notifications', icon: Bell },
    ]
  },
  {
    label: 'Configuration',
    items: [
      { name: 'Feature Flags', href: '/feature-flags', icon: Settings },
      { name: 'Security', href: '/security', icon: Shield },
      { name: 'Admin Users', href: '/admin-users', icon: Users },
      { name: 'Activity Logs', href: '/admin-activity-logs', icon: BarChart3 },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  },
];

function NavGroup({ group, router, collapsed }) {
  const [open, setOpen] = useState(true);
  const isActive = group.items.some(item => router.pathname === item.href || router.pathname.startsWith(item.href + '/'));

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
            const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-2 py-1.5 text-sm font-medium rounded-md ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
        Admin v2.0 — All Systems
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
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
