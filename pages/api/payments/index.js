import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    // Payments data comes from orders with payment info
    let query = supabase.from('orders')
      .select('id, business_id, business_name, customer_name, total_amount, payment_status, payment_method, payment_reference, paid_at, created_at, escrow_fee_cents, platform_commission_cents, gateway_fee_cents, seller_payout_cents', { count: 'exact' })
      .not('payment_status', 'is', null);
    if (status) query = query.eq('payment_status', status);
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, payments: data || [], total: count || 0 });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
