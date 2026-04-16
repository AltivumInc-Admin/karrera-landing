import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "karrera-resumes-prod.s3.amazonaws.com" },
    ],
  },
};

export default nextConfig;
