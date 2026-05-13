"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link href="/" className="font-bold text-foreground">
          {siteConfig.name}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {siteConfig.sidebarNav.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      disabled={item.disabled}
                      className={cn(item.disabled && "opacity-50 cursor-not-allowed")}
                    >
                      {item.disabled ? (
                        <span>{item.title}</span>
                      ) : (
                        <Link href={item.href}>{item.title}</Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t px-4 py-3">
        <p className="text-muted-foreground text-xs">&copy; {new Date().getFullYear()} {siteConfig.name}</p>
      </SidebarFooter>
    </Sidebar>
  )
}
