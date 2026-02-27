import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static export for dev
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
