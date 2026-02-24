import Link from 'next/link';
import { Settings, User, Shield, Bell, Cog, Database, Key, Globe } from 'lucide-react';

export default function SettingsPage() {
  const settingSections = [
    {
      title: 'Admin Profile',
      description: 'Manage your admin profile and preferences',
      icon: User,
      color: 'bg-blue-500',
      href: '/admin-users',
      status: 'Active'
    },
    {
      title: 'System Configuration',
      description: 'Platform settings and feature flags',
      icon: Cog,
      color: 'bg-green-500',
      href: '/system-configuration',
      status: 'Active'
    },
    {
      title: 'Security Management',
      description: 'Security settings and access controls',
      icon: Shield,
      color: 'bg-red-500',
      href: '/security-management',
      status: 'Active'
    },
    {
      title: 'Notification Settings',
      description: 'Email templates and notification preferences',
      icon: Bell,
      color: 'bg-purple-500',
      href: '/notification-templates',
      status: 'Active'
    },
    {
      title: 'Integration Settings',
      description: 'API keys and third-party integrations',
      icon: Key,
      color: 'bg-yellow-500',
      href: '/integrations',
      status: 'Coming Soon'
    },
    {
      title: 'Platform Configuration',
      description: 'General platform and company settings',
      icon: Globe,
      color: 'bg-indigo-500',
      href: '/platform-config',
      status: 'Coming Soon'
    },
    {
      title: 'Backup & Maintenance',
      description: 'System backup and maintenance controls',
      icon: Database,
      color: 'bg-gray-500',
      href: '/maintenance-mode',
      status: 'Active'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage admin settings, system configuration, and platform preferences.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {settingSections.map((section) => {
          const Icon = section.icon;
          const isComingSoon = section.status === 'Coming Soon';
          
          return (
            <div key={section.title}>
              {isComingSoon ? (
                <div className="bg-white overflow-hidden shadow rounded-lg opacity-60 cursor-not-allowed">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`flex-shrink-0 ${section.color} rounded-md p-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {section.status}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                      <p className="mt-2 text-sm text-gray-500">{section.description}</p>
                    </div>
                    
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-400">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href={section.href}>
                  <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className={`flex-shrink-0 ${section.color} rounded-md p-3`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {section.status}
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                        <p className="mt-2 text-sm text-gray-500">{section.description}</p>
                      </div>
                      
                      <div className="mt-4">
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Configure →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Settings */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Settings</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Link href="/admin-2fa">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full">
                <Shield className="h-4 w-4 mr-2" />
                Enable 2FA
              </button>
            </Link>
            <Link href="/maintenance-mode">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full">
                <Database className="h-4 w-4 mr-2" />
                Maintenance
              </button>
            </Link>
            <Link href="/system-monitoring">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full">
                <Cog className="h-4 w-4 mr-2" />
                System Status
              </button>
            </Link>
            <Link href="/security-audit-dashboard">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full">
                <Settings className="h-4 w-4 mr-2" />
                Security Audit
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}