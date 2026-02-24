import { useState } from 'react';
import Link from 'next/link';
import { Star, Eye, Trash2, Flag, CheckCircle, XCircle } from 'lucide-react';

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: 'John Doe',
      business: 'Tech Store Lagos',
      rating: 5,
      comment: 'Excellent service and fast delivery!',
      date: '2024-01-15',
      status: 'approved',
      reported: false
    },
    {
      id: 2,
      customer: 'Jane Smith',
      business: 'Fashion Hub',
      rating: 2,
      comment: 'Poor quality products, not as described.',
      date: '2024-01-14',
      status: 'pending',
      reported: true
    },
    {
      id: 3,
      customer: 'Mike Johnson',
      business: 'Food Corner',
      rating: 4,
      comment: 'Good food but delivery was late.',
      date: '2024-01-13',
      status: 'approved',
      reported: false
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleReviewAction = (reviewId, action) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: action }
        : review
    ));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor and moderate customer reviews across all businesses.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Total Reviews</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">1,247</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Pending Review</dt>
            <dd className="mt-1 text-2xl font-semibold text-yellow-600">23</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Reported</dt>
            <dd className="mt-1 text-2xl font-semibold text-red-600">8</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500">Avg Rating</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">4.2</dd>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Reviews</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <li key={review.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {review.customer.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{review.customer}</p>
                        {review.reported && (
                          <Flag className="ml-2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{review.business}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(review.status)}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-gray-600">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
                <div className="mt-3 flex space-x-2">
                  {review.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleReviewAction(review.id, 'approved')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReviewAction(review.id, 'rejected')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedReview(review);
                      setShowModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Review Detail Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Details</h3>
            <div className="space-y-3">
              <div><strong>Customer:</strong> {selectedReview.customer}</div>
              <div><strong>Business:</strong> {selectedReview.business}</div>
              <div><strong>Rating:</strong> 
                <div className="flex items-center mt-1">
                  {renderStars(selectedReview.rating)}
                  <span className="ml-2 text-sm text-gray-600">({selectedReview.rating}/5)</span>
                </div>
              </div>
              <div><strong>Comment:</strong> 
                <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-2 rounded">{selectedReview.comment}</p>
              </div>
              <div><strong>Date:</strong> {selectedReview.date}</div>
              <div><strong>Status:</strong> {getStatusBadge(selectedReview.status)}</div>
              {selectedReview.reported && (
                <div className="text-red-600 text-sm flex items-center">
                  <Flag className="h-4 w-4 mr-1" />
                  This review has been reported
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              {selectedReview.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleReviewAction(selectedReview.id, 'approved');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReviewAction(selectedReview.id, 'rejected');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
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