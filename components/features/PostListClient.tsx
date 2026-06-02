/**
 * @description 포스트 목록 클라이언트 컴포넌트
 * 검색 입력(300ms 디바운스) + 카테고리 필터를 AND 조건으로 결합하여
 * 서버 재호출 없이 클라이언트 메모리 내에서 필터링합니다.
 */

"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { useDebounceValue } from "usehooks-ts"

import type { Post, Category } from "@/lib/types"
import CategoryFilter from "@/components/features/CategoryFilter"
import PostCard from "@/components/features/PostCard"
import { Input } from "@/components/ui/input"

// ============================================================
// Props 타입 정의
// ============================================================

interface PostListClientProps {
  posts: Post[]
  categories: Category[]
}

// ============================================================
// 컴포넌트
// ============================================================

/**
 * @description 검색 + 카테고리 필터 + 포스트 그리드 클라이언트 컴포넌트
 * @param {PostListClientProps} props - 컴포넌트 props
 * @returns {JSX.Element} 검색바 + 필터 + 포스트 목록 UI
 */
const PostListClient = ({ posts, categories }: PostListClientProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  // 표시용 즉시 값 + 필터링용 디바운스 값 분리
  const [inputValue, setInputValue] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue("", 300)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setDebouncedQuery(e.target.value)
  }

  const handleSearchReset = () => {
    setInputValue("")
    setDebouncedQuery("")
  }

  const handleFilterReset = () => {
    setSelectedCategory(undefined)
    handleSearchReset()
  }

  // 카테고리 → 검색어 순으로 AND 조건 축소
  const filteredPosts = posts
    .filter((post) => !selectedCategory || post.category === selectedCategory)
    .filter((post) => {
      if (!debouncedQuery) return true
      const query = debouncedQuery.toLowerCase()
      return (
        post.title.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })

  const hasActiveFilters = !!selectedCategory || !!debouncedQuery

  return (
    <div>
      {/* 검색 + 카테고리 필터 영역 */}
      <div className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 space-y-6">
        {/* 검색 입력 */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={inputValue}
            onChange={handleSearchChange}
            placeholder="제목 또는 태그로 검색..."
            className="pl-9 pr-9 h-10 rounded-none border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-visible:ring-slate-900 focus-visible:border-slate-900"
          />
          {inputValue && (
            <button
              onClick={handleSearchReset}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              aria-label="검색어 초기화"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 카테고리 필터 탭 */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}
      </div>

      {/* 포스트 그리드 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-24 text-slate-400 dark:text-slate-600">
          <p className="text-lg font-medium mb-3">
            {debouncedQuery
              ? `"${debouncedQuery}"에 대한 검색 결과가 없습니다.`
              : selectedCategory
                ? `"${selectedCategory}" 카테고리의 포스트가 없습니다.`
                : "아직 발행된 포스트가 없습니다."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleFilterReset}
              className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 transition-colors"
            >
              필터 초기화
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 결과 카운트 */}
      {filteredPosts.length > 0 && (
        <p className="mt-10 text-sm text-slate-400 dark:text-slate-600 text-center">
          총 {filteredPosts.length}개의 포스트
        </p>
      )}
    </div>
  )
}

export default PostListClient
