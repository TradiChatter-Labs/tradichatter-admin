import { checkAllServicesHealth, getAIAgentMetrics } from '../../../lib/serviceConnector';
import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [services, ordersRes, usersRes, escrowRes, kycRes, aiMetricsRes] = await Promise.all([
      checkAllServicesHealth().catch(() => ({})),
      supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', since24h),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('escrow_transactions').select('id, status', { count: 'exact', head: false }),
      supabase.from('business_kyc').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      getAIAgentMetrics().catch(() => ({ ok: false, data: null })),
    ]);

    // Real service latencies
    const serviceLatencies = Object.entries(services).map(([key, svc]) => ({
      name: svc.name,
      latency: svc.latency || 0,
      status: svc.status,
    }));

    const deployedServices = serviceLatencies.filter(s => s.status !== 'not_deployed');
    const avgLatency = deployedServices.length > 0
      ? Math.round(deployedServices.reduce((sum, s) => sum + s.latency, 0) / deployedServices.length)
      : 0;

    const healthyCount = deployedServices.filter(s => s.status === 'healthy').length;
    const uptimePercent = deployedServices.length > 0
      ? Math.round((healthyCount / deployedServices.length) * 1000) / 10
      : 100;

    const activeEscrow = (escrowRes.data || []).filter(e => e.status === 'active').length;

    // Real AI metrics — only include if the service responded successfully
    const aiMetrics = (aiMetricsRes.ok && aiMetricsRes.data)
      ? {
          available: true,
          requestCount: aiMetricsRes.data.request_count ?? null,
          avgLatencyMs: aiMetricsRes.data.avg_latency_ms ?? null,
          escalationRatePct: aiMetricsRes.data.escalation_rate_percent ?? null,
          errorRatePct: aiMetricsRes.data.error_rate_percent ?? null,
          avgConfidence: aiMetricsRes.data.avg_confidence ?? null,
          policyViolations: aiMetricsRes.data.policy_violations ?? null,
          refusalRatePct: aiMetricsRes.data.refusal_rate_percent ?? null,
        }
      : { available: false };

    return res.json({
      success: true,
      source: 'real',
      data: {
        orders24h: ordersRes.count || 0,
        totalUsers: usersRes.count || 0,
        activeEscrow,
        kycPending: kycRes.count || 0,
        avgServiceLatencyMs: avgLatency,
        uptimePercent,
        serviceLatencies,
        healthyServices: healthyCount,
        deployedServices: deployedServices.length,
        aiMetrics,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[performance] error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
