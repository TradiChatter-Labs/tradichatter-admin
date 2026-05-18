import { checkAllServicesHealth } from '../../../lib/serviceConnector';
import { getDashboardStats } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [services, dbStats] = await Promise.all([
      checkAllServicesHealth(),
      getDashboardStats().catch(() => null),
    ]);

    // Determine overall status
    const serviceStatuses = Object.values(services);
    const healthyCount = serviceStatuses.filter(s => s.status === 'healthy').length;
    const totalServices = serviceStatuses.length;

    let overallStatus = 'healthy';
    if (healthyCount === 0) overallStatus = 'critical';
    else if (healthyCount < totalServices) overallStatus = 'degraded';

    // Database status
    const databaseStatus = dbStats ? 'healthy' : 'unhealthy';

    const healthData = {
      success: true,
      data: {
        overallStatus,
        serverStatus: overallStatus,
        databaseStatus,
        services,
        stats: dbStats || {},
        uptime: Math.floor(process.uptime() / 3600) + 'h ' + Math.floor((process.uptime() % 3600) / 60) + 'm',
        timestamp: new Date().toISOString(),
        healthyServices: healthyCount,
        totalServices,
      },
    };

    res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
