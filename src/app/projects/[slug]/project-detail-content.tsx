"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  tech_stack: string[]
  category: string
  featured_image?: string
  images?: string[]
  live_url?: string
  github_url?: string
}

export function ProjectDetailContent({ project }: { project: Project }) {
  return (
    <div className="min-h-screen bg-black pt-24">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-background opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px]"
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/projects"
              className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-4 inline-block rounded-full bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-400">
              {project.category}
            </span>
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 text-lg text-zinc-400">{project.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              {project.live_url && (
                <motion.a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-zinc-200"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </motion.a>
              )}
              {project.github_url && (
                <motion.a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <Github className="h-4 w-4" />
                  View Code
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50"
          >
            <div className="aspect-video bg-zinc-800">
              {project.featured_image ? (
                <img
                  src={project.featured_image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <span className="text-8xl font-bold text-white/10">
                    {project.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12"
          >
            <h2 className="mb-6 text-2xl font-bold text-white">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {project.content && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12"
            >
              <h2 className="mb-6 text-2xl font-bold text-white">About the Project</h2>
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-400">{project.content}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
