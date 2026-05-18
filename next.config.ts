import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Notion S3 이미지 도메인 (인라인 이미지 업로드)
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      // Notion CDN (외부 삽입 이미지)
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      // Notion 파일 업로드 CDN
      {
        protocol: "https",
        hostname: "*.notion.so",
      },
    ],
  },
};

export default nextConfig;
