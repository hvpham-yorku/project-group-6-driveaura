import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Experimental React Compiler has caused RSC client-manifest resolution issues
  // in this project (AuthProvider not found in manifest). Re-enable when stable.
  reactCompiler: false,
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
