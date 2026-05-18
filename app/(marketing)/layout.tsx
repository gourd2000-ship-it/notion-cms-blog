/**
 * @description 마케팅(블로그 공개) 레이아웃
 * 블로그 헤더와 푸터를 포함하는 공통 레이아웃입니다.
 * /, /posts/[id], /categories/[category], /about 라우트에 적용됩니다.
 */

import BlogHeader from "@/components/layout/blog-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <BlogHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
