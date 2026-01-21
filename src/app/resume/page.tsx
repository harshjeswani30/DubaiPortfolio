import { Metadata } from "next"
import { getResumeData } from "@/lib/data"
import { ResumeContent } from "./resume-content"

export const metadata: Metadata = {
  title: "Resume",
  description: "View and download my professional resume.",
}

export const revalidate = 0

export default async function ResumePage() {
  const data = await getResumeData()
  return <ResumeContent {...data} />
}
