import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": ["./repos/**/*", "./.repolens/**/*"],
  },
};

export default nextConfig;
