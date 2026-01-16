import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import { ProjectDetailContent } from "./project-detail-content"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()
  return <ProjectDetailContent project={project} />
}
