import type { SiteConfig } from "@/types"

/**
 * @description 사이트 전역 설정
 * 블로그 이름, 설명, 네비게이션 구조를 정의합니다.
 */
export const siteConfig: SiteConfig = {
  name: "개인 연구 블로그",
  description: "Notion CMS 기반 개인 연구 블로그 - 학습 기록과 기술 연구를 공유합니다.",
  url: "https://example.com",
  links: {
    github: "https://github.com",
  },
  mainNav: [
    { title: "홈", href: "/" },
    { title: "포스트", href: "/posts" },
    { title: "소개", href: "/about" },
  ],
  sidebarNav: [],
}
