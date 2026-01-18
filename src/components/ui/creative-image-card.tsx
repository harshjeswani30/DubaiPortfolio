"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { Code2, Palette, Sparkles, MessageCircle, ArrowRight } from "lucide-react"

interface FloatingTag {
  icon: React.ElementType
  text: string
  color: string
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right"
}

const floatingTags: FloatingTag[] = [
  { icon: Code2, text: "React", color: "#61DAFB", position: "top-left" },
  { icon: Palette, text: "UI/UX", color: "#FF6B6B", position: "right" },
  { icon: Sparkles, text: "Creative", color: "#00ADB5", position: "bottom-left" },
]

export function CreativeImageCard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const pathsRef = useRef<SVGPathElement[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const cardRotateX = useMotionValue(0)
  const cardRotateY = useMotionValue(0)
  const smoothRotateX = useSpring(cardRotateX, { stiffness: 100, damping: 20 })
  const smoothRotateY = useSpring(cardRotateY, { stiffness: 100, damping: 20 })

  const vinePathsData = [
    "M 0 200 Q 50 180 80 140 Q 100 100 90 60 Q 85 30 100 0",
    "M 0 220 Q 40 200 60 160 Q 75 130 70 100 Q 65 70 80 40 Q 90 20 85 0",
    "M 0 180 Q 60 170 100 130 Q 130 100 120 60 Q 115 30 130 0",
    "M 400 200 Q 350 180 320 140 Q 300 100 310 60 Q 315 30 300 0",
    "M 400 220 Q 360 200 340 160 Q 325 130 330 100 Q 335 70 320 40 Q 310 20 315 0",
    "M 400 180 Q 340 170 300 130 Q 270 100 280 60 Q 285 30 270 0",
    "M 200 400 Q 180 350 160 300 Q 150 260 170 220 Q 185 180 175 140 Q 170 100 180 60",
    "M 220 400 Q 200 340 190 280 Q 185 230 200 180 Q 210 130 200 80",
    "M 180 400 Q 200 360 210 310 Q 215 270 195 230 Q 180 190 190 150",
    "M 200 0 Q 180 50 160 100 Q 150 140 170 180 Q 185 220 175 260 Q 170 300 180 340",
    "M 220 0 Q 200 60 190 120 Q 185 170 200 220 Q 210 270 200 320",
    "M 180 0 Q 200 40 210 90 Q 215 130 195 170 Q 180 210 190 250",
  ]

  const leafPathsData = [
    { path: "M 90 60 Q 70 50 60 35 Q 65 55 90 60", origin: "90 60" },
    { path: "M 100 100 Q 120 85 135 90 Q 115 100 100 100", origin: "100 100" },
    { path: "M 70 100 Q 50 80 40 85 Q 55 95 70 100", origin: "70 100" },
    { path: "M 310 60 Q 330 50 340 35 Q 335 55 310 60", origin: "310 60" },
    { path: "M 300 100 Q 280 85 265 90 Q 285 100 300 100", origin: "300 100" },
    { path: "M 330 100 Q 350 80 360 85 Q 345 95 330 100", origin: "330 100" },
    { path: "M 175 140 Q 155 130 145 115 Q 160 135 175 140", origin: "175 140" },
    { path: "M 200 180 Q 220 165 235 170 Q 215 180 200 180", origin: "200 180" },
    { path: "M 175 260 Q 155 270 145 285 Q 160 265 175 260", origin: "175 260" },
    { path: "M 200 220 Q 220 235 235 230 Q 215 220 200 220", origin: "200 220" },
  ]

  useEffect(() => {
    if (!svgRef.current) return

    timelineRef.current = gsap.timeline({ paused: true })

    const vinePaths = svgRef.current.querySelectorAll(".vine-path")
    const leafPaths = svgRef.current.querySelectorAll(".leaf-path")

    vinePaths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      })
    })

    leafPaths.forEach((path) => {
      gsap.set(path, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      })
    })

    timelineRef.current
      .to(vinePaths, {
        opacity: 1,
        duration: 0.1,
        stagger: 0.05,
      })
      .to(
        vinePaths,
        {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        leafPaths,
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(2)",
        },
        "-=0.4"
      )

    return () => {
      timelineRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (isHovered) {
      timelineRef.current?.play()
    } else {
      timelineRef.current?.reverse()
    }
  }, [isHovered])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    cardRotateX.set((y - centerY) / 15)
    cardRotateY.set((centerX - x) / 15)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    cardRotateX.set(0)
    cardRotateY.set(0)
  }

  const getTagPosition = (position: FloatingTag["position"]) => {
    switch (position) {
      case "top-left":
        return { top: "5%", left: "-15%" }
      case "top-right":
        return { top: "5%", right: "-15%" }
      case "bottom-left":
        return { bottom: "15%", left: "-15%" }
      case "bottom-right":
        return { bottom: "15%", right: "-15%" }
      case "left":
        return { top: "40%", left: "-18%" }
      case "right":
        return { top: "40%", right: "-18%" }
      default:
        return {}
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[420px] lg:w-[420px]">
          <svg
            ref={svgRef}
            className="absolute inset-0 z-20 h-full w-full pointer-events-none"
            viewBox="0 0 400 400"
            fill="none"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="vineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ADB5" />
                <stop offset="50%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {vinePathsData.map((d, i) => (
              <path
                key={`vine-${i}`}
                className="vine-path"
                d={d}
                stroke="url(#vineGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            ))}

            {leafPathsData.map((leaf, i) => (
              <path
                key={`leaf-${i}`}
                className="leaf-path"
                d={leaf.path}
                fill="url(#leafGradient)"
                filter="url(#glow)"
                style={{ transformOrigin: leaf.origin }}
              />
            ))}
          </svg>

          <motion.div
            className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-[#393E46]/50 bg-gradient-to-br from-[#393E46] to-[#222831] shadow-2xl"
            animate={{
              borderColor: isHovered ? "rgba(0, 173, 181, 0.5)" : "rgba(57, 62, 70, 0.5)",
              boxShadow: isHovered
                ? "0 25px 80px -12px rgba(0, 173, 181, 0.4), 0 0 60px -15px rgba(74, 222, 128, 0.3)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/owner.jpg"
              alt="Developer Portrait"
              fill
              className="object-cover transition-all duration-700"
              style={{
                transform: isHovered ? "scale(1.08)" : "scale(1)",
                filter: isHovered ? "brightness(1.1)" : "brightness(1)",
              }}
              priority
            />

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#222831] via-transparent to-transparent"
              animate={{ opacity: isHovered ? 0.3 : 0.6 }}
              transition={{ duration: 0.4 }}
            />

            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 70% 30%, rgba(0, 173, 181, 0.25) 0%, transparent 60%)",
              }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />

            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 173, 181, 0.2) 0%, transparent 50%, rgba(74, 222, 128, 0.15) 100%)",
              }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          <motion.div
            className="absolute -right-4 top-6 z-30"
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : 20,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.div
              animate={{
                y: isHovered ? [0, -6, 0] : 0,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl border border-green-400/40 bg-[#222831]/95 px-4 py-3 backdrop-blur-xl shadow-[0_0_40px_rgba(74,222,128,0.25)]"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]" />
                </span>
                <span className="text-sm font-bold tracking-wide text-green-300">AVAILABLE</span>
              </div>
            </motion.div>
          </motion.div>

          {floatingTags.map((tag, index) => (
            <motion.div
              key={tag.text}
              className="absolute z-30"
              style={getTagPosition(tag.position)}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.5,
                y: isHovered ? [0, index % 2 === 0 ? -8 : 8, 0] : 0,
              }}
              transition={{
                opacity: { duration: 0.3, delay: 0.15 + index * 0.1 },
                scale: { duration: 0.4, delay: 0.15 + index * 0.1, type: "spring" },
                y: { duration: 3 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="group relative cursor-pointer"
              >
                <motion.div
                  className="relative flex items-center gap-2 rounded-xl border bg-[#222831]/95 px-3 py-2 backdrop-blur-xl"
                  style={{ borderColor: `${tag.color}40` }}
                  whileHover={{
                    borderColor: tag.color,
                    boxShadow: `0 0 25px ${tag.color}40`,
                  }}
                >
                  <tag.icon className="h-4 w-4" style={{ color: tag.color }} />
                  <span className="text-xs font-semibold text-[#EEEEEE]">{tag.text}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}

          <motion.div
            className="absolute -left-4 bottom-24 z-30"
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -20,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.div
              animate={{
                y: isHovered ? [0, 6, 0] : 0,
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl border border-[#393E46]/60 bg-[#222831]/95 px-4 py-3 backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="text-2xl"
                  animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🇦🇪
                </motion.div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#00ADB5]/60">Based in</div>
                  <div className="text-base font-bold text-[#EEEEEE]">Dubai</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 left-1/2 z-30 -translate-x-1/2"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group relative cursor-pointer"
              >
                <motion.div
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00ADB5] via-[#4ade80] to-[#00ADB5] opacity-60 blur-sm"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                />
                <div className="relative flex items-center gap-3 rounded-2xl border border-[#00ADB5]/40 bg-[#222831] px-5 py-3 backdrop-blur-xl">
                  <MessageCircle className="h-5 w-5 text-[#00ADB5] transition-colors group-hover:text-[#EEEEEE]" />
                  <span className="text-sm font-bold text-[#EEEEEE] transition-colors group-hover:text-[#00ADB5]">
                    Let&apos;s Connect
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#00ADB5] transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
