"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Clock, Briefcase, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock,
  Briefcase,
  Users,
}

interface HeroData {
  title: string
  title_highlight: string
  subtitle: string
  description: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  rotating_texts: string[]
  stats: { icon: string; value: string; label: string }[]
}

export function HeroSection() {
  const [data, setData] = useState<HeroData | null>(null)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((res) => res.json())
      .then((result) => {
        if (result && !result.error) {
          setData(result)
        }
      })
  }, [])

  useEffect(() => {
    if (!data?.rotating_texts?.length) return
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % data.rotating_texts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [data?.rotating_texts])

  if (!data) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </section>
    )
  }

  const rotatingTexts = data.rotating_texts || []
  const stats = data.stats || []

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-zinc-300">{data.subtitle}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {data.title.split(data.title_highlight)[0]}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {data.title_highlight}
            </span>
            {data.title.split(data.title_highlight)[1]}
          </motion.h1>

          {rotatingTexts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-8 mb-6"
            >
              <motion.p
                key={currentTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-xl text-cyan-400 font-medium"
              >
                {rotatingTexts[currentTextIndex]}
              </motion.p>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto"
          >
            {data.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href={data.primary_button_link}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              {data.primary_button_text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={data.secondary_button_link}
              className="px-8 py-4 border border-zinc-700 text-white font-semibold rounded-full hover:bg-zinc-800/50 transition-all duration-300"
            >
              {data.secondary_button_text}
            </Link>
          </motion.div>

          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {stats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon] || Clock
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <IconComponent className="w-5 h-5 text-cyan-400 mr-2" />
                      <span className="text-3xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-sm text-zinc-500">{stat.label}</p>
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
