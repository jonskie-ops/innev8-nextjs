import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Let other devices on the LAN (and this machine's own network URL) load dev scripts.
  // Without this, the page never hydrates there and the intro never closes.
  allowedDevOrigins: ["192.168.1.88"],
};

export default nextConfig;
