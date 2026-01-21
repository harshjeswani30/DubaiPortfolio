"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  FolderKanban,
  Code,
  FileText,
  Mail,
  Settings,
  LogOut,
  Briefcase,
  Layers,
  User,
  Home,
  ChevronLeft,
  ChevronRight,
  Eye,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { href: "/admin/services", icon: Layers, label: "Services" },
  { href: "/admin/skills", icon: Code, label: "Skills" },
  { href: "/admin/blog", icon: FileText, label: "Blog Posts" },
  { href: "/admin/experience", icon: Briefcase, label: "Experience" },
  { href: "/admin/messages", icon: Mail, label: "Messages" },
]

const settingsItems = [
  { href: "/admin/settings", icon: Settings, label: "Site Settings" },
  { href: "/admin/settings/hero", icon: Home, label: "Hero Section" },
  { href: "/admin/settings/about", icon: User, label: "About Page" },
]

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname === href || pathname?.startsWith(href + "/")
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className={cn(
        "flex h-16 items-center border-b border-white/10 px-4",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
          <span className="text-lg font-bold text-white">A</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold text-white">Admin Panel</p>
            <p className="truncate text-xs text-zinc-500">Portfolio CMS</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-2">
          {!collapsed && <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Content</p>}
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center",
                    active
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", active && "text-cyan-400")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-6">
          {!collapsed && <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Settings</p>}
          <div className="space-y-1">
            {settingsItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center",
                    active
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", active && "text-cyan-400")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className={cn(
            "mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white",
            collapsed && "justify-center"
          )}
          title={collapsed ? "View Site" : undefined}
        >
          <Eye className="h-5 w-5 shrink-0" />
          {!collapsed && <span>View Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden border-t border-white/10 p-3 text-zinc-500 transition-colors hover:text-white lg:flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen border-r border-white/10 bg-zinc-900/80 backdrop-blur-xl transition-all duration-300 lg:block",
        collapsed ? "w-20" : "w-64"
      )}>
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-zinc-900">
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className={cn(
        "min-h-screen flex-1 transition-all duration-300",
        collapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white lg:text-xl">{title}</h1>
                {description && <p className="text-sm text-zinc-500">{description}</p>}
              </div>
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
