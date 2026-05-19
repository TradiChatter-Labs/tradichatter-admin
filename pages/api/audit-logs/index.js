import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { page = 1, limit = 50, admin_id, action, entity_type, from, to } = req.query;
  const offset = (page - 1) * limit;

  let query = supabase.from('admin_audit_logs').select('*', { count: 'exact' });
  if (admin_id) query = query.eq('admin_id', admin_id);
  if (action) query = query.ilike('action', `%${action}%`);
  if (entity_type) query = query.eq('entity_type', entity_type);
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true, logs: data || [], total: count || 0 });
}
