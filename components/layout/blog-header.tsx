/**
 * @description 블로그 전용 헤더 컴포넌트
 * 블로그 제목, 메인 네비게이션, 다크모드 토글을 포함합니다.
 * 모바일에서는 햄버거 메뉴를 통해 네비게이션을 제공합니다.
 */

"use client"

import Link from "next/link"
import { Menu, BookOpen } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme/theme-toggle"

// ============================================================
// 컴포넌트
// ============================================================

/**
 * @description 블로그 헤더
 * 상단 고정(sticky) 헤더로, 스크롤 시 반투명 배경 처리됩니다.
 * @returns {JSX.Element} 블로그 헤더 UI
 */
const BlogHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-4xl px-6 h-14 flex items-center justify-between gap-4">
        {/* 로고 / 블로그 이름 */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors"
        >
          <BookOpen className="h-5 w-5" />
          <span>{siteConfig.name}</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* 우측 액션 영역 */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* 모바일 메뉴 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="메뉴 열기"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {siteConfig.name}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                {siteConfig.mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground text-base font-medium hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default BlogHeader
