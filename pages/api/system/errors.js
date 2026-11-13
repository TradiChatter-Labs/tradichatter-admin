import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [backupsRes, escalationsRes, auditRes] = await Promise.allSettled([
      supabase
        .from('backup_logs')
        .select('id, status, error_message, created_at, backup_type')
        .eq('status', 'failed')
        .order('created_at', { ascending: false })
        .limit(20),

      supabase
        .from('ai_escalations')
        .select('id, customer_id, escalation_reason, status, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20),

      supabase
        .from('admin_audit_logs')
        .select('id, action, entity_type, details, created_at, admin_id')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(30),
    ]);

    const errors = [];

    for (const b of (backupsRes.value?.data || [])) {
      errors.push({
        id: b.id,
        type: 'Backup Failed',
        severity: 'high',
        count: 1,
        lastOccurred: b.created_at,
        status: 'active',
        app: 'Backup Service',
        message: b.error_message || `${b.backup_type} backup failed`,
      });
    }

    for (const e of (escalationsRes.value?.data || [])) {
      errors.push({
        id: e.id,
        type: 'AI Escalation Pending',
        severity: 'medium',
        count: 1,
        lastOccurred: e.created_at,
        status: 'investigating',
        app: 'AI Agent Service',
        message: e.escalation_reason || `Customer ${e.customer_id?.slice(0, 8)} waiting`,
      });
    }

    const failedActions = (auditRes.value?.data || []).filter(a =>
      a.action?.includes('fail') || a.action?.includes('error') || a.action?.includes('reject')
    );
    for (const a of failedActions) {
      errors.push({
        id: a.id,
        type: `Admin Action: ${a.action}`,
        severity: 'low',
        count: 1,
        lastOccurred: a.created_at,
        status: 'resolved',
        app: 'Admin Portal',
        message: typeof a.details === 'string' ? a.details : JSON.stringify(a.details || {}),
      });
    }

    const summary = {
      total: errors.length,
      critical: errors.filter(e => e.severity === 'critical').length,
      high: errors.filter(e => e.severity === 'high').length,
      resolved: errors.filter(e => e.status === 'resolved').length,
      pending: errors.filter(e => e.status !== 'resolved').length,
    };

    return res.json({ success: true, errors, summary });
  } catch (err) {
    console.error('[errors] error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
