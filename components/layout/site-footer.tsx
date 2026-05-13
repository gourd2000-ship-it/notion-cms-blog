import { siteConfig } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        {siteConfig.links.github && (
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            GitHub
          </a>
        )}
      </div>
    </footer>
  )
}
