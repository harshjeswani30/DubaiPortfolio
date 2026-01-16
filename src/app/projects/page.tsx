import { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/server"
import { ProjectsContent } from "./projects-content"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of web development projects and applications.",
}

async function getProjects() {
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
    return data || []
  } catch {
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))]

  return <ProjectsContent projects={projects} categories={categories} />
}
