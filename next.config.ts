import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "**.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
