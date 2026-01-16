"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { AnimatedStats } from "@/components/ui/animated-stats"
import { ExperienceTimeline } from "@/components/ui/experience-timeline"
import { Code, Server, Wrench } from "lucide-react"

interface AboutContentProps {
  about: {
    title: string
    subtitle: string
    bio: string
    avatar_url?: string
    years_experience: number
    projects_completed: number
    clients_served: number
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
    icon?: string
  }>
}

const categoryIcons: Record<string, typeof Code> = {
  Frontend: Code,
  Backend: Server,
  Tools: Wrench,
}

export function AboutContent({ about, experiences, skills }: AboutContentProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true })

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
      <section ref={heroRef} className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-background opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px]"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-indigo-400">
              About Me
            </span>
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              {about?.title || "Full-Stack Developer"}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
              {about?.bio ||
                "Passionate about building digital experiences that matter."}
            </p>
          </motion.div>

          <AnimatedStats
            yearsExperience={about?.years_experience || 5}
            projectsCompleted={about?.projects_completed || 50}
            clientsServed={about?.clients_served || 30}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-indigo-400">
              Tech Stack
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Skills & Technologies
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {Object.entries(skillsByCategory).map(([category, categorySkills], i) => {
              const Icon = categoryIcons[category] || Code
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-500/10 p-2">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{category}</h3>
                  </div>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-zinc-300">{skill.name}</span>
                          <span className="text-zinc-500">{skill.proficiency}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {experiences.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-indigo-400">
                My Journey
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Work Experience
              </h2>
            </motion.div>

            <ExperienceTimeline experiences={experiences} />
          </div>
        </section>
      )}
    </div>
  )
}
