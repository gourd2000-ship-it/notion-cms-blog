export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: string
  label?: string
  description?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  links: {
    github?: string
    twitter?: string
  }
  mainNav: NavItem[]
  sidebarNav: NavGroup[]
}
