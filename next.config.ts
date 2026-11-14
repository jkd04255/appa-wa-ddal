import type { NextConfig } from "next";

const staticDemo = process.env.STATIC_DEMO === "1";
const basePath = staticDemo ? process.env.NEXT_PUBLIC_BASE_PATH : undefined;

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(staticDemo ? {
    output: "export",
    images: { unoptimized: true },
  } : {}),
  ...(basePath ? { basePath, trailingSlash: true } : {}),
};

export default nextConfig;
