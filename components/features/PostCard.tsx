/**
 * @description 블로그 포스트 카드 컴포넌트
 * 포스트 목록에서 각 글을 카드 형태로 표시합니다.
 * 제목, 카테고리, 발행일, 태그를 포함합니다.
 */

import Link from "next/link"
import { Calendar, Tag } from "lucide-react"

import type { Post } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ============================================================
// Props 타입 정의
// ============================================================

interface PostCardProps {
  /** 표시할 포스트 데이터 */
  post: Post
  /** 추가 CSS 클래스 */
  className?: string
}

// ============================================================
// 내부 유틸리티 함수
// ============================================================

/**
 * @description ISO 날짜 문자열을 한국어 형식으로 변환합니다.
 * @param {string} dateString - ISO 8601 형식 날짜 문자열 (예: "2024-01-15")
 * @returns {string} 한국어 날짜 문자열 (예: "2024년 1월 15일")
 */
function formatDate(dateString: string): string {
  if (!dateString) {
    return "날짜 없음"
  }

  const date = new Date(dateString)

  return date.toLocaleDateString("ko-KR", {
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
 * @param {PostCardProps} props - 컴포넌트 props
 * @returns {JSX.Element} 포스트 카드 UI
 * @example
 * <PostCard post={post} />
 */
const PostCard = ({ post, className }: PostCardProps) => {
  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <Card
        className={cn(
          "h-full transition-shadow hover:shadow-md cursor-pointer",
          className
        )}
      >
        <CardHeader className="pb-3">
          {/* 카테고리 배지 */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
          </div>

          {/* 포스트 제목 */}
          <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          {/* 발행일 */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          {/* 태그 목록 */}
          {post.tags.length > 0 && (
            <div className="flex items-start gap-1.5">
              <Tag className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs px-1.5 py-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default PostCard
