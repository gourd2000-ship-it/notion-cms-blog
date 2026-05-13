import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <nav className={cn("flex items-center gap-6", className)}>
      <Link href="/" className="flex items-center gap-2">
        <span className="font-bold text-foreground">{siteConfig.name}</span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        {siteConfig.mainNav.map((item) =>
          item.disabled ? (
            <span
              key={item.href}
              className="text-muted-foreground text-sm font-medium cursor-not-allowed"
            >
              {item.title}
            </span>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {item.title}
            </Link>
          )
        )}
      </div>
    </nav>
  )
}
