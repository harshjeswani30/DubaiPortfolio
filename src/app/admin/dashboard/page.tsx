import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { AdminDashboardContent } from "./dashboard-content"

async function getDashboardData() {
  const supabase = await createAdminClient()
  const [projects, skills, posts, messages] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*").eq("is_read", false),
  ])
  return {
    projectCount: projects.count || 0,
    skillCount: skills.count || 0,
    postCount: posts.count || 0,
    unreadMessages: messages.data || [],
  }
}

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (!session) redirect("/admin")

  const data = await getDashboardData()
  return <AdminDashboardContent {...data} />
}
