import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('products').select('*, businesses(business_name)', { count: 'exact' });
    if (status && status !== 'all') query = query.eq('status', status);
    else query = query.in('status', ['flagged', 'suspended', 'removed', 'pending_review']);
    if (search) query = query.ilike('name', `%${search}%`);
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, products: data || [], total: count || 0 });
  }

  if (req.method === 'PATCH') {
    const { id, action } = req.body;
    if (!id || !action) return res.status(400).json({ error: 'id and action required' });

    let updates = {};
    if (action === 'approve') updates = { status: 'active' };
    else if (action === 'remove') updates = { status: 'removed', is_active: false };
    else if (action === 'suspend') updates = { status: 'suspended', is_active: false };
    else return res.status(400).json({ error: 'Invalid action' });

    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, product: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
