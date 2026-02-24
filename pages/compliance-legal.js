import Link from 'next/link';
import { Shield, Download, Trash2, FileText, Clock, Users, Database, Scale } from 'lucide-react';

export default function ComplianceLegal() {
  const stats = [
    { name: 'GDPR Requests', value: '23', icon: Download, change: '+3 this week' },
    { name: 'Data Deletions', value: '8', icon: Trash2, change: '+1 today' },
    { name: 'Active Policies', value: '4', icon: FileText, change: 'Updated 2 days ago' },
    { name: 'Compliance Score', value: '98%', icon: Shield, change: '+2% this month' },
  ];

  const sections = [
    {
      title: 'Data Export Tools',
      description: 'GDPR compliance data export and user data requests',
      icon: Download,
      color: 'bg-blue-500',
      href: '/data-export',
      features: ['User Data Export', 'GDPR Requests', 'Data Processing Records', 'Export History']
    },
    {
      title: 'Data Deletion',
      description: 'Right to be forgotten and user data deletion management',
      icon: Trash2,
      color: 'bg-red-500',
      href: '/data-deletion',
      features: ['Delete User Data', 'Anonymization', 'Deletion Logs', 'Recovery Options']
    },
    {
      title: 'Legal Documents',
      description: 'Terms of service and privacy policy management',
      icon: FileText,
      color: 'bg-green-500',
      href: '/legal-documents',
      features: ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'User Agreements']
    },
    {
      title: 'Document Versioning',
      description: 'Version control and history for legal documents',
      icon: Clock,
      color: 'bg-purple-500',
      href: '/document-versioning',
      features: ['Version History', 'Change Tracking', 'Approval Workflow', 'Rollback Options']
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Compliance & Legal</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage GDPR compliance, data protection, and legal document management.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div className="ml-2 text-sm text-gray-600">{stat.change}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${section.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {section.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Access Section →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link href="/data-export" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Export Data</div>
            </Link>
            <Link href="/data-deletion" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Trash2 className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Delete Data</div>
            </Link>
            <Link href="/legal-documents" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Legal Docs</div>
            </Link>
            <Link href="/document-versioning" className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Versions</div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}