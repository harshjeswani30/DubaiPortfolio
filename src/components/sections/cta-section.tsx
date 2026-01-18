"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Clock, CheckCircle2, TrendingUp, Sparkles } from "lucide-react"

interface MagneticButtonProps {
  children: React.ReactNode
  href: string
  variant?: "primary" | "secondary"
}

function MagneticButton({ children, href, variant = "primary" }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }, [x, y])

  return (
    <Link href={href}>
      <motion.div
        ref={buttonRef}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.97 }}
        className="relative"
      >
        <motion.div
          className={`relative flex items-center gap-3 rounded-full px-8 py-4 font-semibold transition-all duration-300 ${
            variant === "primary"
              ? "bg-gradient-to-r from-[#00ADB5] to-[#00CED6] text-[#222831]"
              : "border border-[#393E46] bg-transparent text-[#EEEEEE] hover:border-[#00ADB5]/50"
          }`}
          animate={{
            boxShadow: isHovered && variant === "primary"
              ? "0 20px 40px -12px rgba(0, 173, 181, 0.5)"
              : variant === "primary"
              ? "0 8px 24px -8px rgba(0, 173, 181, 0.3)"
              : "none",
          }}
        >
          <span>{children}</span>
          <motion.div
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  )
}

interface StatItemProps {
  value: string
  label: string
  icon: React.ReactNode
  delay: number
  isInView: boolean
}

function StatItem({ value, label, icon, delay, isInView }: StatItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex items-center gap-4 rounded-2xl border border-[#393E46]/40 bg-[#393E46]/10 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:border-[#00ADB5]/30 hover:bg-[#393E46]/20"
    >
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00ADB5]/10 text-[#00ADB5]"
      >
        {icon}
      </motion.div>
      <div>
        <div className="text-xl font-bold text-[#EEEEEE]">{value}</div>
        <div className="text-sm text-[#EEEEEE]/50">{label}</div>
      </div>
    </motion.div>
  )
}

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 100, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 100, damping: 20 })
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 100, damping: 20 })
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 20 })

  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, 80]), { stiffness: 100, damping: 20 })
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, 80]), { stiffness: 100, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const stats = [
    { value: "< 24hrs", label: "Response Time", icon: <Clock className="h-5 w-5" /> },
    { value: "50+", label: "Projects Done", icon: <TrendingUp className="h-5 w-5" /> },
    { value: "100%", label: "Client Satisfaction", icon: <CheckCircle2 className="h-5 w-5" /> },
  ]

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#222831] py-24 lg:py-32">
      <div className="absolute inset-0 grid-background opacity-20" />
      
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00ADB5]/10 blur-[120px]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-1/4 top-1/2 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-[#393E46]/30 blur-[100px]"
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6" style={{ perspective: 1000 }}>
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            x: translateX,
            y: translateY,
            transformStyle: "preserve-3d",
          }}
          className="relative overflow-hidden rounded-3xl border border-[#393E46]/50 bg-gradient-to-br from-[#2a2f38]/80 to-[#222831]/90 p-10 backdrop-blur-xl md:p-16"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(600px circle at ${glowX}% ${glowY}%, rgba(0, 173, 181, 0.15), transparent 40%)`,
            }}
          />
          
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,173,181,0.05),transparent_50%)]" />
          
          <motion.div
            className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#00ADB5]/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#00ADB5]/5 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          <div className="relative text-center" style={{ transform: "translateZ(20px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-4 py-2"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-[#00ADB5]"
              />
              <span className="text-sm font-medium text-[#00ADB5]">Available for work</span>
              <Sparkles className="h-3.5 w-3.5 text-[#00ADB5]/70" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl font-bold text-[#EEEEEE] md:text-5xl lg:text-6xl"
            >
              Let&apos;s Work{" "}
              <span className="gradient-text">Together</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mx-auto mt-5 max-w-lg text-lg text-[#EEEEEE]/60"
            >
              Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can bring your ideas to life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <MagneticButton href="/contact" variant="primary">
                Get in Touch
              </MagneticButton>
              <MagneticButton href="/projects" variant="secondary">
                View My Work
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="mt-14 grid gap-4 sm:grid-cols-3"
            >
              {stats.map((stat, i) => (
                <StatItem
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  delay={0.8 + i * 0.1}
                  isInView={isInView}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
