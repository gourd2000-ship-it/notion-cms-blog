/**
 * @description 블로그 전용 헤더 컴포넌트
 * 화이트 베이스의 심플한 네비게이션 바입니다.
 * 로고(좌측), 네비게이션(중앙), 액션 버튼(우측) 구조입니다.
 */

"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

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

/**
 * @description 블로그 헤더
 * @returns {JSX.Element} 블로그 헤더 UI
 */
const BlogHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link
          href="/"
          className="font-bold text-xl text-slate-900 dark:text-white tracking-tight hover:opacity-80 transition-opacity"
        >
          {siteConfig.name}
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* 우측 액션 영역 */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* GitHub 버튼 (데스크탑) */}
          {siteConfig.links.github && (
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex"
            >
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-none text-xs font-semibold tracking-wide px-5"
              >
                GitHub
              </Button>
            </a>
          )}

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
                <SheetTitle className="font-bold text-lg">
                  {siteConfig.name}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-5">
                {siteConfig.mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-base font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
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
