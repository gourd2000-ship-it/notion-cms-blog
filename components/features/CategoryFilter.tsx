/**
 * @description 카테고리 필터 컴포넌트
 * 블로그 홈 페이지에서 카테고리별로 포스트를 필터링하는 UI를 제공합니다.
 * "전체" 옵션을 포함하며, 선택된 카테고리를 시각적으로 강조합니다.
 *
 * 클라이언트 컴포넌트로 동작합니다 (상태 관리 필요).
 */

"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/types"

// ============================================================
// 상수 정의
// ============================================================

/** 전체 카테고리를 나타내는 특수 값 */
const ALL_CATEGORY = "전체"

// ============================================================
// Props 타입 정의
// ============================================================

interface CategoryFilterProps {
  /** 표시할 카테고리 목록 */
  categories: Category[]
  /** 현재 선택된 카테고리 (없으면 전체 표시) */
  selectedCategory?: string
  /** 카테고리 선택 시 호출되는 콜백 */
  onCategoryChange: (category: string | undefined) => void
  /** 추가 CSS 클래스 */
  className?: string
}

// ============================================================
// 컴포넌트
// ============================================================

/**
 * @description 카테고리 필터 버튼 그룹
 * @param {CategoryFilterProps} props - 컴포넌트 props
 * @returns {JSX.Element} 카테고리 필터 UI
 * @example
 * <CategoryFilter
 *   categories={categories}
 *   selectedCategory={selected}
 *   onCategoryChange={setSelected}
 * />
 */
const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}: CategoryFilterProps) => {
  /**
   * @description 카테고리 버튼 클릭 핸들러
   * 현재 선택된 카테고리를 다시 클릭하면 선택 해제(전체 보기)합니다.
   */
  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === ALL_CATEGORY) {
      // 전체 버튼 클릭 시 선택 해제
      onCategoryChange(undefined)
      return
    }

    if (categoryName === selectedCategory) {
      // 이미 선택된 카테고리 클릭 시 선택 해제
      onCategoryChange(undefined)
    } else {
      onCategoryChange(categoryName)
    }
  }

  const isAllSelected = !selectedCategory

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label="카테고리 필터">
      {/* 전체 보기 버튼 */}
      <button
        onClick={() => handleCategoryClick(ALL_CATEGORY)}
        aria-pressed={isAllSelected}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
      >
        <Badge
          variant={isAllSelected ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-sm"
        >
          전체
        </Badge>
      </button>

      {/* 카테고리별 버튼 */}
      {categories.map((category) => {
        const isSelected = selectedCategory === category.name

        return (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            aria-pressed={isSelected}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-sm"
            >
              {category.name}
              <span className="ml-1.5 opacity-70">({category.count})</span>
            </Badge>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
