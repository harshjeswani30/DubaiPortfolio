"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MessageCircle, Rocket, Sparkles, Send, Zap, Clock, CheckCircle2, TrendingUp } from "lucide-react"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  href?: string
  variant?: "primary" | "secondary"
  icon?: React.ReactNode
}

function MagneticButton({ children, className = "", href, variant = "primary", icon }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })
  
  const glowX = useSpring(x, { stiffness: 100, damping: 20 })
  const glowY = useSpring(y, { stiffness: 100, damping: 20 })

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

  const buttonContent = (
    <motion.div
      ref={buttonRef}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute -inset-2 rounded-3xl opacity-0 blur-xl transition-opacity"
        style={{
          x: glowX,
          y: glowY,
          background: variant === "primary" 
            ? "radial-gradient(circle, rgba(0, 173, 181, 0.6) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(57, 62, 70, 0.4) 0%, transparent 70%)",
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      <motion.div
        className={`relative flex items-center justify-center gap-3 rounded-2xl px-8 py-4 font-semibold transition-all ${
          variant === "primary"
            ? "bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/90 text-[#222831] shadow-lg shadow-[#00ADB5]/25"
            : "border-2 border-[#393E46] bg-[#393E46]/10 text-[#EEEEEE] backdrop-blur-sm"
        }`}
        animate={{
          boxShadow: isHovered && variant === "primary"
            ? "0 20px 40px -10px rgba(0, 173, 181, 0.4)"
            : variant === "primary"
            ? "0 10px 30px -10px rgba(0, 173, 181, 0.25)"
            : "none",
          borderColor: isHovered && variant === "secondary" ? "#00ADB5" : "#393E46",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: variant === "primary"
              ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)"
              : "linear-gradient(135deg, rgba(0, 173, 181, 0.1) 0%, transparent 50%)",
          }}
        />

        <AnimatePresence mode="wait">
          {isHovered && variant === "primary" && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                    "linear-gradient(90deg, transparent 100%, rgba(255,255,255,0.3) 150%, transparent 200%)",
                  ],
                  x: ["-100%", "100%"],
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {icon && (
          <motion.span
            animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
            transition={{ duration: 0.4 }}
          >
            {icon}
          </motion.span>
        )}
        <span className="relative z-10">{children}</span>
        <motion.div
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </motion.div>
  )

  return href ? <Link href={href}>{buttonContent}</Link> : buttonContent
}

interface StatCardProps {
  value: string
  label: string
  icon: React.ReactNode
  delay: number
  isInView: boolean
}

function StatCard({ value, label, icon, delay, isInView }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    rotateY.set((e.clientX - centerX) / 8)
    rotateX.set(-(e.clientY - centerY) / 8)
  }, [rotateX, rotateY])

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    setIsHovered(false)
  }, [rotateX, rotateY])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="group relative"
    >
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-lg transition-opacity"
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        style={{
          background: "linear-gradient(135deg, rgba(0, 173, 181, 0.3), rgba(57, 62, 70, 0.2))",
        }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-[#393E46]/50 bg-gradient-to-br from-[#2a2f38]/80 via-[#222831]/90 to-[#393E46]/20 p-6 backdrop-blur-xl transition-all hover:border-[#00ADB5]/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,173,181,0.08),transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />
        
        <motion.div
          className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[#00ADB5]/5 blur-2xl"
          animate={{ scale: isHovered ? 1.5 : 1, opacity: isHovered ? 0.8 : 0.3 }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative flex items-center gap-4">
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -5, 5, 0] : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ADB5]/10 text-[#00ADB5] ring-1 ring-[#00ADB5]/20"
          >
            {icon}
          </motion.div>
          
          <div>
            <motion.div 
              className="text-2xl font-bold text-[#EEEEEE]"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.div>
            <div className="text-sm text-[#EEEEEE]/50">{label}</div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#00ADB5] via-[#00ADB5]/60 to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  )
}

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const cardX = useMotionValue(0)
  const cardY = useMotionValue(0)
  const cardRotateX = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 })
  const cardRotateY = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "15%"])
  const cardY2 = useTransform(smoothProgress, [0, 1], [40, -30])
  const orb1Scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 0.9])
  const orb2Scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.8, 1.1])

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setMousePosition({ x, y })
    cardRotateY.set((e.clientX - centerX) / 40)
    cardRotateX.set(-(e.clientY - centerY) / 40)
  }, [cardRotateX, cardRotateY])

  const handleCardMouseLeave = useCallback(() => {
    cardRotateX.set(0)
    cardRotateY.set(0)
  }, [cardRotateX, cardRotateY])

  const stats = [
    { value: "< 24hrs", label: "Response Time", icon: <Clock className="h-5 w-5" /> },
    { value: "50+", label: "Projects Done", icon: <TrendingUp className="h-5 w-5" /> },
    { value: "100%", label: "Client Satisfaction", icon: <CheckCircle2 className="h-5 w-5" /> },
  ]

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#222831] py-32 lg:py-40">
      <motion.div className="absolute inset-0 grid-background opacity-30" style={{ y: bgY }} />
      
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ scale: orb1Scale }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#393E46]/40 to-[#00ADB5]/10 blur-[150px]"
        />
        <motion.div
          style={{ scale: orb2Scale }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-1/4 bottom-1/3 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tl from-[#00ADB5]/25 to-[#393E46]/10 blur-[120px]"
        />

        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] hidden lg:block"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[#00ADB5]/20 blur-xl" />
            <div className="relative rounded-2xl border border-[#393E46]/60 bg-[#222831]/90 p-4 backdrop-blur-xl">
              <Send className="h-6 w-6 text-[#00ADB5]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], x: [0, -8, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute left-[8%] bottom-[25%] hidden lg:block"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[#00ADB5]/15 blur-xl" />
            <div className="relative rounded-2xl border border-[#393E46]/60 bg-[#222831]/90 p-4 backdrop-blur-xl">
              <Rocket className="h-6 w-6 text-[#00ADB5]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-[20%] bottom-[15%] hidden lg:block"
        >
          <div className="rounded-full border border-[#00ADB5]/20 bg-[#222831]/80 p-3 backdrop-blur-sm">
            <Zap className="h-5 w-5 text-[#00ADB5]/60" />
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div style={{ y: cardY2 }}>
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              rotateX: cardRotateX,
              rotateY: cardRotateY,
              transformStyle: "preserve-3d",
              perspective: 1200,
            }}
            className="relative"
          >
            <motion.div
              className="absolute -inset-[1px] rounded-[44px] opacity-50"
              style={{
                background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 173, 181, 0.15), transparent 40%)`,
              }}
            />

            <div className="relative overflow-hidden rounded-[40px] border border-[#393E46]/40 bg-gradient-to-br from-[#2a2f38]/60 via-[#222831]/80 to-[#393E46]/20 p-10 backdrop-blur-2xl md:p-14 lg:p-20">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,173,181,0.06),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(57,62,70,0.15),transparent_50%)]" />
              
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 173, 181, 0.1), transparent 40%)`,
                }}
              />

              <div className="absolute left-6 top-6 flex items-center gap-2 md:left-10 md:top-10">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                      className={`h-3.5 w-3.5 rounded-full ${
                        i === 0 ? "bg-red-400" : i === 1 ? "bg-yellow-400" : "bg-green-400"
                      }`}
                    />
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                      className={`absolute inset-0 rounded-full ${
                        i === 0 ? "bg-red-400/50" : i === 1 ? "bg-yellow-400/50" : "bg-green-400/50"
                      } blur-sm`}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="absolute right-6 top-6 md:right-10 md:top-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="flex items-center gap-2 rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-4 py-2"
                >
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-[#00ADB5]"
                  />
                  <span className="text-xs font-medium text-[#00ADB5]">Available for work</span>
                </motion.div>
              </div>

              <div className="relative pt-8 text-center md:pt-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                  className="mx-auto mb-8"
                >
                  <div className="relative inline-flex">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-4 rounded-full border border-dashed border-[#00ADB5]/20"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-8 rounded-full border border-[#393E46]/30"
                    />
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#393E46]/80 to-[#2a2f38] shadow-xl shadow-black/20 ring-1 ring-[#393E46]/50"
                    >
                      <MessageCircle className="h-10 w-10 text-[#00ADB5]" />
                      <motion.div
                        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#00ADB5] text-xs font-bold text-[#222831]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        1
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                <div className="overflow-hidden">
                  <motion.h2
                    initial={{ y: 80, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl font-bold text-[#EEEEEE] md:text-5xl lg:text-6xl"
                  >
                    Let&apos;s Work{" "}
                    <span className="relative inline-block">
                      <span className="gradient-text">Together</span>
                      <motion.span
                        animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -right-8 -top-6"
                      >
                        <Sparkles className="h-6 w-6 text-[#00ADB5]" />
                      </motion.span>
                      <motion.svg
                        className="absolute -bottom-2 left-0 w-full"
                        viewBox="0 0 200 12"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1, delay: 0.6 }}
                      >
                        <motion.path
                          d="M2 8 Q50 2, 100 6 T198 4"
                          stroke="url(#ctaUnderline)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <defs>
                          <linearGradient id="ctaUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00ADB5" />
                            <stop offset="100%" stopColor="#00ADB5" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                      </motion.svg>
                    </span>
                  </motion.h2>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mx-auto mt-6 max-w-xl text-lg text-[#EEEEEE]/50 leading-relaxed"
                >
                  Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can bring your ideas to life.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row"
                >
                  <MagneticButton
                    href="/contact"
                    variant="primary"
                    icon={<MessageCircle className="h-5 w-5" />}
                  >
                    Get in Touch
                  </MagneticButton>
                  
                  <MagneticButton
                    href="/projects"
                    variant="secondary"
                    icon={<Rocket className="h-5 w-5" />}
                  >
                    View My Work
                  </MagneticButton>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 }}
                  className="mt-16 grid gap-4 sm:grid-cols-3"
                >
                  {stats.map((stat, i) => (
                    <StatCard
                      key={stat.label}
                      value={stat.value}
                      label={stat.label}
                      icon={stat.icon}
                      delay={0.9 + i * 0.1}
                      isInView={isInView}
                    />
                  ))}
                </motion.div>
              </div>

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: "linear-gradient(90deg, transparent, #00ADB5, #00ADB5, transparent)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
