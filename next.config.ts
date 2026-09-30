import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vcsamersham.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/hom',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/live-dosa',
        destination: '/live-dosa-catering',
        permanent: true,
      },
      {
        source: '/outdoor',
        destination: '/outdoor-catering',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
