"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Folder, ExternalLink, Github, Layers, Sparkles, Code2, Eye } from "lucide-react"

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

interface FeaturedProjectsProps {
  projects: Project[]
}

function ProjectCard({ project, index, isInView }: { project: Project; index: number; isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const smoothRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const smoothRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    rotateX.set((y - centerY) / 20)
    rotateY.set((centerX - x) / 20)
    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    setIsHovered(false)
  }

  const isLarge = index === 0 || index === 3

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative ${isLarge ? 'md:col-span-2 lg:col-span-1' : ''}`}
      style={{ perspective: 1000 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <motion.div
          style={{
            rotateX: smoothRotateX,
            rotateY: smoothRotateY,
            transformStyle: "preserve-3d",
          }}
          className="group relative h-full"
        >
          <motion.div
            className="absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: isHovered
                ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 173, 181, 0.15), transparent 40%)`
                : 'none',
            }}
          />

          <div className="relative h-full overflow-hidden rounded-3xl border border-[#393E46]/50 bg-gradient-to-br from-[#2a2f38] via-[#222831] to-[#1a1e24] transition-all duration-500 group-hover:border-[#00ADB5]/30">
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,173,181,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(238,238,238,0.05),transparent_50%)]" />
            </div>

            <div className={`relative overflow-hidden ${isLarge ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
              {project.featured_image ? (
                <motion.div
                  className="h-full w-full"
                  animate={{ scale: isHovered ? 1.08 : 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={project.featured_image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#393E46]/30 via-[#2a2f38] to-[#222831]">
                  <motion.div
                    animate={{ 
                      scale: isHovered ? 1.2 : 1,
                      rotate: isHovered ? 10 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-8 rounded-full border border-dashed border-[#00ADB5]/20"
                    />
                    <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00ADB5]/40 to-[#EEEEEE]/20">
                      {project.title.charAt(0)}
                    </span>
                  </motion.div>
                </div>
              )}

              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/60 to-transparent"
                animate={{ opacity: isHovered ? 0.9 : 0.7 }}
                transition={{ duration: 0.3 }}
              />

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00ADB5] text-[#222831] shadow-lg shadow-[#00ADB5]/25"
                    >
                      <Eye className="h-6 w-6" />
                    </motion.div>
                    {project.github_url && (
                      <motion.div
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        onClick={(e) => {
                          e.preventDefault()
                          window.open(project.github_url, '_blank')
                        }}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#393E46] bg-[#222831]/90 backdrop-blur-sm transition-colors hover:border-[#00ADB5] hover:bg-[#393E46]/50"
                      >
                        <Github className="h-6 w-6 text-[#EEEEEE]" />
                      </motion.div>
                    )}
                    {project.live_url && (
                      <motion.div
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        onClick={(e) => {
                          e.preventDefault()
                          window.open(project.live_url, '_blank')
                        }}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#393E46] bg-[#222831]/90 backdrop-blur-sm transition-colors hover:border-[#00ADB5] hover:bg-[#393E46]/50"
                      >
                        <ExternalLink className="h-6 w-6 text-[#EEEEEE]" />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute left-4 top-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2 rounded-xl bg-[#222831]/80 px-3 py-2 backdrop-blur-md border border-[#393E46]/50"
                >
                  <motion.span 
                    className="flex h-2.5 w-2.5 rounded-full bg-[#00ADB5]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-semibold text-[#EEEEEE]/90 uppercase tracking-wider">{project.category}</span>
                </motion.div>
              </div>

              <motion.div 
                className="absolute right-4 top-4"
                initial={{ x: 20, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#222831]/80 backdrop-blur-md border border-[#393E46]/50">
                  <span className="text-sm font-bold text-[#00ADB5]">0{index + 1}</span>
                </div>
              </motion.div>
            </div>

            <div className="relative p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <motion.h3 
                  className="text-xl font-bold text-[#EEEEEE] transition-all duration-300 group-hover:text-[#00ADB5]"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {project.title}
                </motion.h3>
                <motion.div
                  animate={{ 
                    x: isHovered ? 4 : 0,
                    y: isHovered ? -4 : 0,
                    rotate: isHovered ? 45 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#393E46]/30 text-[#00ADB5] transition-colors group-hover:bg-[#00ADB5] group-hover:text-[#222831]"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.div>
              </div>

              <p className="mb-5 line-clamp-2 text-sm text-[#EEEEEE]/60 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tech_stack.slice(0, 4).map((tech, techIndex) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 + techIndex * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="rounded-lg bg-[#393E46]/30 px-3 py-1.5 text-xs font-medium text-[#00ADB5] transition-all hover:bg-[#00ADB5]/20 border border-transparent hover:border-[#00ADB5]/30"
                  >
                    {tech}
                  </motion.span>
                ))}
                {project.tech_stack.length > 4 && (
                  <span className="rounded-lg bg-[#393E46]/20 px-3 py-1.5 text-xs font-medium text-[#EEEEEE]/40">
                    +{project.tech_stack.length - 4}
                  </span>
                )}
              </div>

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ADB5] via-[#00ADB5]/50 to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.6 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE]"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <AnimatePresence>
              {!isHovered && (
                <>
                  <motion.div
                    className="absolute -right-6 -top-6 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                      <circle cx="25" cy="25" r="20" stroke="rgba(0, 173, 181, 0.2)" strokeWidth="1" strokeDasharray="3 5" fill="none" />
                      <circle cx="25" cy="5" r="2" fill="rgba(0, 173, 181, 0.4)" />
                    </motion.svg>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-4 -left-4 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <motion.svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <rect x="8" y="8" width="24" height="24" rx="4" stroke="rgba(238, 238, 238, 0.1)" strokeWidth="1" fill="none" />
                      <rect x="12" y="12" width="16" height="16" rx="2" stroke="rgba(0, 173, 181, 0.15)" strokeWidth="1" fill="none" />
                    </motion.svg>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "15%"])
  const titleY = useTransform(smoothProgress, [0, 1], [40, -20])
  const orbY = useTransform(smoothProgress, [0, 1], ["0%", "25%"])
  const orb2Y = useTransform(smoothProgress, [0, 1], ["10%", "-15%"])

  const categories = [...new Set(projects.map(p => p.category))]
  const filteredProjects = activeFilter 
    ? projects.filter(p => p.category === activeFilter)
    : projects

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#222831] py-32">
      <motion.div className="absolute inset-0 dot-background opacity-30" style={{ y: bgY }} />
      
      <motion.div 
        style={{ y: orbY }}
        className="absolute -right-32 top-1/4 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-[#00ADB5]/10 to-transparent blur-[150px]" 
      />
      <motion.div 
        style={{ y: orb2Y }}
        className="absolute -left-32 bottom-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#393E46]/20 to-transparent blur-[120px]" 
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[10%]"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Layers className="h-8 w-8 text-[#00ADB5]/10" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-[15%]"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Code2 className="h-10 w-10 text-[#EEEEEE]/5" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-[20%]"
          animate={{ y: [0, 12, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Sparkles className="h-6 w-6 text-[#00ADB5]/15" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: titleY }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ type: "spring", duration: 0.6 }}
                className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#00ADB5]/20 bg-[#00ADB5]/5 px-5 py-2.5"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Folder className="h-5 w-5 text-[#00ADB5]" />
                </motion.div>
                <span className="text-sm font-semibold text-[#00ADB5] uppercase tracking-wider">Portfolio Showcase</span>
              </motion.div>

              <h2 className="text-4xl font-bold text-[#EEEEEE] md:text-5xl lg:text-6xl leading-tight">
                Featured{" "}
                <span className="relative inline-block">
                  <span className="gradient-text">Projects</span>
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.path
                      d="M2 8 Q50 2, 100 6 T198 4"
                      stroke="url(#underlineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <defs>
                      <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00ADB5" />
                        <stop offset="100%" stopColor="#EEEEEE" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>
              </h2>

              <motion.p 
                className="mt-6 text-lg text-[#EEEEEE]/50 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                A curated selection of my recent work. Each project represents a unique challenge 
                solved with modern technologies and creative solutions.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveFilter(null)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      activeFilter === null 
                        ? 'bg-[#00ADB5] text-[#222831]' 
                        : 'border border-[#393E46] bg-[#393E46]/20 text-[#EEEEEE]/70 hover:border-[#00ADB5]/50'
                    }`}
                  >
                    All
                  </motion.button>
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveFilter(cat)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        activeFilter === cat 
                          ? 'bg-[#00ADB5] text-[#222831]' 
                          : 'border border-[#393E46] bg-[#393E46]/20 text-[#EEEEEE]/70 hover:border-[#00ADB5]/50'
                      }`}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              )}

              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-3 rounded-2xl border border-[#393E46] bg-gradient-to-r from-[#393E46]/30 to-[#393E46]/10 px-6 py-3.5 text-sm font-semibold text-[#EEEEEE] transition-all hover:border-[#00ADB5] hover:from-[#00ADB5]/20 hover:to-[#00ADB5]/5"
                >
                  <span>Explore All Projects</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowUpRight className="h-5 w-5 text-[#00ADB5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-2"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={i} 
                isInView={isInView} 
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <motion.div 
              className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#393E46]/30 to-[#222831] border border-[#393E46]/50"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Folder className="h-12 w-12 text-[#00ADB5]/40" />
            </motion.div>
            <h3 className="text-2xl font-bold text-[#EEEEEE]">No projects yet</h3>
            <p className="mt-3 text-[#EEEEEE]/50 max-w-md">
              Featured projects will appear here once they're added to the portfolio.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 flex justify-center md:hidden"
        >
          <Link href="/projects">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/80 px-8 py-4 font-semibold text-[#222831] shadow-lg shadow-[#00ADB5]/20"
            >
              View All Projects
              <ArrowUpRight className="h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
