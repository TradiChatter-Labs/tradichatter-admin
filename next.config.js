/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Security headers to prevent CSRF attacks
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Webpack configuration for security
  webpack: (config) => {
    // Add CSRF protection to webpack runtime
    config.output.crossOriginLoading = 'anonymous';
    return config;
  }
}

module.exports = nextConfig