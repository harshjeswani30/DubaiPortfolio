import { Metadata } from "next"
import { getAboutData } from "@/lib/data"
import { ResumeContent } from "./resume-content"

export const metadata: Metadata = {
  title: "Resume",
  description: "View and download my professional resume.",
}

export default async function ResumePage() {
  const { about, experiences, skills } = await getAboutData()
  return <ResumeContent about={about} experiences={experiences} skills={skills} />
}
