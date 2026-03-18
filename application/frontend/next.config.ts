import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // This tells Next.js to ignore any lockfiles outside of this folder
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
