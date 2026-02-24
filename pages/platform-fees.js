import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Settings, Save, Percent } from 'lucide-react';

export default function PlatformFees() {
  const router = useRouter();
  const [feeConfig, setFeeConfig] = useState({
    transactionFee: 2.5,
    escrowFee: 1.0,
    withdrawalFee: 0.5,
    affiliateCommission: 10.0,
    businessCommission: 5.0,
    minimumFee: 50,
    maximumFee: 5000
  });

  const [categoryFees, setCategoryFees] = useState([
    { category: 'Electronics', fee: 3.0 },
    { category: 'Fashion', fee: 2.5 },
    { category: 'Food & Beverages', fee: 2.0 },
    { category: 'Services', fee: 4.0 },
    { category: 'Real Estate', fee: 1.5 }
  ]);

  const handleSave = () => {
    // Save fee configuration
    alert('Fee configuration saved successfully!');
  };

  const updateCategoryFee = (index, newFee) => {
    setCategoryFees(prev => prev.map((item, i) => 
      i === index ? { ...item, fee: parseFloat(newFee) } : item
    ));
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="mr-3 h-8 w-8" />
              Platform Fee Configuration
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Configure commission rates and fee structures for the platform
            </p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Fee Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">General Fee Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={feeConfig.transactionFee}
                  onChange={(e) => setFeeConfig({...feeConfig, transactionFee: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escrow Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={feeConfig.escrowFee}
                  onChange={(e) => setFeeConfig({...feeConfig, escrowFee: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={feeConfig.withdrawalFee}
                  onChange={(e) => setFeeConfig({...feeConfig, withdrawalFee: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Fee (₦)
                </label>
                <input
                  type="number"
                  value={feeConfig.minimumFee}
                  onChange={(e) => setFeeConfig({...feeConfig, minimumFee: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Fee (₦)
                </label>
                <input
                  type="number"
                  value={feeConfig.maximumFee}
                  onChange={(e) => setFeeConfig({...feeConfig, maximumFee: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Commission Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affiliate Commission (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={feeConfig.affiliateCommission}
                  onChange={(e) => setFeeConfig({...feeConfig, affiliateCommission: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Commission (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={feeConfig.businessCommission}
                  onChange={(e) => setFeeConfig({...feeConfig, businessCommission: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category-Based Fees */}
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Category-Based Fee Structure</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryFees.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-24">
                      <input
                        type="number"
                        step="0.1"
                        value={item.fee}
                        onChange={(e) => updateCategoryFee(index, e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <Percent className="absolute right-2 top-1.5 h-3 w-3 text-gray-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fee Calculator */}
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Fee Calculator</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Amount (₦)</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select category</option>
                {categoryFees.map((item, index) => (
                  <option key={index} value={item.category}>{item.category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Calculate Fee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}