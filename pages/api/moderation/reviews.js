import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('reviews').select('*', { count: 'exact' });
    if (status && status !== 'all') query = query.eq('status', status);
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, reviews: data || [], total: count || 0 });
  }

  if (req.method === 'PATCH') {
    const { id, action } = req.body;
    if (!id || !action) return res.status(400).json({ error: 'id and action required' });

    const updates = { status: action, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from('reviews').update(updates).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, review: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
