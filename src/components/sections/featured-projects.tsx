"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Folder, ExternalLink, Github, Layers, Sparkles, Code2, Zap } from "lucide-react"
import { usePageTransition } from "@/components/providers/page-transition-provider"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  tech_stack: string[]
  category: string
  featured_image?: string
  preview_video?: string
  live_url?: string
  github_url?: string
}

interface FeaturedProjectsProps {
  projects: Project[]
}

function ProjectCard({ project, index, isInView, totalProjects }: { project: Project; index: number; isInView: boolean; totalProjects: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { startTransition } = usePageTransition()
  
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const smoothRotateX = useSpring(rotateX, { stiffness: 200, damping: 25 })
  const smoothRotateY = useSpring(rotateY, { stiffness: 200, damping: 25 })
  const glowOpacity = useSpring(0, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    rotateX.set((y - centerY) / 15)
    rotateY.set((centerX - x) / 15)
    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    glowOpacity.set(1)
    if (videoRef.current && project.preview_video) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    setIsHovered(false)
    glowOpacity.set(0)
    if (videoRef.current && project.preview_video) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

    const handleProjectClick = (e: React.MouseEvent) => {
      e.preventDefault()
      if (!cardRef.current) return
      
      sessionStorage.setItem('projectSource', 'home')
      
      const rect = cardRef.current.getBoundingClientRect()
      startTransition(
        {
          originRect: rect,
          targetSlug: project.slug,
          projectTitle: project.title,
          projectCategory: project.category,
          projectImage: project.featured_image,
        },
        `/projects/${project.slug}`
      )
    }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
      style={{ perspective: 1200 }}
    >
      <div onClick={handleProjectClick} className="cursor-pointer">
        <motion.div
          style={{
            rotateX: smoothRotateX,
            rotateY: smoothRotateY,
            transformStyle: "preserve-3d",
          }}
          className="group relative h-full"
        >
          <motion.div
            className="absolute -inset-[2px] rounded-2xl opacity-0 blur-xl transition-opacity duration-700"
            style={{
              opacity: glowOpacity,
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 173, 181, 0.4), transparent 40%)`,
            }}
          />

          <motion.div
            className="absolute -inset-px rounded-2xl"
            style={{
              background: isHovered
                ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 173, 181, 0.2), transparent 40%)`
                : 'none',
            }}
          />

          <div className="relative h-full overflow-hidden rounded-2xl border border-[#393E46]/60 bg-gradient-to-br from-[#2a2f38]/90 via-[#222831] to-[#1a1e24] backdrop-blur-sm transition-all duration-500 group-hover:border-[#00ADB5]/50 group-hover:shadow-2xl group-hover:shadow-[#00ADB5]/10">
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,173,181,0.12),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(238,238,238,0.04),transparent_60%)]" />
            </div>

            <div className="relative aspect-[16/10] overflow-hidden">
                {project.preview_video ? (
                  <motion.div
                    className="h-full w-full"
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {project.featured_image && (
                      <Image
                        src={project.featured_image}
                        alt={project.title}
                        fill
                        className={`object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <video
                      ref={videoRef}
                      src={project.preview_video}
                      muted
                      loop
                      playsInline
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </motion.div>
                ) : project.featured_image ? (
                  <motion.div
                    className="h-full w-full"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={project.featured_image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </motion.div>
                ) : (
                  <div className="relative flex h-full items-center justify-center bg-gradient-to-br from-[#393E46]/20 via-[#2a2f38] to-[#222831] overflow-hidden">
                    <div className="absolute inset-0">
                      <motion.div
                        className="absolute inset-0"
                        animate={{ 
                          backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%'
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        style={{
                          backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(0, 173, 181, 0.03) 50%, transparent 70%)',
                          backgroundSize: '200% 200%'
                        }}
                      />
                    </div>
                    
                    <motion.div
                      animate={{ 
                        scale: isHovered ? 1.15 : 1,
                        rotate: isHovered ? 5 : 0
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-12 rounded-full border border-dashed border-[#00ADB5]/15"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-8 rounded-full border border-[#393E46]/30"
                      />
                      <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00ADB5]/50 to-[#EEEEEE]/30">
                        {project.title.charAt(0)}
                      </span>
                    </motion.div>
                  </div>
                )}

                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/50 to-transparent"
                  animate={{ opacity: isHovered ? 0.85 : 0.75 }}
                  transition={{ duration: 0.3 }}
                />

                <AnimatePresence>
                  {isHovered && (project.github_url || project.live_url) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute bottom-3 right-3 flex items-center gap-2"
                    >
                      {project.github_url && (
                        <motion.div
                          initial={{ scale: 0, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0, y: 10 }}
                          transition={{ duration: 0.25, delay: 0.05, type: "spring", stiffness: 400 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.github_url, '_blank')
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#393E46] bg-[#222831]/95 backdrop-blur-sm transition-all hover:border-[#00ADB5] hover:bg-[#393E46]/60 cursor-pointer"
                        >
                          <Github className="h-4 w-4 text-[#EEEEEE]" />
                        </motion.div>
                      )}
                      {project.live_url && (
                        <motion.div
                          initial={{ scale: 0, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0, y: 10 }}
                          transition={{ duration: 0.25, delay: 0.1, type: "spring", stiffness: 400 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.live_url, '_blank')
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#393E46] bg-[#222831]/95 backdrop-blur-sm transition-all hover:border-[#00ADB5] hover:bg-[#393E46]/60 cursor-pointer"
                        >
                          <ExternalLink className="h-4 w-4 text-[#EEEEEE]" />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              <div className="absolute left-3 top-3">
                <motion.div
                  initial={{ x: -15, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
                  className="flex items-center gap-2 rounded-lg bg-[#222831]/85 px-2.5 py-1.5 backdrop-blur-md border border-[#393E46]/40"
                >
                  <motion.span 
                    className="flex h-2 w-2 rounded-full bg-[#00ADB5]"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-semibold text-[#EEEEEE]/80 uppercase tracking-wider">{project.category}</span>
                </motion.div>
              </div>

              <motion.div 
                className="absolute right-3 top-3"
                initial={{ x: 15, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#222831]/85 backdrop-blur-md border border-[#393E46]/40">
                  <span className="text-xs font-bold text-[#00ADB5]">{String(index + 1).padStart(2, '0')}</span>
                </div>
              </motion.div>
            </div>

            <div className="relative p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <motion.h3 
                  className="text-lg font-bold text-[#EEEEEE] transition-colors duration-300 group-hover:text-[#00ADB5] line-clamp-1"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  {project.title}
                </motion.h3>
                <motion.div
                  animate={{ 
                    x: isHovered ? 3 : 0,
                    y: isHovered ? -3 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#393E46]/40 text-[#00ADB5] transition-all group-hover:bg-[#00ADB5] group-hover:text-[#222831]"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </motion.div>
              </div>

              <p className="mb-4 line-clamp-2 text-sm text-[#EEEEEE]/55 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.slice(0, 3).map((tech, techIndex) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + index * 0.08 + techIndex * 0.04, duration: 0.25 }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    className="rounded-md bg-[#393E46]/35 px-2.5 py-1 text-[11px] font-medium text-[#00ADB5] transition-all hover:bg-[#00ADB5]/15 border border-transparent hover:border-[#00ADB5]/25"
                  >
                    {tech}
                  </motion.span>
                ))}
                {project.tech_stack.length > 3 && (
                  <span className="rounded-md bg-[#393E46]/20 px-2.5 py-1 text-[11px] font-medium text-[#EEEEEE]/35">
                    +{project.tech_stack.length - 3}
                  </span>
                )}
              </div>

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00ADB5] via-[#00ADB5]/60 to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00ADB5] via-[#00c4cc] to-[#EEEEEE]"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "12%"])
  const titleY = useTransform(smoothProgress, [0, 1], [30, -15])
  const orbY = useTransform(smoothProgress, [0, 1], ["0%", "20%"])
  const orb2Y = useTransform(smoothProgress, [0, 1], ["5%", "-10%"])

  const categories = [...new Set(projects.map(p => p.category))]
  const filteredProjects = activeFilter 
    ? projects.filter(p => p.category === activeFilter)
    : projects

  return (
    <section id="projects" ref={ref} className="relative overflow-hidden bg-[#222831] py-28 lg:py-36">
      <motion.div className="absolute inset-0 dot-background opacity-25" style={{ y: bgY }} />
      
      <motion.div 
        style={{ y: orbY }}
        className="absolute -right-40 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#00ADB5]/8 to-transparent blur-[140px]" 
      />
      <motion.div 
        style={{ y: orb2Y }}
        className="absolute -left-40 bottom-1/4 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-[#393E46]/15 to-transparent blur-[100px]" 
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-24 left-[8%]"
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Layers className="h-7 w-7 text-[#00ADB5]/8" />
        </motion.div>
        <motion.div
          className="absolute top-36 right-[12%]"
          animate={{ y: [0, 12, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <Code2 className="h-9 w-9 text-[#EEEEEE]/4" />
        </motion.div>
        <motion.div
          className="absolute bottom-28 left-[18%]"
          animate={{ y: [0, 10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <Sparkles className="h-5 w-5 text-[#00ADB5]/12" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-[8%]"
          animate={{ y: [0, -8, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap className="h-6 w-6 text-[#00ADB5]/6" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: titleY }}
          className="mb-14"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-xl">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ type: "spring", duration: 0.5 }}
                className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#00ADB5]/20 bg-[#00ADB5]/5 px-4 py-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <Folder className="h-4 w-4 text-[#00ADB5]" />
                </motion.div>
                <span className="text-xs font-semibold text-[#00ADB5] uppercase tracking-wider">Portfolio</span>
              </motion.div>

              <h2 className="text-3xl font-bold text-[#EEEEEE] md:text-4xl lg:text-5xl leading-tight">
                Featured{" "}
                <span className="relative inline-block">
                  <span className="gradient-text">Projects</span>
                  <motion.svg
                    className="absolute -bottom-1.5 left-0 w-full"
                    viewBox="0 0 200 10"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.9, delay: 0.4 }}
                  >
                    <motion.path
                      d="M2 6 Q50 2, 100 5 T198 3"
                      stroke="url(#underlineGradientProjects)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <defs>
                      <linearGradient id="underlineGradientProjects" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00ADB5" />
                        <stop offset="100%" stopColor="#EEEEEE" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>
              </h2>

              <motion.p 
                className="mt-4 text-base text-[#EEEEEE]/45 leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                A curated selection of my recent work showcasing modern solutions and creative problem-solving.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveFilter(null)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                      activeFilter === null 
                        ? 'bg-[#00ADB5] text-[#222831]' 
                        : 'border border-[#393E46] bg-[#393E46]/25 text-[#EEEEEE]/65 hover:border-[#00ADB5]/40'
                    }`}
                  >
                    All
                  </motion.button>
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveFilter(cat)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                        activeFilter === cat 
                          ? 'bg-[#00ADB5] text-[#222831]' 
                          : 'border border-[#393E46] bg-[#393E46]/25 text-[#EEEEEE]/65 hover:border-[#00ADB5]/40'
                      }`}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              )}

              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-2.5 rounded-xl border border-[#393E46] bg-gradient-to-r from-[#393E46]/35 to-[#393E46]/15 px-5 py-3 text-sm font-semibold text-[#EEEEEE] transition-all hover:border-[#00ADB5]/60 hover:from-[#00ADB5]/15 hover:to-[#00ADB5]/5"
                >
                  <span>View All</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.3, repeat: Infinity }}
                  >
                    <ArrowUpRight className="h-4 w-4 text-[#00ADB5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={i} 
                isInView={isInView}
                totalProjects={filteredProjects.length}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div 
              className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#393E46]/35 to-[#222831] border border-[#393E46]/50"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Folder className="h-10 w-10 text-[#00ADB5]/35" />
            </motion.div>
            <h3 className="text-xl font-bold text-[#EEEEEE]">No projects yet</h3>
            <p className="mt-2 text-sm text-[#EEEEEE]/45 max-w-sm">
              Featured projects will appear here once added.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-12 flex justify-center lg:hidden"
        >
          <Link href="/projects">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/85 px-7 py-3.5 font-semibold text-[#222831] shadow-lg shadow-[#00ADB5]/15"
            >
              View All Projects
              <ArrowUpRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
