import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FileText, Plus, Edit, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const CATEGORY_COLORS = {
  'Business Tips':   'bg-yellow-100 text-yellow-800',
  'How-To':          'bg-green-100 text-green-800',
  'Nigerian Market': 'bg-purple-100 text-purple-800',
  'Product Updates': 'bg-blue-100 text-blue-800',
};

export default function BlogPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch('/api/blog/posts');
      const json = await res.json();
      if (json.success) setPosts(json.posts);
      else setError(json.error);
    } catch (e) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(post) {
    setToggling(post.id);
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch('/api/blog/save', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
      }
    } catch (e) { /* silent */ }
    finally { setToggling(null); }
  }

  async function deletePost(id) {
    if (!confirm('Delete this post permanently? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) { /* silent */ }
    finally { setDeleting(null); }
  }

  const published = posts.filter(p => p.status === 'published').length;
  const drafts = posts.filter(p => p.status === 'draft').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {published} published · {drafts} draft{drafts !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/blog-post-editor">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            New Post
          </button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-lg shadow">
          {[1,2,3].map(i => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className="bg-white rounded-lg shadow px-6 py-16 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No blog posts yet</h3>
          <p className="text-sm text-gray-500 mb-6">Click New Post to write your first article.</p>
          <Link href="/blog-post-editor">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
              Write First Post
            </button>
          </Link>
        </div>
      )}

      {/* Posts table */}
      {!loading && posts.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{post.cover_emoji || '📝'}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status === 'published' ? '● Published' : '○ Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                      : new Date(post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* View live */}
                      {post.status === 'published' && (
                        <a
                          href={`https://tradichatter.store/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="View live"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      )}
                      {/* Toggle publish */}
                      <button
                        onClick={() => toggleStatus(post)}
                        disabled={toggling === post.id}
                        className={`p-1.5 rounded transition-colors ${
                          post.status === 'published'
                            ? 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {toggling === post.id
                          ? <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          : post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                        }
                      </button>
                      {/* Edit */}
                      <Link href={`/blog-post-editor?id=${post.id}`}>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      {/* Delete */}
                      <button
                        onClick={() => deletePost(post.id)}
                        disabled={deleting === post.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        {deleting === post.id
                          ? <div className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
