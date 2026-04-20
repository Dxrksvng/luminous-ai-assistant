import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@luminous/shared"],

  // Enable experimental features
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Webpack configuration for Three.js
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      "bufferutil": "commonjs bufferutil",
    });
    return config;
  },
};

export default nextConfig;
