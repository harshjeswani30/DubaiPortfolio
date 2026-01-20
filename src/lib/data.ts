export interface Project {
  id: string
  title: string
  slug: string
  description: string
  tech_stack: string[]
  category: string
  tagline?: string
  tagline_highlight?: string
  featured_image?: string
  live_url?: string
  github_url?: string
  is_featured: boolean
  is_published: boolean
  display_order: number
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

export const projects: Project[] = [
  {
    id: "1",
    title: "Luxury Real Estate Portal",
    slug: "luxury-real-estate",
    description: "A premium property listing platform for high-end real estate in Dubai with immersive 3D views.",
    tech_stack: ["Next.js", "PostgreSQL", "Three.js", "Tailwind CSS"],
    category: "Web Development",
    tagline: "Perfect for luxury",
    tagline_highlight: "living",
    featured_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 1,
  },
  {
    id: "2",
    title: "FinTech Investment Dashboard",
    slug: "fintech-dashboard",
    description: "Real-time portfolio tracking and investment analytics for modern traders and crypto enthusiasts.",
    tech_stack: ["React", "D3.js", "Node.js", "Redis"],
    category: "FinTech",
    tagline: "Built for modern",
    tagline_highlight: "traders",
    featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 2,
  },
  {
    id: "3",
    title: "Smart City IoT Platform",
    slug: "smart-city-iot",
    description: "Centralized monitoring and management for urban infrastructure and IoT sensors in smart cities.",
    tech_stack: ["Python", "FastAPI", "MQTT", "TimescaleDB"],
    category: "IoT / AI",
    tagline: "Powering smart",
    tagline_highlight: "cities",
    featured_image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 3,
  },
  {
    id: "4",
    title: "AI Healthcare Diagnostics",
    slug: "ai-healthcare",
    description: "Predictive diagnostic tools for medical professionals using advanced machine learning models.",
    tech_stack: ["Python", "PyTorch", "Next.js", "MongoDB"],
    category: "Healthcare",
    tagline: "Transforming patient",
    tagline_highlight: "care",
    featured_image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 4,
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Web Development in 2026",
    slug: "future-web-development-2026",
    excerpt: "Exploring the latest trends, from AI-driven development to the evolution of serverless architectures.",
    content: "Full content of the article goes here...",
    featured_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop",
    category: "Technology",
    tags: ["Web Dev", "AI", "Future"],
    reading_time: 5,
    published_at: "2026-01-15T10:00:00Z",
    is_published: true,
  },
  {
    id: "2",
    title: "Mastering React Server Components",
    slug: "mastering-react-server-components",
    excerpt: "A comprehensive guide to building high-performance Next.js applications with RSC.",
    content: "Full content of the article goes here...",
    featured_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop",
    category: "Tutorial",
    tags: ["React", "Next.js", "Performance"],
    reading_time: 8,
    published_at: "2026-01-10T14:30:00Z",
    is_published: true,
  },
]

export async function getProjects() {
  return projects.filter(p => p.is_published).sort((a, b) => a.display_order - b.display_order)
}

export async function getFeaturedProjects() {
  return projects.filter(p => p.is_published && p.is_featured).sort((a, b) => a.display_order - b.display_order).slice(0, 4)
}

export async function getProjectBySlug(slug: string) {
  return projects.find(p => p.slug === slug && p.is_published) || null
}

export async function getBlogPosts() {
  return blogPosts.filter(p => p.is_published).sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
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

export const skills: Skill[] = [
  { id: "1", name: "React", category: "Frontend", proficiency: 95, color: "#61DAFB", display_order: 1 },
  { id: "2", name: "Next.js", category: "Frontend", proficiency: 95, color: "#ffffff", display_order: 2 },
  { id: "3", name: "TypeScript", category: "Languages", proficiency: 90, color: "#3178C6", display_order: 3 },
  { id: "4", name: "JavaScript", category: "Languages", proficiency: 95, color: "#F7DF1E", display_order: 4 },
  { id: "5", name: "Node.js", category: "Backend", proficiency: 88, color: "#339933", display_order: 5 },
  { id: "6", name: "Python", category: "Languages", proficiency: 85, color: "#3776AB", display_order: 6 },
  { id: "7", name: "Tailwind CSS", category: "Frontend", proficiency: 95, color: "#06B6D4", display_order: 7 },
  { id: "8", name: "PostgreSQL", category: "Database", proficiency: 85, color: "#4169E1", display_order: 8 },
  { id: "9", name: "MongoDB", category: "Database", proficiency: 80, color: "#47A248", display_order: 9 },
  { id: "10", name: "GraphQL", category: "Backend", proficiency: 82, color: "#E10098", display_order: 10 },
  { id: "11", name: "Docker", category: "DevOps", proficiency: 78, color: "#2496ED", display_order: 11 },
  { id: "12", name: "AWS", category: "DevOps", proficiency: 75, color: "#FF9900", display_order: 12 },
  { id: "13", name: "Three.js", category: "Frontend", proficiency: 80, color: "#000000", display_order: 13 },
  { id: "14", name: "GSAP", category: "Frontend", proficiency: 85, color: "#88CE02", display_order: 14 },
  { id: "15", name: "Redis", category: "Database", proficiency: 75, color: "#DC382D", display_order: 15 },
  { id: "16", name: "Git", category: "DevOps", proficiency: 92, color: "#F05032", display_order: 16 },
  { id: "17", name: "Figma", category: "Design", proficiency: 85, color: "#F24E1E", display_order: 17 },
  { id: "18", name: "Framer Motion", category: "Frontend", proficiency: 88, color: "#0055FF", display_order: 18 },
]

export const experiences: Experience[] = [
  {
    id: "1",
    company: "Dubai Tech Solutions",
    position: "Senior Frontend Developer",
    location: "Dubai, UAE",
    start_date: "2023-01-01",
    description: "Leading the development of modern web applications using Next.js and React.",
    display_order: 1,
  },
  {
    id: "2",
    company: "Innovative Startups",
    position: "Full Stack Developer",
    location: "Remote",
    start_date: "2021-06-01",
    end_date: "2022-12-31",
    description: "Built scalable APIs and interactive user interfaces for various clients.",
    display_order: 2,
  },
]

export const aboutContent = {
  name: "Dubai Developer",
  role: "Full Stack Developer & UI/UX Enthusiast",
  bio: "Passionate developer based in Dubai, creating high-performance web applications with a focus on user experience and modern technologies.",
  email: "hello@dubaideveloper.com",
  location: "Dubai, UAE",
}

export async function getSkills() {
  return skills.sort((a, b) => a.display_order - b.display_order)
}

export async function getExperience() {
  return experiences.sort((a, b) => a.display_order - b.display_order)
}

export async function getAboutData() {
  return {
    about: aboutContent,
    experiences: await getExperience(),
    skills: await getSkills(),
  }
}
