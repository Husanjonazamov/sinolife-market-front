import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // image optimizationni o'chiradi
  },
  typescript: {
    ignoreBuildErrors: true, // TS xatolarini buildni to'xtatmasdan o'tkazadi
  },
};

export default nextConfig;
