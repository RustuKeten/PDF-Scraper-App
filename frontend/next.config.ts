import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Increase API route timeout for OpenAI processing (Vercel Pro plan required for > 60s)
  experimental: {
    // Increase serverless function timeout (max 60s on Hobby, 300s on Pro)
    // Note: Vercel's free tier has 10s limit, Hobby has 60s, Pro has 300s
  },
};

export default nextConfig;
