import { Metadata } from "next"
import { getAboutPage, getSiteSettings } from "@/lib/data"
import { AboutContent } from "./about-content"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my journey, skills, and experience.",
}

export const revalidate = 0

export default async function AboutPage() {
  const [aboutData, siteSettings] = await Promise.all([
    getAboutPage(),
    getSiteSettings(),
  ])
  
  return <AboutContent aboutData={aboutData} siteSettings={siteSettings} />
}
