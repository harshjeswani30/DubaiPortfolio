"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Code2 } from "lucide-react"
import { SideMenu, MenuButton } from "@/components/ui/side-menu"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
]

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
    title: "Perfect for urban riders",
    slug: "commuter-helmet",
    description: "Move around your city safely and comfortably, while reducing your carbon footprint and helping to keep the air we breathe clean.",
    tech_stack: ["React", "Next.js"],
    category: "Commuter Helmet",
    featured_image: "https://picsum.photos/seed/project1/1920/1080",
  },
  {
    id: "2",
    title: "We're all connected",
    slug: "smart-bottle",
    description: "Let's do it responsibly and avoid having more plastic in the sea than fish. Take your refillable bottle with you and say no to plastic when drinking water.",
    tech_stack: ["TypeScript", "Node.js"],
    category: "Smart bottle",
    featured_image: "https://picsum.photos/seed/project2/1920/1080",
  },
  {
    id: "3",
    title: "Ready for late nights",
    slug: "reflective-helmet",
    description: "The Reflective Helmet seamlessly integrates reflective technology, ensuring visibility without drawing unnecessary attention. The perfect choice for the mindful cyclist.",
    tech_stack: ["Python", "FastAPI"],
    category: "Reflective Helmet",
    featured_image: "https://picsum.photos/seed/project3/1920/1080",
  },
]

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const displayProjects = projects.length > 0 ? projects : mockProjects
  const slideCount = displayProjects.length
  const timelineScope = `--scroller, ${displayProjects.map((_, i) => `--slide-${i + 1}`).join(", ")}`

  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1)
      }
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [isMenuOpen])

  return (
    <div
      className="carousel-container min-h-screen relative isolate flex flex-col gap-8 supports-sda:pointer-events-none overflow-clip bg-black text-white antialiased"
      style={{
        timelineScope: timelineScope,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ["--slides" as any]: slideCount,
      } as React.CSSProperties}
      >
        <nav className="relative z-50 mx-7 flex items-center justify-between py-6 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-xl"
          >
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"
                >
                  <Code2 className="h-4 w-4 text-white" />
                </motion.div>
                <span className="hidden text-lg font-bold text-white sm:block">Portfolio</span>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden rounded-2xl border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-xl md:block"
          >
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      item.href === "/projects"
                        ? "text-white bg-white/20"
                        : "text-white/70 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl border border-white/20 bg-black/40 px-3 py-3 backdrop-blur-xl"
          >
            <MenuButton
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-[120]"
            />
          </motion.div>
        </nav>

        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {displayProjects.map((project, index) => (
        <img
          key={project.id}
          className="absolute hidden supports-sda:block -z-20 inset-0 h-full w-full object-cover animate-grow"
          style={{ animationTimeline: `--slide-${index + 1}` }}
          src={project.featured_image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"}
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
                className="pb-7 font-serif text-8xl animate-text translate-y-[205%] skew-y-6"
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
