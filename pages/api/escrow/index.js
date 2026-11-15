import { getEscrows, updateEscrow, logAdminAction, supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { status, page = 1, limit = 50, id } = req.query;

    // Single escrow detail fetch with timeline
    if (id) {
      const { data: escrow, error } = await supabase
        .from('escrow_transactions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return res.status(404).json({ success: false, error: 'Escrow not found' });

      const { data: logs } = await supabase
        .from('admin_audit_logs')
        .select('action, created_at, details')
        .eq('entity_id', id)
        .order('created_at', { ascending: true });

      return res.json({ success: true, escrow, timeline: logs || [] });
    }

    const { data, total, error } = await getEscrows({ status, page: Number(page), limit: Number(limit) });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, escrows: data, total });
  }

  if (req.method === 'PATCH') {
    const { id, status, admin_notes } = req.body;
    if (!id || !status) return res.status(400).json({ error: 'id and status required' });

    const updates = { status, admin_notes, updated_at: new Date().toISOString() };
    if (status === 'released') updates.released_at = new Date().toISOString();

    const { data, error } = await updateEscrow(id, updates);
    if (error) return res.status(500).json({ error: error.message });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({
      adminId,
      action: `ESCROW_${status.toUpperCase()}`,
      entityType: 'escrow',
      entityId: id,
      details: { status, admin_notes },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true, escrow: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
