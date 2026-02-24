import { useState } from 'react';
import Link from 'next/link';
import { Search, Store, MapPin, Phone, Mail, Eye, Edit, Trash2 } from 'lucide-react';

export default function Businesses() {
  const [businesses, setBusinesses] = useState([
    {
      id: 1,
      name: 'Mama Ngozi Kitchen',
      owner: 'Ngozi Okafor',
      email: 'ngozi@mamangozi.com',
      phone: '+234 801 234 5678',
      category: 'Food & Restaurant',
      location: 'Lagos, Nigeria',
      status: 'active',
      kycStatus: 'verified',
      joinDate: '2024-01-15',
      totalOrders: 245,
      revenue: 125000
    },
    {
      id: 2,
      name: 'Tech Solutions Ltd',
      owner: 'Emeka Obi',
      email: 'emeka@techsolutions.com',
      phone: '+234 802 345 6789',
      category: 'Technology',
      location: 'Abuja, Nigeria',
      status: 'active',
      kycStatus: 'pending',
      joinDate: '2024-01-10',
      totalOrders: 89,
      revenue: 450000
    },
    {
      id: 3,
      name: 'Fashion Hub',
      owner: 'Aisha Mohammed',
      email: 'aisha@fashionhub.com',
      phone: '+234 803 456 7890',
      category: 'Fashion & Clothing',
      location: 'Kano, Nigeria',
      status: 'suspended',
      kycStatus: 'rejected',
      joinDate: '2024-01-05',
      totalOrders: 156,
      revenue: 89000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [modalType, setModalType] = useState('view');

  const categories = ['Food & Restaurant', 'Technology', 'Fashion & Clothing', 'Electronics', 'Services'];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || business.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || business.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const KYCBadge = ({ status }) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Business Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage all registered businesses, their verification status, and performance.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search businesses..."
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
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBusinesses.map((business) => (
          <div key={business.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Store className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {business.name}
                    </h3>
                    <div className="flex space-x-1">
                      <StatusBadge status={business.status} />
                      <KYCBadge status={business.kycStatus} />
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{business.owner}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  {business.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  {business.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {business.location}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{business.category}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Orders:</span>
                  <span className="font-medium">{business.totalOrders}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Revenue:</span>
                  <span className="font-medium">₦{business.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Joined:</span>
                  <span className="font-medium">{business.joinDate}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  onClick={() => {
                    setSelectedBusiness(business);
                    setModalType('view');
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    setSelectedBusiness(business);
                    setModalType('edit');
                    setShowModal(true);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${business.name}?`)) {
                      setBusinesses(businesses.filter(b => b.id !== business.id));
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No businesses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Results will appear here when available.
          </p>
        </div>
      )}

      {/* Business Modal */}
      {showModal && selectedBusiness && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {modalType === 'view' ? 'Business Details' : 'Edit Business'}
            </h3>
            <div className="space-y-3">
              <div><strong>Name:</strong> {selectedBusiness.name}</div>
              <div><strong>Owner:</strong> {selectedBusiness.owner}</div>
              <div><strong>Email:</strong> {selectedBusiness.email}</div>
              <div><strong>Phone:</strong> {selectedBusiness.phone}</div>
              <div><strong>Category:</strong> {selectedBusiness.category}</div>
              <div><strong>Location:</strong> {selectedBusiness.location}</div>
              <div><strong>Status:</strong> <StatusBadge status={selectedBusiness.status} /></div>
              <div><strong>KYC Status:</strong> <KYCBadge status={selectedBusiness.kycStatus} /></div>
              <div><strong>Total Orders:</strong> {selectedBusiness.totalOrders}</div>
              <div><strong>Revenue:</strong> ₦{selectedBusiness.revenue.toLocaleString()}</div>
              <div><strong>Join Date:</strong> {selectedBusiness.joinDate}</div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {modalType === 'edit' && (
                <button
                  onClick={() => {
                    // Update business logic here
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to Business Section */}
      <div className="mt-8">
        <Link href="/business-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Business Section
        </Link>
      </div>
    </div>
  );
}