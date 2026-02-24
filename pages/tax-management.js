import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, FileText, Download, Calculator } from 'lucide-react';

export default function TaxManagement() {
  const router = useRouter();
  const [vatSettings, setVatSettings] = useState({
    enabled: true,
    rate: 7.5,
    threshold: 25000000
  });

  const [taxReports, setTaxReports] = useState([
    {
      id: 'TAX-2024-01',
      period: 'January 2024',
      totalRevenue: 15000000,
      vatCollected: 1125000,
      status: 'completed',
      generatedDate: '2024-02-01'
    },
    {
      id: 'TAX-2024-02',
      period: 'February 2024',
      totalRevenue: 18500000,
      vatCollected: 1387500,
      status: 'pending',
      generatedDate: null
    }
  ]);

  const handleVatToggle = () => {
    setVatSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const generateReport = (reportId) => {
    setTaxReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'completed', generatedDate: new Date().toISOString().split('T')[0] }
        : report
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
              <Calculator className="mr-3 h-8 w-8" />
              Tax Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage VAT settings and generate tax reports
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VAT Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">VAT Configuration</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Enable VAT Collection</label>
                <p className="text-sm text-gray-500">Automatically collect VAT on transactions</p>
              </div>
              <button
                onClick={handleVatToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  vatSettings.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    vatSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                VAT Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={vatSettings.rate}
                onChange={(e) => setVatSettings({...vatSettings, rate: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!vatSettings.enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                VAT Threshold (₦)
              </label>
              <input
                type="number"
                value={vatSettings.threshold}
                onChange={(e) => setVatSettings({...vatSettings, threshold: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!vatSettings.enabled}
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum annual revenue for VAT registration
              </p>
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save VAT Settings
            </button>
          </div>
        </div>

        {/* Tax Summary */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Tax Summary (YTD)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₦33.5M</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">VAT Collected</p>
                <p className="text-2xl font-bold text-green-600">₦2.51M</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Taxable Transactions</p>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg VAT per Transaction</p>
                <p className="text-2xl font-bold text-purple-600">₦2,013</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">VAT Remittance Due</span>
                <span className="text-lg font-bold text-red-600">₦1.39M</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Due: March 21, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Reports */}
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Tax Reports</h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Generate New Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">VAT Collected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{(report.totalRevenue / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{(report.vatCollected / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {report.status === 'completed' ? (
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    ) : (
                      <button 
                        onClick={() => generateReport(report.id)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Compliance */}
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Tax Compliance Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">VAT Registration</p>
                <p className="text-sm text-green-600">Active & Compliant</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">!</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Monthly Filing</p>
                <p className="text-sm text-yellow-600">Due in 5 days</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">i</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Next Audit</p>
                <p className="text-sm text-blue-600">Q2 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}