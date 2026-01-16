"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { Download, Mail, MapPin, Briefcase, GraduationCap } from "lucide-react"

interface ResumeContentProps {
  about: {
    title: string
    subtitle: string
    bio: string
  } | null
  experiences: Array<{
    id: string
    company: string
    position: string
    description: string
    start_date: string
    end_date?: string
    is_current: boolean
  }>
  skills: Array<{
    id: string
    name: string
    category: string
    proficiency: number
  }>
}

export function ResumeContent({ about, experiences, skills }: ResumeContentProps) {
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>
  )

  return (
    <div className="min-h-screen bg-black pt-24">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-background opacity-50" />

        <div className="relative mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-indigo-400">
              Resume
            </span>
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              Professional Resume
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              A comprehensive overview of my professional experience and qualifications.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 font-medium text-white transition-shadow hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-8 md:p-12"
          >
            <header className="mb-8 border-b border-white/10 pb-8">
              <h2 className="text-3xl font-bold text-white">
                {about?.title || "Full-Stack Developer"}
              </h2>
              <p className="mt-2 text-lg text-indigo-400">
                {about?.subtitle || "Building digital experiences"}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  hello@portfolio.com
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Dubai, UAE
                </span>
              </div>
            </header>

            <section className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Briefcase className="h-5 w-5 text-indigo-400" />
                Experience
              </h3>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-indigo-500/30 pl-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-semibold text-white">{exp.position}</h4>
                      <span className="text-sm text-zinc-500">
                        {format(new Date(exp.start_date), "MMM yyyy")} -{" "}
                        {exp.is_current
                          ? "Present"
                          : exp.end_date
                            ? format(new Date(exp.end_date), "MMM yyyy")
                            : ""}
                      </span>
                    </div>
                    <p className="text-indigo-400">{exp.company}</p>
                    <p className="mt-2 text-sm text-zinc-400">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <GraduationCap className="h-5 w-5 text-indigo-400" />
                Skills
              </h3>
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className="mb-2 text-sm font-medium text-zinc-400">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
