import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/generate-fit': ['./node_modules/sharp/**/*'],
  },
};

export default nextConfig;
