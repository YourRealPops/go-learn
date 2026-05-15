import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow fetching from Go Playground during MVP phase
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;