/**
 * @description 카테고리별 포스트 목록 페이지 (서버 컴포넌트)
 *
 * 특정 카테고리에 속한 발행된 포스트 목록을 표시합니다.
 * 네이비 배너 헤더 + 카드 그리드 레이아웃.
 *
 * 라우트: /categories/[category]
 */

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import PostCard from "@/components/features/PostCard"

// ============================================================
// 타입 정의
// ============================================================

// ISR: 5분마다 재검증 (Notion Rate Limit 대응)
export const revalidate = 300

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

// ============================================================
// 메타데이터 생성
// ============================================================

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  return {
    title: `${decodedCategory} | 카테고리`,
    description: `${decodedCategory} 카테고리의 포스트 목록`,
  }
}

// ============================================================
// 페이지 컴포넌트
// ============================================================

/**
 * @description 카테고리별 포스트 목록 페이지
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  // 환경 변수 미설정 시 빈 목록 표시
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return (
      <>
        <div className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 tracking-wider uppercase mb-4">
              카테고리
            </span>
            <h1 className="text-3xl font-bold text-white">{decodedCategory}</h1>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="p-4 border border-dashed rounded-sm bg-muted/40">
            <p className="text-sm text-muted-foreground">
              환경 변수를 설정하면 실제 포스트가 표시됩니다.
            </p>
          </div>
        </div>
      </>
    )
  }

  let posts: Awaited<ReturnType<typeof import("@/lib/notion").getPostsByCategory>> = []
  try {
    const { getPostsByCategory } = await import("@/lib/notion")
    posts = await getPostsByCategory(decodedCategory)
  } catch (error) {
    console.error(`카테고리 포스트 조회 실패 (${decodedCategory}):`, error)
    notFound()
  }

  return (
    <>
      {/* 카테고리 히어로 헤더 */}
      <div className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 tracking-wider uppercase mb-5">
            카테고리
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {decodedCategory}
          </h1>
          <p className="text-slate-400 text-sm">
            총 {posts.length}개의 포스트
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* 뒤로 가기 */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            전체 목록
          </Link>
        </div>

        {/* 포스트 그리드 */}
        {posts.length === 0 ? (
          <div className="text-center py-24 text-slate-400 dark:text-slate-600">
            <p className="text-lg font-medium">
              이 카테고리에 발행된 포스트가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
