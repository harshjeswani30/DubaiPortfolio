import { getFeaturedProjects, getHeroSection, getSiteSettings, getServices, getCTASection } from "@/lib/data"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { ServicesSection } from "@/components/sections/services-section"
import { CTASection } from "@/components/sections/cta-section"
import { ScrollRestore } from "@/components/scroll-restore"

export const revalidate = 0

export default async function HomePage() {
  const [projects, heroData, siteSettings, services, ctaData] = await Promise.all([
    getFeaturedProjects(),
    getHeroSection(),
    getSiteSettings(),
    getServices(),
    getCTASection(),
  ])

  return (
    <>
      <ScrollRestore />
      <HeroSection heroData={heroData} siteSettings={siteSettings} />
      <ServicesSection services={services} siteSettings={siteSettings} />
      <FeaturedProjects projects={projects} />
      <CTASection ctaData={ctaData} siteSettings={siteSettings} />
    </>
  )
}
