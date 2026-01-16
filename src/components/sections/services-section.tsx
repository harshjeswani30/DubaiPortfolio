"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Code, Layers, Zap } from "lucide-react"

const services = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "Building modern, responsive web applications using cutting-edge technologies like React, Next.js, and TypeScript.",
  },
  {
    icon: Layers,
    title: "Full-Stack Solutions",
    description:
      "End-to-end development from database design to frontend implementation, ensuring seamless integration.",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description:
      "Optimizing applications for speed, SEO, and user experience with best practices and modern tooling.",
  },
]

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-32">
      <div className="absolute inset-0 grid-background opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-indigo-400">
            What I Do
          </span>
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Services & Expertise
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            I specialize in building scalable, high-performance applications that
            deliver exceptional user experiences.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 p-8 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/0 to-indigo-500/0 transition-all duration-500 group-hover:from-indigo-500/5 group-hover:to-purple-500/5" />
                <div className="relative">
                  <div className="mb-6 inline-flex rounded-xl bg-indigo-500/10 p-3">
                    <service.icon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="text-zinc-400">{service.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <Link href="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Learn More About Me
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
