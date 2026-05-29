import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages Router handles: all public-facing marketing routes (/, /about, /blog, etc.)
  // App Router handles: /dashboard/* (login, register, designer-dashboard, admin, user-dashboard)

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  reactStrictMode: false,

  sassOptions: {
    silenceDeprecations: ["import", "slash-div", "color-functions", "global-builtin"],
  },
};

export default nextConfig;
