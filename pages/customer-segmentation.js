import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Target, TrendingUp, Filter, Plus, Edit, Trash2 } from 'lucide-react';

export default function CustomerSegmentation() {
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSegments = [
        {
          id: 1,
          name: 'High Value Customers',
          description: 'Customers with orders > ₦50,000',
          criteria: { totalSpent: { min: 50000 }, orderCount: { min: 5 } },
          customerCount: 234,
          revenue: 12500000,
          color: 'bg-green-500'
        },
        {
          id: 2,
          name: 'New Customers',
          description: 'Registered in last 30 days',
          criteria: { registrationDate: { days: 30 } },
          customerCount: 156,
          revenue: 890000,
          color: 'bg-blue-500'
        },
        {
          id: 3,
          name: 'Inactive Customers',
          description: 'No orders in last 90 days',
          criteria: { lastOrderDate: { days: 90, operator: 'before' } },
          customerCount: 89,
          revenue: 0,
          color: 'bg-red-500'
        }
      ];
      setSegments(mockSegments);
    } catch (error) {
      console.error('Error loading segments:', error);
    } finally {
      setLoading(false);
    }
  };

  const CreateSegmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create New Segment</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Segment Name"
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded h-20"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Criteria</label>
            <select className="w-full p-2 border rounded">
              <option>Total Spent</option>
              <option>Order Count</option>
              <option>Registration Date</option>
              <option>Last Order Date</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button 
            onClick={() => setShowCreateModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              alert('Segment created!');
              setShowCreateModal(false);
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Segment
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Segmentation</h1>
        <p className="mt-1 text-sm text-gray-600">
          Organize customers into targeted segments for marketing campaigns.
        </p>
      </div>

      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Segment
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Segments</p>
              <p className="text-xl font-semibold">{segments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Segmented Customers</p>
              <p className="text-xl font-semibold">
                {segments.reduce((sum, seg) => sum + seg.customerCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-semibold">
                ₦{(segments.reduce((sum, seg) => sum + seg.revenue, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Filter className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Segment Size</p>
              <p className="text-xl font-semibold">
                {Math.round(segments.reduce((sum, seg) => sum + seg.customerCount, 0) / segments.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Segments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map((segment) => (
          <div key={segment.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => alert(`Editing ${segment.name}`)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Delete ${segment.name}?`)) {
                        setSegments(segments.filter(s => s.id !== segment.id));
                      }
                    }}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{segment.name}</h3>
              <p className="text-sm text-gray-600">{segment.description}</p>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Customers</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {segment.customerCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-medium">₦{(segment.revenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => setSelectedSegment(segment)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Segment Details Modal */}
      {selectedSegment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{selectedSegment.name}</h3>
              <button 
                onClick={() => setSelectedSegment(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Segment Criteria</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <pre className="text-sm">{JSON.stringify(selectedSegment.criteria, null, 2)}</pre>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Count</h4>
                  <p className="text-2xl font-bold">{selectedSegment.customerCount}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Total Revenue</h4>
                  <p className="text-2xl font-bold">₦{(selectedSegment.revenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => {
                    alert(`Exporting customers from ${selectedSegment.name}`);
                    setSelectedSegment(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Export Customers
                </button>
                <button 
                  onClick={() => {
                    alert(`Creating campaign for ${selectedSegment.name}`);
                    setSelectedSegment(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && <CreateSegmentModal />}

      <div className="mt-8">
        <Link href="/customer-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Customer Section
        </Link>
      </div>
    </div>
  );
}