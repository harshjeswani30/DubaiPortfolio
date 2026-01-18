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

const neuronPathsData = [
  { d: "M 0 0 L -120 -80 L -200 -60 L -280 -100", branches: [{ from: [-120, -80], to: [-150, -140] }, { from: [-200, -60], to: [-240, -20] }] },
  { d: "M 0 0 L -80 -140 L -60 -240 L -100 -340", branches: [{ from: [-80, -140], to: [-140, -160] }, { from: [-60, -240], to: [-20, -280] }] },
  { d: "M 0 0 L -140 -40 L -260 -30 L -380 -60", branches: [{ from: [-140, -40], to: [-160, -100] }, { from: [-260, -30], to: [-280, 40] }] },
  { d: "M 0 0 L -100 60 L -180 140 L -280 200", branches: [{ from: [-100, 60], to: [-140, 20] }, { from: [-180, 140], to: [-220, 100] }] },
  { d: "M 0 0 L -60 120 L -40 220 L -80 320", branches: [{ from: [-60, 120], to: [-120, 140] }, { from: [-40, 220], to: [20, 260] }] },
  { d: "M 0 0 L 120 -100 L 220 -160 L 340 -200", branches: [{ from: [120, -100], to: [140, -160] }, { from: [220, -160], to: [260, -100] }] },
  { d: "M 0 0 L 80 -160 L 120 -280 L 100 -400", branches: [{ from: [80, -160], to: [140, -180] }, { from: [120, -280], to: [60, -320] }] },
  { d: "M 0 0 L 160 -40 L 280 -20 L 400 -60", branches: [{ from: [160, -40], to: [180, -100] }, { from: [280, -20], to: [300, 50] }] },
  { d: "M 0 0 L 100 80 L 200 140 L 320 180", branches: [{ from: [100, 80], to: [120, 20] }, { from: [200, 140], to: [240, 80] }] },
  { d: "M 0 0 L 60 140 L 100 260 L 80 380", branches: [{ from: [60, 140], to: [120, 160] }, { from: [100, 260], to: [40, 300] }] },
  { d: "M 0 0 L -40 -160 L 20 -280 L -20 -400", branches: [{ from: [-40, -160], to: [-100, -180] }, { from: [20, -280], to: [80, -300] }] },
  { d: "M 0 0 L 40 160 L -20 280 L 40 400", branches: [{ from: [40, 160], to: [100, 180] }, { from: [-20, 280], to: [-80, 300] }] },
]

const synapseNodesData = [
  { cx: -280, cy: -100, size: 6 },
  { cx: -100, cy: -340, size: 5 },
  { cx: -380, cy: -60, size: 7 },
  { cx: -280, cy: 200, size: 6 },
  { cx: -80, cy: 320, size: 5 },
  { cx: 340, cy: -200, size: 6 },
  { cx: 100, cy: -400, size: 5 },
  { cx: 400, cy: -60, size: 7 },
  { cx: 320, cy: 180, size: 6 },
  { cx: 80, cy: 380, size: 5 },
  { cx: -20, cy: -400, size: 6 },
  { cx: 40, cy: 400, size: 6 },
  { cx: -150, cy: -140, size: 4 },
  { cx: -140, cy: -160, size: 4 },
  { cx: -160, cy: -100, size: 4 },
  { cx: 140, cy: -160, size: 4 },
  { cx: 140, cy: -180, size: 4 },
  { cx: 180, cy: -100, size: 4 },
  { cx: -120, cy: 140, size: 4 },
  { cx: 120, cy: 160, size: 4 },
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

    const axonPaths = svgRef.current.querySelectorAll(".axon-path")
    const branchPaths = svgRef.current.querySelectorAll(".branch-path")
    const synapseNodes = svgRef.current.querySelectorAll(".synapse-node")
    const pulseCircles = svgRef.current.querySelectorAll(".pulse-circle")

    axonPaths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      })
    })

    branchPaths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      })
    })

    synapseNodes.forEach((node) => {
      gsap.set(node, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      })
    })

    pulseCircles.forEach((circle) => {
      gsap.set(circle, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      })
    })

    timelineRef.current
      .to(axonPaths, {
        opacity: 1,
        duration: 0.05,
        stagger: 0.015,
      })
      .to(
        axonPaths,
        {
          strokeDashoffset: 0,
          duration: 0.35,
          stagger: 0.02,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        branchPaths,
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 0.25,
          stagger: 0.01,
          ease: "power2.out",
        },
        "-=0.15"
      )
      .to(
        synapseNodes,
        {
          scale: 1,
          opacity: 1,
          duration: 0.2,
          stagger: 0.01,
          ease: "back.out(2)",
        },
        "-=0.15"
      )
      .to(
        pulseCircles,
        {
          scale: 1.5,
          opacity: 0.6,
          duration: 0.3,
          stagger: 0.02,
          ease: "power1.out",
        },
        "-=0.1"
      )

    return () => {
      timelineRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (isCardHovered) {
      timelineRef.current?.timeScale(1).play()
    } else {
      timelineRef.current?.timeScale(1.5).reverse()
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
