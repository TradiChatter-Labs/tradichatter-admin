import { supabase, logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { filter = 'all', search = '' } = req.query;

    let query = supabase
      .from('chat_reports')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter !== 'all') query = query.eq('status', filter);
    if (search) query = query.or(`reported_user_id.ilike.%${search}%,reason.ilike.%${search}%,message_content.ilike.%${search}%`);

    const { data, count, error } = await query;

    // Table doesn't exist yet — return honest empty state
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      return res.json({ success: true, reports: [], total: 0, tableExists: false });
    }
    if (error) return res.status(500).json({ error: error.message });

    return res.json({ success: true, reports: data || [], total: count || 0, tableExists: true });
  }

  if (req.method === 'PATCH') {
    const { id, action } = req.body;
    if (!id || !action) return res.status(400).json({ error: 'id and action required' });

    const status = action === 'resolve' ? 'resolved' : 'dismissed';
    const { data, error } = await supabase
      .from('chat_reports')
      .update({ status, resolved_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    await logAdminAction({
      adminId: req.headers['x-admin-id'] || 'unknown',
      action: `CHAT_REPORT_${status.toUpperCase()}`,
      entityType: 'chat_report',
      entityId: id,
      details: { action },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true, report: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
