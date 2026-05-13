import type { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "Next.js Starter",
  description: "clone → npm install → npm run dev 만으로 즉시 개발 시작 가능한 모던 웹 스타터킷",
  url: "https://example.com",
  links: {
    github: "https://github.com",
  },
  mainNav: [
    { title: "홈", href: "/" },
    { title: "소개", href: "/about" },
  ],
  sidebarNav: [
    {
      title: "개요",
      items: [
        { title: "대시보드", href: "/dashboard" },
      ],
    },
    {
      title: "설정",
      items: [
        { title: "계정", href: "/dashboard/account", disabled: true },
        { title: "환경설정", href: "/dashboard/settings", disabled: true },
      ],
    },
  ],
}
