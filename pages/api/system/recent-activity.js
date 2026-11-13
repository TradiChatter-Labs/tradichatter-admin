import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const [ordersRes, usersRes, kycRes, escalationsRes, backupsRes] = await Promise.allSettled([
      supabase.from('orders').select('id, status, total_amount, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('profiles').select('id, display_name, phone, created_at').order('created_at', { ascending: false }).limit(2),
      supabase.from('business_kyc').select('id, verification_status, updated_at').order('updated_at', { ascending: false }).limit(2),
      supabase.from('ai_escalations').select('id, customer_id, escalation_reason, created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(2),
      supabase.from('backup_logs').select('id, status, size_bytes, error_message, created_at').order('created_at', { ascending: false }).limit(1),
    ]);

    const activities = [];

    for (const order of (ordersRes.value?.data || [])) {
      activities.push({
        type: 'order', icon: '🛒',
        text: `New order ₦${(order.total_amount || 0).toLocaleString()} — ${order.status}`,
        href: '/orders', time: order.created_at,
      });
    }
    for (const user of (usersRes.value?.data || [])) {
      activities.push({
        type: 'user', icon: '👤',
        text: `New user registered: ${user.display_name || user.phone || 'Unknown'}`,
        href: '/users', time: user.created_at,
      });
    }
    for (const kyc of (kycRes.value?.data || [])) {
      activities.push({
        type: 'kyc', icon: kyc.verification_status === 'verified' ? '✅' : '⏳',
        text: `KYC ${kyc.verification_status}: ${kyc.id?.slice(0, 8)}`,
        href: '/kyc', time: kyc.updated_at,
      });
    }
    for (const esc of (escalationsRes.value?.data || [])) {
      activities.push({
        type: 'escalation', icon: '⚠️',
        text: `Escalation pending: ${esc.escalation_reason || esc.customer_id?.slice(0, 12)}`,
        href: '/ai-agents', time: esc.created_at,
      });
    }
    for (const bk of (backupsRes.value?.data || [])) {
      activities.push({
        type: 'backup', icon: bk.status === 'completed' ? '💾' : '🔴',
        text: bk.status === 'completed'
          ? `Backup completed — ${bk.size_bytes ? Math.round(bk.size_bytes / 1024 / 1024) + 'MB' : 'unknown size'}`
          : `Backup ${bk.status}${bk.error_message ? ': ' + bk.error_message.slice(0, 60) : ''}`,
        href: '/backup-restore', time: bk.created_at,
      });
    }

    // Sort all by time descending, take top 10
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    return res.json({ success: true, activities: activities.slice(0, 10) });
  } catch (err) {
    console.error('[recent-activity] error:', err);
    return res.json({ success: false, activities: [] });
  }
}
