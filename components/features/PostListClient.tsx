/**
 * @description 포스트 목록 클라이언트 컴포넌트
 * 카테고리 필터 상태를 관리하고 필터링된 포스트 그리드를 렌더링합니다.
 */

"use client"

import { useState } from "react"

import type { Post, Category } from "@/lib/types"
import CategoryFilter from "@/components/features/CategoryFilter"
import PostCard from "@/components/features/PostCard"

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
 * @description 카테고리 필터 + 포스트 그리드 클라이언트 컴포넌트
 * @param {PostListClientProps} props - 컴포넌트 props
 * @returns {JSX.Element} 필터 + 포스트 목록 UI
 */
const PostListClient = ({ posts, categories }: PostListClientProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts

  return (
    <div>
      {/* 카테고리 필터 */}
      {categories.length > 0 && (
        <div className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      )}

      {/* 포스트 그리드 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-24 text-slate-400 dark:text-slate-600">
          <p className="text-lg font-medium">
            {selectedCategory
              ? `"${selectedCategory}" 카테고리의 포스트가 없습니다.`
              : "아직 발행된 포스트가 없습니다."}
          </p>
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
