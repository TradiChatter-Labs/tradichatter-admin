import { supabase } from '../../../lib/supabaseAdmin';

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, excerpt, category, content, cover_image_url, cover_emoji, author, status, slug: customSlug } = req.body;

    if (!title || !excerpt || !category || !content) {
      return res.status(400).json({ success: false, error: 'title, excerpt, category and content are required' });
    }

    const slug = customSlug || toSlug(title);
    const now = new Date().toISOString();
    const published_at = status === 'published' ? now : null;

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        slug, title, excerpt, category, content,
        cover_image_url: cover_image_url || null,
        cover_emoji: cover_emoji || '📝',
        author: author || 'TradiChatter Team',
        status: status || 'draft',
        published_at,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, error: error.message });
    return res.status(201).json({ success: true, post: data });
  }

  if (req.method === 'PUT') {
    const { id, title, excerpt, category, content, cover_image_url, cover_emoji, author, status, slug } = req.body;

    if (!id) return res.status(400).json({ success: false, error: 'id is required' });

    const now = new Date().toISOString();

    // Only set published_at if transitioning to published and not already set
    const { data: existing } = await supabase.from('blog_posts').select('published_at, status').eq('id', id).single();
    const published_at = status === 'published' && !existing?.published_at ? now : existing?.published_at || null;

    const updates = {
      updated_at: now,
      ...(title !== undefined && { title }),
      ...(excerpt !== undefined && { excerpt }),
      ...(category !== undefined && { category }),
      ...(content !== undefined && { content }),
      ...(cover_image_url !== undefined && { cover_image_url }),
      ...(cover_emoji !== undefined && { cover_emoji }),
      ...(author !== undefined && { author }),
      ...(status !== undefined && { status }),
      ...(slug !== undefined && { slug }),
      published_at,
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, error: error.message });
    return res.status(200).json({ success: true, post: data });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
