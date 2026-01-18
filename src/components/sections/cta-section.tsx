"use client"

import { useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MessageCircle, Rocket, Sparkles, Send } from "lucide-react"

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isHovering, setIsHovering] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x / 20)
    mouseY.set(y / 20)
  }

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#222831] py-32">
      <div className="absolute inset-0 grid-background" />
      
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#393E46]/30 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute right-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#00ADB5]/20 blur-[100px]"
        />
      </div>

      <div 
        className="relative mx-auto max-w-5xl px-6"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[40px] border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/20 via-[#222831] to-[#393E46]/10 p-8 md:p-12 lg:p-16"
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#00ADB5]/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#393E46]/20 blur-3xl" />

            <div className="absolute left-8 top-8 flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className={`h-3 w-3 rounded-full ${
                    i === 0 ? "bg-red-400/60" : i === 1 ? "bg-yellow-400/60" : "bg-green-400/60"
                  }`}
                />
              ))}
            </div>

            <div className="relative text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                className="mx-auto mb-8 flex items-center justify-center gap-3"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#393E46] glow-md"
                >
                  <MessageCircle className="h-8 w-8 text-[#00ADB5]" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl font-bold text-[#EEEEEE] md:text-4xl lg:text-5xl"
              >
                Let&apos;s Work
                <span className="relative mx-2 inline-block">
                  <span className="gradient-text">Together</span>
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -right-6 -top-4"
                  >
                    <Sparkles className="h-5 w-5 text-[#00ADB5]" />
                  </motion.span>
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mx-auto mt-4 max-w-xl text-[#00ADB5]/70"
              >
                Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can bring your ideas to life.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-[#00ADB5] px-8 py-4 font-semibold text-[#222831] transition-all"
                  >
                    <motion.div
                      animate={{ x: isHovering ? "100%" : "-100%" }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                    <MessageCircle className="h-5 w-5" />
                    Get in Touch
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 rounded-2xl border-2 border-[#393E46] bg-transparent px-8 py-4 font-semibold text-[#EEEEEE] transition-all hover:border-[#00ADB5] hover:bg-[#393E46]/20"
                  >
                    <Rocket className="h-5 w-5" />
                    View My Work
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-6"
              >
                {[
                  { label: "Response Time", value: "< 24hrs" },
                  { label: "Projects Done", value: "50+" },
                  { label: "Client Satisfaction", value: "100%" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 rounded-xl border border-[#393E46]/50 bg-[#393E46]/10 px-4 py-3"
                  >
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#EEEEEE]">{stat.value}</div>
                      <div className="text-xs text-[#00ADB5]/60">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-2 top-1/4 hidden lg:block"
            >
              <div className="rounded-2xl border border-[#393E46] bg-[#222831]/90 p-3 backdrop-blur-sm glow-sm">
                <Send className="h-6 w-6 text-[#00ADB5]" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -left-2 bottom-1/4 hidden lg:block"
            >
              <div className="rounded-2xl border border-[#393E46] bg-[#222831]/90 p-3 backdrop-blur-sm glow-sm">
                <Rocket className="h-6 w-6 text-[#00ADB5]" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
