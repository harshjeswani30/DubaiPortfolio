import { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/server"
import { SkillsContent } from "./skills-content"

export const metadata: Metadata = {
  title: "Skills",
  description: "Explore my technical skills and expertise in various technologies.",
}

async function getSkills() {
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true })
    return data || []
  } catch {
    return []
  }
}

export default async function SkillsPage() {
  const skills = await getSkills()
  return <SkillsContent skills={skills} />
}
