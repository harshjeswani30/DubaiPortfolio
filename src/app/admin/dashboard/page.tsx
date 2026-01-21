import { createAdminClient } from "@/lib/supabase/server"
import Link from "next/link"
import { 
  FolderKanban, 
  FileText, 
  Code2, 
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Briefcase,
  User,
  Share2
} from "lucide-react"

async function getStats() {
  const supabase = await createAdminClient()
  
  const [projects, posts, skills, messages, services] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact" }),
    supabase.from("blog_posts").select("id", { count: "exact" }),
    supabase.from("skills").select("id", { count: "exact" }),
    supabase.from("contact_submissions").select("id", { count: "exact" }).eq("is_read", false),
    supabase.from("services").select("id", { count: "exact" }),
  ])

  return {
    projects: projects.count || 0,
    posts: posts.count || 0,
    skills: skills.count || 0,
    unreadMessages: messages.count || 0,
    services: services.count || 0,
  }
}

const quickLinks = [
  { href: "/admin/dashboard/hero", label: "Edit Hero Section", icon: Sparkles, color: "from-cyan-500 to-blue-600" },
  { href: "/admin/dashboard/projects", label: "Manage Projects", icon: FolderKanban, color: "from-purple-500 to-pink-600" },
  { href: "/admin/dashboard/blog", label: "Write Blog Post", icon: FileText, color: "from-green-500 to-emerald-600" },
  { href: "/admin/dashboard/skills", label: "Update Skills", icon: Code2, color: "from-orange-500 to-red-600" },
  { href: "/admin/dashboard/about", label: "Edit About", icon: User, color: "from-blue-500 to-indigo-600" },
  { href: "/admin/dashboard/services", label: "Manage Services", icon: Briefcase, color: "from-pink-500 to-rose-600" },
  { href: "/admin/dashboard/social", label: "Social Links", icon: Share2, color: "from-teal-500 to-cyan-600" },
  { href: "/admin/dashboard/messages", label: "View Messages", icon: MessageSquare, color: "from-yellow-500 to-orange-600" },
]

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here&apos;s an overview of your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projects"
          value={stats.projects}
          icon={FolderKanban}
          href="/admin/dashboard/projects"
          color="from-purple-500/20 to-purple-600/20"
          iconColor="text-purple-400"
        />
        <StatCard
          title="Blog Posts"
          value={stats.posts}
          icon={FileText}
          href="/admin/dashboard/blog"
          color="from-green-500/20 to-green-600/20"
          iconColor="text-green-400"
        />
        <StatCard
          title="Skills"
          value={stats.skills}
          icon={Code2}
          href="/admin/dashboard/skills"
          color="from-orange-500/20 to-orange-600/20"
          iconColor="text-orange-400"
        />
        <StatCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={MessageSquare}
          href="/admin/dashboard/messages"
          color="from-cyan-500/20 to-cyan-600/20"
          iconColor="text-cyan-400"
          highlight={stats.unreadMessages > 0}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative overflow-hidden bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <link.icon className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors mb-3" />
                <p className="text-white font-medium">{link.label}</p>
              </div>
              <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  href, 
  color, 
  iconColor,
  highlight = false 
}: { 
  title: string
  value: number
  icon: React.ElementType
  href: string
  color: string
  iconColor: string
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className={`relative overflow-hidden bg-gray-800/50 border rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
        highlight ? "border-cyan-500/50" : "border-gray-700/50 hover:border-gray-600"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-8 h-8 ${iconColor}`} />
          {highlight && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-gray-400 text-sm mt-1">{title}</p>
      </div>
    </Link>
  )
}
