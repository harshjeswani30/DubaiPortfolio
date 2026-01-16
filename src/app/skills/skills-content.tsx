"use client"

import { motion } from "framer-motion"
import { Code, Server, Wrench } from "lucide-react"

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon?: string
}

const categoryIcons: Record<string, typeof Code> = {
  Frontend: Code,
  Backend: Server,
  Tools: Wrench,
}

const categoryColors: Record<string, string> = {
  Frontend: "from-blue-500 to-cyan-500",
  Backend: "from-green-500 to-emerald-500",
  Tools: "from-orange-500 to-yellow-500",
}

export function SkillsContent({ skills }: { skills: Skill[] }) {
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )

  return (
    <div className="min-h-screen bg-black pt-24">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-background opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute -right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[120px]"
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
              Expertise
            </span>
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              Skills & Technologies
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              A comprehensive overview of my technical skills and the technologies I work
              with on a daily basis.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-16">
            {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => {
              const Icon = categoryIcons[category] || Code
              const gradient = categoryColors[category] || "from-indigo-500 to-purple-500"

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <div className="mb-8 flex items-center gap-4">
                    <div className={`rounded-xl bg-gradient-to-br ${gradient} p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{category}</h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categorySkills.map((skill, i) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition-colors hover:border-white/20"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-lg font-medium text-white">{skill.name}</span>
                          <span className="text-sm font-medium text-zinc-400">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
