import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('orders').select('*', { count: 'exact' });
    if (status) query = query.eq('status', status);
    if (search) query = query.or(`business_name.ilike.%${search}%,customer_name.ilike.%${search}%`);
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, orders: data || [], total: count || 0 });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
