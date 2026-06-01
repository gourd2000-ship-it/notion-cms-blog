/**
 * @description On-demand Revalidation API 라우트
 *
 * Notion에서 글을 발행한 직후 수동 또는 Webhook으로 호출하면
 * 5분 ISR 주기를 기다리지 않고 즉시 캐시를 갱신합니다.
 *
 * Next.js 16 변경 사항:
 * - revalidateTag(tag, profile) — 두 번째 인자 필수. "max"를 권장.
 * - revalidatePath(path, type?) — 특정 경로의 Full Route Cache + Data Cache 무효화.
 *
 * 사용법:
 *   GET /api/revalidate?secret=TOKEN             → 전체 포스트 목록 갱신 (기본)
 *   GET /api/revalidate?secret=TOKEN&path=/      → 홈 페이지 캐시 갱신
 *   GET /api/revalidate?secret=TOKEN&path=/posts → 포스트 목록 캐시 갱신
 *
 * 환경 변수:
 *   REVALIDATE_SECRET — 인증 토큰 (.env.local에 설정)
 */

import { revalidateTag, revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

import { CACHE_TAGS } from "@/lib/notion"

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")

  // 시크릿 토큰 검증
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "인증 실패: 유효하지 않은 시크릿 토큰입니다." },
      { status: 401 }
    )
  }

  const path = request.nextUrl.searchParams.get("path")

  try {
    // path 파라미터가 있으면 해당 경로만 갱신
    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        type: "path",
        value: path,
        timestamp: new Date().toISOString(),
      })
    }

    // 기본: 포스트 목록 전체 캐시 무효화
    // Next.js 16에서 revalidateTag는 두 번째 인자(profile) 필수 — "max" 사용
    revalidateTag(CACHE_TAGS.POSTS_LIST, "max")

    // 모든 마케팅 페이지 경로도 함께 무효화
    revalidatePath("/")
    revalidatePath("/posts/[id]", "page")
    revalidatePath("/categories/[category]", "page")

    return NextResponse.json({
      revalidated: true,
      type: "all",
      tag: CACHE_TAGS.POSTS_LIST,
      paths: ["/", "/posts/[id]", "/categories/[category]"],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("캐시 갱신 실패:", error)
    return NextResponse.json(
      { error: "캐시 갱신 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
