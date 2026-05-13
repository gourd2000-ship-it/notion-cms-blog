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
import { MainNav } from "@/components/layout/main-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between gap-4">
        <MainNav />

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* 모바일 메뉴 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="메뉴 열기">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
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
