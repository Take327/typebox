import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true, // CSSの最適化を有効化
  },
  reactStrictMode: true, // Strictモードを有効化
};

export default nextConfig;
