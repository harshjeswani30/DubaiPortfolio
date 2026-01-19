import { Metadata } from "next"
import { getAboutData } from "@/lib/data"
import { AboutContent } from "./about-content"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my journey, experience, and the technologies I work with.",
}

export default async function AboutPage() {
  const { about, experiences, skills } = await getAboutData()

  return <AboutContent about={about} experiences={experiences} skills={skills} />
}
