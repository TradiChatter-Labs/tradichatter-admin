import { getDashboardStats } from '../../../lib/supabaseAdmin';
import { checkAllServicesHealth } from '../../../lib/serviceConnector';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [stats, services] = await Promise.all([
      getDashboardStats(),
      checkAllServicesHealth(),
    ]);

    const serviceStatuses = Object.values(services);
    const healthyServices = serviceStatuses.filter(s => s.status === 'healthy').length;

    res.json({
      success: true,
      data: {
        ...stats,
        systemHealth: {
          healthy: healthyServices,
          total: serviceStatuses.length,
          status: healthyServices === serviceStatuses.length ? 'all_healthy' : 'degraded',
        },
        services,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
