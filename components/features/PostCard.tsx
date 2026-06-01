/**
 * @description 블로그 포스트 카드 컴포넌트
 * Stretched Link 패턴: 제목 링크의 ::after 가상 요소가 카드 전체를 클릭 가능하게 만들고,
 * 카테고리 배지는 z-10으로 그 위에 독립 링크로 올려 별도 탐색을 지원합니다.
 */

import Link from "next/link"
import { Calendar } from "lucide-react"

import type { Post } from "@/lib/types"
import { cn } from "@/lib/utils"

// ============================================================
// 카테고리별 컬러 매핑
// ============================================================

const CATEGORY_GRADIENTS: Record<string, string> = {
  AI: "from-indigo-900 to-blue-900",
  개발: "from-slate-800 to-slate-900",
  리뷰: "from-emerald-900 to-slate-900",
  디자인: "from-purple-900 to-slate-900",
  기타: "from-slate-700 to-slate-900",
}

function getCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS["기타"]
}

// ============================================================
// Props 타입 정의
// ============================================================

interface PostCardProps {
  post: Post
  className?: string
}

// ============================================================
// 내부 유틸리티
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
// 컴포넌트
// ============================================================

/**
 * @description 블로그 포스트 카드
 * - 제목 링크에 after:absolute after:inset-0 으로 카드 전체 클릭 영역 생성 (Stretched Link)
 * - 카테고리 배지는 relative z-10 으로 Stretched Link 위에 독립 링크로 배치
 */
const PostCard = ({ post, className }: PostCardProps) => {
  const gradient = getCategoryGradient(post.category)

  return (
    <article
      className={cn(
        "relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
        "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group",
        className
      )}
    >
      {/* 이미지 플레이스홀더 영역 */}
      <div className={cn("relative h-48 bg-gradient-to-br overflow-hidden", gradient)}>
        {/* 장식 원형 요소 */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/5" />

        {/* 카테고리 배지 — z-10으로 Stretched Link 위에 위치, 카테고리 페이지로 이동 */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href={`/categories/${encodeURIComponent(post.category)}`}
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1 tracking-wider uppercase transition-colors"
          >
            {post.category}
          </Link>
        </div>

        {/* 카테고리 이니셜 (배경 장식) */}
        <div className="absolute bottom-4 right-6 text-6xl font-black text-white/10 select-none leading-none">
          {post.category.slice(0, 1)}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-5">
        {/* 발행일 */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-3">
          <Calendar className="h-3 w-3 flex-shrink-0" />
          <span>{formatDate(post.publishedAt)}</span>
        </div>

        {/* 제목 — Stretched Link: after:absolute after:inset-0 으로 카드 전체 클릭 영역 생성 */}
        <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
          <Link
            href={`/posts/${post.id}`}
            className="after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </h2>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-slate-400 dark:text-slate-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard
