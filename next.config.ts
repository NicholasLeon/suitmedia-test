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
};

module.exports = nextConfig;
