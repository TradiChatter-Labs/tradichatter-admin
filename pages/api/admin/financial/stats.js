import { supabase } from '../../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const [escrowRes, ordersRes] = await Promise.all([
      supabase.from('escrows').select('id, amount, status, created_at'),
      supabase.from('orders').select('id, total_amount, payment_status, platform_commission_cents, created_at').not('payment_status', 'is', null),
    ]);

    const escrows = escrowRes.data || [];
    const orders = ordersRes.data || [];

    const escrowStats = {
      active: escrows.filter(e => e.status === 'active' || e.status === 'held').length,
      completed: escrows.filter(e => e.status === 'released' || e.status === 'completed').length,
      disputed: escrows.filter(e => e.status === 'disputed').length,
      totalValue: escrows.filter(e => e.status === 'active' || e.status === 'held').reduce((s, e) => s + (e.amount || 0), 0),
    };

    const completedOrders = orders.filter(o => o.payment_status === 'paid' || o.payment_status === 'completed');
    const totalFees = completedOrders.reduce((s, o) => s + Math.round((o.platform_commission_cents || 0) / 100), 0);
    const totalRevenue = completedOrders.reduce((s, o) => s + (o.total_amount || 0), 0);

    const recentOrders = orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
      .map(o => ({
        id: o.id?.slice(0, 8).toUpperCase(),
        type: 'Payment',
        amount: o.total_amount || 0,
        status: o.payment_status === 'paid' ? 'Completed' : o.payment_status === 'pending' ? 'Processing' : o.payment_status,
        date: o.created_at?.split('T')[0],
      }));

    return res.json({
      success: true,
      totalTransactions: orders.length,
      totalRevenue,
      totalFees,
      escrowBalance: escrowStats.totalValue,
      escrowStats,
      recentTransactions: recentOrders,
    });
  } catch (error) {
    console.error('[FINANCIAL STATS]', error);
    return res.status(500).json({ error: 'Failed to fetch financial stats' });
  }
}
