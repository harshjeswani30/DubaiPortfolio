"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Briefcase, Users, Clock, MessageCircle, Sparkles, Code2, Palette } from "lucide-react"
import Image from "next/image"
import RotatingText from "@/components/ui/rotating-text"

const stats = [
  { icon: Clock, value: "5+", label: "Years Experience" },
  { icon: Briefcase, value: "50+", label: "Projects Completed" },
  { icon: Users, value: "30+", label: "Happy Clients" },
]

const floatingTags = [
  { icon: Code2, text: "React", color: "#61DAFB" },
  { icon: Palette, text: "UI/UX", color: "#FF6B6B" },
  { icon: Sparkles, text: "Creative", color: "#A5C9CA" },
]

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [imageHover, setImageHover] = useState(false)
  const [activeTag, setActiveTag] = useState<number | null>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const textY = useTransform(smoothProgress, [0, 1], ["0%", "50%"])
  const imageY = useTransform(smoothProgress, [0, 1], ["0%", "-30%"])
  const imageScale = useTransform(smoothProgress, [0, 0.5], [1, 1.15])
  const imageRotate = useTransform(smoothProgress, [0, 1], [0, 8])
  const opacity = useTransform(smoothProgress, [0, 0.4, 0.6], [1, 0.8, 0])
  const blur = useTransform(smoothProgress, [0, 0.5], [0, 10])
  
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "30%"])
  const circleScale = useTransform(smoothProgress, [0, 1], [1, 1.5])
  const circleOpacity = useTransform(smoothProgress, [0, 0.5], [0.2, 0])
  
  const floatingY1 = useParallax(smoothProgress, 100)
  const floatingY2 = useParallax(smoothProgress, 150)
  const floatingY3 = useParallax(smoothProgress, 80)
  
  const statsY = useTransform(smoothProgress, [0, 1], ["0%", "80%"])
  const statsScale = useTransform(smoothProgress, [0, 0.5], [1, 0.9])

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
    cardRotateX.set((y - centerY) / 8)
    cardRotateY.set((centerX - x) / 8)
  }

  const handleImageMouseLeave = () => {
    setImageHover(false)
    cardRotateX.set(0)
    cardRotateY.set(0)
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[120vh] overflow-hidden bg-[#2C3333]"
    >
      <motion.div 
        className="absolute inset-0 dot-background"
        style={{ y: bgY }}
      />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ scale: circleScale, opacity: circleOpacity }}
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

        <motion.div
          style={{ y: bgY, opacity: circleOpacity }}
          className="absolute left-10 top-1/4 h-2 w-2 rounded-full bg-[#A5C9CA]"
        />
        <motion.div
          style={{ y: floatingY1 }}
          className="absolute right-1/4 top-1/3 h-3 w-3 rounded-full bg-[#395B64]"
        />
        <motion.div
          style={{ y: floatingY2 }}
          className="absolute left-1/3 bottom-1/4 h-1.5 w-1.5 rounded-full bg-[#E7F6F2]/50"
        />
      </div>

      <div className="sticky top-0 h-screen">
        <motion.div 
          style={{ 
            opacity,
            filter: useTransform(blur, (v) => `blur(${v}px)`)
          }} 
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col lg:flex-row lg:items-center lg:justify-between px-6 pt-24 pb-8 gap-6"
        >
          <motion.div 
            style={{ y: textY }}
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
                    mainClassName="overflow-hidden justify-center text-sm font-medium text-[#E7F6F2]"
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
              style={{ y: statsY, scale: statsScale }}
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
            style={{ 
              y: imageY,
              scale: imageScale,
              rotate: imageRotate
            }}
            className="relative flex items-center justify-center flex-shrink-0 lg:mr-8"
          >
            <div 
              className="relative"
              style={{ perspective: "1200px" }}
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
                whileHover={{ scale: 1.03 }}
                className="relative overflow-hidden cursor-pointer"
              >
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <clipPath id="leafShape" clipPathUnits="objectBoundingBox">
                      <path d="M0.95,0.05 C0.98,0.15 1,0.3 0.98,0.5 C0.95,0.75 0.8,0.9 0.55,0.98 C0.35,1.02 0.15,0.95 0.08,0.8 C0.02,0.65 0,0.45 0.05,0.25 C0.1,0.1 0.25,0.02 0.45,0 C0.65,-0.02 0.85,0 0.95,0.05" />
                    </clipPath>
                  </defs>
                </svg>
                
                <div 
                  className="relative h-[320px] w-[280px] sm:h-[380px] sm:w-[320px] lg:h-[450px] lg:w-[380px]"
                  style={{ clipPath: "url(#leafShape)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#395B64] to-[#2C3333]" />
                  <Image
                    src="/owner.jpg"
                    alt="Developer Portrait"
                    fill
                    className="object-cover transition-transform duration-700"
                    style={{ transform: imageHover ? "scale(1.1)" : "scale(1)" }}
                    priority
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-[#2C3333] via-transparent to-transparent"
                    animate={{ opacity: imageHover ? 0.2 : 0.5 }}
                  />
                  
                  <motion.div
                    className="absolute inset-0"
                    style={{ 
                      opacity: imageHover ? 0.6 : 0,
                      background: "radial-gradient(circle at 70% 30%, rgba(165, 201, 202, 0.3) 0%, transparent 60%)"
                    }}
                    animate={{ opacity: imageHover ? 0.6 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ 
                    clipPath: "url(#leafShape)",
                    border: "3px solid transparent",
                    background: `linear-gradient(135deg, rgba(165, 201, 202, ${imageHover ? 0.5 : 0.2}) 0%, transparent 50%, rgba(165, 201, 202, ${imageHover ? 0.3 : 0.1}) 100%)`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "3px"
                  }}
                  animate={{ 
                    boxShadow: imageHover 
                      ? "0 0 60px rgba(165, 201, 202, 0.4), inset 0 0 60px rgba(165, 201, 202, 0.1)" 
                      : "0 0 30px rgba(165, 201, 202, 0.2)"
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 100 }}
                style={{ y: floatingY1 }}
                className="absolute -right-8 top-8 z-30"
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="group relative cursor-pointer"
                >
                  <div className="relative rounded-2xl border border-green-400/30 bg-[#2C3333]/90 px-4 py-3 backdrop-blur-xl shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{ 
                        boxShadow: ["0 0 20px rgba(74,222,128,0.2)", "0 0 40px rgba(74,222,128,0.4)", "0 0 20px rgba(74,222,128,0.2)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative flex items-center gap-3">
                      <motion.span 
                        className="relative flex h-3 w-3"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]" />
                      </motion.span>
                      <span className="text-sm font-bold text-green-300 tracking-wide">AVAILABLE</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {floatingTags.map((tag, index) => (
                <motion.div
                  key={tag.text}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.15, type: "spring", stiffness: 100 }}
                  style={{ y: index === 0 ? floatingY2 : index === 1 ? floatingY3 : floatingY1 }}
                  className="absolute z-30"
                  {...{
                    style: {
                      left: index === 0 ? "-60px" : index === 1 ? "-40px" : "auto",
                      right: index === 2 ? "-50px" : "auto",
                      top: index === 0 ? "25%" : index === 1 ? "55%" : "40%",
                      y: index === 0 ? floatingY2 : index === 1 ? floatingY3 : floatingY1
                    }
                  }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, index % 2 === 0 ? -10 : 10, 0],
                      x: [0, index % 2 === 0 ? 5 : -5, 0],
                      rotate: [0, index % 2 === 0 ? 3 : -3, 0]
                    }}
                    transition={{ 
                      duration: 3 + index * 0.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                    whileHover={{ scale: 1.2, rotate: 0 }}
                    onHoverStart={() => setActiveTag(index)}
                    onHoverEnd={() => setActiveTag(null)}
                    className="group relative cursor-pointer"
                  >
                    <motion.div 
                      className="relative flex items-center gap-2 rounded-xl border bg-[#2C3333]/95 px-3 py-2 backdrop-blur-xl shadow-lg"
                      style={{ 
                        borderColor: activeTag === index ? tag.color : "rgba(57, 91, 100, 0.6)",
                      }}
                      animate={{
                        boxShadow: activeTag === index 
                          ? `0 0 25px ${tag.color}40, 0 0 50px ${tag.color}20`
                          : "0 4px 20px rgba(0,0,0,0.3)"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0"
                        style={{ background: `linear-gradient(135deg, ${tag.color}20, transparent)` }}
                        animate={{ opacity: activeTag === index ? 1 : 0 }}
                      />
                      <motion.div
                        animate={{ rotate: activeTag === index ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <tag.icon 
                          className="h-4 w-4 relative z-10" 
                          style={{ color: tag.color }}
                        />
                      </motion.div>
                      <span 
                        className="text-xs font-semibold relative z-10 transition-colors"
                        style={{ color: activeTag === index ? tag.color : "#E7F6F2" }}
                      >
                        {tag.text}
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 100 }}
                style={{ y: floatingY3 }}
                className="absolute -left-12 bottom-16 z-30"
              >
                <motion.div
                  animate={{ 
                    y: [0, 8, 0],
                    rotate: [0, -3, 0]
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  whileHover={{ scale: 1.1, rotate: -8 }}
                  className="group relative cursor-pointer"
                >
                  <div className="relative rounded-2xl border border-[#395B64]/60 bg-[#2C3333]/95 px-4 py-3 backdrop-blur-xl shadow-xl overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#A5C9CA]/0 via-[#A5C9CA]/10 to-[#A5C9CA]/0"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative flex items-center gap-3">
                      <motion.div 
                        className="text-2xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        🇦🇪
                      </motion.div>
                      <div>
                        <div className="text-[9px] text-[#A5C9CA]/60 uppercase tracking-widest font-medium">Based in</div>
                        <div className="text-base font-bold text-[#E7F6F2] group-hover:text-[#A5C9CA] transition-colors">Dubai</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.8, type: "spring", stiffness: 100 }}
                style={{ y: floatingY2 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30"
              >
                <Link href="/contact">
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative cursor-pointer"
                  >
                    <motion.div
                      className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#A5C9CA] via-[#395B64] to-[#A5C9CA] opacity-50 blur-sm"
                      animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ backgroundSize: "200% 200%" }}
                    />
                    <div className="relative flex items-center gap-3 rounded-2xl border border-[#A5C9CA]/30 bg-[#2C3333] px-5 py-3 backdrop-blur-xl">
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
                      >
                        <MessageCircle className="h-5 w-5 text-[#A5C9CA] group-hover:text-[#E7F6F2] transition-colors" />
                      </motion.div>
                      <span className="text-sm font-bold text-[#E7F6F2] group-hover:text-[#A5C9CA] transition-colors">Let&apos;s Connect</span>
                      <ArrowRight className="h-4 w-4 text-[#A5C9CA] transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: useTransform(smoothProgress, [0, 0.3], [1, 0]) }}
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
      </div>
    </section>
  )
}
