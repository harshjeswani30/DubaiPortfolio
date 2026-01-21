"use client"

import { motion } from "framer-motion"
import { Code, Database, Palette, Cpu } from "lucide-react"
import { useEffect, useState } from "react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Database,
  Palette,
  Cpu,
}

interface Service {
  id: string
  title: string
  description: string
  icon: string
  skills: string[]
  color: string
  gradient: string
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data)
        }
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium mb-4 block">What I Do</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Services & Expertise
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Specialized in building modern web applications with cutting-edge technologies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Code
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient || "from-cyan-500/20 to-blue-500/20"} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300 h-full">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: service.color + "20" }}
                  >
                    <IconComponent className="w-7 h-7" style={{ color: service.color }} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-zinc-400 text-sm mb-5">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(service.skills || []).map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-zinc-800/50 text-zinc-300 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
