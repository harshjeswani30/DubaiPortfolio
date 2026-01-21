"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Code, Cpu, Database, Palette, Lightbulb, Layers, Zap, Globe } from "lucide-react"

function useParallax(value: ReturnType<typeof useSpring>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

const services = [
  {
    icon: Code,
    title: "Frontend Development",
    description: "Crafting pixel-perfect, responsive interfaces with React, Next.js & TypeScript that users love.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind"],
    color: "#61DAFB",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: Database,
    title: "Backend Engineering",
    description: "Building robust APIs and scalable server architectures with Node.js, Python & PostgreSQL.",
    skills: ["Node.js", "PostgreSQL", "APIs", "GraphQL"],
    color: "#68D391",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Creating intuitive user experiences with modern design principles and smooth animations.",
    skills: ["Figma", "Motion", "Design Systems", "Prototyping"],
    color: "#F687B3",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Cpu,
    title: "DevOps & Cloud",
    description: "Deploying and scaling applications with Docker, AWS, and CI/CD pipelines.",
    skills: ["Docker", "AWS", "CI/CD", "Kubernetes"],
    color: "#F6AD55",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
]

const floatingIcons = [
  { icon: Lightbulb, x: "10%", y: "20%", delay: 0 },
  { icon: Layers, x: "85%", y: "15%", delay: 0.5 },
  { icon: Zap, x: "5%", y: "70%", delay: 1 },
  { icon: Globe, x: "90%", y: "75%", delay: 1.5 },
]

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeService, setActiveService] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "20%"])
  const orb1X = useTransform(smoothProgress, [0, 1], ["-10%", "10%"])
  const orb2Y = useTransform(smoothProgress, [0, 1], ["10%", "-10%"])
  
  const titleY = useParallax(smoothProgress, -30)
  const leftColY = useParallax(smoothProgress, -20)
  const rightColY = useParallax(smoothProgress, 30)
  const statsY = useParallax(smoothProgress, 40)
  const floatingParallax1 = useParallax(smoothProgress, -50)
  const floatingParallax2 = useParallax(smoothProgress, 60)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      mouseX.set((clientX - innerWidth / 2) / 30)
      mouseY.set((clientY - innerHeight / 2) / 30)
      setMousePosition({ x: clientX, y: clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    
    setProgress(0)
    
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 2.5
      })
    }, 100)
    
    intervalRef.current = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length)
      setProgress(0)
    }, 4000)
  }

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (progressRef.current) {
      clearInterval(progressRef.current)
      progressRef.current = null
    }
  }

  useEffect(() => {
    if (!isPaused) {
      startAutoPlay()
    } else {
      stopAutoPlay()
    }
    return () => stopAutoPlay()
  }, [isPaused])

  const handleServiceHover = (index: number) => {
    setIsPaused(true)
    setHoveredIndex(index)
    setActiveService(index)
    setProgress(0)
  }

  const handleServiceLeave = () => {
    setHoveredIndex(null)
    setIsPaused(false)
  }

  const handleServiceClick = (index: number) => {
    setActiveService(index)
    setProgress(0)
    if (!isPaused) {
      stopAutoPlay()
      startAutoPlay()
    }
  }

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#222831] py-32">
      <motion.div 
        className="absolute inset-0 grid-background opacity-50"
        style={{ y: bgY }}
      />
      
      <motion.div 
        style={{ x: orb1X }}
        className="absolute left-0 top-1/4 h-[600px] w-[600px] rounded-full bg-[#393E46]/15 blur-[150px]" 
      />
      <motion.div 
        style={{ y: orb2Y }}
        className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#00ADB5]/10 blur-[120px]" 
      />

        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 0.3, scale: 1 } : {}}
            transition={{ delay: item.delay, duration: 0.5 }}
            style={{ 
              left: item.x, 
              top: item.y,
              x: smoothMouseX,
              y: i % 2 === 0 ? floatingParallax1 : floatingParallax2,
            }}
            className="absolute hidden lg:block"
          >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 4 + i, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <item.icon className="h-8 w-8 text-[#00ADB5]/30" />
          </motion.div>
        </motion.div>
      ))}

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ y: titleY }}
            className="mb-20 flex flex-col items-center text-center"
          >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-6 relative"
          >
            <div className="flex items-center gap-2 rounded-full border border-[#393E46] bg-[#393E46]/20 px-5 py-2.5 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Cpu className="h-4 w-4 text-[#00ADB5]" />
              </motion.div>
              <span className="text-sm font-medium text-[#00ADB5]">What I Do</span>
            </div>
            <motion.div
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00ADB5]/20 to-[#393E46]/20 blur-md -z-10"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold text-[#EEEEEE] md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            My <span className="gradient-text">Services</span>
          </motion.h2>
          <motion.p 
            className="mx-auto mt-4 max-w-2xl text-[#00ADB5]/70"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Comprehensive solutions for your digital needs. From concept to deployment, I deliver quality at every step.
          </motion.p>

          <motion.div 
            className="mt-8 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            {services.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleServiceClick(i)}
                  className="relative h-2 rounded-full overflow-hidden"
                  animate={{ width: activeService === i ? 32 : 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-[#393E46]" />
                  {activeService === i && (
                    <motion.div
                      className="absolute inset-0 bg-[#00ADB5]"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </motion.button>
              ))}
          </motion.div>
        </motion.div>

          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <motion.div className="lg:col-span-5" style={{ y: leftColY }}>
              <div className="sticky top-32 space-y-4">
{services.map((service, i) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    onMouseEnter={() => handleServiceHover(i)}
                    onMouseLeave={handleServiceLeave}
                    onClick={() => handleServiceClick(i)}
                    className="cursor-pointer"
                  >
                  <motion.div
                    animate={{ 
                      scale: activeService === i ? 1.02 : 1,
                      x: activeService === i ? 8 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                      activeService === i 
                        ? "border-[#00ADB5]/50 bg-[#393E46]/30" 
                        : "border-[#393E46]/30 bg-[#393E46]/10 hover:border-[#393E46]/50"
                    }`}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 transition-opacity`}
                      animate={{ opacity: activeService === i ? 1 : 0 }}
                    />

                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                      style={{ backgroundColor: service.color }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: activeService === i ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative flex items-center gap-4">
                      <motion.div
                        animate={{ 
                          rotate: hoveredIndex === i ? [0, -10, 10, 0] : 0,
                          scale: activeService === i ? 1.1 : 1
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ 
                          backgroundColor: activeService === i ? `${service.color}20` : "#393E46",
                        }}
                      >
                        <service.icon 
                          className="h-6 w-6 transition-colors" 
                          style={{ color: activeService === i ? service.color : "#00ADB5" }}
                        />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 
                          className="font-bold transition-colors"
                          style={{ color: activeService === i ? service.color : "#EEEEEE" }}
                        >
                          {service.title}
                        </h3>
                        <p className="text-sm text-[#00ADB5]/60 line-clamp-1">
                          {service.description}
                        </p>
                      </div>

                      <motion.div
                        animate={{ 
                          x: activeService === i ? 0 : -10,
                          opacity: activeService === i ? 1 : 0
                        }}
                      >
                        <ArrowRight className="h-5 w-5" style={{ color: service.color }} />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              </div>
            </motion.div>

            <motion.div className="lg:col-span-7" style={{ y: rightColY }}>
              <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, y: 20, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: 10 }}
                  transition={{ duration: 0.4 }}
                  className="relative overflow-hidden rounded-3xl border border-[#393E46]/50"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${services[activeService].gradient}`}
                  />
                  
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `radial-gradient(circle at ${mousePosition.x % 400}px ${mousePosition.y % 400}px, ${services[activeService].color}20, transparent 50%)`
                    }}
                  />

                  <div className="relative p-8 lg:p-10">
                    <div className="flex items-start justify-between mb-8">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="relative"
                      >
                        <div 
                          className="flex h-20 w-20 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: `${services[activeService].color}20` }}
                        >
                          {(() => {
                            const Icon = services[activeService].icon
                            return <Icon className="h-10 w-10" style={{ color: services[activeService].color }} />
                          })()}
                        </div>
                        <motion.div
                          className="absolute -inset-2 rounded-2xl -z-10"
                          style={{ backgroundColor: services[activeService].color }}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-2 rounded-full px-4 py-2"
                        style={{ backgroundColor: `${services[activeService].color}20` }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span 
                          className="text-sm font-semibold"
                          style={{ color: services[activeService].color }}
                        >
                          0{activeService + 1}
                        </span>
                        <span className="text-[#00ADB5]/50">/</span>
                        <span className="text-sm text-[#00ADB5]/50">0{services.length}</span>
                      </motion.div>
                    </div>

                    <motion.h3 
                      className="text-3xl font-bold text-[#EEEEEE] mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      {services[activeService].title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-lg text-[#00ADB5]/80 mb-8 leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {services[activeService].description}
                    </motion.p>

                    <motion.div 
                      className="mb-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <div className="text-xs text-[#00ADB5]/50 uppercase tracking-wider mb-3">Technologies</div>
                      <div className="flex flex-wrap gap-3">
                        {services[activeService].skills.map((skill, i) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="rounded-xl border px-4 py-2 text-sm font-medium transition-all cursor-default"
                            style={{ 
                              borderColor: `${services[activeService].color}40`,
                              backgroundColor: `${services[activeService].color}10`,
                              color: services[activeService].color
                            }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="flex items-center gap-4"
                    >
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="group flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-[#222831] transition-all"
                          style={{ backgroundColor: services[activeService].color }}
                        >
                          Start a Project
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                      </Link>
                      <Link href="/projects">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="rounded-xl border-2 px-6 py-3 font-semibold transition-all"
                          style={{ 
                            borderColor: `${services[activeService].color}50`,
                            color: services[activeService].color
                          }}
                        >
                          View Work
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>

                  <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-5" viewBox="0 0 200 200">
                    <motion.path
                      d="M 100 0 C 150 50 150 150 100 200 C 50 150 50 50 100 0"
                      fill="none"
                      stroke={services[activeService].color}
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke={services[activeService].color}
                      strokeWidth="1"
                      initial={{ pathLength: 0, rotate: 0 }}
                      animate={{ pathLength: 1, rotate: 360 }}
                      transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    />
                  </svg>
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="mt-6 grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                {[
                  { label: "Projects", value: "50+" },
                  { label: "Experience", value: "5+ Yrs" },
                  { label: "Satisfaction", value: "100%" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="rounded-2xl border border-[#393E46]/30 bg-[#393E46]/10 p-4 text-center backdrop-blur-sm"
                  >
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: services[activeService].color }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-[#00ADB5]/60">{stat.label}</div>
                  </motion.div>
                ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{ y: statsY }}
            className="mt-20 flex justify-center"
          >
          <Link href="/skills">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border-2 border-[#393E46] bg-[#393E46]/20 px-8 py-4 font-semibold text-[#EEEEEE] transition-all hover:border-[#00ADB5]"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#00ADB5]/0 via-[#00ADB5]/10 to-[#00ADB5]/0"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative">View All Skills</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
