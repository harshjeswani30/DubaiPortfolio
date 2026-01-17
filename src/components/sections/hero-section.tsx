"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Sparkles, Briefcase, Users, Clock, Code2, Command, Menu, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

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

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
]

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
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

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#2C3333]"
    >
      <div className="absolute inset-0 dot-background" />
      
      <div className="absolute inset-0 overflow-hidden">
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

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 mx-auto max-w-7xl px-6 pt-6"
      >
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#395B64] glow-sm"
              >
                <Code2 className="h-5 w-5 text-[#A5C9CA]" />
              </motion.div>
              <span className="text-xl font-bold text-[#E7F6F2]">Portfolio</span>
            </motion.div>
          </Link>

          <div className="hidden items-center gap-1 rounded-2xl border border-[#395B64]/50 bg-[#395B64]/10 px-2 py-2 backdrop-blur-xl md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    "relative rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-[#E7F6F2]"
                      : "text-[#A5C9CA]/70 hover:text-[#E7F6F2]"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pathname === item.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-xl bg-[#395B64]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden items-center gap-2 rounded-xl border border-[#395B64]/50 bg-[#395B64]/10 px-3 py-2 text-sm text-[#A5C9CA]/70 backdrop-blur-xl transition-all hover:border-[#A5C9CA]/50 hover:text-[#A5C9CA] md:flex"
            >
              <Command className="h-3 w-3" />
              <span>K</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-[#395B64]/50 bg-[#395B64]/10 text-[#E7F6F2] backdrop-blur-xl md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#2C3333]/95 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="flex h-full flex-col items-center justify-center gap-6"
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "relative block text-3xl font-bold transition-colors",
                      pathname === item.href ? "text-[#A5C9CA]" : "text-[#E7F6F2]/60 hover:text-[#E7F6F2]"
                    )}
                  >
                    {pathname === item.href && (
                      <motion.span
                        layoutId="mobile-indicator"
                        className="absolute -left-6 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#A5C9CA]"
                      />
                    )}
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col lg:flex-row lg:items-center lg:justify-between px-6 py-12 lg:py-0 gap-8">
        <motion.div 
          style={{ y }}
          className="flex flex-col justify-center lg:max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#395B64] glow-sm"
            >
              <Sparkles className="h-5 w-5 text-[#E7F6F2]" />
            </motion.div>
            <div className="flex items-center gap-2 rounded-full border border-[#395B64] bg-[#395B64]/20 px-4 py-2">
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
            className="text-4xl font-bold leading-[1.1] tracking-tight text-[#E7F6F2] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Crafting
            <span className="relative mx-3 inline-block">
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
            className="mt-6 max-w-md text-base text-[#A5C9CA]/80 md:text-lg leading-relaxed"
          >
            Full-stack developer based in Dubai, turning complex problems into elegant solutions. Let&apos;s build something extraordinary together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-[#A5C9CA] px-7 py-4 text-sm font-semibold text-[#2C3333] transition-all"
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
                className="rounded-2xl border-2 border-[#395B64] bg-transparent px-7 py-4 text-sm font-semibold text-[#E7F6F2] transition-all hover:border-[#A5C9CA] hover:bg-[#395B64]/20"
              >
                Get in Touch
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-12 flex items-center gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="flex items-center gap-3 rounded-2xl border border-[#395B64]/50 bg-[#395B64]/20 px-4 py-3 backdrop-blur-sm transition-all hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#395B64]">
                    <stat.icon className="h-5 w-5 text-[#A5C9CA]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#E7F6F2]">{stat.value}</div>
                    <div className="text-xs text-[#A5C9CA]/60">{stat.label}</div>
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
          className="relative mt-8 lg:mt-0 flex items-center justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 rounded-full border border-dashed border-[#395B64]/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-16 rounded-full border border-[#A5C9CA]/10"
            />
            
            {techOrbs.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + tech.delay * 0.2 }}
                className="absolute"
                style={{
                  top: `${50 + 45 * Math.sin((i * 2 * Math.PI) / techOrbs.length)}%`,
                  left: `${50 + 45 * Math.cos((i * 2 * Math.PI) / techOrbs.length)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: tech.delay
                  }}
                  whileHover={{ scale: 1.2 }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#395B64] bg-[#2C3333] text-xs font-medium text-[#A5C9CA] shadow-lg glow-sm cursor-pointer"
                >
                  {tech.name.slice(0, 2)}
                </motion.div>
              </motion.div>
            ))}
            
            <div className="relative h-[350px] w-[280px] sm:h-[420px] sm:w-[340px] lg:h-[480px] lg:w-[380px] overflow-hidden rounded-[60px] border-4 border-[#395B64]/50 glow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#395B64] to-[#2C3333]" />
              <Image
                src="/owner.jpg"
                alt="Developer Portrait"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C3333] via-transparent to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -right-4 top-8"
            >
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="rounded-2xl border border-[#395B64] bg-[#2C3333]/95 p-3 backdrop-blur-md glow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  <span className="text-xs font-semibold text-[#E7F6F2]">Available for work</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="absolute -left-4 top-1/3"
            >
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="rounded-2xl border border-[#395B64] bg-[#2C3333]/95 p-3 backdrop-blur-md glow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="text-xl">🇦🇪</div>
                  <div>
                    <div className="text-[10px] text-[#A5C9CA]/60">Based in</div>
                    <div className="text-xs font-semibold text-[#E7F6F2]">Dubai</div>
                  </div>
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
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#A5C9CA]/60">Scroll to explore</span>
          <div className="h-12 w-6 rounded-full border-2 border-[#395B64] p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-[#A5C9CA]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
