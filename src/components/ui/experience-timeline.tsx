"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { format } from "date-fns"

interface Experience {
  id: string
  company: string
  position: string
  description: string
  start_date: string
  end_date?: string
  is_current: boolean
}

interface TimelineProps {
  experiences: Experience[]
}

export function ExperienceTimeline({ experiences }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent md:left-1/2" />

      {experiences.map((exp, i) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: i * 0.2 }}
          className={`relative mb-12 flex items-center ${
            i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          <div className="absolute left-8 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-indigo-500 bg-black md:left-1/2" />

          <div
            className={`ml-16 w-full md:ml-0 md:w-1/2 ${
              i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm"
            >
              <span className="mb-2 inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                {format(new Date(exp.start_date), "MMM yyyy")} -{" "}
                {exp.is_current ? "Present" : exp.end_date ? format(new Date(exp.end_date), "MMM yyyy") : ""}
              </span>
              <h3 className="mb-1 text-xl font-semibold text-white">
                {exp.position}
              </h3>
              <p className="mb-3 text-sm text-indigo-400">{exp.company}</p>
              <p className="text-sm text-zinc-400">{exp.description}</p>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
