import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, category, status, published_at, created_at, excerpt, cover_emoji, cover_image_url')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(200).json({ success: true, posts: data || [] });
}
