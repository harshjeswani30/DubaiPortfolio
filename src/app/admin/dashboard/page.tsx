import { createAdminClient } from "@/lib/supabase/server"
import { AdminDashboardContent } from "./dashboard-content"

async function countTable(supabase: Awaited<ReturnType<typeof createAdminClient>>, table: string) {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true })
  return count || 0
}

export default async function AdminDashboardPage() {
  const supabase = await createAdminClient()

  const [projectCount, skillCount, postCount] = await Promise.all([
    countTable(supabase, "projects"),
    countTable(supabase, "skills"),
    countTable(supabase, "blog_posts"),
  ])

  const { data: unreadMessages } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <AdminDashboardContent
      projectCount={projectCount}
      skillCount={skillCount}
      postCount={postCount}
      unreadMessages={(unreadMessages as any[]) || []}
    />
  )
}
