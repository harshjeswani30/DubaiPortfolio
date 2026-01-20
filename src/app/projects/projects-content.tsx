"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, ExternalLink, ArrowUpRight } from "lucide-react"

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
  const slideCount = displayProjects.length
  const timelineScope = `--scroller, ${displayProjects.map((_, i) => `--slide-${i + 1}`).join(", ")}`

  return (
    <div
      className="carousel-container h-screen relative isolate flex flex-col gap-4 supports-sda:pointer-events-none overflow-hidden bg-black text-white antialiased pt-20"
      style={{
        timelineScope: timelineScope,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ["--slides" as any]: slideCount,
      } as React.CSSProperties}
      >

        {displayProjects.map((project, index) => (
        <img
          key={project.id}
          className="absolute hidden supports-sda:block -z-20 inset-0 h-full w-full object-cover animate-grow"
          style={{ animationTimeline: `--slide-${index + 1}` }}
          src={project.featured_image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80"}
          alt={project.title}
        />
      ))}

      <div
        className="absolute hidden supports-sda:block -z-10 inset-0 h-full w-full overflow-x-auto snap-mandatory scroll-smooth snap-x scrollbar-hidden pointer-events-auto"
        style={{ scrollTimeline: "--scroller x" }}
      >
        <div className="grid grid-flow-col auto-cols-[70cqw] pr-[30cqw] h-full w-fit">
          {displayProjects.map((_, index) => (
            <div
              key={index}
              role="none"
              id={`slide-${index + 1}`}
              className="snap-start"
              style={{ viewTimeline: `--slide-${index + 1} x` }}
            />
          ))}
        </div>
      </div>



        <div className="flex-1 px-7 relative hidden supports-sda:flex flex-col gap-[inherit]">
          <div className="overlap w-[17rem]">
            {displayProjects.map((project, index) => (
              <p
                key={project.id}
                className="animate-text translate-y-[50%] skew-y-[1.5deg]"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                }}
              >
                {project.description}
              </p>
            ))}
          </div>

          <div className="overlap max-w-2xl mt-3">
            {displayProjects.map((project, index) => (
              <div
                key={project.id}
                className="flex flex-wrap gap-3 animate-tech pointer-events-auto pb-4"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                }}
              >
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="group relative cursor-pointer rounded-xl bg-white/5 border border-white/15 px-4 py-2 text-[11px] font-bold text-white/90 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:border-[#00ADB5]/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(0,173,181,0.25)] hover:text-white"
                  >
                    <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00ADB5] shadow-[0_0_10px_#00ADB5] animate-pulse" />
                      {tech}
                    </span>
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00ADB5]/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="overlap w-[22rem] mt-2">
            {displayProjects.map((project, index) => (
              <div
                key={project.id}
                className="flex items-center gap-3 animate-text translate-y-[50%] pointer-events-auto"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                }}
              >
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
            ))}
          </div>

          <div className="w-60 my-auto">
          <nav className="flex font-medium text-sm gap-5">
            {displayProjects.map((_, index) => (
              <a
                key={index}
                href={`#slide-${index + 1}`}
                className="animate-page !text-white pointer-events-auto"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </a>
            ))}
          </nav>
          <div className="bg-white/60 mt-2">
            <div
              className="bg-white h-0.5 animate-progress origin-left"
              style={{ animationTimeline: "--scroller" }}
            />
          </div>
        </div>

        <div className="overlap items-end w-[31rem]">
          {displayProjects.map((project, index) => (
            <div key={project.id}>
              <span className="block overflow-clip">
                <span
                  className="block uppercase font-medium tracking-widest mb-4 animate-text-up"
                  style={{
                    animationTimeline: `--slide-${index + 1}`,
                    animationRangeStart: "30cqw",
                    letterSpacing: "0.3em",
                  }}
                >
                  {project.category}
                </span>
              </span>
              <p
                  className="pb-4 font-serif text-7xl animate-text translate-y-[205%] skew-y-6"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                }}
              >
                {project.title.split(" ").slice(0, -1).join(" ")}{" "}
                <em>{project.title.split(" ").slice(-1)[0]}</em>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="supports-sda:hidden px-7 pb-7">
        Your browser does not support scroll-driven animations. See{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations"
          className="underline"
        >
          MDN
        </a>{" "}
        for browser compatibility tables.
      </div>
    </div>
  )
}
