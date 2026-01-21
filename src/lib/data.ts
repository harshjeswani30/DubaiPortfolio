import { createAdminClient } from "./supabase/server"

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  long_description?: string
  image: string
  technologies: string[]
  category: string
  demo_url?: string
  github_url?: string
  featured: boolean
  display_order: number
  is_active: boolean
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  skills: string[]
  color: string
  gradient: string
  display_order: number
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon: string
  color: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  tags: string[]
  read_time: string
  published: boolean
  published_at: string
  created_at: string
}

export interface HeroSection {
  title: string
  title_highlight: string
  subtitle: string
  description: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  rotating_texts: string[]
  stats: { icon: string; value: string; label: string }[]
  profile_image: string
}

export interface AboutContent {
  name: string
  role: string
  bio: string
  long_bio: string
  email: string
  location: string
  profile_image: string
  resume_url: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  start_date: string
  end_date: string
  description: string
  achievements: string[]
  is_current: boolean
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
}

export interface ContactInfo {
  email: string
  phone: string
  location: string
  availability_text: string
  is_available: boolean
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  return data || []
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(3)
  return data || []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()
  return data
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  return data || []
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("skills")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  return data || []
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
  return data || []
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()
  return data
}

export async function getHeroSection(): Promise<HeroSection | null> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("hero_section")
    .select("*")
    .eq("is_active", true)
    .single()
  return data
}

export async function getAboutContent(): Promise<AboutContent | null> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("about_content")
    .select("*")
    .limit(1)
    .single()
  return data
}

export async function getExperience(): Promise<Experience[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true })
  return data || []
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  return data || []
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("contact_info")
    .select("*")
    .limit(1)
    .single()
  return data
}
