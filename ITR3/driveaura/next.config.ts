import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Avoid broken webpack vendor-chunks for Firebase (MODULE_NOT_FOUND @firebase.js)
  // and load firebase from node_modules on the server instead.
  serverExternalPackages: ["firebase"],
  // Stale Webpack filesystem cache often causes "Cannot find module './611.js'" in dev.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  turbopack: {
    // Ensure Next/Turbopack treats this folder as the project root
    // (important in monorepos / multiple lockfiles, and for .env.local loading)
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.ontario.ca",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
