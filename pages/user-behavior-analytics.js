import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, MessageCircle, TrendingUp, Eye, Clock, ShoppingCart, DollarSign, Target, BarChart3, Activity, Zap, Brain, Layers, Calendar, AlertTriangle } from 'lucide-react';

export default function UserBehaviorAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 15247,
    activeUsers: 8934,
    chatSessions: 2456,
    avgSessionDuration: '12:34',
    conversionRate: '3.2%',
    revenuePerUser: '$24.50',
    bounceRate: '28%',
    retentionRate: '67%'
  });

  const [chatAnalytics, setChatAnalytics] = useState([
    { time: '14:00', messages: 1250, users: 450, sentiment: 'positive' },
    { time: '14:15', messages: 1380, users: 520, sentiment: 'positive' },
    { time: '14:30', messages: 1150, users: 480, sentiment: 'neutral' },
    { time: '14:45', messages: 1420, users: 580, sentiment: 'positive' },
    { time: '15:00', messages: 1320, users: 510, sentiment: 'positive' }
  ]);

  const [userJourney, setUserJourney] = useState([
    { stage: 'App Download', users: 10000, conversion: 100, dropOff: 0 },
    { stage: 'Registration', users: 8500, conversion: 85, dropOff: 15 },
    { stage: 'Profile Setup', users: 7200, conversion: 72, dropOff: 13 },
    { stage: 'First Chat', users: 6100, conversion: 61, dropOff: 11 },
    { stage: 'First Purchase', users: 3200, conversion: 32, dropOff: 29 },
    { stage: 'Repeat Purchase', users: 2100, conversion: 21, dropOff: 11 }
  ]);

  const [revenueForecasting, setRevenueForecasting] = useState([
    { month: 'Jan', actual: 45000, predicted: 47000, growth: 4.4 },
    { month: 'Feb', actual: 52000, predicted: 54000, growth: 3.8 },
    { month: 'Mar', actual: null, predicted: 58000, growth: 7.4 },
    { month: 'Apr', actual: null, predicted: 62000, growth: 6.9 },
    { month: 'May', actual: null, predicted: 67000, growth: 8.1 }
  ]);

  const [competitorAnalysis, setCompetitorAnalysis] = useState([
    { competitor: 'WhatsApp Business', marketShare: 45, userGrowth: 2.1, features: 8 },
    { competitor: 'Telegram Business', marketShare: 25, userGrowth: 5.3, features: 6 },
    { competitor: 'Signal Business', marketShare: 15, userGrowth: 8.7, features: 4 },
    { competitor: 'TradiChatter', marketShare: 8, userGrowth: 12.4, features: 12 },
    { competitor: 'Others', marketShare: 7, userGrowth: -1.2, features: 3 }
  ]);

  const [userSegments, setUserSegments] = useState([
    { segment: 'Power Users', count: 1247, revenue: 45600, engagement: 92, churn: 2.1 },
    { segment: 'Regular Users', count: 5834, revenue: 89200, engagement: 67, churn: 8.4 },
    { segment: 'Casual Users', count: 6892, revenue: 23400, engagement: 34, churn: 15.7 },
    { segment: 'At-Risk Users', count: 1274, revenue: 8900, engagement: 12, churn: 45.2 }
  ]);

  const [behavioralInsights, setBehavioralInsights] = useState([
    { insight: 'Peak usage hours', value: '2-4 PM, 8-10 PM', trend: 'stable', impact: 'high' },
    { insight: 'Avg session duration', value: '12.5 minutes', trend: 'increasing', impact: 'medium' },
    { insight: 'Feature adoption rate', value: '67% (voice messages)', trend: 'increasing', impact: 'high' },
    { insight: 'Cross-platform usage', value: '34% mobile + web', trend: 'increasing', impact: 'medium' },
    { insight: 'Purchase intent signals', value: '23% show buying behavior', trend: 'stable', impact: 'high' }
  ]);

  const [engagementHeatmap, setEngagementHeatmap] = useState([
    { hour: '00', mon: 12, tue: 15, wed: 18, thu: 14, fri: 22, sat: 45, sun: 38 },
    { hour: '06', mon: 45, tue: 52, wed: 48, thu: 51, fri: 47, sat: 34, sun: 29 },
    { hour: '12', mon: 78, tue: 82, wed: 85, thu: 79, fri: 76, sat: 68, sun: 62 },
    { hour: '18', mon: 92, tue: 89, wed: 94, thu: 91, fri: 88, sat: 95, sun: 87 }
  ]);

  const [predictiveMetrics, setPredictiveMetrics] = useState({
    churnPrediction: { nextMonth: 8.4, confidence: 87 },
    revenueGrowth: { nextQuarter: 23.7, confidence: 92 },
    userAcquisition: { nextMonth: 1247, confidence: 78 },
    featureAdoption: { newFeature: 45.2, confidence: 83 }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Behavior Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Advanced analytics for user behavior, chat patterns, and revenue forecasting.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Active Users</dt>
                <dd className="text-lg font-medium text-gray-900">{analyticsData.activeUsers.toLocaleString()}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <MessageCircle className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Chat Sessions</dt>
                <dd className="text-lg font-medium text-gray-900">{analyticsData.chatSessions.toLocaleString()}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Conversion Rate</dt>
                <dd className="text-lg font-medium text-gray-900">{analyticsData.conversionRate}</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <dt className="text-sm font-medium text-gray-500">Revenue/User</dt>
                <dd className="text-lg font-medium text-gray-900">{analyticsData.revenuePerUser}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Chat Analytics */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Real-time Chat Analytics</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Messages</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chatAnalytics.map((data, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.messages.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.users.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        data.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        data.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {data.sentiment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Journey Tracking */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">User Journey Analytics</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {userJourney.map((stage, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      stage.conversion >= 50 ? 'bg-green-500' : stage.conversion >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{stage.stage}</h4>
                    <p className="text-sm text-gray-500">{stage.users.toLocaleString()} users</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{stage.conversion}% conversion</p>
                    {stage.dropOff > 0 && (
                      <p className="text-sm text-red-600">-{stage.dropOff}% drop-off</p>
                    )}
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${stage.conversion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Revenue Forecasting</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {revenueForecasting.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 w-12">{data.month}</span>
                    <div className="ml-4">
                      {data.actual ? (
                        <span className="text-sm text-gray-900">${data.actual.toLocaleString()}</span>
                      ) : (
                        <span className="text-sm text-blue-600 font-medium">${data.predicted.toLocaleString()} (predicted)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{data.growth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitor Analysis */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Competitor Analysis</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {competitorAnalysis.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{competitor.competitor}</h4>
                    <p className="text-xs text-gray-500">{competitor.marketShare}% market share</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${competitor.userGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {competitor.userGrowth > 0 ? '+' : ''}{competitor.userGrowth}%
                    </p>
                    <p className="text-xs text-gray-500">{competitor.features} features</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Segmentation */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Layers className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">User Segmentation</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userSegments.map((segment, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{segment.segment}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Users:</span>
                    <span className="text-xs font-medium">{segment.count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Revenue:</span>
                    <span className="text-xs font-medium">${segment.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Engagement:</span>
                    <span className="text-xs font-medium">{segment.engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Churn:</span>
                    <span className={`text-xs font-medium ${segment.churn < 10 ? 'text-green-600' : segment.churn < 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {segment.churn}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Behavioral Insights */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Behavioral Insights</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {behavioralInsights.map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    insight.impact === 'high' ? 'bg-red-500' : 
                    insight.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{insight.insight}</h4>
                    <p className="text-sm text-gray-600">{insight.value}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    insight.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                    insight.trend === 'decreasing' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {insight.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Heatmap & Predictive Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Engagement Heatmap</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-xs font-medium text-gray-500 text-left pb-2">Hour</th>
                    <th className="text-xs font-medium text-gray-500 text-center pb-2">Mon</th>
                    <th className="text-xs font-medium text-gray-500 text-center pb-2">Tue</th>
                    <th className="text-xs font-medium text-gray-500 text-center pb-2">Wed</th>
                    <th className="text-xs font-medium text-gray-500 text-center pb-2">Thu</th>
                    <th className="text-xs font-medium text-gray-500 text-center pb-2">Fri</th>
                    <th className="text-xs font-medium text-gray-500 text-center pb-2">Sat</th>
                    <th className="text-xs font-medium text-gray-500 text-center pb-2">Sun</th>
                  </tr>
                </thead>
                <tbody>
                  {engagementHeatmap.map((row, index) => (
                    <tr key={index}>
                      <td className="text-xs font-medium text-gray-900 py-1">{row.hour}:00</td>
                      {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                        <td key={day} className="text-center py-1">
                          <div className={`w-8 h-6 rounded text-xs flex items-center justify-center text-white ${
                            row[day] >= 80 ? 'bg-red-500' :
                            row[day] >= 60 ? 'bg-orange-500' :
                            row[day] >= 40 ? 'bg-yellow-500' :
                            row[day] >= 20 ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {row[day]}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Predictive Analytics</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Churn Prediction</h4>
                  <p className="text-xs text-gray-500">Next month forecast</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">{predictiveMetrics.churnPrediction.nextMonth}%</p>
                  <p className="text-xs text-gray-500">{predictiveMetrics.churnPrediction.confidence}% confidence</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Revenue Growth</h4>
                  <p className="text-xs text-gray-500">Next quarter forecast</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+{predictiveMetrics.revenueGrowth.nextQuarter}%</p>
                  <p className="text-xs text-gray-500">{predictiveMetrics.revenueGrowth.confidence}% confidence</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">User Acquisition</h4>
                  <p className="text-xs text-gray-500">Next month forecast</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{predictiveMetrics.userAcquisition.nextMonth.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{predictiveMetrics.userAcquisition.confidence}% confidence</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Feature Adoption</h4>
                  <p className="text-xs text-gray-500">New feature uptake</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-600">{predictiveMetrics.featureAdoption.newFeature}%</p>
                  <p className="text-xs text-gray-500">{predictiveMetrics.featureAdoption.confidence}% confidence</p>
                </div>
              </div>
            </div>
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