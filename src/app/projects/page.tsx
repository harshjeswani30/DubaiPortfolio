import { Metadata } from "next"
import { getProjects } from "@/lib/data"
import { ProjectsContent } from "./projects-content"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of web development projects and applications.",
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))]

  return <ProjectsContent projects={projects} categories={categories} />
}
