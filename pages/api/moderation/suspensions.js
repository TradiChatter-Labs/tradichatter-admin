import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { status } = req.query;
    let query = supabase.from('user_suspensions').select('*').order('created_at', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, suspensions: data || [] });
  }

  if (req.method === 'POST') {
    const { user_id, username, type, reason, notes, duration } = req.body;
    if (!user_id || !reason) return res.status(400).json({ error: 'user_id and reason required' });

    const end_date = type === 'ban' ? null : new Date(Date.now() + parseInt(duration || 7) * 86400000).toISOString();
    const { data, error } = await supabase.from('user_suspensions').insert({
      user_id, username, type, reason, notes,
      duration: type === 'ban' ? 'permanent' : `${duration || 7} days`,
      end_date, admin_id: req.headers['x-admin-id'] || 'unknown'
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });

    // Also mark user as suspended
    await supabase.from('users').update({ is_deleted: true }).eq('id', user_id);
    return res.status(201).json({ success: true, suspension: data });
  }

  if (req.method === 'PATCH') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });

    const { data, error } = await supabase.from('user_suspensions')
      .update({ status: 'lifted', lifted_at: new Date().toISOString() })
      .eq('id', id).select().single();

    if (error) return res.status(500).json({ error: error.message });

    // Reactivate user
    if (data?.user_id) await supabase.from('users').update({ is_deleted: false }).eq('id', data.user_id);
    return res.json({ success: true, suspension: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
