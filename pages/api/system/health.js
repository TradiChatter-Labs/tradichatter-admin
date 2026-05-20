import { checkAllServicesHealth } from '../../../lib/serviceConnector';
import { getDashboardStats } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // If called by ECS health check (no query params), return fast
  const deep = req.query.deep === 'true';
  if (!deep) {
    return res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
  }

  try {
    const [services, dbStats] = await Promise.all([
      checkAllServicesHealth(),
      getDashboardStats().catch(() => null),
    ]);

    const serviceStatuses = Object.values(services);
    const healthyCount = serviceStatuses.filter(s => s.status === 'healthy').length;
    const totalServices = serviceStatuses.length;

    let overallStatus = 'healthy';
    if (healthyCount === 0) overallStatus = 'critical';
    else if (healthyCount < totalServices) overallStatus = 'degraded';

    res.status(200).json({
      success: true,
      data: {
        overallStatus,
        databaseStatus: dbStats ? 'healthy' : 'unhealthy',
        services,
        stats: dbStats || {},
        uptime: Math.floor(process.uptime() / 3600) + 'h ' + Math.floor((process.uptime() % 3600) / 60) + 'm',
        timestamp: new Date().toISOString(),
        healthyServices: healthyCount,
        totalServices,
      },
    });
  } catch (error) {
    res.status(200).json({ success: true, status: 'degraded', error: error.message, timestamp: new Date().toISOString() });
  }
}
