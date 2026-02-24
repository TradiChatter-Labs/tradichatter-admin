import { useState } from 'react';
import Link from 'next/link';
import { Search, CreditCard, CheckCircle, XCircle, Clock, Settings, Zap, DollarSign } from 'lucide-react';

export default function SellerSubaccounts() {
  const [subaccounts, setSubaccounts] = useState([
    {
      id: 1,
      businessName: 'Tech Solutions Ltd',
      ownerName: 'Emeka Obi',
      email: 'emeka@techsolutions.com',
      flutterwaveSubaccountId: 'FLW_SUB_123456',
      status: 'active',
      createdDate: '2024-01-15',
      settlementBank: 'GTBank',
      accountNumber: '0123456789',
      splitPercentage: 97.5,
      totalTransactions: 45,
      totalVolume: 2500000,
      lastTransaction: '2024-01-20'
    },
    {
      id: 2,
      businessName: 'Fashion Hub',
      ownerName: 'Aisha Mohammed',
      email: 'aisha@fashionhub.com',
      flutterwaveSubaccountId: null,
      status: 'pending',
      createdDate: null,
      settlementBank: 'Access Bank',
      accountNumber: '0987654321',
      splitPercentage: 97.5,
      totalTransactions: 0,
      totalVolume: 0,
      lastTransaction: null
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const createSubaccount = async (businessId) => {
    try {
      const response = await fetch('/api/flutterwave/create-subaccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubaccounts(accounts => 
          accounts.map(account => 
            account.id === businessId 
              ? { 
                  ...account, 
                  flutterwaveSubaccountId: result.subaccountId, 
                  status: 'active',
                  createdDate: new Date().toISOString().split('T')[0]
                }
              : account
          )
        );
      }
    } catch (error) {
      console.error('Failed to create subaccount:', error);
    }
  };

  const updateSplitPercentage = async (businessId, percentage) => {
    try {
      const response = await fetch('/api/flutterwave/update-split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, percentage })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubaccounts(accounts => 
          accounts.map(account => 
            account.id === businessId 
              ? { ...account, splitPercentage: percentage }
              : account
          )
        );
      }
    } catch (error) {
      console.error('Failed to update split percentage:', error);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    
    const icons = { active: CheckCircle, pending: Clock, suspended: XCircle };
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Seller Subaccount Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Automate Flutterwave subaccounts for sellers and manage payment splits.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Subaccounts</p>
              <p className="text-lg font-semibold text-gray-900">{subaccounts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-lg font-semibold text-gray-900">
                {subaccounts.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Volume</p>
              <p className="text-lg font-semibold text-gray-900">
                ₦{subaccounts.reduce((sum, s) => sum + s.totalVolume, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">
                {subaccounts.filter(s => s.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search subaccounts..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Subaccounts List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {subaccounts.map((account) => (
            <li key={account.id}>
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{account.businessName}</div>
                        <div className="ml-2">
                          <StatusBadge status={account.status} />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{account.ownerName}</div>
                      <div className="text-sm text-gray-500">{account.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-900">
                        {account.flutterwaveSubaccountId || 'No Subaccount'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Split: {account.splitPercentage}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {account.settlementBank} - {account.accountNumber}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {!account.flutterwaveSubaccountId ? (
                        <button
                          onClick={() => createSubaccount(account.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Create Subaccount
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button className="text-gray-600 hover:text-gray-900">
                            <Settings className="h-5 w-5" />
                          </button>
                          <select
                            value={account.splitPercentage}
                            onChange={(e) => updateSplitPercentage(account.id, parseFloat(e.target.value))}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value={95}>95%</option>
                            <option value={97.5}>97.5%</option>
                            <option value={98}>98%</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {account.flutterwaveSubaccountId && (
                  <div className="mt-2 ml-14">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Transactions:</span>
                        <span className="ml-1 font-medium">{account.totalTransactions}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Volume:</span>
                        <span className="ml-1 font-medium">₦{account.totalVolume.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Transaction:</span>
                        <span className="ml-1 font-medium">{account.lastTransaction || 'None'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}