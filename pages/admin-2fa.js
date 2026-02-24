import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Smartphone, Key, QrCode, Copy, Check } from 'lucide-react';

export default function Admin2FA() {
  const [currentAdmin] = useState({
    id: 'ADM-001',
    name: 'Super Admin',
    email: 'admin@tradichatter.com',
    has2FA: false
  });

  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (step === 2) {
      // Generate QR code (in real app, this would come from backend)
      setQrCode('otpauth://totp/TradiChatter:admin@tradichatter.com?secret=JBSWY3DPEHPK3PXP&issuer=TradiChatter');
      
      // Generate backup codes
      const codes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
    }
  }, [step]);

  const handleEnable2FA = () => {
    if (verificationCode.length === 6) {
      alert('2FA has been successfully enabled for your account!');
      setStep(4);
    } else {
      alert('Please enter a valid 6-digit code from your authenticator app.');
    }
  };

  const handleDisable2FA = () => {
    if (confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      alert('2FA has been disabled for your account.');
      setStep(1);
    }
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h1>
        <p className="mt-1 text-sm text-gray-600">
          Secure your admin account with an additional layer of protection.
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Step 1: 2FA Status */}
        {step === 1 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Shield className={`h-8 w-8 ${currentAdmin.has2FA ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Two-Factor Authentication {currentAdmin.has2FA ? 'Enabled' : 'Disabled'}
                </h2>
                <p className="text-sm text-gray-600">
                  {currentAdmin.has2FA 
                    ? 'Your account is protected with 2FA' 
                    : 'Add an extra layer of security to your account'
                  }
                </p>
              </div>
            </div>

            {!currentAdmin.has2FA ? (
              <div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Security Recommendation</h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Enable 2FA to protect your admin account from unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">What you'll need:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                      A smartphone with an authenticator app (Google Authenticator, Authy, etc.)
                    </li>
                    <li className="flex items-center">
                      <Key className="h-4 w-4 mr-2 text-blue-600" />
                      Access to your current admin account
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Enable 2FA
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <Check className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">2FA Active</h3>
                      <p className="mt-1 text-sm text-green-700">
                        Your account is protected with two-factor authentication.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(5)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Backup Codes
                  </button>
                  <button
                    onClick={handleDisable2FA}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200"
                  >
                    Disable 2FA
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: QR Code Setup */}
        {step === 2 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Scan QR Code</h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app:
              </p>
              
              <div className="flex justify-center">
                <div className="bg-gray-100 p-8 rounded-lg">
                  <QrCode className="h-32 w-32 text-gray-400" />
                  <p className="text-xs text-gray-500 mt-2 text-center">QR Code Placeholder</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-900 mb-2">Manual Entry Key:</p>
                <code className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                  JBSWY3DPEHPK3PXP
                </code>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Popular Authenticator Apps:</p>
                <ul className="space-y-1">
                  <li>• Google Authenticator</li>
                  <li>• Microsoft Authenticator</li>
                  <li>• Authy</li>
                  <li>• 1Password</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Next: Verify Code
              </button>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verify Code */}
        {step === 3 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Verify Your Code</h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the 6-digit code from your authenticator app:
              </p>
              
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-mono"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              />
              
              <p className="text-xs text-gray-500">
                The code changes every 30 seconds. Enter the current code shown in your app.
              </p>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleEnable2FA}
                disabled={verificationCode.length !== 6}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              >
                Enable 2FA
              </button>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success & Backup Codes */}
        {step === 4 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center mb-6">
              <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-900">2FA Successfully Enabled!</h2>
              <p className="text-sm text-gray-600 mt-2">
                Your account is now protected with two-factor authentication.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Important: Save Your Backup Codes</h3>
              <p className="text-sm text-yellow-700 mb-4">
                Store these backup codes in a safe place. You can use them to access your account if you lose your phone.
              </p>
              
              <div className="bg-white p-4 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">Backup Codes</span>
                  <button
                    onClick={copyBackupCodes}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Complete Setup
            </button>
          </div>
        )}

        {/* Step 5: View Backup Codes */}
        {step === 5 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Backup Codes</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-sm text-yellow-700">
                Each backup code can only be used once. Generate new codes if you've used most of them.
              </p>
            </div>

            <div className="bg-white p-4 rounded border mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">Your Backup Codes</span>
                <button
                  onClick={copyBackupCodes}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  const codes = Array.from({ length: 8 }, () => 
                    Math.random().toString(36).substring(2, 8).toUpperCase()
                  );
                  setBackupCodes(codes);
                  alert('New backup codes generated!');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Generate New Codes
              </button>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}