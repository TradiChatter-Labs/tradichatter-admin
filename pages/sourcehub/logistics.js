import { useState, useEffect } from 'react';
import { Truck, RefreshCw, MapPin, Clock, CheckCircle, Package } from 'lucide-react';

export default function SourceHubLogistics() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchLogistics(); }, [filter]);

  const fetchLogistics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/sourcehub/logistics?${params}`);
      const json = await res.json();
      if (json.success) {
        setShipments(json.shipments || []);
        setTotal(json.total || 0);
      }
    } catch (err) {
      console.error('Fetch logistics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      customs: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SourceHub — Logistics</h1>
        <p className="mt-1 text-sm text-gray-600">Track shipments and logistics providers across all B2B orders.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Shipments</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <Truck className="h-5 w-5 text-indigo-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">In Transit</p>
              <p className="text-2xl font-bold text-indigo-600">{shipments.filter(s => s.status === 'in_transit').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Pending Pickup</p>
              <p className="text-2xl font-bold text-yellow-600">{shipments.filter(s => s.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{shipments.filter(s => s.status === 'delivered').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="customs">Customs</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
        </select>
        <button onClick={fetchLogistics} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : shipments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No shipments found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{shipment.tracking_id || shipment.id?.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{shipment.order_id?.slice(0, 8) || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{shipment.carrier || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{shipment.origin || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{shipment.destination || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                      {shipment.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {shipment.eta ? new Date(shipment.eta).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
