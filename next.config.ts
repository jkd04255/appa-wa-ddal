import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(process.env.STATIC_DEMO === "1" ? {
    output: "export",
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;
