export interface Project {
  id: string
  title: string
  slug: string
  description: string
  tech_stack: string[]
  category: string
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
    description: "A premium property listing platform for high-end real estate in Dubai with immersive 3D views and virtual tours.",
    tech_stack: ["Next.js", "PostgreSQL", "Three.js", "Tailwind CSS"],
    category: "Web Development",
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
    featured_image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 4,
  },
  {
    id: "5",
    title: "E-Commerce Fashion Store",
    slug: "ecommerce-fashion",
    description: "A modern e-commerce platform for luxury fashion brands with AI-powered size recommendations.",
    tech_stack: ["Next.js", "Stripe", "Prisma", "TailwindCSS"],
    category: "E-Commerce",
    featured_image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 5,
  },
  {
    id: "6",
    title: "Travel Booking Platform",
    slug: "travel-booking",
    description: "Full-stack travel booking system with flight, hotel, and experience reservations for Dubai tourists.",
    tech_stack: ["React", "Node.js", "GraphQL", "PostgreSQL"],
    category: "Travel",
    featured_image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 6,
  },
  {
    id: "7",
    title: "Fitness & Wellness App",
    slug: "fitness-wellness",
    description: "Mobile-first fitness tracking application with personalized workout plans and nutrition guidance.",
    tech_stack: ["React Native", "Firebase", "TensorFlow", "Node.js"],
    category: "Health & Fitness",
    featured_image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 7,
  },
  {
    id: "8",
    title: "Restaurant Management System",
    slug: "restaurant-management",
    description: "Comprehensive POS and inventory management system for high-end restaurants and cafes.",
    tech_stack: ["Vue.js", "Laravel", "MySQL", "Socket.io"],
    category: "Hospitality",
    featured_image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 8,
  },
  {
    id: "9",
    title: "Crypto Trading Bot",
    slug: "crypto-trading-bot",
    description: "Automated cryptocurrency trading platform with ML-driven market analysis and strategy backtesting.",
    tech_stack: ["Python", "TensorFlow", "Binance API", "Docker"],
    category: "FinTech",
    featured_image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 9,
  },
  {
    id: "10",
    title: "Event Management Portal",
    slug: "event-management",
    description: "End-to-end event planning and ticketing solution for conferences, exhibitions, and corporate events.",
    tech_stack: ["Next.js", "Supabase", "Stripe", "SendGrid"],
    category: "Events",
    featured_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 10,
  },
  {
    id: "11",
    title: "Online Learning Platform",
    slug: "online-learning",
    description: "Interactive e-learning platform with video courses, quizzes, and progress tracking for students.",
    tech_stack: ["Next.js", "AWS S3", "PostgreSQL", "WebRTC"],
    category: "Education",
    featured_image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 11,
  },
  {
    id: "12",
    title: "Social Media Analytics",
    slug: "social-analytics",
    description: "Comprehensive social media dashboard for brands to track engagement, sentiment, and ROI metrics.",
    tech_stack: ["React", "Python", "NLP", "ElasticSearch"],
    category: "Marketing",
    featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 12,
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
  return projects.filter(p => p.is_published && p.is_featured).sort((a, b) => a.display_order - b.display_order)
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
  { id: "1", name: "Next.js", category: "Frontend", proficiency: 95, display_order: 1 },
  { id: "2", name: "TypeScript", category: "Languages", proficiency: 90, display_order: 2 },
  { id: "3", name: "Node.js", category: "Backend", proficiency: 85, display_order: 3 },
  { id: "4", name: "Tailwind CSS", category: "Frontend", proficiency: 95, display_order: 4 },
  { id: "5", name: "PostgreSQL", category: "Database", proficiency: 80, display_order: 5 },
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
