export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 50, severity, timeframe = '24h' } = req.query;
    
    const errors = await getErrorReports(limit, severity, timeframe);
    const summary = await getErrorSummary(timeframe);
    
    res.status(200).json({
      success: true,
      data: {
        errors: errors.map(error => ({
          id: error.id,
          type: error.type,
          app: error.platform === 'mobile' ? 'Mobile App' : error.platform === 'web' ? 'Web App' : 'Server',
          count: error.count,
          lastOccurred: new Date(error.timestamp).toLocaleString()
        })),
        alerts: [
          {
            id: 1,
            type: 'warning',
            message: 'High memory usage detected',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
            status: 'active'
          },
          {
            id: 2,
            type: 'info',
            message: 'System backup completed',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
            status: 'resolved'
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching error reports:', error);
    res.status(500).json({ error: 'Failed to fetch error reports' });
  }
}

async function getErrorReports(limit, severity, timeframe) {
  // Mock error data - replace with actual database queries
  const mockErrors = [
    {
      id: '1',
      type: 'crash',
      severity: 'critical',
      message: 'App crashed during payment processing',
      stack: 'Error: Payment gateway timeout\n  at PaymentService.process',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      userId: 'user123',
      platform: 'mobile',
      count: 3
    },
    {
      id: '2',
      type: 'api_error',
      severity: 'warning',
      message: 'API rate limit exceeded',
      stack: 'RateLimitError: Too many requests',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      userId: 'user456',
      platform: 'web',
      count: 15
    },
    {
      id: '3',
      type: 'timeout',
      severity: 'warning',
      message: 'Database query timeout',
      stack: 'TimeoutError: Query exceeded 30s limit',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      userId: null,
      platform: 'server',
      count: 7
    }
  ];

  let filtered = mockErrors;
  
  if (severity) {
    filtered = filtered.filter(error => error.severity === severity);
  }
  
  return filtered.slice(0, parseInt(limit));
}

async function getErrorSummary(timeframe) {
  return {
    totalErrors: 25,
    criticalErrors: 3,
    warningErrors: 15,
    infoErrors: 7,
    topErrors: [
      { type: 'api_error', count: 15 },
      { type: 'timeout', count: 7 },
      { type: 'crash', count: 3 }
    ],
    errorTrend: 'decreasing',
    lastHour: 2,
    last24Hours: 25
  };
}