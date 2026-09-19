import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Star, Flag, CheckCircle, XCircle } from 'lucide-react';

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/moderation/reviews');
      const json = await res.json();
      if (json.success) setReviews(json.reviews);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const res = await fetch('/api/moderation/reviews', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action })
    });
    const json = await res.json();
    if (json.success) setReviews(reviews.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const renderStars = (rating) => [...Array(5)].map((_, i) => (
    <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
  ));

  const filtered = reviews.filter(r => filter === 'all' || r.status === filter);

  if (loading) return <Layout><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-sm text-gray-500 mt-1">Moderate customer reviews</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{reviews.length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">{reviews.filter(r => r.status === 'pending').length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Reported</p><p className="text-2xl font-bold text-red-600">{reviews.filter(r => r.reported).length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Avg Rating</p><p className="text-2xl font-bold text-green-600">{reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '-'}</p></div>
        </div>

        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white shadow rounded-lg divide-y">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No reviews found</div>
          ) : filtered.map(review => (
            <div key={review.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">{(review.customer_name || 'C')[0]}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{review.customer_name}</p>
                      {review.reported && <Flag className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="flex items-center mt-1">{renderStars(review.rating)}<span className="ml-2 text-xs text-gray-500">{review.created_at?.split('T')[0]}</span></div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${review.status === 'approved' ? 'bg-green-100 text-green-800' : review.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{review.status}</span>
              </div>
              {review.comment && <p className="mt-2 text-sm text-gray-700 ml-13">{review.comment}</p>}
              {review.status === 'pending' && (
                <div className="mt-3 flex space-x-2 ml-13">
                  <button onClick={() => handleAction(review.id, 'approved')} className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" />Approve</button>
                  <button onClick={() => handleAction(review.id, 'rejected')} className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-red-600 text-white hover:bg-red-700"><XCircle className="h-3 w-3 mr-1" />Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
