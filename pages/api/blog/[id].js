import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, error: 'id is required' });

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ success: false, error: 'Post not found' });
    return res.status(200).json({ success: true, post: data });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ success: false, error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
