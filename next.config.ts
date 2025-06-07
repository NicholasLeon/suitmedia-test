import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/ideas",
        destination: "https://suitmedia-backend.suitdev.com/api/ideas",
      },
    ];
  },
  images: {
    domains: [
      "images.unsplash.com",
      "suitmedia-backend.suitdev.com",
      "assets.suitdev.com",
    ],
  },
};

module.exports = nextConfig;
