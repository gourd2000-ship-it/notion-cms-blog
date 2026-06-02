/**
 * @description 블로그 홈 페이지 (서버 컴포넌트)
 *
 * 히어로 배너 + 발행된 포스트 목록 + 카테고리 필터를 표시합니다.
 * Notion DB에서 데이터를 서버에서 직접 조회하여 렌더링합니다.
 *
 * 라우트: /
 */

import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import PostListClient from "@/components/features/PostListClient"
import type { Category } from "@/lib/types"
import { MOCK_POSTS, MOCK_CATEGORIES } from "@/lib/mock-data"
import { env } from "@/lib/env"

// ============================================================
// 메타데이터
// ============================================================

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

// ISR: 5분마다 재검증 (Notion Rate Limit 대응)
export const revalidate = 300

// ============================================================
// 데이터 조회 함수
// ============================================================

/**
 * @description Notion에서 포스트 목록과 카테고리를 조회합니다.
 * NOTION_TOKEN / NOTION_DATABASE_ID 환경 변수가 없으면 목업 데이터를 반환합니다.
 */
async function getHomePageData() {
  if (!env.NOTION_TOKEN || !env.NOTION_DATABASE_ID) {
    return { posts: MOCK_POSTS, categories: MOCK_CATEGORIES, isMock: true }
  }

  try {
    const { getPublishedPosts, getCategories } = await import("@/lib/notion")
    const [posts, categories] = await Promise.all([
      getPublishedPosts(),
      getCategories(),
    ])
    if (posts.length === 0) {
      return { posts: MOCK_POSTS, categories: MOCK_CATEGORIES, isMock: true }
    }
    return { posts, categories, isMock: false }
  } catch (error) {
    console.error("홈 페이지 데이터 로딩 실패:", error)
    return { posts: MOCK_POSTS, categories: MOCK_CATEGORIES, isMock: true }
  }
}

// ============================================================
// 히어로 섹션 컴포넌트
// ============================================================

/**
 * @description 블로그 히어로 배너 — 레퍼런스 이미지의 다크 텍스트 박스 스타일
 */
function HeroSection() {
  return (
    <section className="relative bg-slate-800 dark:bg-slate-950 overflow-hidden">
      {/* 배경 그라디언트 레이어 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800" />

      {/* 장식용 기하학 요소 */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-slate-700/20 skew-x-12 translate-x-20" />
      <div className="absolute bottom-0 left-1/4 w-32 h-32 rounded-full bg-blue-800/20 blur-3xl" />

      {/* 히어로 콘텐츠 */}
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-32 flex items-center justify-center">
        {/* 중앙 텍스트 박스 (레퍼런스의 다크 오버레이 박스) */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 px-10 py-12 md:px-16 md:py-16 text-center max-w-2xl w-full">
          {/* BLOG 레이블 */}
          <span className="block text-xs font-bold tracking-[0.35em] text-blue-400 uppercase mb-5">
            BLOG
          </span>

          {/* 메인 타이틀 */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            {siteConfig.name}
          </h1>

          {/* 서브 설명 */}
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            {siteConfig.description}
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 페이지 컴포넌트
// ============================================================

/**
 * @description 블로그 홈 페이지
 * @returns {Promise<JSX.Element>} 홈 페이지 UI
 */
export default async function HomePage() {
  const { posts, categories, isMock } = await getHomePageData()

  const typedCategories: Category[] = categories.map((cat) => ({
    name: cat.name,
    count: cat.count,
  }))

  return (
    <>
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* 목업 데이터 안내 */}
        {isMock && (
          <div className="mb-10 p-4 border border-dashed rounded-sm bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              현재 <strong>목업 데이터</strong>를 표시 중입니다.{" "}
              <strong>.env.local</strong> 파일에{" "}
              <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">NOTION_TOKEN</code>과{" "}
              <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">NOTION_DATABASE_ID</code>를
              설정하면 실제 Notion 포스트가 표시됩니다.
            </p>
          </div>
        )}

        {/* 포스트 목록 (카테고리 필터 포함) */}
        <PostListClient posts={posts} categories={typedCategories} />
      </div>
    </>
  )
}
