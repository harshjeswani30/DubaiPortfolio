import { getFeaturedProjects, getHeroSection, getSiteSettings, getServices } from "@/lib/data"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { ServicesSection } from "@/components/sections/services-section"
import { CTASection } from "@/components/sections/cta-section"
import { ScrollRestore } from "@/components/scroll-restore"

export const revalidate = 0

export default async function HomePage() {
  const [projects, heroData, siteSettings, services] = await Promise.all([
    getFeaturedProjects(),
    getHeroSection(),
    getSiteSettings(),
    getServices(),
  ])

  return (
    <>
      <ScrollRestore />
      <HeroSection heroData={heroData} siteSettings={siteSettings} />
      <ServicesSection services={services} siteSettings={siteSettings} />
      <FeaturedProjects projects={projects} />
      <CTASection />
    </>
  )
}
