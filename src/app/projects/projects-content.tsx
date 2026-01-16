"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function ProjectsContent({ projects, categories }: ProjectsContentProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-black pt-24">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-background opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px]"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-indigo-400">
              Portfolio
            </span>
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              My Projects
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              A collection of projects I&apos;ve built, from web applications to
              creative experiments.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full px-6 py-2 text-sm font-medium transition-all",
                  activeCategory === category
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link href={`/projects/${project.slug}`}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
                        {project.featured_image ? (
                          <img
                            src={project.featured_image}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                            <span className="text-6xl font-bold text-white/10">
                              {project.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
                            View Project <ArrowUpRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="mb-3">
                          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-indigo-400">
                          {project.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm text-zinc-400">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-white/10 px-2 py-1 text-xs text-zinc-500"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack.length > 3 && (
                            <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-zinc-500">
                              +{project.tech_stack.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <p className="text-zinc-500">No projects found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
