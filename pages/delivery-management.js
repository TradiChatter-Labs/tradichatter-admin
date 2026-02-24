import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // Mock data
    setDeliveries([
      { id: 1, business: 'Shop A', order: '#001', status: 'pending', driver: 'John Doe' },
      { id: 2, business: 'Shop B', order: '#002', status: 'delivered', driver: 'Jane Smith' }
    ]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Delivery Management</h1>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Deliveries</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {deliveries.map(delivery => (
              <div key={delivery.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <p className="font-medium">{delivery.business}</p>
                  <p className="text-sm text-gray-600">Order: {delivery.order}</p>
                  <p className="text-sm text-gray-600">Driver: {delivery.driver}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  delivery.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {delivery.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}