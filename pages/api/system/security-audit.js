import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [
      pendingKycRes,
      pendingEscalationsRes,
      suspendedUsersRes,
      failedBackupsRes,
      auditLogsRes,
    ] = await Promise.allSettled([
      supabase
        .from('business_kyc')
        .select('id', { count: 'exact', head: true })
        .in('verification_status', ['pending', 'submitted']),

      supabase
        .from('ai_escalations')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),

      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('suspended', true),

      supabase
        .from('backup_logs')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'failed')
        .gte('created_at', since24h),

      supabase
        .from('admin_audit_logs')
        .select('id, action, admin_id, created_at')
        .gte('created_at', since24h)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const metrics = {
      pendingKyc: pendingKycRes.value?.count || 0,
      pendingEscalations: pendingEscalationsRes.value?.count || 0,
      suspendedUsers: suspendedUsersRes.value?.count || 0,
      failedBackups24h: failedBackupsRes.value?.count || 0,
      recentAdminActions: auditLogsRes.value?.data || [],
    };

    return res.json({ success: true, metrics });
  } catch (err) {
    console.error('[security-audit] error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
