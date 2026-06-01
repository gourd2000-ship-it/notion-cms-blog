/**
 * @description 카테고리 필터 컴포넌트
 * 레퍼런스 이미지의 해시태그 스타일 필 탭 형태로 디자인합니다.
 * 선택된 카테고리는 다크 네이비로 강조됩니다.
 */

"use client"

import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

// ============================================================
// 상수 정의
// ============================================================

const ALL_CATEGORY = "전체"

// ============================================================
// Props 타입 정의
// ============================================================

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
  onCategoryChange: (category: string | undefined) => void
  className?: string
}

// ============================================================
// 컴포넌트
// ============================================================

/**
 * @description 카테고리 필터 탭 그룹
 * @param {CategoryFilterProps} props - 컴포넌트 props
 * @returns {JSX.Element} 카테고리 필터 UI
 */
const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}: CategoryFilterProps) => {
  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === ALL_CATEGORY) {
      onCategoryChange(undefined)
      return
    }
    onCategoryChange(categoryName === selectedCategory ? undefined : categoryName)
  }

  const isAllSelected = !selectedCategory

  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
      aria-label="카테고리 필터"
    >
      {/* 전체 탭 */}
      <button
        onClick={() => handleCategoryClick(ALL_CATEGORY)}
        aria-pressed={isAllSelected}
        className={cn(
          "px-5 py-1.5 text-sm font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
          isAllSelected
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
            : "bg-white dark:bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white"
        )}
      >
        All
      </button>

      {/* 카테고리별 탭 */}
      {categories.map((category) => {
        const isSelected = selectedCategory === category.name

        return (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            aria-pressed={isSelected}
            className={cn(
              "px-5 py-1.5 text-sm font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
              isSelected
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                : "bg-white dark:bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white"
            )}
          >
            #{category.name}
            <span className="ml-1.5 opacity-60">({category.count})</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
