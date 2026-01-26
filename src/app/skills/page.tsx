import { Metadata } from "next"
import { getSkills, getServices } from "@/lib/data"
import { SkillsContent } from "./skills-content"

export const metadata: Metadata = {
  title: "Skills",
  description: "Explore my technical skills and expertise in various technologies.",
}

export const revalidate = 0

export default async function SkillsPage() {
  const [skills, services] = await Promise.all([
    getSkills(),
    getServices(),
  ])
  return <SkillsContent skills={skills} allServices={services} />
}
