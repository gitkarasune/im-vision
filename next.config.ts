import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
     { protocol: "https", hostname: "avatars.githubusercontent.com" },
    { protocol: "https", hostname: "github.com" },
    { protocol: "https", hostname: "raw.githubusercontent.com" },
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "https", hostname: "www.gravatar.com" },
    { protocol: "https", hostname: "cdn.sanity.io" },
    { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
     {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
    ],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  eslint: { ignoreDuringBuilds: true }, // This will ignore ESLint errors during the build process
  
  typescript: { ignoreBuildErrors: true }, // This will ignore Typescript errors during the build process
};

export default nextConfig;
