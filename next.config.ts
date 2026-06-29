import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Monorepo: Next lives in frontend/; avoid picking a parent lockfile as turbopack root
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
