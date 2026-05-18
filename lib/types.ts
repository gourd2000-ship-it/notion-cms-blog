/**
 * @description 블로그 도메인 타입 정의
 * Notion CMS에서 가져오는 데이터 구조를 TypeScript 타입으로 정의합니다.
 */

// ============================================================
// Notion 블록 타입
// ============================================================

/**
 * @description Notion 블록의 기본 구조
 * 글 본문을 구성하는 개별 블록 단위입니다.
 */
export interface NotionBlock {
  id: string
  type: string
  has_children: boolean
  // 각 블록 타입별 실제 데이터 (paragraph, heading_1 등)
  // Notion API 응답 구조를 그대로 따릅니다.
  [key: string]: unknown
}

// ============================================================
// 카테고리 타입
// ============================================================

/**
 * @description 블로그 카테고리
 */
export interface Category {
  name: string
  count: number
}

// ============================================================
// 포스트 타입
// ============================================================

/**
 * @description 포스트 목록 아이템 (Notion DB 행 데이터)
 */
export interface Post {
  id: string
  title: string
  category: string
  tags: string[]
  publishedAt: string
  status: "초안" | "발행됨"
}

/**
 * @description 포스트 상세 (목록 + 본문 블록 포함)
 */
export interface PostDetail extends Post {
  blocks: NotionBlock[]
}

// ============================================================
// API 응답 타입
// ============================================================

/**
 * @description 포스트 목록 API 응답
 */
export interface PostListResponse {
  posts: Post[]
  total: number
}

/**
 * @description 카테고리별 포스트 응답
 */
export interface CategoryPostsResponse {
  category: string
  posts: Post[]
  total: number
}
