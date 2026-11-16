import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ArrowLeft, Save, Send, Plus, Trash2, ChevronUp, ChevronDown,
  Image, AlertTriangle, CheckCircle, Type, AlignLeft, List, Lightbulb,
} from 'lucide-react';

const CATEGORIES = [
  'Business Tips',
  'How-To',
  'Nigerian Market',
  'Product Updates',
  'Success Stories',
  'Fraud & Safety',
  'Payments & Escrow',
  'Delivery & Logistics',
  'Sales & Marketing',
  'App Features',
  'Entrepreneur Life',
];
const EMOJIS = ['📝','💡','🛡️','🔒','⚖️','📈','🚀','💰','🏪','📱','🌍','🤝','⚡','🔑','📊','🎯','💬','🛍️'];

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}>
      {type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
      {message}
    </div>
  );
}

function BlockEditor({ blocks, onChange }) {
  function addBlock(type) {
    onChange([...blocks, { type, text: '' }]);
  }

  function updateBlock(i, text) {
    const updated = [...blocks];
    updated[i] = { ...updated[i], text };
    onChange(updated);
  }

  function removeBlock(i) {
    onChange(blocks.filter((_, idx) => idx !== i));
  }

  function moveBlock(i, dir) {
    const updated = [...blocks];
    const target = i + dir;
    if (target < 0 || target >= updated.length) return;
    [updated[i], updated[target]] = [updated[target], updated[i]];
    onChange(updated);
  }

  const BLOCK_STYLES = {
    h2:  { label: 'H2 Heading', placeholder: 'Section heading...', className: 'text-lg font-bold text-gray-900', rows: 1 },
    p:   { label: 'Paragraph', placeholder: 'Write your paragraph here...', className: 'text-sm text-gray-700', rows: 4 },
    ul:  { label: 'Bullet List', placeholder: 'First point|Second point|Third point  (separate with |)', className: 'text-sm text-gray-700', rows: 3 },
    tip: { label: 'Tip Box 💡', placeholder: 'Key takeaway or important note...', className: 'text-sm text-green-800', rows: 2 },
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => addBlock('h2')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors">
          <Type className="h-3.5 w-3.5" /> H2 Heading
        </button>
        <button onClick={() => addBlock('p')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors">
          <AlignLeft className="h-3.5 w-3.5" /> Paragraph
        </button>
        <button onClick={() => addBlock('ul')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors">
          <List className="h-3.5 w-3.5" /> Bullet List
        </button>
        <button onClick={() => addBlock('tip')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-xs font-semibold text-green-700 transition-colors">
          <Lightbulb className="h-3.5 w-3.5" /> Tip Box
        </button>
      </div>

      {/* Blocks */}
      {blocks.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400">
          Click a button above to add your first content block
        </div>
      )}

      <div className="space-y-3">
        {blocks.map((block, i) => {
          const style = BLOCK_STYLES[block.type];
          return (
            <div key={i} className={`border rounded-xl p-3 ${block.type === 'tip' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  block.type === 'tip' ? 'bg-green-200 text-green-800' :
                  block.type === 'h2' ? 'bg-blue-100 text-blue-700' :
                  block.type === 'ul' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{style.label}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveBlock(i, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => removeBlock(i)} className="p-1 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={block.text}
                onChange={e => updateBlock(i, e.target.value)}
                placeholder={style.placeholder}
                rows={style.rows}
                className={`w-full resize-none border-0 bg-transparent focus:outline-none focus:ring-0 ${style.className}`}
              />
              {block.type === 'ul' && block.text && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Preview:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {block.text.split('|').map((item, j) => (
                      <li key={j} className="text-xs text-gray-600">{item.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BlogPostEditor() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = !!id;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', category: '', cover_emoji: '📝',
    cover_image_url: '', author: 'TradiChatter Team', content: [],
  });
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [currentStatus, setCurrentStatus] = useState('draft');

  useEffect(() => {
    if (id) loadPost(id);
  }, [id]);

  async function loadPost(postId) {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${postId}`);
      const json = await res.json();
      if (json.success) {
        const p = json.post;
        setForm({
          title: p.title, slug: p.slug, excerpt: p.excerpt,
          category: p.category, cover_emoji: p.cover_emoji || '📝',
          cover_image_url: p.cover_image_url || '',
          author: p.author || 'TradiChatter Team',
          content: p.content || [],
        });
        setCurrentStatus(p.status);
        setSlugManual(true);
      }
    } catch (e) {
      setToast({ message: 'Failed to load post', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function setField(key, value) {
    setForm(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'title' && !slugManual) updated.slug = toSlug(value);
      return updated;
    });
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.excerpt.trim()) e.excerpt = 'Excerpt is required';
    if (form.excerpt.length > 160) e.excerpt = 'Excerpt must be 160 characters or less';
    if (!form.category) e.category = 'Category is required';
    if (form.content.length === 0) e.content = 'Add at least one content block';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'Image must be under 5MB', type: 'error' });
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/blog/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, filename: file.name, mimetype: file.type }),
      });
      const json = await res.json();
      if (json.success) {
        setField('cover_image_url', json.url);
        setToast({ message: 'Image uploaded', type: 'success' });
      } else {
        setToast({ message: json.error || 'Upload failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Upload failed', type: 'error' });
    } finally {
      setUploading(false);
    }
  }

  async function save(status) {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, status };
      const method = isEdit ? 'PUT' : 'POST';
      if (isEdit) payload.id = id;

      const res = await fetch('/api/blog/save', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setCurrentStatus(status);
        const msg = status === 'published'
          ? `Published! Live at tradichatter.store/blog/${json.post.slug}`
          : 'Draft saved successfully';
        setToast({ message: msg, type: 'success' });
        if (!isEdit) setTimeout(() => router.push(`/blog-post-editor?id=${json.post.id}`), 1500);
      } else {
        setToast({ message: json.error || 'Save failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Save failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/blog-posts">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" /> Back to Posts
            </button>
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Post' : 'New Post'}</h1>
          {isEdit && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              currentStatus === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {currentStatus === 'published' ? '● Published' : '○ Draft'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => save('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => save('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {saving ? 'Publishing...' : currentStatus === 'published' ? 'Update Live Post' : 'Publish Now'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor — left 2/3 */}
        <div className="lg:col-span-2 space-y-5">

          {/* Title */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="Enter article title..."
              className={`w-full text-xl font-bold text-gray-900 border-0 focus:outline-none focus:ring-0 placeholder-gray-300 ${errors.title ? 'placeholder-red-300' : ''}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Excerpt * <span className="normal-case font-normal">(shown on blog list + Google description)</span></label>
              <span className={`text-xs font-medium ${form.excerpt.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                {form.excerpt.length}/160
              </span>
            </div>
            <textarea
              value={form.excerpt}
              onChange={e => setField('excerpt', e.target.value)}
              placeholder="2-sentence summary. Keep under 160 characters for best Google results..."
              rows={3}
              className="w-full text-sm text-gray-700 border-0 focus:outline-none focus:ring-0 resize-none placeholder-gray-300"
            />
            {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>}
          </div>

          {/* Content blocks */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Article Content *</label>
            <BlockEditor blocks={form.content} onChange={blocks => setField('content', blocks)} />
            {errors.content && <p className="text-xs text-red-500 mt-2">{errors.content}</p>}
          </div>
        </div>

        {/* Sidebar — right 1/3 */}
        <div className="space-y-5">

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category *</label>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={form.category === cat}
                    onChange={() => setField('category', cat)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
            {errors.category && <p className="text-xs text-red-500 mt-2">{errors.category}</p>}
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cover Image</label>
            {form.cover_image_url ? (
              <div className="relative">
                <img src={form.cover_image_url} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
                <button
                  onClick={() => setField('cover_image_url', '')}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Image className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-500">Click to upload image<br />(jpg, png, webp · max 5MB)</span>
                  </div>
                )}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
          </div>

          {/* Cover Emoji (fallback) */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cover Emoji <span className="normal-case font-normal">(used if no image)</span></label>
            <div className="grid grid-cols-6 gap-1.5">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setField('cover_emoji', emoji)}
                  className={`text-xl p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${form.cover_emoji === emoji ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Slug */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">URL Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => { setSlugManual(true); setField('slug', e.target.value); }}
              placeholder="auto-generated-from-title"
              className="w-full text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            {form.slug && (
              <p className="text-xs text-gray-400 mt-1.5 break-all">tradichatter.store/blog/{form.slug}</p>
            )}
          </div>

          {/* Author */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Author</label>
            <input
              type="text"
              value={form.author}
              onChange={e => setField('author', e.target.value)}
              className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
