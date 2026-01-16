import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@ai-progress-controls/next'],
  },
  // Disable static generation for dev testing
  output: 'standalone',
};

export default nextConfig;
