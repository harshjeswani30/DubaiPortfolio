"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Folder, ExternalLink, Github } from "lucide-react"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  tech_stack: string[]
  category: string
  featured_image?: string
}

interface FeaturedProjectsProps {
  projects: Project[]
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "15%"])
  const titleY = useTransform(smoothProgress, [0, 1], [50, -30])
  const orbY = useTransform(smoothProgress, [0, 1], ["0%", "30%"])
  const card1Y = useTransform(smoothProgress, [0, 1], [80, -40])
  const card2Y = useTransform(smoothProgress, [0, 1], [100, -20])
  const card3Y = useTransform(smoothProgress, [0, 1], [60, -60])
  const card4Y = useTransform(smoothProgress, [0, 1], [120, -30])
  const cardParallax = [card1Y, card2Y, card3Y, card4Y]

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#222831] py-32">
      <motion.div className="absolute inset-0 dot-background opacity-50" style={{ y: bgY }} />
      
      <motion.div 
        style={{ y: orbY }}
        className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-[#393E46]/10 blur-[150px]" 
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ y: titleY }}
          className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ type: "spring", duration: 0.6 }}
              className="mb-6 flex items-center gap-2 rounded-full border border-[#393E46] bg-[#393E46]/20 px-4 py-2"
            >
              <Folder className="h-4 w-4 text-[#00ADB5]" />
              <span className="text-sm font-medium text-[#00ADB5]">Portfolio</span>
            </motion.div>
            <h2 className="text-4xl font-bold text-[#EEEEEE] md:text-5xl lg:text-6xl">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="mt-4 max-w-lg text-[#00ADB5]/70">
              A selection of my recent work. Each project showcases different skills and technologies.
            </p>
          </div>
          
          <Link href="/projects">
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2 rounded-xl border border-[#393E46] bg-[#393E46]/20 px-5 py-3 text-sm font-medium text-[#00ADB5] transition-all hover:border-[#00ADB5] hover:bg-[#393E46]/30"
            >
              View All Projects
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              style={{ y: cardParallax[i % 4] }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link href={`/projects/${project.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative h-full overflow-hidden rounded-3xl border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/10 to-[#222831]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {project.featured_image ? (
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#393E46]/30 to-[#222831]">
                        <motion.span
                          animate={{ 
                            scale: hoveredIndex === i ? [1, 1.1, 1] : 1,
                            rotate: hoveredIndex === i ? [0, 5, -5, 0] : 0
                          }}
                          transition={{ duration: 0.5 }}
                          className="text-6xl font-bold text-[#00ADB5]/20"
                        >
                          {project.title.charAt(0)}
                        </motion.span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/20 to-transparent" />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: hoveredIndex === i ? 1 : 0, y: hoveredIndex === i ? 0 : 20 }}
                      className="absolute right-4 top-4 flex gap-2"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#222831]/80 backdrop-blur-sm"
                      >
                        <Github className="h-5 w-5 text-[#00ADB5]" />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#222831]/80 backdrop-blur-sm"
                      >
                        <ExternalLink className="h-5 w-5 text-[#00ADB5]" />
                      </motion.div>
                    </motion.div>

                    <div className="absolute left-4 top-4">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-2 rounded-full bg-[#222831]/80 px-3 py-1.5 backdrop-blur-sm"
                      >
                        <span className="flex h-2 w-2 items-center justify-center rounded-full bg-[#00ADB5]">
                          <span className="h-1 w-1 rounded-full bg-[#EEEEEE]" />
                        </span>
                        <span className="text-xs font-medium text-[#00ADB5]">{project.category}</span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="relative p-6">
                    <h3 className="mb-2 text-xl font-bold text-[#EEEEEE] transition-colors group-hover:text-[#00ADB5]">
                      {project.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-[#00ADB5]/70 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.slice(0, 4).map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: 0.4 + i * 0.1 + techIndex * 0.05 }}
                          className="rounded-lg border border-[#393E46]/50 bg-[#393E46]/20 px-3 py-1 text-xs font-medium text-[#00ADB5]"
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="rounded-lg border border-[#393E46]/50 bg-[#393E46]/20 px-3 py-1 text-xs font-medium text-[#00ADB5]/60">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>

                    <motion.div
                      initial={{ width: "0%" }}
                      animate={isInView ? { width: "100%" } : {}}
                      transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE]"
                    />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#393E46]/20">
              <Folder className="h-10 w-10 text-[#00ADB5]/50" />
            </div>
            <h3 className="text-xl font-semibold text-[#EEEEEE]">No projects yet</h3>
            <p className="mt-2 text-[#00ADB5]/60">Featured projects will appear here.</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 flex justify-center md:hidden"
        >
          <Link href="/projects">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-2xl border-2 border-[#393E46] bg-[#393E46]/20 px-6 py-3 font-semibold text-[#EEEEEE] transition-colors hover:border-[#00ADB5]"
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
