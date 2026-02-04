"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

interface CounterProps {
  end: number
  label: string
  suffix?: string
}

function Counter({ end, label, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const duration = 1500

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end])

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="text-5xl font-bold text-white md:text-6xl"
      >
        {count}
        {suffix}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-2 text-zinc-400"
      >
        {label}
      </motion.p>
    </div>
  )
}

interface StatsProps {
  yearsExperience: number
  projectsCompleted: number
  clientsServed: number
}

export function AnimatedStats({
  yearsExperience,
  projectsCompleted,
  clientsServed,
}: StatsProps) {
  return (
    <div className="grid grid-cols-3 gap-8 py-16">
      <Counter end={yearsExperience} label="Years Experience" suffix="+" />
      <Counter end={projectsCompleted} label="Projects Completed" suffix="+" />
      <Counter end={clientsServed} label="Happy Clients" suffix="+" />
    </div>
  )
}
