export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timeframe = '1h', metric } = req.query;
    
    const performanceData = await getPerformanceMetrics(timeframe, metric);
    
    res.status(200).json({
      success: true,
      data: {
        metrics: performanceData.slice(-5).map((point, index) => {
          const time = new Date(point.timestamp);
          return {
            time: time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0'),
            cpu: point.cpu,
            memory: point.memory,
            requests: point.requests
          };
        })
      }
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
}

async function getPerformanceMetrics(timeframe, metric) {
  const now = new Date();
  const dataPoints = [];
  
  // Generate mock performance data
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    dataPoints.push({
      timestamp: timestamp.toISOString(),
      cpu: Math.floor(Math.random() * 40 + 30), // 30-70%
      memory: Math.floor(Math.random() * 30 + 50), // 50-80%
      responseTime: Math.floor(Math.random() * 200 + 100), // 100-300ms
      requests: Math.floor(Math.random() * 500 + 800), // 800-1300 req/min
      errors: Math.floor(Math.random() * 5), // 0-5 errors
      activeUsers: Math.floor(Math.random() * 200 + 1000), // 1000-1200 users
      throughput: (Math.random() * 0.8 + 0.8).toFixed(1), // 0.8-1.6K req/min
      uptime: 99.9 - Math.random() * 0.1 // 99.8-99.9%
    });
  }
  
  if (metric) {
    return dataPoints.map(point => ({
      timestamp: point.timestamp,
      value: point[metric]
    }));
  }
  
  return dataPoints;
}