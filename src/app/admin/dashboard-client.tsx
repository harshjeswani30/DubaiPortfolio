"use client"

import Link from "next/link"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminCard, AdminCardContent, AdminButton } from "@/components/admin/form-elements"
import {
  FolderKanban,
  Code,
  FileText,
  Mail,
  Layers,
  Plus,
  ArrowRight,
  User,
  Clock,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface DashboardProps {
  stats: {
    projects: number
    skills: number
    posts: number
    services: number
    unreadMessages: number
  }
  recentMessages: {
    id: string
    name: string
    email: string
    subject: string
    message: string
    created_at: string
  }[]
  recentProjects: {
    id: string
    title: string
    slug: string
    is_published: boolean
    created_at: string
  }[]
}

const statCards = [
  { key: "projects", label: "Projects", icon: FolderKanban, color: "from-blue-500 to-cyan-500", href: "/admin/projects" },
  { key: "services", label: "Services", icon: Layers, color: "from-purple-500 to-pink-500", href: "/admin/services" },
  { key: "skills", label: "Skills", icon: Code, color: "from-green-500 to-emerald-500", href: "/admin/skills" },
  { key: "posts", label: "Blog Posts", icon: FileText, color: "from-orange-500 to-yellow-500", href: "/admin/blog" },
  { key: "unreadMessages", label: "Unread Messages", icon: Mail, color: "from-red-500 to-rose-500", href: "/admin/messages" },
]

export function AdminDashboardClient({ stats, recentMessages, recentProjects }: DashboardProps) {
  return (
    <AdminShell title="Dashboard" description="Welcome back! Here's an overview of your portfolio.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => (
          <Link key={stat.key} href={stat.href}>
            <AdminCard className="group cursor-pointer transition-all duration-300 hover:border-white/20 hover:shadow-lg">
              <AdminCardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 shadow-lg`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats[stat.key as keyof typeof stats]}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </AdminCardContent>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
            <Link href="/admin/messages" className="text-sm text-cyan-400 hover:underline">
              View All
            </Link>
          </div>
          <AdminCardContent className="p-0">
            {recentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Mail className="mb-3 h-10 w-10 text-zinc-600" />
                <p className="text-zinc-500">No unread messages</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    href={`/admin/messages?id=${msg.id}`}
                    className="block px-6 py-4 transition-colors hover:bg-white/5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                          <User className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">{msg.name}</p>
                          <p className="truncate text-xs text-zinc-500">{msg.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {formatDate(msg.created_at)}
                      </div>
                    </div>
                    <p className="truncate text-sm font-medium text-zinc-300">{msg.subject}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-500">{msg.message}</p>
                  </Link>
                ))}
              </div>
            )}
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </div>
          <AdminCardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/admin/projects/new">
                <AdminCard className="group cursor-pointer transition-all duration-200 hover:border-cyan-500/30 hover:bg-cyan-500/5">
                  <AdminCardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-xl bg-blue-500/20 p-3">
                      <FolderKanban className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">New Project</p>
                      <p className="text-xs text-zinc-500">Add a new portfolio project</p>
                    </div>
                  </AdminCardContent>
                </AdminCard>
              </Link>

              <Link href="/admin/blog/new">
                <AdminCard className="group cursor-pointer transition-all duration-200 hover:border-cyan-500/30 hover:bg-cyan-500/5">
                  <AdminCardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-xl bg-orange-500/20 p-3">
                      <FileText className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">New Blog Post</p>
                      <p className="text-xs text-zinc-500">Write a new article</p>
                    </div>
                  </AdminCardContent>
                </AdminCard>
              </Link>

              <Link href="/admin/services/new">
                <AdminCard className="group cursor-pointer transition-all duration-200 hover:border-cyan-500/30 hover:bg-cyan-500/5">
                  <AdminCardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-xl bg-purple-500/20 p-3">
                      <Layers className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">New Service</p>
                      <p className="text-xs text-zinc-500">Add a new service offering</p>
                    </div>
                  </AdminCardContent>
                </AdminCard>
              </Link>

              <Link href="/admin/skills/new">
                <AdminCard className="group cursor-pointer transition-all duration-200 hover:border-cyan-500/30 hover:bg-cyan-500/5">
                  <AdminCardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-xl bg-green-500/20 p-3">
                      <Code className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">New Skill</p>
                      <p className="text-xs text-zinc-500">Add a new technical skill</p>
                    </div>
                  </AdminCardContent>
                </AdminCard>
              </Link>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-zinc-400">Recent Projects</h3>
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition-colors hover:border-white/10 hover:bg-white/10"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{project.title}</p>
                      <p className="text-xs text-zinc-500">/{project.slug}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        project.is_published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {project.is_published ? "Published" : "Draft"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </AdminCardContent>
        </AdminCard>
      </div>
    </AdminShell>
  )
}
