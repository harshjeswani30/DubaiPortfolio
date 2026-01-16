import { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/server"
import { ResumeContent } from "./resume-content"

export const metadata: Metadata = {
  title: "Resume",
  description: "View and download my professional resume.",
}

async function getResumeData() {
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

export default async function ResumePage() {
  const { about, experiences, skills } = await getResumeData()
  return <ResumeContent about={about} experiences={experiences} skills={skills} />
}
