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
        hostname: 'picsum.photos',
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    // Cache RSC page payloads in the router cache so back-navigation is instant
    staleTimes: {
      dynamic: 60,    // seconds — pages with revalidate=0 stay cached for 60s
      static: 600,    // seconds — static pages cached for 10min
    },
  },
};

export default nextConfig;
