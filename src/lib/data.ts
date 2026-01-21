import { createClient } from "@/lib/supabase/server"

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  tech_stack: string[]
  category: string
  tagline?: string
  tagline_highlight?: string
  featured_image?: string
  images?: string[]
  live_url?: string
  github_url?: string
  is_featured: boolean
  is_published: boolean
  display_order: number
  duration?: string
  client?: string
  role?: string
  challenges?: string[]
  solutions?: string[]
  results?: string[]
  testimonial?: {
    quote: string
    author: string
    position: string
  }
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  category: string
  tags: string[]
  reading_time: number
  published_at: string
  is_published: boolean
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon_name?: string
  color?: string
  display_order: number
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  start_date: string
  end_date?: string
  description: string
  display_order: number
}

export interface Service {
  id: string
  title: string
  description: string
  icon_name: string
  skills: string[]
  color: string
  gradient: string
  display_order: number
}

export interface SiteSettings {
  id: string
  name: string
  role: string
  bio: string
  email: string
  phone: string
  location: string
  available_for_work: boolean
  years_experience: number
  projects_completed: number
  happy_clients: number
  profile_image?: string
  hero_tags?: { icon: string; text: string; color: string }[]
}

export interface CTASection {
  id: string
  title: string
  title_highlight: string
  description: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  availability_text: string
  response_time: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon_name: string
  display_order: number
  is_active: boolean
}

export interface HeroSection {
  id: string
  tagline: string
  highlight_text: string
  description: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  rotating_texts: string[]
}

export interface ContactInfo {
  id: string
  type: string
  label: string
  value: string
  icon_name: string
  color_gradient: string
  display_order: number
}

export interface AboutPage {
  id: string
  intro_eyebrow: string
  intro_title: string
  intro_title_highlight: string
  intro_description: string
  main_title: string
  footer_text: string
  images: string[]
  stats: { value: string; label: string }[]
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  if (error || !data) return []

  return data.map((p) => ({
    ...p,
    tech_stack: p.tech_stack || [],
    images: p.images || [],
    challenges: p.challenges || [],
    solutions: p.solutions || [],
    results: p.results || [],
    testimonial: p.testimonial_quote
      ? {
          quote: p.testimonial_quote,
          author: p.testimonial_author,
          position: p.testimonial_position,
        }
      : undefined,
  }))
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(3)

  if (error || !data) return []

  return data.map((p) => ({
    ...p,
    tech_stack: p.tech_stack || [],
    images: p.images || [],
    challenges: p.challenges || [],
    solutions: p.solutions || [],
    results: p.results || [],
    testimonial: p.testimonial_quote
      ? {
          quote: p.testimonial_quote,
          author: p.testimonial_author,
          position: p.testimonial_position,
        }
      : undefined,
  }))
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !data) return null

  return {
    ...data,
    tech_stack: data.tech_stack || [],
    images: data.images || [],
    challenges: data.challenges || [],
    solutions: data.solutions || [],
    results: data.results || [],
    testimonial: data.testimonial_quote
      ? {
          quote: data.testimonial_quote,
          author: data.testimonial_author,
          position: data.testimonial_position,
        }
      : undefined,
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  if (error || !data) return []

  return data.map((p) => ({
    ...p,
    tags: p.tags || [],
  }))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !data) return null

  return {
    ...data,
    tags: data.tags || [],
  }
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error || !data) return []
  return data
}

export async function getExperience(): Promise<Experience[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error || !data) return []
  return data
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error || !data) return []

  return data.map((s) => ({
    ...s,
    skills: s.skills || [],
  }))
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("site_settings").select("*").single()

  if (error || !data) return null
  return {
    ...data,
    hero_tags: data.hero_tags || [],
  }
}

export async function getCTASection(): Promise<CTASection | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("cta_section").select("*").single()

  if (error || !data) return null
  return data
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error || !data) return []
  return data
}

export async function getHeroSection(): Promise<HeroSection | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("hero_section").select("*").single()

  if (error || !data) return null
  return {
    ...data,
    rotating_texts: data.rotating_texts || [],
  }
}

export async function getContactInfo(): Promise<ContactInfo[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("contact_info")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error || !data) return []
  return data
}

export async function getAboutPage(): Promise<AboutPage | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("about_page").select("*").single()

  if (error || !data) return null
  return {
    ...data,
    images: data.images || [],
    stats: data.stats || [],
  }
}

export async function getAboutData() {
  const [settings, experiences, skills] = await Promise.all([
    getSiteSettings(),
    getExperience(),
    getSkills(),
  ])

  return {
    about: settings
      ? {
          name: settings.name,
          role: settings.role,
          bio: settings.bio,
          email: settings.email,
          location: settings.location,
        }
      : {
          name: "Dubai Developer",
          role: "Full Stack Developer",
          bio: "",
          email: "",
          location: "Dubai, UAE",
        },
    experiences,
    skills,
  }
}
