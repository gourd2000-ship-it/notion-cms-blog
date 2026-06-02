import type { NextConfig } from "next";

// ============================================================
// 보안 헤더 설정
// ============================================================

const isDev = process.env.NODE_ENV === "development"

/**
 * @description Content-Security-Policy 값 구성
 * - script-src: next-themes 인라인 스크립트 허용을 위해 'unsafe-inline' 필수
 * - 개발 환경: HMR을 위한 'unsafe-eval' 및 WebSocket connect-src 추가
 * - img-src: Notion S3 이미지 도메인 명시적 허용
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  [
    "img-src 'self' data: blob:",
    "https://prod-files-secure.s3.us-west-2.amazonaws.com",
    "https://www.notion.so",
    "https://*.notion.so",
    // Notion 커버에서 Unsplash 이미지 선택 시 필요
    "https://images.unsplash.com",
  ].join(" "),
  "font-src 'self' data:",
  isDev
    ? "connect-src 'self' ws://localhost:* wss://localhost:* http://localhost:*"
    : "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ")

/**
 * @description 모든 응답에 적용할 보안 헤더 목록
 */
const securityHeaders = [
  // XSS 완화 — 인라인 스크립트·스타일·이미지 출처 제한
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  // 클릭재킹 방지 — iframe 삽입 차단
  { key: "X-Frame-Options", value: "DENY" },
  // MIME 스니핑 방지
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referer 정보 최소화 — 교차 도메인 요청 시 오리진만 전송
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // HTTPS 강제 (Vercel 프로덕션 기준 2년)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // 불필요한 브라우저 기능 비활성화
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

// ============================================================
// Next.js 설정
// ============================================================

const nextConfig: NextConfig = {
  /**
   * @description 보안 응답 헤더 — 모든 경로에 적용
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },

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
