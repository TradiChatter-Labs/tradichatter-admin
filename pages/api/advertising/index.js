import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('ad_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        // Table may not exist yet — return empty gracefully
        return res.json({ success: true, campaigns: [] });
      }
      return res.json({ success: true, campaigns: data || [] });
    } catch (err) {
      return res.json({ success: true, campaigns: [] });
    }
  }

  if (req.method === 'PATCH') {
    const { id, status, rejectionReason } = req.body;
    if (!id || !status) return res.status(400).json({ success: false, error: 'id and status required' });
    try {
      const updates = { status, updated_at: new Date().toISOString() };
      if (rejectionReason) updates.rejection_reason = rejectionReason;
      const { error } = await supabase.from('ad_campaigns').update(updates).eq('id', id);
      if (error) return res.status(500).json({ success: false, error: error.message });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
