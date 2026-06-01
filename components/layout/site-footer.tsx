import { siteConfig } from "@/config/site"

/**
 * @description 사이트 푸터 — 다크 네이비 배경의 심플한 푸터
 */
export function SiteFooter() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 좌측: 사이트명 + 저작권 */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-white font-bold text-base">{siteConfig.name}</span>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>

        {/* 우측: 링크 */}
        <div className="flex items-center gap-6 text-sm">
          {siteConfig.mainNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-slate-500 hover:text-white transition-colors"
            >
              {item.title}
            </a>
          ))}
          {siteConfig.links.github && (
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
