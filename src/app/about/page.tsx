import { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/server"
import { AboutContent } from "./about-content"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my journey, experience, and the technologies I work with.",
}

async function getAboutData() {
  try {
    const supabase = await createAdminClient()
    const [aboutResult, experienceResult, skillsResult] = await Promise.all([
      supabase.from("about_content").select("*").single(),
      supabase.from("experience").select("*").order("display_order", { ascending: true }),
      supabase.from("skills").select("*").order("display_order", { ascending: true }),
    ])
    return {
      about: aboutResult.data,
      experiences: experienceResult.data || [],
      skills: skillsResult.data || [],
    }
  } catch {
    return { about: null, experiences: [], skills: [] }
  }
}

export default async function AboutPage() {
  const { about, experiences, skills } = await getAboutData()

  return <AboutContent about={about} experiences={experiences} skills={skills} />
}
