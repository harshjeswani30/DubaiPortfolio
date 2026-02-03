import { Metadata } from "next"
import { AboutContent } from "./about-content"
import { getAboutPage } from "@/lib/data"
import { defaultAboutData } from "@/lib/default-about-data"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about me.",
}

export const revalidate = 0

export default async function AboutPage() {
  const aboutData = await getAboutPage()
  
  // Use default sample data if no configuration exists
  const displayData = aboutData || defaultAboutData
  
  return (
    <AboutContent 
      heroImage={displayData.hero_image}
      mainTitle={displayData.main_title}
      sections={displayData.sections || []}
    />
  )
}
