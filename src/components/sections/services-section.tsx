"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Code, Cpu, Database, Palette, ChevronRight } from "lucide-react"

const services = [
  {
    icon: Code,
    title: "Frontend Development",
    description: "Crafting pixel-perfect, responsive interfaces with React, Next.js & TypeScript that users love.",
    skills: ["React", "Next.js", "TypeScript"],
  },
  {
    icon: Database,
    title: "Backend Engineering",
    description: "Building robust APIs and scalable server architectures with Node.js, Python & PostgreSQL.",
    skills: ["Node.js", "PostgreSQL", "APIs"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Creating intuitive user experiences with modern design principles and smooth animations.",
    skills: ["Figma", "Motion", "Design Systems"],
  },
  {
    icon: Cpu,
    title: "DevOps & Cloud",
    description: "Deploying and scaling applications with Docker, AWS, and CI/CD pipelines.",
    skills: ["Docker", "AWS", "CI/CD"],
  },
]

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#2C3333] py-32">
      <div className="absolute inset-0 grid-background" />
      
      <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[#395B64]/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#A5C9CA]/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6 flex items-center gap-2 rounded-full border border-[#395B64] bg-[#395B64]/20 px-4 py-2"
          >
            <Cpu className="h-4 w-4 text-[#A5C9CA]" />
            <span className="text-sm font-medium text-[#A5C9CA]">What I Do</span>
          </motion.div>
          
          <h2 className="text-4xl font-bold text-[#E7F6F2] md:text-5xl lg:text-6xl">
            My <span className="gradient-text">Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#A5C9CA]/70">
            Comprehensive solutions for your digital needs. From concept to deployment, I deliver quality at every step.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative h-full overflow-hidden rounded-3xl border border-[#395B64]/50 bg-gradient-to-br from-[#395B64]/20 to-[#2C3333] p-6 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === i ? 0.1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-[#A5C9CA] to-[#E7F6F2]"
                />
                
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#395B64] glow-sm"
                    >
                      <service.icon className="h-7 w-7 text-[#A5C9CA]" />
                    </motion.div>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-xl font-bold text-[#E7F6F2] transition-colors group-hover:text-[#A5C9CA]">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#A5C9CA]/70 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-[#395B64]/50 bg-[#395B64]/20 px-3 py-1 text-xs font-medium text-[#A5C9CA]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: hoveredIndex === i ? 1 : 0, x: hoveredIndex === i ? 0 : -10 }}
                    className="mt-5 flex items-center gap-1 text-sm font-medium text-[#A5C9CA]"
                  >
                    Learn more
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
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
          <Link href="/skills">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 rounded-2xl border-2 border-[#395B64] bg-[#395B64]/20 px-8 py-4 font-semibold text-[#E7F6F2] transition-all hover:border-[#A5C9CA] hover:bg-[#395B64]/30"
            >
              View All Skills
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
