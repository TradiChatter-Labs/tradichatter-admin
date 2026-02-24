import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, CheckCircle, Clock, Download } from 'lucide-react';

export default function SecurityAuditDashboard() {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    try {
      // Simulate fetching audit data
      setAuditData({
        auditId: 'AUDIT_1642258800_abc123def',
        status: 'completed',
        timestamp: '2024-01-15 15:45:00',
        duration: '2m 34s',
        overallScore: 78,
        findings: {
          vulnerabilities: { critical: 0, high: 2, medium: 5, low: 8 },
          permissions: { excessive: 3, outdated: 7, misconfigured: 2 },
          network: { openPorts: 4, weakProtocols: 1, missingEncryption: 0 }
        },
        details: [
          {
            category: 'Authentication',
            severity: 'high',
            issue: 'Weak password policy detected',
            description: 'Current password policy allows passwords shorter than 8 characters',
            recommendation: 'Implement minimum 12-character password requirement with complexity rules',
            status: 'open'
          },
          {
            category: 'API Security',
            severity: 'medium',
            issue: 'Missing rate limiting on sensitive endpoints',
            description: 'Payment processing endpoints lack proper rate limiting',
            recommendation: 'Implement stricter rate limiting for financial operations',
            status: 'open'
          },
          {
            category: 'Data Protection',
            severity: 'low',
            issue: 'Outdated encryption algorithm',
            description: 'Some data fields use SHA-1 instead of SHA-256',
            recommendation: 'Migrate to SHA-256 or higher encryption standards',
            status: 'in_progress'
          }
        ]
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch audit data:', error);
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Security Audit Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Detailed security audit results and recommendations.
        </p>
      </div>

      {/* Audit Summary */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Audit Summary</h3>
            <div className="flex space-x-3">
              <span className="text-sm text-gray-500">ID: {auditData.auditId}</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-gray-200" transform="translate(30, 30)"/>
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray={`${auditData.overallScore * 0.502} 50.2`} className="text-green-500" transform="translate(30, 30)"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{auditData.overallScore}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Security Score</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-gray-900">{auditData.duration}</p>
              <p className="text-sm text-gray-500">Scan Duration</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-gray-900">{auditData.status}</p>
              <p className="text-sm text-gray-500">Status</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-gray-900">{auditData.timestamp}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Findings Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vulnerabilities</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-red-600">Critical:</span>
              <span className="text-sm font-semibold">{auditData.findings.vulnerabilities.critical}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-orange-600">High:</span>
              <span className="text-sm font-semibold">{auditData.findings.vulnerabilities.high}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-yellow-600">Medium:</span>
              <span className="text-sm font-semibold">{auditData.findings.vulnerabilities.medium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-blue-600">Low:</span>
              <span className="text-sm font-semibold">{auditData.findings.vulnerabilities.low}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Excessive:</span>
              <span className="text-sm font-semibold">{auditData.findings.permissions.excessive}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Outdated:</span>
              <span className="text-sm font-semibold">{auditData.findings.permissions.outdated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Misconfigured:</span>
              <span className="text-sm font-semibold">{auditData.findings.permissions.misconfigured}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Network Security</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Open Ports:</span>
              <span className="text-sm font-semibold">{auditData.findings.network.openPorts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Weak Protocols:</span>
              <span className="text-sm font-semibold">{auditData.findings.network.weakProtocols}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Missing Encryption:</span>
              <span className="text-sm font-semibold">{auditData.findings.network.missingEncryption}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Findings */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Detailed Findings</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {auditData.details.map((finding, index) => (
            <div key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(finding.severity)}`}>
                      {finding.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(finding.status)}`}>
                      {finding.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{finding.category}</span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{finding.issue}</h4>
                  <p className="text-sm text-gray-600 mb-3">{finding.description}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Recommendation:</strong> {finding.recommendation}
                    </p>
                  </div>
                </div>
                <div className="ml-6 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">Mark Resolved</button>
                  <button className="text-green-600 hover:text-green-900 text-sm">Assign</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Link href="/security-management" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Security Management
        </Link>
      </div>
    </div>
  );
}