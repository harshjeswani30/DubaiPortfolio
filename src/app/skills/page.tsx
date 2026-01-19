import { Metadata } from "next"
import { getSkills } from "@/lib/data"
import { SkillsContent } from "./skills-content"

export const metadata: Metadata = {
  title: "Skills",
  description: "Explore my technical skills and expertise in various technologies.",
}

export default async function SkillsPage() {
  const skills = await getSkills()
  return <SkillsContent skills={skills} />
}
