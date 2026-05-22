import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tuvtwryuufmmiuupedki.supabase.co',
      },
    ],
  },
};

export default nextConfig;
