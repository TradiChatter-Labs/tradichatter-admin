import { createClient } from '@supabase/supabase-js';
import { checkAllServicesHealth } from '../../../lib/serviceConnector';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    const [backupsRes, escalationsRes, auditRes, services] = await Promise.allSettled([
      supabase
        .from('backup_logs')
        .select('id, status, error_message, created_at, backup_type')
        .eq('status', 'failed')
        .lte('created_at', now)
        .order('created_at', { ascending: false })
        .limit(20),

      // Fix: filter out future-dated rows (2026 timestamp issue)
      supabase
        .from('ai_escalations')
        .select('id, customer_id, escalation_reason, status, created_at')
        .eq('status', 'pending')
        .lte('created_at', now)
        .order('created_at', { ascending: false })
        .limit(20),

      supabase
        .from('admin_audit_logs')
        .select('id, action, entity_type, details, created_at, admin_id')
        .gte('created_at', since)
        .lte('created_at', now)
        .order('created_at', { ascending: false })
        .limit(30),

      checkAllServicesHealth().catch(() => ({})),
    ]);

    const systemErrors = [];
    const escalations = [];

    // ── Backup failures (real errors) ────────────────────────────────────────
    for (const b of (backupsRes.value?.data || [])) {
      systemErrors.push({
        id: `backup-${b.id}`,
        type: 'Backup Failed',
        severity: 'high',
        lastOccurred: b.created_at,
        status: 'active',
        source: 'Backup Service',
        message: b.error_message || `${b.backup_type || 'unknown'} backup failed`,
      });
    }

    // ── Microservice health errors (Step 4) ──────────────────────────────────
    const svcHealth = services.value || {};
    for (const [key, svc] of Object.entries(svcHealth)) {
      if (svc.status === 'not_deployed') continue;
      if (svc.status === 'unhealthy' || svc.status === 'timeout') {
        systemErrors.push({
          id: `svc-${key}`,
          type: svc.status === 'timeout' ? 'Service Timeout' : 'Service Unhealthy',
          severity: svc.status === 'timeout' ? 'medium' : 'high',
          lastOccurred: new Date().toISOString(),
          status: 'active',
          source: svc.name,
          message: svc.error
            ? `${svc.name}: ${svc.error}`
            : `${svc.name} is not responding (latency: ${svc.latency}ms)`,
        });
      } else if (svc.status === 'healthy' && svc.latency > 2000) {
        systemErrors.push({
          id: `svc-slow-${key}`,
          type: 'Service Slow',
          severity: 'low',
          lastOccurred: new Date().toISOString(),
          status: 'investigating',
          source: svc.name,
          message: `${svc.name} responding slowly (${svc.latency}ms)`,
        });
      }
    }

    // ── Admin audit failures (real errors) ───────────────────────────────────
    const failedActions = (auditRes.value?.data || []).filter(a =>
      a.action?.includes('fail') || a.action?.includes('error') || a.action?.includes('reject')
    );
    for (const a of failedActions) {
      systemErrors.push({
        id: `audit-${a.id}`,
        type: `Admin Action: ${a.action}`,
        severity: 'low',
        lastOccurred: a.created_at,
        status: 'resolved',
        source: 'Admin Portal',
        message: typeof a.details === 'string' ? a.details : JSON.stringify(a.details || {}),
      });
    }

    // ── AI escalations (NOT errors — separate section) ───────────────────────
    for (const e of (escalationsRes.value?.data || [])) {
      escalations.push({
        id: e.id,
        customerId: e.customer_id?.slice(0, 8) + '...',
        reason: e.escalation_reason || 'No reason provided',
        status: e.status,
        createdAt: e.created_at,
      });
    }

    const summary = {
      total: systemErrors.length,
      critical: systemErrors.filter(e => e.severity === 'critical').length,
      high: systemErrors.filter(e => e.severity === 'high').length,
      medium: systemErrors.filter(e => e.severity === 'medium').length,
      low: systemErrors.filter(e => e.severity === 'low').length,
      active: systemErrors.filter(e => e.status === 'active').length,
      resolved: systemErrors.filter(e => e.status === 'resolved').length,
      pendingEscalations: escalations.length,
    };

    return res.json({ success: true, errors: systemErrors, escalations, summary });
  } catch (err) {
    console.error('[errors] error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
