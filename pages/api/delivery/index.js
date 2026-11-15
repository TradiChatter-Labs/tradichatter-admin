import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { filter = 'all', page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    let query = supabase
      .from('orders')
      .select('id, business_id, customer_id, customer_name, total_amount, status, delivery_status, delivery_provider, delivery_tracking_number, delivery_fee, delivery_address, delivery_city, delivery_state, created_at, businesses(business_name)', { count: 'exact' })
      .not('delivery_provider', 'is', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (filter !== 'all') query = query.eq('delivery_status', filter);

    const { data, count, error } = await query;

    if (error) return res.status(500).json({ error: error.message });

    // Stats from all delivery orders (no pagination)
    const { data: allDeliveries } = await supabase
      .from('orders')
      .select('delivery_status, delivery_provider')
      .not('delivery_provider', 'is', null);

    const stats = {
      total: allDeliveries?.length || 0,
      pending: allDeliveries?.filter(o => o.delivery_status === 'pending').length || 0,
      in_transit: allDeliveries?.filter(o => ['booked', 'picked_up', 'in_transit'].includes(o.delivery_status)).length || 0,
      delivered: allDeliveries?.filter(o => o.delivery_status === 'delivered').length || 0,
      failed: allDeliveries?.filter(o => o.delivery_status === 'failed').length || 0,
    };

    return res.json({ success: true, deliveries: data || [], total: count || 0, stats });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
