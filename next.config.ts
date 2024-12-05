import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/venue",
        destination: "https://cdn-dev.preoday.com/challenge/venue/9",
      },
      {
        source: "/api/menu",
        destination: "https://cdn-dev.preoday.com/challenge/menu",
      },
    ];
  },
};

export default nextConfig;
