/**
 * @description Notion API 클라이언트 및 데이터 조회 함수
 *
 * Notion을 CMS로 활용하여 블로그 포스트 데이터를 가져옵니다.
 * @notionhq/client v5.x 의 새로운 dataSources API를 사용합니다.
 * (v5에서는 databases.query() 대신 dataSources.query()를 사용합니다.)
 *
 * 필수 환경 변수:
 * - NOTION_TOKEN: Notion Integration 토큰
 * - NOTION_DATABASE_ID: 블로그 포스트가 저장된 데이터베이스 ID (data_source_id)
 */

import { Client } from "@notionhq/client"
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

// ============================================================
// Notion 클라이언트 초기화
// ============================================================

/**
 * @description Notion API 클라이언트 싱글톤 인스턴스
 * 서버 사이드에서만 호출되어야 합니다.
 */
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// databases.query()가 v5에서 제거됨에 따라 dataSources.query()를 사용.
// data_source_id는 database_id(URL에서 복사)와 다른 별도 ID이므로
// databases.retrieve()로 조회 후 data_sources[0].id를 캐싱해서 사용한다.
let cachedDataSourceId: string | null = null

async function getDataSourceId(): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId

  const databaseId = process.env.NOTION_DATABASE_ID
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

  return {
    id: page.id,
    title,
    category,
    tags,
    publishedAt,
    status,
  }
}

// ============================================================
// 공개 API 함수
// ============================================================

/**
 * @description 발행됨 상태의 포스트 전체 목록을 조회합니다.
 * Status = "발행됨" 필터를 적용하며, 발행일 내림차순으로 정렬합니다.
 *
 * @notionhq/client v5에서는 databases.query() 대신
 * dataSources.query({ data_source_id }) 를 사용합니다.
 *
 * @returns {Promise<Post[]>} 발행된 포스트 배열
 */
export async function getPublishedPosts(): Promise<Post[]> {
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

  // PageObjectResponse 타입만 필터링 (properties 필드 보유 여부로 구분)
  const pages = response.results.filter(
    (result): result is PageObjectResponse =>
      result.object === "page" && "properties" in result
  )

  return pages.map(mapPageToPost)
}

/**
 * @description 특정 ID의 포스트 상세 정보를 조회합니다.
 * 포스트 메타데이터와 본문 블록을 함께 반환합니다.
 * @param {string} id - Notion 페이지 ID
 * @returns {Promise<PostDetail | null>} 포스트 상세 데이터, 없으면 null
 */
export async function getPostById(id: string): Promise<PostDetail | null> {
  try {
    // 페이지 메타데이터 조회
    const page: GetPageResponse = await notion.pages.retrieve({ page_id: id })

    // properties 필드가 없는 경우(PartialPageObjectResponse) 처리
    if (!("properties" in page)) {
      return null
    }

    const fullPage = page as PageObjectResponse
    const post = mapPageToPost(fullPage)

    // 페이지 블록(본문) 조회
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
    // 페이지가 존재하지 않거나 접근 권한이 없는 경우
    console.error(`포스트 조회 실패 (id: ${id}):`, error)
    return null
  }
}

/**
 * @description 특정 카테고리의 발행된 포스트 목록을 조회합니다.
 * @param {string} category - 조회할 카테고리 이름
 * @returns {Promise<Post[]>} 해당 카테고리의 포스트 배열
 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
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

/**
 * @description 발행된 포스트에서 카테고리 목록과 각 포스트 수를 집계합니다.
 * @returns {Promise<Array<{ name: string; count: number }>>} 카테고리 배열 (포스트 수 내림차순)
 */
export async function getCategories(): Promise<Array<{ name: string; count: number }>> {
  const posts = await getPublishedPosts()

  // 카테고리별 포스트 수 집계
  const categoryMap = posts.reduce<Record<string, number>>((acc, post) => {
    const cat = post.category
    acc[cat] = (acc[cat] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
