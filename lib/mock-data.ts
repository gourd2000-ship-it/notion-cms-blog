/**
 * @description 개발 환경용 목업 데이터
 * NOTION_TOKEN 미설정 시 UI 확인을 위해 사용합니다.
 * 실제 배포 환경에서는 Notion API 데이터로 대체됩니다.
 */

import type { Post, Category } from "@/lib/types"

export const MOCK_POSTS: Post[] = [
  {
    id: "mock-1",
    title: "Next.js 16 App Router 완벽 가이드",
    category: "개발",
    tags: ["Next.js", "React", "TypeScript"],
    publishedAt: "2026-05-01",
    status: "발행됨",
    coverImage: null,
  },
  {
    id: "mock-2",
    title: "GPT-4o 활용 사례 연구: 코드 리뷰 자동화",
    category: "AI",
    tags: ["GPT-4", "AI", "자동화"],
    publishedAt: "2026-04-20",
    status: "발행됨",
    coverImage: null,
  },
  {
    id: "mock-3",
    title: "Tailwind CSS v4 변경사항 정리",
    category: "개발",
    tags: ["Tailwind", "CSS"],
    publishedAt: "2026-04-10",
    status: "발행됨",
    coverImage: null,
  },
  {
    id: "mock-4",
    title: "Claude API로 RAG 시스템 구축하기",
    category: "AI",
    tags: ["Claude", "RAG", "LLM"],
    publishedAt: "2026-03-28",
    status: "발행됨",
    coverImage: null,
  },
  {
    id: "mock-5",
    title: "shadcn/ui 컴포넌트 커스터마이징 전략",
    category: "개발",
    tags: ["shadcn", "React", "UI"],
    publishedAt: "2026-03-15",
    status: "발행됨",
    coverImage: null,
  },
  {
    id: "mock-6",
    title: "《개발자를 위한 글쓰기》 독서 후기",
    category: "리뷰",
    tags: ["독서", "글쓰기"],
    publishedAt: "2026-03-01",
    status: "발행됨",
    coverImage: null,
  },
]

export const MOCK_CATEGORIES: Category[] = [
  { name: "개발", count: 3 },
  { name: "AI", count: 2 },
  { name: "리뷰", count: 1 },
]
