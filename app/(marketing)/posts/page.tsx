/**
 * @description 전체 포스트 목록 페이지 (서버 컴포넌트)
 *
 * Notion DB에서 발행된 모든 포스트를 조회하여 목록과 카테고리 필터를 표시합니다.
 *
 * 라우트: /posts
 */

import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import PostListClient from "@/components/features/PostListClient"
import type { Category } from "@/lib/types"
import { MOCK_POSTS, MOCK_CATEGORIES } from "@/lib/mock-data"

// ============================================================
// 메타데이터
// ============================================================

export const metadata: Metadata = {
  title: `포스트 | ${siteConfig.name}`,
  description: "발행된 모든 연구 기록과 기술 포스트를 확인하세요.",
}

// ============================================================
// 데이터 조회 함수
// ============================================================

/**
 * @description Notion에서 포스트 목록과 카테고리를 조회합니다.
 * NOTION_TOKEN / NOTION_DATABASE_ID 환경 변수가 없으면 빈 배열을 반환합니다.
 */
async function getPostsPageData() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
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
    console.error("포스트 목록 데이터 로딩 실패:", error)
    return { posts: MOCK_POSTS, categories: MOCK_CATEGORIES, isMock: true }
  }
}

// ============================================================
// 페이지 컴포넌트
// ============================================================

/**
 * @description 전체 포스트 목록 페이지
 * @returns {Promise<JSX.Element>} 포스트 목록 UI
 */
export default async function PostsPage() {
  const { posts, categories, isMock } = await getPostsPageData()

  const typedCategories: Category[] = categories.map((cat) => ({
    name: cat.name,
    count: cat.count,
  }))

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 페이지 헤더 */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-3">포스트</h1>
        <p className="text-muted-foreground text-lg">
          연구 기록과 기술 포스트 모음
        </p>
      </section>

      {/* 목업 데이터 사용 중 안내 */}
      {isMock && (
        <div className="mb-8 p-4 border border-dashed rounded-lg bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
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
  )
}
