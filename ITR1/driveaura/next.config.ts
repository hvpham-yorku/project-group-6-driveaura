import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    // Ensure Next/Turbopack treats this folder as the project root
    // (important in monorepos / multiple lockfiles, and for .env.local loading)
    root: __dirname,
  },
};

export default nextConfig;
