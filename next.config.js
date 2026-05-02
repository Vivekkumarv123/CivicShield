/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Skip heavy linting/type-checking during build to avoid OOM
  typescript: {
    // Re-enabling build errors for production hardening
    ignoreBuildErrors: false,
  },
  eslint: {
    // Re-enabling linting during builds
    ignoreDuringBuilds: false,
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    
    // In dev, we allow some leniency for Fast Refresh
    if (isDev) {
        return [];
    }
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Tightened CSP: Removed unsafe-eval, limited connect-src to trusted AI and analytics domains
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com https://*.upstash.io; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none'; upgrade-insecure-requests;`
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
