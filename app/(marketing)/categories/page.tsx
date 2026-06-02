/**
 * @description 전체 카테고리 목록 페이지 (서버 컴포넌트)
 *
 * 발행된 포스트에서 카테고리를 집계하여 목록 형태로 표시합니다.
 * 각 카드 클릭 시 해당 카테고리 포스트 목록으로 이동합니다.
 *
 * 라우트: /categories
 */

import type { Metadata } from "next"
import Link from "next/link"
import { FolderOpen } from "lucide-react"

import { getCategories } from "@/lib/notion"
import { env } from "@/lib/env"

// ISR: 5분마다 재검증 (Notion Rate Limit 대응)
export const revalidate = 300

export const metadata: Metadata = {
  title: "카테고리 | 개인 연구 블로그",
  description: "블로그 전체 카테고리 목록",
}

/**
 * @description 카테고리 목록 페이지
 */
export default async function CategoriesPage() {
  let categories: Array<{ name: string; count: number }> = []

  if (env.NOTION_TOKEN && env.NOTION_DATABASE_ID) {
    try {
      categories = await getCategories()
    } catch (error) {
      console.error("카테고리 목록 조회 실패:", error)
    }
  }

  return (
    <>
      {/* 히어로 헤더 */}
      <div className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 tracking-wider uppercase mb-5">
            카테고리
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            전체 카테고리
          </h1>
          <p className="text-slate-400 text-sm">
            총 {categories.length}개의 카테고리
          </p>
        </div>
      </div>

      {/* 카테고리 그리드 */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        {categories.length === 0 ? (
          <div className="text-center py-24 text-slate-400 dark:text-slate-600">
            <FolderOpen className="mx-auto h-12 w-12 mb-4 opacity-40" />
            <p className="text-lg font-medium">등록된 카테고리가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="p-6">
                  {/* 카테고리 아이콘 */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-800 mb-4">
                    <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>

                  {/* 카테고리명 */}
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {category.name}
                  </h2>

                  {/* 포스트 수 */}
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {category.count}개의 포스트
                  </p>
                </div>

                {/* 하단 강조선 */}
                <div className="h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
