/**
 * @description Notion API 클라이언트 및 데이터 조회 함수
 *
 * Notion을 CMS로 활용하여 블로그 포스트 데이터를 가져옵니다.
 * @notionhq/client v5.x 의 새로운 dataSources API를 사용합니다.
 * (v5에서는 databases.query() 대신 dataSources.query()를 사용합니다.)
 *
 * 캐싱 전략:
 * - @notionhq/client는 자체 SDK(fetch 미사용)이므로 Next.js fetch 캐싱 불가
 * - unstable_cache 로 래핑하여 Next.js 데이터 캐시에 저장 (TTL: 300초 = 5분)
 * - On-demand Revalidation은 app/api/revalidate/route.ts 에서 처리
 *
 * 필수 환경 변수:
 * - NOTION_TOKEN: Notion Integration 토큰
 * - NOTION_DATABASE_ID: 블로그 포스트가 저장된 데이터베이스 ID (data_source_id)
 */

import { Client } from "@notionhq/client"
import { unstable_cache } from "next/cache"
import type {
  QueryDataSourceResponse,
  QueryDataSourceParameters,
} from "@notionhq/client/build/src/api-endpoints/data-sources"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints/common"
import type { GetPageResponse } from "@notionhq/client/build/src/api-endpoints/pages"
import type {
  ListBlockChildrenResponse,
  GetBlockResponse,
} from "@notionhq/client/build/src/api-endpoints/blocks"
import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints/databases"
import type { Post, PostDetail, NotionBlock } from "@/lib/types"
// Zod 검증을 통과한 환경 변수 사용 (process.env 직접 접근 대신)
import { env } from "@/lib/env"

// ============================================================
// 캐시 태그 상수
// ============================================================

/**
 * @description On-demand Revalidation에서 사용할 캐시 태그 상수
 * notion-posts-list: 포스트 목록·카테고리 조회에 사용 (무효화 시 목록 전체 갱신)
 */
export const CACHE_TAGS = {
  POSTS_LIST: "notion-posts-list",
} as const

// ============================================================
// Notion 클라이언트 초기화
// ============================================================

/**
 * @description Notion API 클라이언트 싱글톤 인스턴스
 * 서버 사이드에서만 호출되어야 합니다.
 */
const notion = new Client({
  auth: env.NOTION_TOKEN,
})

// databases.query()가 v5에서 제거됨에 따라 dataSources.query()를 사용.
// data_source_id는 database_id(URL에서 복사)와 다른 별도 ID이므로
// databases.retrieve()로 조회 후 data_sources[0].id를 캐싱해서 사용한다.
let cachedDataSourceId: string | null = null

async function getDataSourceId(): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId

  const databaseId = env.NOTION_DATABASE_ID
  if (!databaseId) throw new Error("NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다.")

  const db = await notion.databases.retrieve({ database_id: databaseId })

  if ("data_sources" in db) {
    const fullDb = db as DatabaseObjectResponse
    if (fullDb.data_sources.length > 0) {
      cachedDataSourceId = fullDb.data_sources[0].id
      return cachedDataSourceId
    }
  }

  // data_sources가 없는 경우 database_id를 그대로 사용
  cachedDataSourceId = databaseId
  return cachedDataSourceId
}

// ============================================================
// 내부 유틸리티 함수
// ============================================================

/**
 * @description Notion 페이지 객체를 Post 타입으로 변환합니다.
 * @param {PageObjectResponse} page - Notion API 응답의 페이지 객체
 * @returns {Post} 정규화된 포스트 데이터
 */
function mapPageToPost(page: PageObjectResponse): Post {
  const properties = page.properties

  // 제목 추출 (title 타입 프로퍼티)
  const titleProperty = properties["Title"]
  const title =
    titleProperty?.type === "title"
      ? (titleProperty.title[0]?.plain_text ?? "제목 없음")
      : "제목 없음"

  // 카테고리 추출 (select 타입 프로퍼티)
  const categoryProperty = properties["Category"]
  const category =
    categoryProperty?.type === "select"
      ? (categoryProperty.select?.name ?? "미분류")
      : "미분류"

  // 태그 추출 (multi_select 타입 프로퍼티)
  const tagsProperty = properties["Tags"]
  const tags =
    tagsProperty?.type === "multi_select"
      ? tagsProperty.multi_select.map((tag) => tag.name)
      : []

  // 발행일 추출 (date 타입 프로퍼티)
  const publishedProperty = properties["Published"]
  const publishedAt =
    publishedProperty?.type === "date"
      ? (publishedProperty.date?.start ?? "")
      : ""

  // 상태 추출 (select 타입 프로퍼티)
  const statusProperty = properties["Status"]
  const statusValue =
    statusProperty?.type === "select"
      ? (statusProperty.select?.name ?? "초안")
      : "초안"
  const status: "초안" | "발행됨" = statusValue === "발행됨" ? "발행됨" : "초안"

  // 커버 이미지 추출 (file 타입은 1시간 만료 — ISR 5분 갱신으로 완화)
  const cover = page.cover
  const coverImage =
    cover?.type === "external"
      ? cover.external.url
      : cover?.type === "file"
        ? cover.file.url
        : null

  return {
    id: page.id,
    title,
    category,
    tags,
    publishedAt,
    status,
    coverImage,
  }
}

// ============================================================
// 내부 Notion 조회 함수 (unstable_cache 래핑 전 원본)
// ============================================================

/** Status = "발행됨" 포스트 목록 조회 원본 함수 */
async function _getPublishedPosts(): Promise<Post[]> {
  const dataSourceId = await getDataSourceId()

  const queryParams: QueryDataSourceParameters = {
    data_source_id: dataSourceId,
    filter: {
      property: "Status",
      select: {
        equals: "발행됨",
      },
    },
    sorts: [
      {
        property: "Published",
        direction: "descending",
      },
    ],
  }

  const response: QueryDataSourceResponse = await notion.dataSources.query(queryParams)

  const pages = response.results.filter(
    (result): result is PageObjectResponse =>
      result.object === "page" && "properties" in result
  )

  return pages.map(mapPageToPost)
}

/** 특정 ID 포스트 상세 조회 원본 함수 */
async function _getPostById(id: string): Promise<PostDetail | null> {
  try {
    const page: GetPageResponse = await notion.pages.retrieve({ page_id: id })

    if (!("properties" in page)) {
      return null
    }

    const fullPage = page as PageObjectResponse
    const post = mapPageToPost(fullPage)

    const blocksResponse: ListBlockChildrenResponse = await notion.blocks.children.list({
      block_id: id,
    })

    const blocks: NotionBlock[] = blocksResponse.results.map((block: GetBlockResponse) => ({
      ...(block as Record<string, unknown>),
      id: block.id,
      type: "type" in block ? (block.type as string) : "unknown",
      has_children: "has_children" in block ? Boolean(block.has_children) : false,
    }))

    return {
      ...post,
      blocks,
    }
  } catch (error) {
    console.error(`포스트 조회 실패 (id: ${id}):`, error)
    return null
  }
}

/** 특정 카테고리 포스트 목록 조회 원본 함수 */
async function _getPostsByCategory(category: string): Promise<Post[]> {
  const dataSourceId = await getDataSourceId()

  const queryParams: QueryDataSourceParameters = {
    data_source_id: dataSourceId,
    filter: {
      and: [
        {
          property: "Status",
          select: {
            equals: "발행됨",
          },
        },
        {
          property: "Category",
          select: {
            equals: category,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Published",
        direction: "descending",
      },
    ],
  }

  const response: QueryDataSourceResponse = await notion.dataSources.query(queryParams)

  const pages = response.results.filter(
    (result): result is PageObjectResponse =>
      result.object === "page" && "properties" in result
  )

  return pages.map(mapPageToPost)
}

// ============================================================
// 공개 API 함수 — unstable_cache 래핑으로 Next.js 데이터 캐시 적용
// ============================================================

/**
 * @description 발행됨 상태의 포스트 전체 목록을 조회합니다.
 * unstable_cache: TTL 300초(5분), 태그 "notion-posts-list"
 * On-demand 갱신: /api/revalidate?secret=TOKEN&tag=notion-posts-list
 *
 * @returns {Promise<Post[]>} 발행된 포스트 배열
 */
export const getPublishedPosts = unstable_cache(
  _getPublishedPosts,
  ["notion-published-posts"],
  { tags: [CACHE_TAGS.POSTS_LIST], revalidate: 300 }
)

/**
 * @description 특정 ID의 포스트 상세 정보를 조회합니다.
 * unstable_cache: TTL 300초(5분), 태그 "notion-posts-list"
 * 함수 인자(id)가 캐시 키에 자동 포함되어 포스트별로 독립 캐시됨.
 *
 * @param {string} id - Notion 페이지 ID
 * @returns {Promise<PostDetail | null>} 포스트 상세 데이터, 없으면 null
 */
export const getPostById = unstable_cache(
  _getPostById,
  ["notion-post-by-id"],
  { tags: [CACHE_TAGS.POSTS_LIST], revalidate: 300 }
)

/**
 * @description 특정 카테고리의 발행된 포스트 목록을 조회합니다.
 * unstable_cache: TTL 300초(5분), 태그 "notion-posts-list"
 * 함수 인자(category)가 캐시 키에 자동 포함되어 카테고리별로 독립 캐시됨.
 *
 * @param {string} category - 조회할 카테고리 이름
 * @returns {Promise<Post[]>} 해당 카테고리의 포스트 배열
 */
export const getPostsByCategory = unstable_cache(
  _getPostsByCategory,
  ["notion-posts-by-category"],
  { tags: [CACHE_TAGS.POSTS_LIST], revalidate: 300 }
)

/**
 * @description 발행된 포스트에서 카테고리 목록과 각 포스트 수를 집계합니다.
 * getPublishedPosts()가 이미 캐시되므로 별도 unstable_cache 래핑 불필요.
 *
 * @returns {Promise<Array<{ name: string; count: number }>>} 카테고리 배열 (포스트 수 내림차순)
 */
export async function getCategories(): Promise<Array<{ name: string; count: number }>> {
  // getPublishedPosts가 캐시된 함수이므로 이 호출도 캐시 혜택을 받음
  const posts = await getPublishedPosts()

  const categoryMap = posts.reduce<Record<string, number>>((acc, post) => {
    const cat = post.category
    acc[cat] = (acc[cat] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
