import { supabase, logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, search, user_type } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('users').select('*', { count: 'exact' });
    if (search) query = query.or(`display_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    if (user_type) query = query.eq('user_type', user_type);
    query = query.is('is_deleted', false).order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, users: data || [], total: count || 0 });
  }

  if (req.method === 'PATCH') {
    const { id, action, reason } = req.body;
    if (!id || !action) return res.status(400).json({ error: 'id and action required' });

    let updates = {};
    if (action === 'suspend') updates = { is_deleted: true, deleted_at: new Date().toISOString() };
    else if (action === 'reactivate') updates = { is_deleted: false, deleted_at: null };
    else return res.status(400).json({ error: 'Invalid action' });

    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({ adminId, action: `USER_${action.toUpperCase()}`, entityType: 'user', entityId: id, details: { reason }, ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress });

    return res.json({ success: true, user: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
