import { getFeaturedProjects } from "@/lib/data"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { ServicesSection } from "@/components/sections/services-section"
import { CTASection } from "@/components/sections/cta-section"

export default async function HomePage() {
  const projects = await getFeaturedProjects()

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturedProjects projects={projects} />
      <CTASection />
    </>
  )
}
