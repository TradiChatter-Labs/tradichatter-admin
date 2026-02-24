import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Calendar as CalendarIcon, Play, Save, Trash2, Eye } from 'lucide-react';

export default function AdvancedReports() {
  const [reports, setReports] = useState([]);
  const [reportBuilder, setReportBuilder] = useState({
    name: '',
    type: 'table',
    dataSource: 'users',
    filters: [],
    columns: [],
    dateRange: { start: null, end: null },
    groupBy: '',
    aggregations: []
  });
  const [savedReports, setSavedReports] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchSavedReports();
  }, []);

  const fetchSavedReports = async () => {
    // Mock data - replace with API call
    setSavedReports([
      {
        id: 1,
        name: 'Monthly Revenue Report',
        type: 'chart',
        dataSource: 'transactions',
        lastRun: '2024-01-15T10:00:00Z',
        schedule: 'monthly'
      },
      {
        id: 2,
        name: 'User Activity Analysis',
        type: 'table',
        dataSource: 'users',
        lastRun: '2024-01-14T15:30:00Z',
        schedule: 'weekly'
      },
      {
        id: 3,
        name: 'Product Performance Dashboard',
        type: 'dashboard',
        dataSource: 'products',
        lastRun: '2024-01-13T09:15:00Z',
        schedule: 'daily'
      }
    ]);
  };

  const dataSourceOptions = [
    { value: 'users', label: 'Users', fields: ['id', 'name', 'email', 'created_at', 'status', 'kyc_status'] },
    { value: 'transactions', label: 'Transactions', fields: ['id', 'amount', 'type', 'status', 'created_at', 'user_id'] },
    { value: 'products', label: 'Products', fields: ['id', 'name', 'price', 'category', 'seller_id', 'status', 'views'] },
    { value: 'chats', label: 'Chat Messages', fields: ['id', 'message', 'sender_id', 'room_id', 'created_at', 'flagged'] },
    { value: 'orders', label: 'Orders', fields: ['id', 'total', 'status', 'created_at', 'buyer_id', 'seller_id'] }
  ];

  const filterOperators = ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'between', 'in', 'not_in'];
  const aggregationTypes = ['count', 'sum', 'avg', 'min', 'max', 'distinct_count'];

  const addFilter = () => {
    setReportBuilder({
      ...reportBuilder,
      filters: [...reportBuilder.filters, { field: '', operator: 'equals', value: '' }]
    });
  };

  const updateFilter = (index, field, value) => {
    const newFilters = [...reportBuilder.filters];
    newFilters[index][field] = value;
    setReportBuilder({ ...reportBuilder, filters: newFilters });
  };

  const removeFilter = (index) => {
    const newFilters = reportBuilder.filters.filter((_, i) => i !== index);
    setReportBuilder({ ...reportBuilder, filters: newFilters });
  };

  const addColumn = (field) => {
    if (!reportBuilder.columns.includes(field)) {
      setReportBuilder({
        ...reportBuilder,
        columns: [...reportBuilder.columns, field]
      });
    }
  };

  const removeColumn = (field) => {
    setReportBuilder({
      ...reportBuilder,
      columns: reportBuilder.columns.filter(col => col !== field)
    });
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Mock report generation - replace with API call
    setTimeout(() => {
      const mockData = generateMockData();
      setReportData(mockData);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockData = () => {
    if (reportBuilder.type === 'chart') {
      return [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 5000 },
        { name: 'Apr', value: 4500 },
        { name: 'May', value: 6000 },
        { name: 'Jun', value: 5500 }
      ];
    } else {
      return [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', created_at: '2024-01-01' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', created_at: '2024-01-02' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', created_at: '2024-01-03' }
      ];
    }
  };

  const saveReport = async () => {
    const newReport = {
      ...reportBuilder,
      id: Date.now(),
      lastRun: new Date().toISOString()
    };
    setSavedReports([newReport, ...savedReports]);
    alert('Report saved successfully!');
  };

  const exportReport = (format) => {
    // Mock export functionality
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  const getAvailableFields = () => {
    const source = dataSourceOptions.find(ds => ds.value === reportBuilder.dataSource);
    return source ? source.fields : [];
  };

  const renderChart = () => {
    if (!reportData) return null;

    switch (reportBuilder.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {reportData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  {reportBuilder.columns.map(col => (
                    <th key={col} className="border border-gray-300 p-2 text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    {reportBuilder.columns.map(col => (
                      <td key={col} className="border border-gray-300 p-2">{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advanced Report Builder</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Configuration */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Report Name</label>
                    <Input
                      value={reportBuilder.name}
                      onChange={(e) => setReportBuilder({...reportBuilder, name: e.target.value})}
                      placeholder="Enter report name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Report Type</label>
                    <Select value={reportBuilder.type} onValueChange={(value) => setReportBuilder({...reportBuilder, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Data Source</label>
                    <Select value={reportBuilder.dataSource} onValueChange={(value) => setReportBuilder({...reportBuilder, dataSource: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dataSourceOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Available Fields</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {getAvailableFields().map(field => (
                        <div key={field} className="flex items-center justify-between">
                          <span className="text-sm">{field}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addColumn(field)}
                            disabled={reportBuilder.columns.includes(field)}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reportBuilder.filters.map((filter, index) => (
                    <div key={index} className="space-y-2 p-3 border rounded">
                      <Select value={filter.field} onValueChange={(value) => updateFilter(index, 'field', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableFields().map(field => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={filter.operator} onValueChange={(value) => updateFilter(index, 'operator', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOperators.map(op => (
                            <SelectItem key={op} value={op}>{op.replace('_', ' ')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Input
                          value={filter.value}
                          onChange={(e) => updateFilter(index, 'value', e.target.value)}
                          placeholder="Filter value"
                        />
                        <Button size="sm" variant="outline" onClick={() => removeFilter(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addFilter}>
                    <Filter className="w-4 h-4 mr-2" />
                    Add Filter
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Report Preview */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Report Preview
                    <div className="flex gap-2">
                      <Button onClick={generateReport} disabled={isGenerating}>
                        <Play className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Generating...' : 'Generate'}
                      </Button>
                      <Button variant="outline" onClick={saveReport}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Report
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reportBuilder.columns.length > 0 && (
                    <div className="mb-4">
                      <label className="text-sm font-medium">Selected Columns:</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reportBuilder.columns.map(col => (
                          <Badge key={col} variant="secondary" className="cursor-pointer" onClick={() => removeColumn(col)}>
                            {col} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {isGenerating ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p>Generating report...</p>
                      </div>
                    </div>
                  ) : reportData ? (
                    <div>
                      {renderChart()}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      Configure your report and click Generate to see results
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-gray-600">
                        {report.type} • {report.dataSource} • Last run: {new Date(report.lastRun).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        Run
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.filter(r => r.schedule).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-gray-600">
                        Runs {report.schedule} • Next run: {new Date(Date.now() + 86400000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{report.schedule}</Badge>
                      <Button size="sm" variant="outline">Edit Schedule</Button>
                      <Button size="sm" variant="outline">Disable</Button>
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