import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Top businesses by order count and revenue
    const { data: orders, error } = await supabase
      .from('orders')
      .select('business_id, total_amount, customer_id, status, created_at, businesses(business_name)')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) return res.status(500).json({ error: error.message });

    // Group by business
    const byBusiness = {};
    (orders || []).forEach(o => {
      const id = o.business_id;
      if (!id) return;
      if (!byBusiness[id]) {
        byBusiness[id] = {
          business_id: id,
          business_name: o.businesses?.business_name || id,
          total_orders: 0,
          total_revenue: 0,
          unique_customers: new Set(),
          last_order_at: null,
        };
      }
      byBusiness[id].total_orders++;
      byBusiness[id].total_revenue += o.total_amount || 0;
      if (o.customer_id) byBusiness[id].unique_customers.add(o.customer_id);
      if (!byBusiness[id].last_order_at || o.created_at > byBusiness[id].last_order_at) {
        byBusiness[id].last_order_at = o.created_at;
      }
    });

    const businesses = Object.values(byBusiness)
      .map(b => ({ ...b, unique_customers: b.unique_customers.size }))
      .sort((a, b) => b.total_orders - a.total_orders);

    const totalOrders = (orders || []).length;
    const totalRevenue = (orders || []).reduce((s, o) => s + (o.total_amount || 0), 0);
    const totalBusinesses = businesses.length;
    const allCustomers = new Set((orders || []).map(o => o.customer_id).filter(Boolean));

    return res.json({
      success: true,
      stats: {
        totalBusinesses,
        totalOrders,
        totalRevenue,
        totalUniqueCustomers: allCustomers.size,
      },
      businesses,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
