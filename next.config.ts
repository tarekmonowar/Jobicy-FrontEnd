import type { NextConfig } from 'next';

// Embed public env at build time so the browser bundle always has API URLs.
const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
    NEXT_PUBLIC_SOCKET_URL:
      process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000',
    NEXT_PUBLIC_USD_TO_BDT: process.env.NEXT_PUBLIC_USD_TO_BDT ?? '120',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'Joblens',
  },
};

export default nextConfig;
