import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Clock, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';

export default function CustomerSupport() {
  const [tickets, setTickets] = useState([
    {
      id: 'T001',
      customer: 'John Doe',
      subject: 'Payment not processed',
      priority: 'high',
      status: 'open',
      created: '2024-01-15 10:30',
      lastReply: '2024-01-15 14:20',
      category: 'payment'
    },
    {
      id: 'T002',
      customer: 'Jane Smith',
      subject: 'Cannot access my account',
      priority: 'medium',
      status: 'in-progress',
      created: '2024-01-14 16:45',
      lastReply: '2024-01-15 09:15',
      category: 'account'
    },
    {
      id: 'T003',
      customer: 'Mike Johnson',
      subject: 'Order delivery delayed',
      priority: 'low',
      status: 'resolved',
      created: '2024-01-13 12:00',
      lastReply: '2024-01-14 10:30',
      category: 'delivery'
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleTicketAction = (ticketId, action) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: action }
        : ticket
    ));
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Support</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage customer support tickets and inquiries.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Open Tickets</dt>
            <dd className="mt-1 text-2xl font-semibold text-blue-600">12</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">In Progress</dt>
            <dd className="mt-1 text-2xl font-semibold text-yellow-600">8</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Resolved Today</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">15</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Avg Response</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">2.4h</dd>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="payment">Payment</option>
              <option value="account">Account</option>
              <option value="delivery">Delivery</option>
              <option value="technical">Technical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Support Tickets</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">#{ticket.id}</p>
                        <span className="ml-2 text-sm text-gray-500">-</span>
                        <p className="ml-2 text-sm font-medium text-gray-900">{ticket.subject}</p>
                      </div>
                      <div className="flex items-center mt-1">
                        <User className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">{ticket.customer}</p>
                        <span className="mx-2 text-gray-300">•</span>
                        <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">{ticket.created}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(ticket.priority)}
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Last reply: {ticket.lastReply}
                  </p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowModal(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => {
                        alert(`Replying to ticket ${ticket.id}`);
                      }}
                      className="text-xs text-green-600 hover:text-green-500 font-medium"
                    >
                      Reply
                    </button>
                    {ticket.status === 'open' && (
                      <button 
                        onClick={() => {
                          handleTicketAction(ticket.id, 'in-progress');
                        }}
                        className="text-xs text-yellow-600 hover:text-yellow-500 font-medium"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Ticket Detail Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Details</h3>
            <div className="space-y-3">
              <div><strong>Ticket ID:</strong> {selectedTicket.id}</div>
              <div><strong>Customer:</strong> {selectedTicket.customer}</div>
              <div><strong>Subject:</strong> {selectedTicket.subject}</div>
              <div><strong>Priority:</strong> {getPriorityBadge(selectedTicket.priority)}</div>
              <div><strong>Status:</strong> {getStatusBadge(selectedTicket.status)}</div>
              <div><strong>Category:</strong> {selectedTicket.category}</div>
              <div><strong>Created:</strong> {selectedTicket.created}</div>
              <div><strong>Last Reply:</strong> {selectedTicket.lastReply}</div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Replying to ticket ${selectedTicket.id}`);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Reply
              </button>
              {selectedTicket.status !== 'resolved' && (
                <button
                  onClick={() => {
                    handleTicketAction(selectedTicket.id, 'resolved');
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to Customer Section */}
      <div className="mt-8">
        <Link href="/customer-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Customer Section
        </Link>
      </div>
    </div>
  );
}