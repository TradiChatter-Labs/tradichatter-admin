import { supabase, logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('business_kyc').select('*, businesses(business_name, owner_id)', { count: 'exact' });
    if (status) query = query.eq('verification_status', status);
    query = query.order('submitted_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, kyc: data || [], total: count || 0 });
  }

  if (req.method === 'PATCH') {
    const { id, status, reason } = req.body;
    if (!id || !status) return res.status(400).json({ error: 'id and status required' });

    const updates = { verification_status: status };
    if (status === 'verified') updates.verified_at = new Date().toISOString();

    const { data, error } = await supabase.from('business_kyc').update(updates).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({ adminId, action: `KYC_${status.toUpperCase()}`, entityType: 'business_kyc', entityId: id, details: { status, reason }, ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress });

    return res.json({ success: true, kyc: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
