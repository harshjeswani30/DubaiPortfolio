"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  FolderKanban,
  Code,
  FileText,
  Mail,
  Settings,
  User,
  Plus,
  ArrowUpRight,
  Briefcase,
  TrendingUp,
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { AdminShell } from "@/components/admin/admin-shell"

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

const stats = [
  { label: "Projects", icon: FolderKanban, color: "from-[#00ADB5] to-[#00ADB5]/60" },
  { label: "Skills", icon: Code, color: "from-emerald-500 to-emerald-500/60" },
  { label: "Blog Posts", icon: FileText, color: "from-amber-500 to-amber-500/60" },
  { label: "Messages", icon: Mail, color: "from-rose-500 to-rose-500/60" },
]

const quickActions = [
  { href: "/admin/projects/new", label: "New Project", icon: FolderKanban, color: "text-[#00ADB5]" },
  { href: "/admin/blog/new", label: "Write Post", icon: FileText, color: "text-amber-400" },
  { href: "/admin/skills/new", label: "Add Skill", icon: Code, color: "text-emerald-400" },
  { href: "/admin/experience/new", label: "Add Experience", icon: Briefcase, color: "text-purple-400" },
]

export function AdminDashboardContent({
  projectCount,
  skillCount,
  postCount,
  unreadMessages,
}: DashboardProps) {
  const statValues = [projectCount, skillCount, postCount, unreadMessages.length]

  return (
    <AdminShell title="Dashboard" description="Welcome back! Here's an overview of your portfolio.">
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-[#393E46]/50 bg-[#393E46]/20 p-6 transition-all duration-300 hover:border-[#00ADB5]/30 hover:shadow-lg hover:shadow-[#00ADB5]/5"
          >
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-4 w-4 text-[#00ADB5]/50" />
            </div>
            <p className="text-4xl font-bold text-[#EEEEEE]">{statValues[i]}</p>
            <p className="mt-1 text-sm text-[#EEEEEE]/50">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl border border-[#393E46]/50 bg-[#393E46]/20 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#EEEEEE]">Recent Messages</h2>
            <Link
              href="/admin/messages"
              className="flex items-center gap-1 text-sm text-[#00ADB5] transition-colors hover:text-[#00ADB5]/80"
            >
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {unreadMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#393E46]/50">
                <Mail className="h-8 w-8 text-[#EEEEEE]/30" />
              </div>
              <p className="text-[#EEEEEE]/50">No messages yet</p>
              <p className="text-sm text-[#EEEEEE]/30">Messages from your contact form will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unreadMessages.slice(0, 4).map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="group rounded-xl border border-[#393E46]/50 bg-[#222831]/50 p-4 transition-all duration-200 hover:border-[#00ADB5]/20 hover:bg-[#393E46]/30"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#00ADB5]/20 to-[#00ADB5]/5 text-[#00ADB5]">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-[#EEEEEE]">{msg.name}</p>
                        <p className="text-xs text-[#EEEEEE]/40">{msg.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#EEEEEE]/30">{formatDate(msg.created_at)}</span>
                  </div>
                  <p className="mb-1 text-sm font-medium text-[#EEEEEE]/80">{msg.subject}</p>
                  <p className="line-clamp-2 text-sm text-[#EEEEEE]/40">{msg.message}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-[#393E46]/50 bg-[#393E46]/20 p-6"
        >
          <h2 className="mb-6 text-lg font-semibold text-[#EEEEEE]">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 rounded-xl border border-[#393E46]/50 bg-[#222831]/50 p-4 transition-all duration-200 hover:border-[#00ADB5]/20 hover:bg-[#393E46]/30"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[#393E46]/50 ${action.color} transition-colors group-hover:bg-[#393E46]`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="flex-1 text-sm font-medium text-[#EEEEEE]/70 group-hover:text-[#EEEEEE]">
                  {action.label}
                </span>
                <Plus className="h-4 w-4 text-[#EEEEEE]/30 transition-colors group-hover:text-[#00ADB5]" />
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-[#00ADB5]/20 bg-gradient-to-br from-[#00ADB5]/10 to-transparent p-4">
            <h3 className="mb-2 text-sm font-medium text-[#EEEEEE]">Need Help?</h3>
            <p className="text-xs text-[#EEEEEE]/50">
              Use the sidebar to navigate between sections. Add projects, skills, and blog posts to showcase your work.
            </p>
          </div>
        </motion.div>
      </div>
    </AdminShell>
  )
}
