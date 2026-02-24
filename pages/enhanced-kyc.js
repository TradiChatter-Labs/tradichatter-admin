import { useState } from 'react';
import Link from 'next/link';
import { Search, FileText, CheckCircle, XCircle, Clock, Eye, Download, Shield, Zap } from 'lucide-react';

export default function EnhancedKYC() {
  const [kycRequests, setKycRequests] = useState([
    {
      id: 1,
      businessName: 'Tech Solutions Ltd',
      ownerName: 'Emeka Obi',
      email: 'emeka@techsolutions.com',
      phone: '+234 802 345 6789',
      status: 'pending',
      submissionDate: '2024-01-19',
      documents: {
        'cac_certificate': { url: '/docs/cac_1.pdf', verified: true, provider: 'CAC' },
        'tax_id': { url: '/docs/tin_1.pdf', verified: true, provider: 'FIRS' },
        'bank_statement': { url: '/docs/bank_1.pdf', verified: false, provider: 'Manual' }
      },
      businessType: 'Technology',
      kycTier: 2,
      verificationScore: 85,
      paystackVerified: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [aiVerificationEnabled, setAiVerificationEnabled] = useState(true);
  const [verificationProviders, setVerificationProviders] = useState({
    cac: { enabled: true, status: 'active', successRate: 94.2 },
    firs: { enabled: true, status: 'active', successRate: 89.7 },
    bvn: { enabled: true, status: 'active', successRate: 96.8 },
    nin: { enabled: false, status: 'maintenance', successRate: 0 }
  });

  const handleDocumentView = (document, businessName) => {
    setSelectedDocument({ ...document, businessName });
    setShowDocumentViewer(true);
  };

  const handleProviderVerification = async (requestId, documentType) => {
    try {
      // Simulate API call to verification provider
      const response = await fetch('/api/kyc/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, documentType })
      });
      
      const result = await response.json();
      
      setKycRequests(requests => 
        requests.map(request => {
          if (request.id === requestId) {
            const updatedDocs = { ...request.documents };
            if (updatedDocs[documentType]) {
              updatedDocs[documentType].verified = result.verified;
              updatedDocs[documentType].provider = result.provider;
              updatedDocs[documentType].verificationDetails = result.details;
            }
            return { ...request, documents: updatedDocs };
          }
          return request;
        })
      );
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const icons = { pending: Clock, approved: CheckCircle, rejected: XCircle };
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const VerificationBadge = ({ verified, provider }) => (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
      verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {verified ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
      {provider}
    </span>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced KYC System</h1>
        <p className="mt-1 text-sm text-gray-600">
          Advanced KYC verification with document viewer, provider integration, and automated verification.
        </p>
      </div>

      {/* Advanced Provider Status */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Verification Providers</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(verificationProviders).map(([provider, info]) => (
              <div key={provider} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 uppercase">{provider}</span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    info.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {info.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Success Rate: {info.successRate}%
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => setVerificationProviders(prev => ({
                      ...prev,
                      [provider]: { ...prev[provider], enabled: !prev[provider].enabled }
                    }))}
                    className={`text-xs px-2 py-1 rounded ${
                      info.enabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {info.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-lg font-semibold text-gray-900">{kycRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Auto-Verified</p>
              <p className="text-lg font-semibold text-gray-900">
                {kycRequests.filter(r => r.paystackVerified).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">AI Verified</p>
              <p className="text-lg font-semibold text-gray-900">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Processing</p>
              <p className="text-lg font-semibold text-gray-900">7</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-lg font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-medium text-gray-900">Bulk Actions</h3>
              <button
                onClick={() => setBulkProcessing(!bulkProcessing)}
                disabled={bulkProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {bulkProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Auto-Process Pending
                  </>
                )}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Export KYC Report
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">AI Verification:</span>
              <button
                onClick={() => setAiVerificationEnabled(!aiVerificationEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  aiVerificationEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  aiVerificationEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Requests */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {kycRequests.map((request) => (
            <li key={request.id}>
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">{request.businessName}</div>
                        <div className="flex items-center space-x-2 ml-2">
                          <StatusBadge status={request.status} />
                          {request.paystackVerified && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              <Zap className="h-3 w-3 mr-1" />
                              Paystack
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{request.ownerName}</div>
                      <div className="text-sm text-gray-500">{request.email} • {request.phone}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 ml-14">
                  <div className="text-sm text-gray-500 mb-2">Documents:</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(request.documents).map(([docType, docInfo]) => (
                      <div key={docType} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                        <span className="text-xs font-medium">{docType.replace('_', ' ').toUpperCase()}</span>
                        <VerificationBadge verified={docInfo.verified} provider={docInfo.provider} />
                        <button
                          onClick={() => handleDocumentView(docInfo, request.businessName)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Document"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        {!docInfo.verified && (
                          <button
                            onClick={() => handleProviderVerification(request.id, docType)}
                            className="text-green-600 hover:text-green-900"
                            title="Auto-Verify"
                          >
                            <Zap className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Document Viewer - {selectedDocument.businessName}
              </h3>
              <button
                onClick={() => setShowDocumentViewer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <VerificationBadge 
                  verified={selectedDocument.verified} 
                  provider={selectedDocument.provider} 
                />
                <span className="text-sm text-gray-500">URL: {selectedDocument.url}</span>
              </div>
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verify
                </button>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-lg h-96 overflow-hidden">
              {selectedDocument.url.endsWith('.pdf') ? (
                <iframe 
                  src={selectedDocument.url} 
                  className="w-full h-full"
                  title="Document Preview"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <img 
                    src={selectedDocument.url} 
                    alt="Document" 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="text-center" style={{display: 'none'}}>
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Document Preview</h3>
                    <p className="mt-1 text-sm text-gray-500">Unable to load document</p>
                    <p className="text-xs text-gray-400 mt-2">{selectedDocument.url}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}