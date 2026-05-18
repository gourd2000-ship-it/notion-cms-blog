/**
 * @description 블로그 포스트 상세 페이지 (서버 컴포넌트)
 *
 * 특정 포스트의 제목, 메타데이터(카테고리, 발행일, 태그)와
 * Notion 블록으로 구성된 본문을 표시합니다.
 *
 * 라우트: /posts/[id]
 */

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, ArrowLeft, Tag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// ============================================================
// 타입 정의
// ============================================================

interface PostPageProps {
  params: Promise<{ id: string }>
}

// ============================================================
// 메타데이터 생성
// ============================================================

/**
 * @description 포스트 제목을 페이지 메타데이터로 설정합니다.
 * @param {PostPageProps} props - 페이지 props
 * @returns {Promise<Metadata>} 페이지 메타데이터
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params

  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return { title: "포스트" }
  }

  try {
    const { getPostById } = await import("@/lib/notion")
    const post = await getPostById(id)

    if (!post) {
      return { title: "포스트를 찾을 수 없습니다" }
    }

    return {
      title: post.title,
      description: `${post.category} | ${post.tags.join(", ")}`,
    }
  } catch {
    return { title: "포스트" }
  }
}

// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * @description ISO 날짜 문자열을 한국어 형식으로 변환합니다.
 * @param {string} dateString - ISO 8601 형식 날짜 문자열
 * @returns {string} 한국어 날짜 문자열
 */
function formatDate(dateString: string): string {
  if (!dateString) return "날짜 없음"

  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// ============================================================
// 페이지 컴포넌트
// ============================================================

/**
 * @description 포스트 상세 페이지
 * @param {PostPageProps} props - 페이지 props
 * @returns {Promise<JSX.Element>} 포스트 상세 UI
 */
export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params

  // 환경 변수 미설정 시 404 처리
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    notFound()
  }

  let post = null
  try {
    const { getPostById } = await import("@/lib/notion")
    post = await getPostById(id)
  } catch (error) {
    console.error("포스트 상세 조회 실패:", error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      {/* 뒤로 가기 */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        </Button>
      </div>

      {/* 포스트 헤더 */}
      <header className="mb-10">
        {/* 카테고리 */}
        <div className="mb-4">
          <Link href={`/categories/${encodeURIComponent(post.category)}`}>
            <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
              {post.category}
            </Badge>
          </Link>
        </div>

        {/* 제목 */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-6">
          {post.title}
        </h1>

        {/* 발행일 */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>{formatDate(post.publishedAt)}</span>
        </div>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 구분선 */}
        <hr className="mt-8 border-border" />
      </header>

      {/* 포스트 본문 */}
      {/* TODO: Notion 블록 렌더러 구현 후 blocks 데이터 사용 */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {post.blocks.length === 0 ? (
          <p className="text-muted-foreground">본문 내용이 없습니다.</p>
        ) : (
          <div className="p-4 border border-dashed rounded-lg bg-muted/40">
            <p className="text-sm text-muted-foreground">
              Notion 블록 렌더러를 구현하면 여기에 본문이 표시됩니다.
              <br />
              총 {post.blocks.length}개의 블록이 로드되었습니다.
            </p>
          </div>
        )}
      </div>

      {/* 하단 내비게이션 */}
      <footer className="mt-16 pt-8 border-t">
        <Button variant="outline" asChild>
          <Link href="/">전체 포스트 보기</Link>
        </Button>
      </footer>
    </article>
  )
}
