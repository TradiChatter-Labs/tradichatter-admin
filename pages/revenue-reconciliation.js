import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, Download } from 'lucide-react';

export default function RevenueReconciliation() {
  const router = useRouter();
  const [reconciliationData, setReconciliationData] = useState({
    platformTotal: 2480000,
    paystackTotal: 2475000,
    flutterwaveTotal: 1250000,
    totalGateway: 3725000,
    difference: -1245000,
    lastSync: '2024-01-20 14:30:00'
  });

  const [discrepancies, setDiscrepancies] = useState([
    {
      id: 'DISC-001',
      date: '2024-01-19',
      platformAmount: 25000,
      gatewayAmount: 24250,
      difference: 750,
      gateway: 'Paystack',
      transactionId: 'TXN-001',
      status: 'investigating'
    },
    {
      id: 'DISC-002', 
      date: '2024-01-18',
      platformAmount: 15000,
      gatewayAmount: 15000,
      difference: 0,
      gateway: 'Flutterwave',
      transactionId: 'TXN-002',
      status: 'resolved'
    }
  ]);

  const handleSync = () => {
    setReconciliationData(prev => ({
      ...prev,
      lastSync: new Date().toLocaleString()
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Revenue Reconciliation</h1>
            <p className="mt-1 text-sm text-gray-600">
              Compare platform revenue with payment gateway records
            </p>
          </div>
          <button
            onClick={handleSync}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Now
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Platform Total</h3>
          <p className="text-2xl font-bold text-blue-600">₦{reconciliationData.platformTotal.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Gateway Total</h3>
          <p className="text-2xl font-bold text-green-600">₦{reconciliationData.totalGateway.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Difference</h3>
          <p className={`text-2xl font-bold ${reconciliationData.difference < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ₦{Math.abs(reconciliationData.difference).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Last Sync</h3>
          <p className="text-sm text-gray-900">{reconciliationData.lastSync}</p>
        </div>
      </div>

      {/* Gateway Breakdown */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Gateway Breakdown</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Paystack</p>
                  <p className="text-sm text-gray-500">Primary Gateway</p>
                </div>
                <p className="text-lg font-bold text-gray-900">₦{reconciliationData.paystackTotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Flutterwave</p>
                  <p className="text-sm text-gray-500">Secondary Gateway</p>
                </div>
                <p className="text-lg font-bold text-gray-900">₦{reconciliationData.flutterwaveTotal.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {reconciliationData.difference === 0 ? (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-medium text-green-600">Perfect Match!</p>
                </div>
              ) : (
                <div className="text-center">
                  <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-2" />
                  <p className="text-lg font-medium text-red-600">Discrepancy Found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancies Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Transaction Discrepancies</h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gateway Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gateway</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discrepancies.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{item.platformAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{item.gatewayAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${item.difference > 0 ? 'text-red-600' : item.difference < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      {item.difference === 0 ? '₦0' : `₦${Math.abs(item.difference).toLocaleString()}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.gateway}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}