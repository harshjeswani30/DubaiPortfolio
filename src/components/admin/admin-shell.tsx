"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FolderKanban,
  Code,
  FileText,
  Mail,
  Settings,
  Briefcase,
  User,
  Phone,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Wrench,
  Home,
  PanelsTopLeft,
} from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: PanelsTopLeft },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Code },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/contact-info", label: "Contact Info", icon: Phone },
  { href: "/admin/settings", label: "Settings", icon: Settings },
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
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#222831]">
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-[#393E46]/50 text-[#EEEEEE] backdrop-blur-sm transition-colors hover:bg-[#393E46] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#393E46]/50 bg-[#222831] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#393E46]/50 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00ADB5] to-[#00ADB5]/70 shadow-lg shadow-[#00ADB5]/20">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#EEEEEE]">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#EEEEEE]/50 transition-colors hover:bg-[#393E46]/50 hover:text-[#EEEEEE] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#00ADB5]/10 text-[#00ADB5]"
                      : "text-[#EEEEEE]/60 hover:bg-[#393E46]/30 hover:text-[#EEEEEE]"
                  }`}
                >
                  <item.icon className={`h-5 w-5 transition-colors ${isActive ? "text-[#00ADB5]" : "text-[#EEEEEE]/40 group-hover:text-[#EEEEEE]/70"}`} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 h-8 w-1 rounded-r-full bg-[#00ADB5]"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-[#393E46]/50 p-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#EEEEEE]/60 transition-colors hover:bg-[#393E46]/30 hover:text-[#EEEEEE]"
          >
            <Home className="h-5 w-5" />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-7xl p-4 pt-16 lg:p-8 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                {pathname !== "/admin/dashboard" && (
                  <button
                    onClick={() => router.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#393E46]/30 text-[#EEEEEE]/50 transition-colors hover:bg-[#393E46]/50 hover:text-[#EEEEEE]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <h1 className="text-2xl font-bold text-[#EEEEEE] lg:text-3xl">{title}</h1>
              </div>
              {description && <p className="mt-2 text-[#EEEEEE]/50">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </motion.div>
          {children}
        </div>
      </main>
    </div>
  )
}
