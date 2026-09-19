import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('business_members')
      .select('*, businesses(business_name)')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Group by business
    const grouped = {};
    (data || []).forEach(m => {
      const bizId = m.business_id;
      if (!grouped[bizId]) grouped[bizId] = { business_id: bizId, business_name: m.businesses?.business_name || 'Unknown', members: [] };
      grouped[bizId].members.push(m);
    });

    return res.json({ success: true, teams: Object.values(grouped) });
  }

  if (req.method === 'POST') {
    const { business_id, email, role, name } = req.body;
    if (!business_id || !email) return res.status(400).json({ error: 'business_id and email required' });

    const { data, error } = await supabase.from('business_members')
      .insert({ business_id, email, role: role || 'staff', name, invited_by: req.headers['x-admin-id'] })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ success: true, member: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
