import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",  // bu bo‘lmasin
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
