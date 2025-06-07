const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/ideas",
        destination: "https://suitmedia-backend.suitdev.com/api/ideas",
      },
      {
        source: "/api/proxy-image/:path*",
        destination: "https://assets.suitdev.com/:path*",
      },
    ];
  },
  images: {
    domains: ["assets.suitdev.com", "suitmedia-backend.suitdev.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.suitdev.com",
        pathname: "/storage/files/**",
      },
    ],
  },
};

module.exports = nextConfig;
