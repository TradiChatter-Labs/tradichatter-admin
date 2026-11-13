import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { q } = req.query;
  if (!q || q.trim().length < 2) return res.json({ users: [], businesses: [], orders: [], escalations: [] });

  const query = q.trim();

  try {
    const [usersRes, businessesRes, ordersRes, escalationsRes] = await Promise.allSettled([
      supabase
        .from('profiles')
        .select('id, display_name, phone, user_type, created_at')
        .or(`display_name.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(4),

      supabase
        .from('businesses')
        .select('id, business_name, city, state, subscription_status, is_active')
        .or(`business_name.ilike.%${query}%,city.ilike.%${query}%`)
        .limit(4),

      supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .or(`id.ilike.%${query}%`)
        .limit(3),

      supabase
        .from('ai_escalations')
        .select('id, customer_id, customer_message, status, created_at')
        .or(`customer_id.ilike.%${query}%,customer_message.ilike.%${query}%`)
        .eq('status', 'pending')
        .limit(3),
    ]);

    return res.json({
      users: usersRes.status === 'fulfilled' ? (usersRes.value.data || []) : [],
      businesses: businessesRes.status === 'fulfilled' ? (businessesRes.value.data || []) : [],
      orders: ordersRes.status === 'fulfilled' ? (ordersRes.value.data || []) : [],
      escalations: escalationsRes.status === 'fulfilled' ? (escalationsRes.value.data || []) : [],
    });
  } catch (err) {
    console.error('[global search] error:', err);
    return res.json({ users: [], businesses: [], orders: [], escalations: [] });
  }
}
