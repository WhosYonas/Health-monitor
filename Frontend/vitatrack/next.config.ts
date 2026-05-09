import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: "http://backend:8000/:path*/",
      },
      {
        source: "/api/:path*",
        destination: "http://backend:8000/:path*",
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
