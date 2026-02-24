import Link from 'next/link';
import { Settings, Flag, Cog, Bell, Wrench } from 'lucide-react';

export default function SystemConfiguration() {
  const configSections = [
    {
      title: 'Feature Flags',
      description: 'Enable/disable features across the platform',
      icon: Flag,
      color: 'bg-blue-500',
      href: '/feature-flags',
      status: 'Active'
    },
    {
      title: 'App Configuration',
      description: 'Manage application settings and parameters',
      icon: Cog,
      color: 'bg-green-500',
      href: '/app-configuration',
      status: 'Active'
    },
    {
      title: 'Notification Templates',
      description: 'Configure email and push notification templates',
      icon: Bell,
      color: 'bg-purple-500',
      href: '/notification-templates',
      status: 'Active'
    },
    {
      title: 'Maintenance Mode',
      description: 'Control system maintenance and downtime',
      icon: Wrench,
      color: 'bg-orange-500',
      href: '/maintenance-mode',
      status: 'Inactive'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage platform settings, feature flags, and system configuration.
        </p>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {configSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`flex-shrink-0 ${section.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      section.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
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
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <Flag className="h-4 w-4 mr-2" />
              Toggle Feature Flag
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Wrench className="h-4 w-4 mr-2" />
              Enable Maintenance
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Cog className="h-4 w-4 mr-2" />
              Backup Config
            </button>
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