import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { filter = 'all', search = '' } = req.query;

    let query = supabase
      .from('call_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter !== 'all') query = query.eq('status', filter);
    if (search) query = query.or(`caller_id.ilike.%${search}%,callee_id.ilike.%${search}%`);

    const { data, count, error } = await query;

    // Table doesn't exist yet — return honest empty state
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      return res.json({ success: true, calls: [], total: 0, tableExists: false });
    }
    if (error) return res.status(500).json({ error: error.message });

    return res.json({ success: true, calls: data || [], total: count || 0, tableExists: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
