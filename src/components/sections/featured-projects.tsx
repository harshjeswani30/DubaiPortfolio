"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

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

  return (
    <section ref={ref} className="relative bg-black py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 flex items-end justify-between"
        >
          <div>
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-indigo-400">
              Featured Work
            </span>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Selected Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-2 text-zinc-400 transition-colors hover:text-white md:flex"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <Link href={`/projects/${project.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-800">
                    {project.featured_image ? (
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <span className="text-4xl font-bold text-white/20">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1 text-sm text-white">
                        View Project <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-indigo-400">
                      {project.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-zinc-400">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 flex justify-center md:hidden"
        >
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white transition-colors hover:bg-white/10"
          >
            View All Projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
