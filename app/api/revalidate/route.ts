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
 *   권장 — Authorization 헤더:
 *     curl -H "Authorization: Bearer TOKEN" https://.../api/revalidate
 *     curl -H "Authorization: Bearer TOKEN" https://.../api/revalidate?path=/
 *
 *   하위호환 — query param (기존 webhook 호환):
 *     GET /api/revalidate?secret=TOKEN
 *     GET /api/revalidate?secret=TOKEN&path=/
 *
 * 환경 변수:
 *   REVALIDATE_SECRET — 인증 토큰 (.env.local에 설정, 미설정 시 항상 401)
 */

import { createHash, timingSafeEqual } from "crypto"
import { revalidateTag, revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

import { CACHE_TAGS } from "@/lib/notion"
import { env } from "@/lib/env"

// ============================================================
// 인증 헬퍼
// ============================================================

/**
 * @description 요청의 시크릿 토큰을 검증합니다.
 * Authorization 헤더(Bearer)를 우선 확인하고, 없으면 query param ?secret= 으로 폴백합니다.
 * SHA-256 해시 비교로 타이밍 공격을 방지합니다.
 *
 * @param {NextRequest} request - 수신된 요청 객체
 * @returns {boolean} 인증 성공 여부
 */
function isAuthorized(request: NextRequest): boolean {
  const expectedSecret = env.REVALIDATE_SECRET
  if (!expectedSecret) return false

  // Authorization: Bearer <token> 헤더 우선, 없으면 ?secret= query param 폴백
  const authHeader = request.headers.get("authorization")
  const providedSecret = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : request.nextUrl.searchParams.get("secret")

  if (!providedSecret) return false

  try {
    // SHA-256 해시로 고정 길이 버퍼를 만들어 timingSafeEqual 비교
    // 가변 길이 문자열의 타이밍 공격을 방지합니다.
    const expected = createHash("sha256").update(expectedSecret).digest()
    const provided = createHash("sha256").update(providedSecret).digest()
    return timingSafeEqual(expected, provided)
  } catch {
    return false
  }
}

// ============================================================
// 라우트 핸들러
// ============================================================

export async function GET(request: NextRequest) {
  // 시크릿 토큰 검증
  if (!isAuthorized(request)) {
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
