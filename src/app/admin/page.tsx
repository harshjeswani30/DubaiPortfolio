import { createClient } from "@/lib/supabase/server"
import { AdminDashboardClient } from "./dashboard-client"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: projectCount },
    { count: skillCount },
    { count: postCount },
    { count: serviceCount },
    { data: messages },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*").eq("is_read", false).order("created_at", { ascending: false }).limit(5),
    supabase.from("projects").select("id, title, slug, is_published, created_at").order("created_at", { ascending: false }).limit(5),
  ])

  return (
    <AdminDashboardClient
      stats={{
        projects: projectCount || 0,
        skills: skillCount || 0,
        posts: postCount || 0,
        services: serviceCount || 0,
        unreadMessages: messages?.length || 0,
      }}
      recentMessages={messages || []}
      recentProjects={recentProjects || []}
    />
  )
}
