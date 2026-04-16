import type { NextConfig } from "next";
import { S3_BUCKETS } from "./lib/constants";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: `${S3_BUCKETS.RESUMES}.s3.amazonaws.com` },
    ],
  },
};

export default nextConfig;
