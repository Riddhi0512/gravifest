import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This will allow your project to build even if it has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! This disables TypeScript errors !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
