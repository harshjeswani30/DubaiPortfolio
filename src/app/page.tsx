import { createAdminClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { ServicesSection } from "@/components/sections/services-section"
import { CTASection } from "@/components/sections/cta-section"

async function getProjects() {
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("is_featured", true)
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .limit(4)
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const projects = await getProjects()

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturedProjects projects={projects} />
      <CTASection />
    </>
  )
}
