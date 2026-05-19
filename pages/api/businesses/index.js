import { supabase, logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, search, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('businesses').select('*', { count: 'exact' });
    if (search) query = query.ilike('business_name', `%${search}%`);
    if (status === 'active') query = query.eq('is_active', true);
    else if (status === 'inactive') query = query.eq('is_active', false);
    else if (status === 'verified') query = query.eq('is_verified', true);
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, businesses: data || [], total: count || 0 });
  }

  if (req.method === 'PATCH') {
    const { id, action, reason } = req.body;
    if (!id || !action) return res.status(400).json({ error: 'id and action required' });

    let updates = {};
    if (action === 'activate') updates = { is_active: true };
    else if (action === 'deactivate') updates = { is_active: false };
    else if (action === 'verify') updates = { is_verified: true };
    else if (action === 'unverify') updates = { is_verified: false };
    else return res.status(400).json({ error: 'Invalid action' });

    const { data, error } = await supabase.from('businesses').update(updates).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({ adminId, action: `BUSINESS_${action.toUpperCase()}`, entityType: 'business', entityId: id, details: { reason }, ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress });

    return res.json({ success: true, business: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
