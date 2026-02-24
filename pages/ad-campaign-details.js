import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, Play, Pause, Stop, Edit, Trash2, Eye, MousePointer, 
  DollarSign, Calendar, Target, Users, AlertTriangle, CheckCircle,
  Clock, TrendingUp, Download, RefreshCw
} from 'lucide-react';

const AdCampaignDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState('active');

  // Mock campaign data
  const campaign = {
    id: 'ADV-001',
    title: 'Summer Fashion Collection 2024',
    business: 'Fashion Hub',
    businessId: 'BUS-123',
    description: 'Promote our latest summer collection with trendy outfits for young professionals',
    status: 'active',
    adFormat: 'sponsored_messages',
    budget: 5000,
    spent: 3200,
    remaining: 1800,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    targetAudience: {
      ageRange: '25-35',
      location: 'Lagos, Abuja',
      interests: ['Fashion', 'Shopping', 'Lifestyle']
    },
    createdAt: '2024-01-10',
    lastModified: '2024-01-20'
  };

  const performanceMetrics = {
    impressions: 125000,
    clicks: 6250,
    ctr: 5.0,
    conversions: 312,
    conversionRate: 4.99,
    cpc: 0.51,
    cpm: 25.60,
    roi: 180
  };

  const dailyPerformance = [
    { date: '2024-01-15', impressions: 8500, clicks: 425, spent: 217 },
    { date: '2024-01-16', impressions: 9200, clicks: 460, spent: 235 },
    { date: '2024-01-17', impressions: 7800, clicks: 390, spent: 199 },
    { date: '2024-01-18', impressions: 10500, clicks: 525, spent: 268 },
    { date: '2024-01-19', impressions: 11200, clicks: 560, spent: 286 },
    { date: '2024-01-20', impressions: 9800, clicks: 490, spent: 250 }
  ];

  const audienceInsights = [
    { demographic: '25-30 years', percentage: 45, engagement: 'High' },
    { demographic: '31-35 years', percentage: 35, engagement: 'Medium' },
    { demographic: 'Lagos users', percentage: 60, engagement: 'High' },
    { demographic: 'Abuja users', percentage: 40, engagement: 'Medium' }
  ];

  const handleStatusChange = (newStatus) => {
    setCampaignStatus(newStatus);
    // API call to update campaign status
  };

  const handleSaveCampaign = () => {
    setIsEditing(false);
    // API call to save changes
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{campaign.title}</h1>
            <p className="text-gray-600">Campaign ID: {campaign.id} • {campaign.business}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Campaign Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Campaign Controls</h3>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={campaign.status === 'active' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('active')}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Activate
                </Button>
                <Button 
                  size="sm" 
                  variant={campaign.status === 'paused' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('paused')}
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleStatusChange('stopped')}
                >
                  <Stop className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impressions</p>
                <p className="text-2xl font-bold">{performanceMetrics.impressions.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total views</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clicks</p>
                <p className="text-2xl font-bold">{performanceMetrics.clicks.toLocaleString()}</p>
                <p className="text-sm text-gray-500">CTR: {performanceMetrics.ctr}%</p>
              </div>
              <MousePointer className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Spent</p>
                <p className="text-2xl font-bold">${campaign.spent.toLocaleString()}</p>
                <p className="text-sm text-gray-500">of ${campaign.budget.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ROI</p>
                <p className="text-2xl font-bold">{performanceMetrics.roi}%</p>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">Profitable</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">Campaign Title</label>
                      <Input defaultValue={campaign.title} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea defaultValue={campaign.description} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Budget ($)</label>
                      <Input type="number" defaultValue={campaign.budget} />
                    </div>
                    <Button onClick={handleSaveCampaign}>Save Changes</Button>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium">{campaign.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-medium">{campaign.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-medium">{campaign.endDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ad Format</p>
                      <p className="font-medium capitalize">{campaign.adFormat.replace('_', ' ')}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget & Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Budget</span>
                    <span className="font-bold">${campaign.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount Spent</span>
                    <span className="font-bold text-red-600">${campaign.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-bold text-green-600">${campaign.remaining.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    {((campaign.spent / campaign.budget) * 100).toFixed(1)}% of budget used
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressions" />
                  <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-600">Cost Per Click</p>
                <p className="text-2xl font-bold">${performanceMetrics.cpc}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-600">Cost Per Mille</p>
                <p className="text-2xl font-bold">${performanceMetrics.cpm}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics.conversionRate}%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Demographics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Age Range:</span>
                      <span className="font-medium">{campaign.targetAudience.ageRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Location:</span>
                      <span className="font-medium">{campaign.targetAudience.location}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.targetAudience.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audienceInsights.map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{insight.demographic}</p>
                      <p className="text-sm text-gray-500">{insight.percentage}% of audience</p>
                    </div>
                    <Badge variant={insight.engagement === 'High' ? 'default' : 'secondary'}>
                      {insight.engagement} Engagement
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Campaign Status</label>
                <Select value={campaignStatus} onValueChange={setCampaignStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Campaign
                </Button>
                <Button variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Flag for Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdCampaignDetails;