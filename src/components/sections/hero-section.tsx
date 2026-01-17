"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Briefcase, Users, Clock, MessageCircle } from "lucide-react"
import Image from "next/image"
import RotatingText from "@/components/ui/rotating-text"

const stats = [
  { icon: Clock, value: "5+", label: "Years Experience" },
  { icon: Briefcase, value: "50+", label: "Projects Completed" },
  { icon: Users, value: "30+", label: "Happy Clients" },
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
              className="mb-4"
            >
              <div className="group relative inline-flex items-center gap-3 rounded-full border border-[#395B64] bg-[#395B64]/20 px-5 py-2.5 overflow-hidden cursor-pointer hover:border-[#A5C9CA]/50 transition-colors">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#A5C9CA]/0 via-[#A5C9CA]/10 to-[#A5C9CA]/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A5C9CA] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A5C9CA]" />
                </span>
                <div className="relative flex items-center">
                  <RotatingText
                    texts={['Full-Stack Web Developer', 'Creative UI/UX Designer', 'Software Engineer']}
                    mainClassName="px-2 bg-[#A5C9CA] text-[#2C3333] overflow-hidden py-1 justify-center rounded-lg"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </div>
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 100 }}
                className="absolute -right-4 top-6 z-30"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  className="group relative rounded-2xl border border-[#395B64]/80 bg-[#2C3333]/95 px-4 py-2.5 backdrop-blur-xl shadow-xl cursor-pointer overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                    </span>
                    <span className="text-sm font-semibold text-[#E7F6F2] group-hover:text-green-300 transition-colors">Available</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                className="absolute -left-6 top-1/3 z-30"
              >
                <motion.div
                  animate={{ y: [0, 8, 0], rotate: [0, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="group relative rounded-2xl border border-[#395B64]/80 bg-[#2C3333]/95 px-4 py-2.5 backdrop-blur-xl shadow-xl cursor-pointer overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#A5C9CA]/0 via-[#A5C9CA]/10 to-[#A5C9CA]/0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-center gap-2.5">
                    <div className="text-lg group-hover:scale-110 transition-transform">🇦🇪</div>
                    <div>
                      <div className="text-[9px] text-[#A5C9CA]/60 uppercase tracking-wider">Based in</div>
                      <div className="text-sm font-semibold text-[#E7F6F2] group-hover:text-[#A5C9CA] transition-colors">Dubai</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 100 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30"
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="group relative rounded-2xl border border-[#395B64]/80 bg-[#2C3333]/95 px-4 py-2.5 backdrop-blur-xl shadow-xl cursor-pointer overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#A5C9CA]/0 via-[#A5C9CA]/10 to-[#A5C9CA]/0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-center gap-2.5">
                    <MessageCircle className="h-4 w-4 text-[#A5C9CA] group-hover:text-[#E7F6F2] transition-colors" />
                    <span className="text-sm font-semibold text-[#E7F6F2] group-hover:text-[#A5C9CA] transition-colors">Let&apos;s Connect</span>
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
