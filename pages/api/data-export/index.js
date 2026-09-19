import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('data_export_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, requests: data || [] });
  }

  if (req.method === 'POST') {
    const { user_id, email, request_type } = req.body;
    if (!user_id || !email) return res.status(400).json({ error: 'user_id and email required' });

    const { data, error } = await supabase.from('data_export_requests')
      .insert({ user_id, email, request_type: request_type || 'full_export' })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ success: true, request: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
