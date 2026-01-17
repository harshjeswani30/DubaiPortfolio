"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles, Briefcase, Users, Clock } from "lucide-react"
import Image from "next/image"

const stats = [
  { icon: Clock, value: "5+", label: "Years Experience" },
  { icon: Briefcase, value: "50+", label: "Projects Completed" },
  { icon: Users, value: "30+", label: "Happy Clients" },
]

const techOrbs = [
  { name: "React", delay: 0 },
  { name: "Next.js", delay: 0.5 },
  { name: "TypeScript", delay: 1 },
  { name: "Node.js", delay: 1.5 },
  { name: "Tailwind", delay: 2 },
]

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [imageHover, setImageHover] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const cardRotateX = useMotionValue(0)
  const cardRotateY = useMotionValue(0)
  const smoothRotateX = useSpring(cardRotateX, { stiffness: 100, damping: 20 })
  const smoothRotateY = useSpring(cardRotateY, { stiffness: 100, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      mouseX.set((clientX - innerWidth / 2) / 50)
      mouseY.set((clientY - innerHeight / 2) / 50)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageHover) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    cardRotateX.set((y - centerY) / 10)
    cardRotateY.set((centerX - x) / 10)
  }

  const handleImageMouseLeave = () => {
    setImageHover(false)
    cardRotateX.set(0)
    cardRotateY.set(0)
  }

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-[#2C3333]"
    >
      <div className="absolute inset-0 dot-background" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[400px] -top-[400px] h-[800px] w-[800px]"
        >
          <div className="absolute inset-0 rounded-full border border-[#395B64]/20" />
          <div className="absolute inset-[100px] rounded-full border border-[#A5C9CA]/10" />
          <div className="absolute inset-[200px] rounded-full border border-[#E7F6F2]/5" />
        </motion.div>
        
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[#395B64]/20 blur-[100px]"
        />
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[#A5C9CA]/10 blur-[80px]"
        />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col lg:flex-row lg:items-center lg:justify-between px-6 pt-24 pb-8 gap-6">
        <motion.div 
          style={{ y }}
          className="flex flex-col justify-center lg:max-w-lg flex-shrink-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#395B64] glow-sm"
            >
              <Sparkles className="h-4 w-4 text-[#E7F6F2]" />
            </motion.div>
            <div className="flex items-center gap-2 rounded-full border border-[#395B64] bg-[#395B64]/20 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A5C9CA] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A5C9CA]" />
              </span>
              <span className="text-sm font-medium text-[#A5C9CA]">Full-Stack Developer</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold leading-[1.1] tracking-tight text-[#E7F6F2] sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Crafting
            <span className="relative mx-2 inline-block">
              <span className="gradient-text">Digital</span>
              <motion.span
                animate={{ width: ["0%", "100%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                className="absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r from-[#A5C9CA] to-[#E7F6F2]"
              />
            </span>
            <br />
            Experiences
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 max-w-md text-sm text-[#A5C9CA]/80 md:text-base leading-relaxed"
          >
            Full-stack developer based in Dubai, turning complex problems into elegant solutions. Let&apos;s build something extraordinary together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-[#A5C9CA] px-5 py-3 text-sm font-semibold text-[#2C3333] transition-all"
              >
                <motion.div
                  animate={{ x: isHovering ? "100%" : "-100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                View My Work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl border-2 border-[#395B64] bg-transparent px-5 py-3 text-sm font-semibold text-[#E7F6F2] transition-all hover:border-[#A5C9CA] hover:bg-[#395B64]/20"
              >
                Get in Touch
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 flex items-center gap-3"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="group relative flex-1"
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="flex items-center gap-2 rounded-xl border border-[#395B64]/50 bg-[#395B64]/20 px-3 py-2.5 backdrop-blur-sm transition-all hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#395B64]">
                    <stat.icon className="h-4 w-4 text-[#A5C9CA]" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#E7F6F2]">{stat.value}</div>
                    <div className="text-[10px] text-[#A5C9CA]/60 whitespace-nowrap">{stat.label}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ y: imageY }}
          className="relative flex items-center justify-center flex-shrink-0"
        >
          <div 
            className="relative"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 rounded-full border border-dashed border-[#395B64]/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 rounded-full border border-[#A5C9CA]/10"
            />
            
            {techOrbs.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + tech.delay * 0.2 }}
                className="absolute z-20"
                style={{
                  top: `${50 + 42 * Math.sin((i * 2 * Math.PI) / techOrbs.length)}%`,
                  left: `${50 + 42 * Math.cos((i * 2 * Math.PI) / techOrbs.length)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -6, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: tech.delay
                  }}
                  whileHover={{ scale: 1.2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#395B64] bg-[#2C3333] text-xs font-medium text-[#A5C9CA] shadow-lg glow-sm cursor-pointer"
                >
                  {tech.name.slice(0, 2)}
                </motion.div>
              </motion.div>
            ))}
            
            <motion.div
              onMouseEnter={() => setImageHover(true)}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
              style={{
                rotateX: smoothRotateX,
                rotateY: smoothRotateY,
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.02 }}
              className="relative h-[280px] w-[220px] sm:h-[320px] sm:w-[260px] lg:h-[380px] lg:w-[300px] overflow-hidden rounded-[40px] border-4 border-[#395B64]/50 shadow-2xl cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#395B64] to-[#2C3333]" />
              <Image
                src="/owner.jpg"
                alt="Developer Portrait"
                fill
                className="object-cover transition-transform duration-500"
                style={{ transform: imageHover ? "scale(1.05)" : "scale(1)" }}
                priority
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-[#2C3333] via-transparent to-transparent"
                animate={{ opacity: imageHover ? 0.3 : 0.6 }}
              />
              
              <motion.div
                className="absolute inset-0 opacity-0 transition-opacity duration-300"
                style={{ 
                  opacity: imageHover ? 1 : 0,
                  background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(165, 201, 202, 0.15) 0%, transparent 50%)"
                }}
              />
              
              <motion.div
                className="absolute inset-0 rounded-[36px] border-2 border-[#A5C9CA]/0 transition-all duration-300"
                style={{ borderColor: imageHover ? "rgba(165, 201, 202, 0.3)" : "transparent" }}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: imageHover ? 1 : 0, y: imageHover ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <div className="rounded-xl bg-[#2C3333]/90 backdrop-blur-md p-3 border border-[#395B64]">
                  <div className="text-sm font-bold text-[#E7F6F2]">Full-Stack Developer</div>
                  <div className="text-xs text-[#A5C9CA]/70">React • Node • Cloud</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -right-2 top-4 z-30"
            >
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="rounded-xl border border-[#395B64] bg-[#2C3333]/95 px-3 py-2 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  <span className="text-xs font-semibold text-[#E7F6F2]">Available</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="absolute -left-2 top-1/4 z-30"
            >
              <motion.div
                animate={{ y: [0, 6, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="rounded-xl border border-[#395B64] bg-[#2C3333]/95 px-3 py-2 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="text-base">🇦🇪</div>
                  <div>
                    <div className="text-[9px] text-[#A5C9CA]/60">Based in</div>
                    <div className="text-xs font-semibold text-[#E7F6F2]">Dubai</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30"
            >
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="rounded-xl border border-[#395B64] bg-[#2C3333]/95 px-3 py-2 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-[#A5C9CA]" />
                  <span className="text-xs font-semibold text-[#E7F6F2]">Let&apos;s Connect</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] text-[#A5C9CA]/60">Scroll</span>
          <div className="h-8 w-4 rounded-full border border-[#395B64] p-0.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-[#A5C9CA]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
