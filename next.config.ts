import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack root absolute (Windows path with forward slashes works in Turbopack).
  turbopack: {
    root: "C:/Users/User/Downloads/muffment-web",
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
