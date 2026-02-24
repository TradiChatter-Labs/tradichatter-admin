import Link from 'next/link';
import { useRouter } from 'next/router';
import { Shield, Flag, Ban, Settings, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function ContentModeration() {
  const router = useRouter();

  const moderationSections = [
    {
      title: 'Reported Content',
      description: 'Review flagged messages, businesses, and reviews',
      icon: Flag,
      color: 'bg-red-500',
      href: '/reported-content',
      status: 'Active',
      count: 23
    },
    {
      title: 'Moderation Rules',
      description: 'Configure automated spam detection and content filters',
      icon: Settings,
      color: 'bg-blue-500',
      href: '/moderation-rules',
      status: 'Active',
      count: 12
    },
    {
      title: 'Content Takedown',
      description: 'Remove inappropriate content and manage violations',
      icon: Shield,
      color: 'bg-orange-500',
      href: '/content-takedown',
      status: 'Active',
      count: 8
    },
    {
      title: 'User Management',
      description: 'Suspend, ban, or restrict user accounts',
      icon: Ban,
      color: 'bg-purple-500',
      href: '/user-suspension',
      status: 'Active',
      count: 5
    }
  ];

  const recentActivity = [
    { type: 'report', content: 'Inappropriate message reported', time: '2 minutes ago', severity: 'high' },
    { type: 'ban', content: 'User @spammer123 banned', time: '15 minutes ago', severity: 'medium' },
    { type: 'takedown', content: 'Business listing removed', time: '1 hour ago', severity: 'high' },
    { type: 'rule', content: 'Spam filter updated', time: '2 hours ago', severity: 'low' }
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor and moderate platform content, manage user violations, and configure automated rules.
        </p>
      </div>

      {/* Alert Banner */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Pending Reviews</h3>
            <p className="text-sm text-yellow-700">
              You have 23 reported items awaiting review and 5 users pending moderation action.
            </p>
          </div>
        </div>
      </div>

      {/* Moderation Sections */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {moderationSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`flex-shrink-0 ${section.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        section.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {section.status}
                      </span>
                      {section.count > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {section.count}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{section.description}</p>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Manage →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Moderation Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.severity === 'high' ? 'bg-red-500' :
                    activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm text-gray-900">{activity.content}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
              <Flag className="h-4 w-4 mr-2" />
              Review Reports
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Ban className="h-4 w-4 mr-2" />
              Ban User
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Shield className="h-4 w-4 mr-2" />
              Content Takedown
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Settings className="h-4 w-4 mr-2" />
              Update Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}