import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const [notifsRes, kycRes, escalationsRes, backupRes] = await Promise.allSettled([
      supabase.from('admin_notifications').select('id, type, message, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('business_kyc').select('id', { count: 'exact', head: true }).in('verification_status', ['pending', 'submitted']),
      supabase.from('ai_escalations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('backup_logs').select('id, status, created_at').eq('status', 'failed').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).limit(1),
    ]);

    const notifications = notifsRes.value?.data || [];
    const pendingKyc = kycRes.value?.count || 0;
    const pendingEscalations = escalationsRes.value?.count || 0;
    const recentFailedBackup = backupRes.value?.data?.length > 0;

    // Build system alerts to prepend
    const systemAlerts = [];
    if (recentFailedBackup) {
      systemAlerts.push({ id: 'backup-fail', type: 'backup', message: '❌ Backup failed in the last 24 hours', href: '/backup-restore', created_at: new Date().toISOString() });
    }
    if (pendingKyc > 0) {
      systemAlerts.push({ id: 'kyc-pending', type: 'kyc', message: `⏳ ${pendingKyc} KYC application${pendingKyc > 1 ? 's' : ''} pending review`, href: '/kyc', created_at: new Date().toISOString() });
    }
    if (pendingEscalations > 0) {
      systemAlerts.push({ id: 'esc-pending', type: 'escalation', message: `💬 ${pendingEscalations} customer escalation${pendingEscalations > 1 ? 's' : ''} waiting`, href: '/ai-agents', created_at: new Date().toISOString() });
    }

    const allNotifications = [...systemAlerts, ...notifications].slice(0, 5);
    const unreadCount = systemAlerts.length + notifications.filter(n => n.status !== 'read').length;

    return res.json({ success: true, unreadCount, notifications: allNotifications });
  } catch (err) {
    console.error('[notifications-summary] error:', err);
    return res.json({ success: true, unreadCount: 0, notifications: [] });
  }
}
