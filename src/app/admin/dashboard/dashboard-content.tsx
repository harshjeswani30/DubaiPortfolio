"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FolderKanban,
  Code,
  FileText,
  Mail,
  Settings,
  LogOut,
  User,
  Eye,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

interface DashboardProps {
  projectCount: number
  skillCount: number
  postCount: number
  unreadMessages: Message[]
}

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { href: "/admin/skills", icon: Code, label: "Skills" },
  { href: "/admin/blog", icon: FileText, label: "Blog Posts" },
  { href: "/admin/messages", icon: Mail, label: "Messages" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

const stats = [
  { label: "Total Projects", icon: FolderKanban, color: "from-blue-500 to-cyan-500" },
  { label: "Skills", icon: Code, color: "from-green-500 to-emerald-500" },
  { label: "Blog Posts", icon: FileText, color: "from-orange-500 to-yellow-500" },
  { label: "Unread Messages", icon: Mail, color: "from-pink-500 to-rose-500" },
]

export function AdminDashboardContent({
  projectCount,
  skillCount,
  postCount,
  unreadMessages,
}: DashboardProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin")
  }

  const statValues = [projectCount, skillCount, postCount, unreadMessages.length]

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-zinc-950">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
            <span className="font-bold text-white">Admin Panel</span>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-400">Welcome back, Admin</p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10"
          >
            <Eye className="h-4 w-4" />
            View Site
          </Link>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{statValues[i]}</p>
              <p className="text-sm text-zinc-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
              <Link
                href="/admin/messages"
                className="text-sm text-indigo-400 hover:underline"
              >
                View All
              </Link>
            </div>
            {unreadMessages.length === 0 ? (
              <p className="text-center text-zinc-500 py-8">No unread messages</p>
            ) : (
              <div className="space-y-4">
                {unreadMessages.slice(0, 5).map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{msg.name}</p>
                          <p className="text-xs text-zinc-500">{msg.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-zinc-300">{msg.subject}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/admin/projects/new"
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <FolderKanban className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-zinc-300">Add Project</span>
              </Link>
              <Link
                href="/admin/blog/new"
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <FileText className="h-5 w-5 text-orange-400" />
                <span className="text-sm text-zinc-300">Write Post</span>
              </Link>
              <Link
                href="/admin/skills"
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <Code className="h-5 w-5 text-green-400" />
                <span className="text-sm text-zinc-300">Manage Skills</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <Settings className="h-5 w-5 text-zinc-400" />
                <span className="text-sm text-zinc-300">Settings</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
