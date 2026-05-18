/**
 * @description 포스트 목록 클라이언트 컴포넌트
 * 카테고리 필터 상태를 관리하고 필터링된 포스트 목록을 렌더링합니다.
 * 서버 컴포넌트인 홈 페이지에서 데이터를 받아 클라이언트 인터랙션을 처리합니다.
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
  /** 전체 발행된 포스트 목록 */
  posts: Post[]
  /** 카테고리 목록 (이름 + 포스트 수) */
  categories: Category[]
}

// ============================================================
// 컴포넌트
// ============================================================

/**
 * @description 카테고리 필터 + 포스트 그리드를 함께 관리하는 클라이언트 컴포넌트
 * @param {PostListClientProps} props - 컴포넌트 props
 * @returns {JSX.Element} 필터 + 포스트 목록 UI
 */
const PostListClient = ({ posts, categories }: PostListClientProps) => {
  // 선택된 카테고리 상태 (undefined = 전체)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  // 카테고리 필터 적용
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts

  return (
    <div>
      {/* 카테고리 필터 */}
      {categories.length > 0 && (
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      )}

      {/* 포스트 목록 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">
            {selectedCategory
              ? `"${selectedCategory}" 카테고리의 포스트가 없습니다.`
              : "아직 발행된 포스트가 없습니다."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 필터링 결과 카운트 */}
      {filteredPosts.length > 0 && (
        <p className="mt-6 text-sm text-muted-foreground text-center">
          총 {filteredPosts.length}개의 포스트
        </p>
      )}
    </div>
  )
}

export default PostListClient
