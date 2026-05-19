import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const [users, businesses, orders, subscriptions, escrows] = await Promise.all([
      supabase.from('users').select('id, created_at, user_type, is_deleted', { count: 'exact' }),
      supabase.from('businesses').select('id, is_active, is_verified, subscription_status, created_at', { count: 'exact' }),
      supabase.from('orders').select('id, status, total_amount, payment_status, created_at', { count: 'exact' }),
      supabase.from('subscriptions').select('id, status, plan, created_at', { count: 'exact' }),
      supabase.from('escrow_transactions').select('id, status, amount, created_at', { count: 'exact' }),
    ]);

    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

    const allUsers = users.data || [];
    const allBusinesses = businesses.data || [];
    const allOrders = orders.data || [];

    const stats = {
      users: {
        total: users.count || 0,
        active: allUsers.filter(u => !u.is_deleted).length,
        new_30d: allUsers.filter(u => u.created_at >= thirtyDaysAgo).length,
        new_7d: allUsers.filter(u => u.created_at >= sevenDaysAgo).length,
        sellers: allUsers.filter(u => u.user_type === 'seller' || u.user_type === 'business').length,
        buyers: allUsers.filter(u => u.user_type === 'customer' || u.user_type === 'buyer').length,
      },
      businesses: {
        total: businesses.count || 0,
        active: allBusinesses.filter(b => b.is_active).length,
        verified: allBusinesses.filter(b => b.is_verified).length,
        premium: allBusinesses.filter(b => b.subscription_status === 'active').length,
        new_30d: allBusinesses.filter(b => b.created_at >= thirtyDaysAgo).length,
      },
      orders: {
        total: orders.count || 0,
        completed: allOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length,
        total_revenue: allOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + (o.total_amount || 0), 0),
        revenue_30d: allOrders.filter(o => o.payment_status === 'paid' && o.created_at >= thirtyDaysAgo).reduce((sum, o) => sum + (o.total_amount || 0), 0),
      },
      subscriptions: {
        total: subscriptions.count || 0,
        active: (subscriptions.data || []).filter(s => s.status === 'active').length,
        trial: (subscriptions.data || []).filter(s => s.status === 'trial').length,
      },
      escrow: {
        total: escrows.count || 0,
        active: (escrows.data || []).filter(e => e.status === 'active' || e.status === 'funded').length,
        total_held: (escrows.data || []).filter(e => e.status === 'active' || e.status === 'funded').reduce((sum, e) => sum + (e.amount || 0), 0),
      },
    };

    return res.json({ success: true, stats });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
