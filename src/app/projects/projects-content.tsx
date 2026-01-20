"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, ExternalLink, ArrowUpRight } from "lucide-react"
import Image from "next/image"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  tech_stack: string[]
  category: string
  featured_image?: string
  live_url?: string
  github_url?: string
}

interface ProjectsContentProps {
  projects: Project[]
  categories: string[]
}

const mockProjects = [
  {
    id: "1",
    title: "Luxury Real Estate Portal",
    slug: "luxury-real-estate",
    description: "A premium property listing platform for high-end real estate in Dubai.",
    tech_stack: ["Next.js", "PostgreSQL", "Three.js", "Tailwind CSS"],
    category: "Web Development",
    featured_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
  },
  {
    id: "2",
    title: "FinTech Investment Dashboard",
    slug: "fintech-dashboard",
    description: "Real-time portfolio tracking and investment analytics for modern traders.",
    tech_stack: ["React", "D3.js", "Node.js", "Redis"],
    category: "FinTech",
    featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
  },
  {
    id: "3",
    title: "Smart City IoT Platform",
    slug: "smart-city-iot",
    description: "Centralized monitoring and management for urban infrastructure and IoT sensors.",
    tech_stack: ["Python", "FastAPI", "MQTT", "TimescaleDB"],
    category: "IoT / AI",
    featured_image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=800&fit=crop",
  },
  {
    id: "4",
    title: "AI Healthcare Diagnostics",
    slug: "ai-healthcare",
    description: "Predictive diagnostic tools for medical professionals using machine learning.",
    tech_stack: ["Python", "PyTorch", "Next.js", "MongoDB"],
    category: "Healthcare",
    featured_image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
  },
  {
    id: "5",
    title: "Sustainable Lifestyle E-commerce",
    slug: "eco-lifestyle",
    description: "An eco-friendly marketplace focused on sustainable products and conscious living.",
    tech_stack: ["Next.js", "Shopify", "TypeScript", "Prisma"],
    category: "E-commerce",
    featured_image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=800&fit=crop",
  },
]

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const displayProjects = projects.length > 0 ? projects : mockProjects

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            A collection of my recent work spanning web development, fintech, and innovative digital solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-[#00ADB5]/50 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.featured_image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider bg-[#00ADB5]/20 border border-[#00ADB5]/30 rounded-full text-[#00ADB5]">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-[#00ADB5] transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/60 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-lg text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Link href={`/projects/${project.slug}`}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                  
                  {project.github_url && (
                    <motion.a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50"
                    >
                      <Github className="h-4 w-4" />
                    </motion.a>
                  )}
                  
                  {project.live_url && (
                    <motion.a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
