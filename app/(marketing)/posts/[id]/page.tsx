/**
 * @description 블로그 포스트 상세 페이지 (서버 컴포넌트)
 *
 * 특정 포스트의 제목, 메타데이터(카테고리, 발행일, 태그)와
 * Notion 블록으로 구성된 본문을 표시합니다.
 * 하단에 이전/다음 글 내비게이션을 포함합니다.
 *
 * 라우트: /posts/[id]
 */

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, ArrowLeft, ArrowRight, Tag } from "lucide-react"

import type { Post } from "@/lib/types"
import NotionBlockRenderer from "@/components/features/NotionBlockRenderer"

// ============================================================
// 타입 정의
// ============================================================

// ISR: 5분마다 재검증 (Notion Rate Limit 대응)
export const revalidate = 300

interface PostPageProps {
  params: Promise<{ id: string }>
}

// ============================================================
// 메타데이터 생성
// ============================================================

/**
 * @description 포스트 제목을 페이지 메타데이터로 설정합니다.
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params

  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return { title: "포스트" }
  }

  try {
    const { getPostById } = await import("@/lib/notion")
    const post = await getPostById(id)

    if (!post) return { title: "포스트를 찾을 수 없습니다" }

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
// 이전/다음 글 내비게이션 컴포넌트
// ============================================================

interface PostNavProps {
  /** 이전 글 (발행일이 현재보다 이른 글) */
  prevPost: Post | null
  /** 다음 글 (발행일이 현재보다 최근인 글) */
  nextPost: Post | null
}

/**
 * @description 이전/다음 글 내비게이션
 * posts는 발행일 내림차순(최신순)으로 정렬되어 있으므로:
 * - 다음 글(더 최신) = 배열 상 이전 인덱스
 * - 이전 글(더 오래된) = 배열 상 다음 인덱스
 */
function PostNavigation({ prevPost, nextPost }: PostNavProps) {
  if (!prevPost && !nextPost) return null

  return (
    <nav
      aria-label="포스트 내비게이션"
      className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-6"
    >
      {/* 이전 글 (오래된 글) */}
      <div>
        {prevPost ? (
          <Link
            href={`/posts/${prevPost.id}`}
            className="group flex flex-col gap-1.5"
          >
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <ArrowLeft className="h-3 w-3" />
              이전 글
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors leading-snug">
              {prevPost.title}
            </span>
          </Link>
        ) : null}
      </div>

      {/* 다음 글 (최신 글) */}
      <div className="text-right">
        {nextPost ? (
          <Link
            href={`/posts/${nextPost.id}`}
            className="group flex flex-col gap-1.5 items-end"
          >
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              다음 글
              <ArrowRight className="h-3 w-3" />
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors leading-snug">
              {nextPost.title}
            </span>
          </Link>
        ) : null}
      </div>
    </nav>
  )
}

// ============================================================
// 페이지 컴포넌트
// ============================================================

/**
 * @description 포스트 상세 페이지
 */
export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params

  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    notFound()
  }

  let post = null
  let prevPost: Post | null = null
  let nextPost: Post | null = null

  try {
    const { getPostById, getPublishedPosts } = await import("@/lib/notion")

    // 포스트 상세와 전체 목록을 병렬로 조회
    const [fetchedPost, allPosts] = await Promise.all([
      getPostById(id),
      getPublishedPosts(),
    ])

    post = fetchedPost

    if (post) {
      // 전체 목록(최신순)에서 현재 포스트 위치 탐색
      const currentIndex = allPosts.findIndex((p) => p.id === id)

      if (currentIndex !== -1) {
        // 배열이 최신순이므로: 이전 인덱스 = 더 최신(다음 글), 다음 인덱스 = 더 오래된(이전 글)
        nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
        prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
      }
    }
  } catch (error) {
    console.error("포스트 상세 조회 실패:", error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* 포스트 히어로 헤더 */}
      <div className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          {/* 카테고리 배지 */}
          <div className="mb-5">
            <Link
              href={`/categories/${encodeURIComponent(post.category)}`}
              className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 tracking-wider uppercase hover:bg-blue-500 transition-colors"
            >
              {post.category}
            </Link>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-6">
            {post.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="h-4 w-4 flex-shrink-0" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 포스트 본문 */}
      <article className="mx-auto max-w-4xl px-6 py-14">
        {/* 목록으로 */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        </div>

        {/* 본문 */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <NotionBlockRenderer blocks={post.blocks} />
        </div>

        {/* 이전/다음 글 내비게이션 */}
        <PostNavigation prevPost={prevPost} nextPost={nextPost} />

        {/* 전체 포스트 보기 */}
        <footer className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-sm font-semibold px-6 py-2.5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            전체 포스트 보기
          </Link>
        </footer>
      </article>
    </>
  )
}
