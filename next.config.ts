import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ymqpkygmownybanldbpq.supabase.co",
      },
    ],
  },
  experimental: {
    serverComponentsHmrCache: false, // defaults to true
  },
};

export default nextConfig;
