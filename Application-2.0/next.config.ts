import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.46', 'localhost:3000'],

  // Keep this if you need server actions, otherwise you can remove it
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;