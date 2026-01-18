"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Briefcase, Users, Clock } from "lucide-react"
import gsap from "gsap"
import RotatingText from "@/components/ui/rotating-text"
import { CreativeImageCard } from "@/components/ui/creative-image-card"

const stats = [
  { icon: Clock, value: "5+", label: "Years Experience" },
  { icon: Briefcase, value: "50+", label: "Projects Completed" },
  { icon: Users, value: "30+", label: "Happy Clients" },
]

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

const vinePathsData = [
  { d: "M 0 0 Q -80 -40 -150 -100 Q -200 -150 -280 -180 Q -350 -200 -450 -220", origin: "right" },
  { d: "M 0 0 Q -60 -80 -100 -160 Q -130 -220 -180 -300 Q -220 -360 -260 -420", origin: "right" },
  { d: "M 0 0 Q -100 -20 -180 -60 Q -250 -90 -350 -100 Q -420 -110 -520 -80", origin: "right" },
  { d: "M 0 0 Q -40 60 -80 120 Q -120 180 -180 250 Q -230 300 -300 380", origin: "right" },
  { d: "M 0 0 Q -90 40 -160 100 Q -220 150 -300 200 Q -360 240 -450 260", origin: "right" },
  { d: "M 0 0 Q 80 -60 150 -120 Q 200 -170 280 -240 Q 340 -290 420 -340", origin: "left" },
  { d: "M 0 0 Q 60 -100 100 -180 Q 140 -250 200 -340 Q 250 -400 300 -480", origin: "left" },
  { d: "M 0 0 Q 100 -30 180 -80 Q 250 -120 350 -150 Q 420 -170 520 -160", origin: "left" },
  { d: "M 0 0 Q 50 80 100 160 Q 150 230 220 320 Q 280 390 350 480", origin: "left" },
  { d: "M 0 0 Q 90 50 170 120 Q 240 180 330 250 Q 400 300 500 340", origin: "left" },
  { d: "M 0 0 Q -30 -100 -50 -200 Q -60 -280 -40 -380 Q -20 -450 20 -520", origin: "top" },
  { d: "M 0 0 Q 40 -90 80 -180 Q 110 -250 120 -350 Q 130 -420 100 -500", origin: "top" },
  { d: "M 0 0 Q -20 100 -60 200 Q -100 280 -120 380 Q -130 450 -100 540", origin: "bottom" },
  { d: "M 0 0 Q 30 120 80 220 Q 120 300 140 400 Q 150 470 120 560", origin: "bottom" },
]

const leafPathsData = [
  { cx: -280, cy: -180, origin: "right" },
  { cx: -180, cy: -300, origin: "right" },
  { cx: -350, cy: -100, origin: "right" },
  { cx: -180, cy: 250, origin: "right" },
  { cx: -300, cy: 200, origin: "right" },
  { cx: 280, cy: -240, origin: "left" },
  { cx: 200, cy: -340, origin: "left" },
  { cx: 350, cy: -150, origin: "left" },
  { cx: 220, cy: 320, origin: "left" },
  { cx: 330, cy: 250, origin: "left" },
  { cx: -40, cy: -380, origin: "top" },
  { cx: 120, cy: -350, origin: "top" },
  { cx: -120, cy: 380, origin: "bottom" },
  { cx: 140, cy: 400, origin: "bottom" },
]

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const textY = useTransform(smoothProgress, [0, 1], ["0%", "50%"])
  const imageY = useTransform(smoothProgress, [0, 1], ["0%", "-30%"])
  const opacity = useTransform(smoothProgress, [0, 0.4, 0.6], [1, 0.8, 0])
  const blur = useTransform(smoothProgress, [0, 0.5], [0, 10])
  
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "30%"])
  const circleScale = useTransform(smoothProgress, [0, 1], [1, 1.5])
  const circleOpacity = useTransform(smoothProgress, [0, 0.5], [0.2, 0])
  
  const floatingY1 = useParallax(smoothProgress, 100)
  const floatingY2 = useParallax(smoothProgress, 150)
  
  const statsY = useTransform(smoothProgress, [0, 1], ["0%", "80%"])
  const statsScale = useTransform(smoothProgress, [0, 0.5], [1, 0.9])

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

  useEffect(() => {
    if (!svgRef.current) return

    timelineRef.current = gsap.timeline({ paused: true })

    const vinePaths = svgRef.current.querySelectorAll(".vine-path")
    const leafPaths = svgRef.current.querySelectorAll(".leaf-shape")

    vinePaths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      })
    })

    leafPaths.forEach((leaf) => {
      gsap.set(leaf, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      })
    })

    timelineRef.current
      .to(vinePaths, {
        opacity: 1,
        duration: 0.1,
        stagger: 0.03,
      })
      .to(
        vinePaths,
        {
          strokeDashoffset: 0,
          duration: 1.2,
          stagger: 0.06,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        leafPaths,
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: "back.out(2)",
        },
        "-=0.6"
      )

    return () => {
      timelineRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (isCardHovered) {
      timelineRef.current?.play()
    } else {
      timelineRef.current?.reverse()
    }
  }, [isCardHovered])

  return (
    <section
      ref={containerRef}
      className="relative h-[120vh] overflow-hidden bg-[#222831]"
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
          <div className="absolute inset-0 rounded-full border border-[#393E46]/20" />
          <div className="absolute inset-[100px] rounded-full border border-[#00ADB5]/10" />
          <div className="absolute inset-[200px] rounded-full border border-[#EEEEEE]/5" />
        </motion.div>
        
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[#393E46]/20 blur-[100px]"
        />
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[#00ADB5]/10 blur-[80px]"
        />

        <motion.div
          style={{ y: bgY, opacity: circleOpacity }}
          className="absolute left-10 top-1/4 h-2 w-2 rounded-full bg-[#00ADB5]"
        />
        <motion.div
          style={{ y: floatingY1 }}
          className="absolute right-1/4 top-1/3 h-3 w-3 rounded-full bg-[#393E46]"
        />
        <motion.div
          style={{ y: floatingY2 }}
          className="absolute left-1/3 bottom-1/4 h-1.5 w-1.5 rounded-full bg-[#EEEEEE]/50"
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
              <div className="group relative inline-flex items-center gap-3 rounded-full border border-[#393E46] bg-[#393E46]/20 px-5 py-2.5 overflow-hidden cursor-pointer hover:border-[#00ADB5]/50 transition-colors">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#00ADB5]/0 via-[#00ADB5]/10 to-[#00ADB5]/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ADB5] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ADB5]" />
                </span>
                <div className="relative flex items-center">
                  <RotatingText
                    texts={['Full-Stack Web Developer', 'Creative UI/UX Designer', 'Software Engineer']}
                    mainClassName="overflow-hidden justify-center text-sm font-medium text-[#EEEEEE]"
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
              className="text-3xl font-bold leading-[1.1] tracking-tight text-[#EEEEEE] sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Crafting
              <span className="relative mx-2 inline-block">
                <span className="gradient-text">Digital</span>
                <motion.span
                  animate={{ width: ["0%", "100%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE]"
                />
              </span>
              <br />
              Experiences
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 max-w-md text-sm text-[#00ADB5]/80 md:text-base leading-relaxed"
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
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-[#00ADB5] px-5 py-3 text-sm font-semibold text-[#222831] transition-all"
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
                  className="rounded-xl border-2 border-[#393E46] bg-transparent px-5 py-3 text-sm font-semibold text-[#EEEEEE] transition-all hover:border-[#00ADB5] hover:bg-[#393E46]/20"
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
                    className="flex items-center gap-2 rounded-xl border border-[#393E46]/50 bg-[#393E46]/20 px-3 py-2.5 backdrop-blur-sm transition-all hover:border-[#00ADB5]/50 hover:bg-[#393E46]/30"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#393E46]">
                      <stat.icon className="h-4 w-4 text-[#00ADB5]" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[#EEEEEE]">{stat.value}</div>
                      <div className="text-[10px] text-[#00ADB5]/60 whitespace-nowrap">{stat.label}</div>
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
            className="relative flex items-center justify-center flex-shrink-0 lg:mr-8"
          >
            <svg
              ref={svgRef}
              className="absolute z-0 pointer-events-none"
              style={{
                width: "200%",
                height: "200%",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                overflow: "visible",
              }}
              viewBox="-600 -600 1200 1200"
              fill="none"
            >
              <defs>
                <linearGradient id="heroVineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ADB5" />
                  <stop offset="50%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <linearGradient id="heroLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <filter id="heroGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {vinePathsData.map((vine, i) => (
                <path
                  key={`vine-${i}`}
                  className="vine-path"
                  d={vine.d}
                  stroke="url(#heroVineGradient)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#heroGlow)"
                />
              ))}

              {leafPathsData.map((leaf, i) => (
                <g key={`leaf-${i}`} className="leaf-shape">
                  <ellipse
                    cx={leaf.cx}
                    cy={leaf.cy}
                    rx="12"
                    ry="6"
                    fill="url(#heroLeafGradient)"
                    filter="url(#heroGlow)"
                    transform={`rotate(${Math.random() * 90 - 45} ${leaf.cx} ${leaf.cy})`}
                  />
                  <ellipse
                    cx={leaf.cx + (Math.random() > 0.5 ? 15 : -15)}
                    cy={leaf.cy + (Math.random() > 0.5 ? 10 : -10)}
                    rx="8"
                    ry="4"
                    fill="url(#heroLeafGradient)"
                    filter="url(#heroGlow)"
                    opacity="0.7"
                    transform={`rotate(${Math.random() * 90 - 45} ${leaf.cx + 15} ${leaf.cy + 10})`}
                  />
                </g>
              ))}
            </svg>

            <CreativeImageCard onHoverChange={setIsCardHovered} />
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
            <span className="text-[10px] text-[#00ADB5]/60">Scroll</span>
            <div className="h-8 w-4 rounded-full border border-[#393E46] p-0.5">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-[#00ADB5]"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
