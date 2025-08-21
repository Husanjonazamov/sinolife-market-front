import type { NextConfig } from "next";
const createNextIntlPlugin = require('next-intl/plugin');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // image optimizationni o'chiradi
  },
  typescript: {

    ignoreBuildErrors: true, // TS xatolarini buildni to'xtatmasdan o'tkazadi
  },
};

const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl(nextConfig);
