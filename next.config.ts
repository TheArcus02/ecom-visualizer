import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['sharp'],
  // Ensure sharp works in production
  outputFileTracingIncludes: {
    '/api/generate-fit': ['./node_modules/sharp/**/*'],
  },
};

export default nextConfig;
