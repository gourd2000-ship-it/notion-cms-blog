/**
 * @description 카테고리별 포스트 목록 페이지 (서버 컴포넌트)
 *
 * 특정 카테고리에 속한 발행된 포스트 목록을 표시합니다.
 * URL 파라미터로 카테고리 이름을 받으며, 한글 카테고리를 지원합니다.
 *
 * 라우트: /categories/[category]
 */

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PostCard from "@/components/features/PostCard"

// ============================================================
// 타입 정의
// ============================================================

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

// ============================================================
// 메타데이터 생성
// ============================================================

/**
 * @description 카테고리 이름을 페이지 메타데이터로 설정합니다.
 * @param {CategoryPageProps} props - 페이지 props
 * @returns {Promise<Metadata>} 페이지 메타데이터
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  // URL 인코딩된 카테고리 이름 디코딩
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
 * @param {CategoryPageProps} props - 페이지 props
 * @returns {Promise<JSX.Element>} 카테고리 페이지 UI
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  // URL 인코딩된 한글 카테고리 이름 디코딩
  const decodedCategory = decodeURIComponent(category)

  // 환경 변수 미설정 시 빈 목록 표시
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="p-4 border border-dashed rounded-lg bg-muted/40">
          <p className="text-sm text-muted-foreground">
            환경 변수를 설정하면 실제 포스트가 표시됩니다.
          </p>
        </div>
      </div>
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
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 뒤로 가기 */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            전체 목록
          </Link>
        </Button>
      </div>

      {/* 페이지 헤더 */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold tracking-tight">카테고리</h1>
          <Badge variant="default" className="text-base px-3 py-1">
            {decodedCategory}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          총 {posts.length}개의 포스트
        </p>
      </header>

      {/* 포스트 목록 */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>이 카테고리에 발행된 포스트가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
