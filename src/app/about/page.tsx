import { Metadata } from "next"
import { getFullAboutData } from "@/lib/data"
import { AboutContent } from "./about-content"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my journey, skills, and experience.",
}

export const revalidate = 0

export default async function AboutPage() {
  const data = await getFullAboutData()
  return <AboutContent {...data} />
}
