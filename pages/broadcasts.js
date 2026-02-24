import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, Users, Calendar as CalendarIcon, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Broadcasts() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    message: '',
    type: 'push',
    audience: 'all',
    scheduledFor: null,
    filters: {}
  });
  const [selectedDate, setSelectedDate] = useState();
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    // Mock data - replace with API call
    setBroadcasts([
      {
        id: 1,
        title: 'New Feature Launch',
        message: 'Check out our new marketplace features!',
        type: 'push',
        audience: 'all',
        status: 'sent',
        sentAt: '2024-01-15T10:00:00Z',
        recipients: 15420,
        openRate: 68.5
      },
      {
        id: 2,
        title: 'Maintenance Notice',
        message: 'Scheduled maintenance on Sunday 2-4 AM',
        type: 'email',
        audience: 'active_users',
        status: 'scheduled',
        scheduledFor: '2024-01-20T02:00:00Z',
        recipients: 8930
      }
    ]);
  };

  const handleSendBroadcast = async () => {
    const broadcast = {
      ...newBroadcast,
      id: Date.now(),
      status: newBroadcast.scheduledFor ? 'scheduled' : 'sending',
      sentAt: new Date().toISOString(),
      recipients: getAudienceCount()
    };

    setBroadcasts([broadcast, ...broadcasts]);
    setNewBroadcast({
      title: '',
      message: '',
      type: 'push',
      audience: 'all',
      scheduledFor: null,
      filters: {}
    });
  };

  const getAudienceCount = () => {
    const counts = {
      all: 15420,
      active_users: 8930,
      sellers: 2340,
      buyers: 13080,
      premium: 1250
    };
    return counts[newBroadcast.audience] || 0;
  };

  const getStatusBadge = (status) => {
    const variants = {
      sent: 'default',
      sending: 'secondary',
      scheduled: 'outline',
      failed: 'destructive'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Broadcast System</h1>
        <Button onClick={() => setPreviewMode(!previewMode)}>
          <Eye className="w-4 h-4 mr-2" />
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </Button>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Broadcast</TabsTrigger>
          <TabsTrigger value="history">Broadcast History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>New Broadcast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newBroadcast.title}
                    onChange={(e) => setNewBroadcast({...newBroadcast, title: e.target.value})}
                    placeholder="Broadcast title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newBroadcast.type} onValueChange={(value) => setNewBroadcast({...newBroadcast, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="in_app">In-App Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={newBroadcast.message}
                  onChange={(e) => setNewBroadcast({...newBroadcast, message: e.target.value})}
                  placeholder="Your broadcast message..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Audience</label>
                  <Select value={newBroadcast.audience} onValueChange={(value) => setNewBroadcast({...newBroadcast, audience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users ({getAudienceCount().toLocaleString()})</SelectItem>
                      <SelectItem value="active_users">Active Users (8,930)</SelectItem>
                      <SelectItem value="sellers">Sellers (2,340)</SelectItem>
                      <SelectItem value="buyers">Buyers (13,080)</SelectItem>
                      <SelectItem value="premium">Premium Users (1,250)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Schedule (Optional)</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {selectedDate ? selectedDate.toDateString() : 'Send now'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {previewMode && (
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-semibold">{newBroadcast.title || 'Broadcast Title'}</div>
                      <div className="text-gray-600">{newBroadcast.message || 'Your message will appear here...'}</div>
                      <div className="text-sm text-gray-500">
                        To: {getAudienceCount().toLocaleString()} users via {newBroadcast.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSendBroadcast} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  {selectedDate ? 'Schedule Broadcast' : 'Send Now'}
                </Button>
                <Button variant="outline">Save as Template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {broadcasts.map((broadcast) => (
                  <div key={broadcast.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{broadcast.title}</h3>
                        {getStatusBadge(broadcast.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{broadcast.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span><Users className="w-4 h-4 inline mr-1" />{broadcast.recipients?.toLocaleString()} recipients</span>
                        <span><Clock className="w-4 h-4 inline mr-1" />{new Date(broadcast.sentAt || broadcast.scheduledFor).toLocaleDateString()}</span>
                        {broadcast.openRate && <span>Open Rate: {broadcast.openRate}%</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {broadcast.status === 'scheduled' && (
                        <Button variant="outline" size="sm">Cancel</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Welcome Message', type: 'push', usage: 45 },
                  { name: 'Maintenance Notice', type: 'email', usage: 12 },
                  { name: 'Feature Announcement', type: 'in_app', usage: 23 },
                  { name: 'Security Alert', type: 'sms', usage: 8 }
                ].map((template, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Used {template.usage} times</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Use Template</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}