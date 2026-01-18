"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Briefcase, Users, Clock } from "lucide-react"
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

const defaultGradient = {
  color1: "rgba(0, 173, 181, 0.08)",
  color2: "rgba(57, 62, 70, 0.15)",
  angle: 135,
}

const hoverGradient = {
  color1: "rgba(0, 173, 181, 0.18)",
  color2: "rgba(74, 222, 128, 0.12)",
  angle: 145,
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [cardPosition, setCardPosition] = useState<"left" | "center" | "right">("center")
  
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

  const ambientGlowOpacity = useSpring(0, { stiffness: 30, damping: 25 })
  const ambientGlowScale = useSpring(0.8, { stiffness: 25, damping: 20 })
  const noiseOpacity = useSpring(0.03, { stiffness: 20, damping: 25 })
  const gradientAngle = useSpring(defaultGradient.angle, { stiffness: 20, damping: 30 })

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

  const updateCardPosition = useCallback(() => {
    if (!cardContainerRef.current) return
    const rect = cardContainerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const screenWidth = window.innerWidth
    
    if (centerX < screenWidth * 0.33) {
      setCardPosition("left")
    } else if (centerX > screenWidth * 0.66) {
      setCardPosition("right")
    } else {
      setCardPosition("center")
    }
  }, [])

  useEffect(() => {
    updateCardPosition()
    window.addEventListener("resize", updateCardPosition)
    return () => window.removeEventListener("resize", updateCardPosition)
  }, [updateCardPosition])

  useEffect(() => {
    if (isCardHovered) {
      ambientGlowOpacity.set(1)
      ambientGlowScale.set(1.2)
      noiseOpacity.set(0.06)
      
      const angleOffset = cardPosition === "left" ? -15 : cardPosition === "right" ? 15 : 0
      gradientAngle.set(hoverGradient.angle + angleOffset)
    } else {
      ambientGlowOpacity.set(0)
      ambientGlowScale.set(0.8)
      noiseOpacity.set(0.03)
      gradientAngle.set(defaultGradient.angle)
    }
  }, [isCardHovered, cardPosition, ambientGlowOpacity, ambientGlowScale, noiseOpacity, gradientAngle])

  return (
    <section
      ref={containerRef}
      className="relative h-[120vh] overflow-hidden bg-[#222831]"
    >
      <motion.div 
        className="absolute inset-0 dot-background"
        style={{ y: bgY }}
      />
      
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: noiseOpacity }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="heroNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroNoise)" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none transition-all"
        style={{
          background: useTransform(
            gradientAngle,
            (angle) => `linear-gradient(${angle}deg, ${isCardHovered ? hoverGradient.color1 : defaultGradient.color1} 0%, transparent 50%, ${isCardHovered ? hoverGradient.color2 : defaultGradient.color2} 100%)`
          ),
        }}
        animate={{
          opacity: isCardHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      <AnimatePresence>
        {isCardHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1],
              exit: { duration: 1, ease: [0.16, 1, 0.3, 1] }
            }}
            className="absolute pointer-events-none"
            style={{
              right: "15%",
              top: "50%",
              transform: "translate(50%, -50%)",
              width: "800px",
              height: "800px",
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(0, 173, 181, 0.15) 0%, rgba(0, 173, 181, 0.05) 40%, transparent 70%)",
                scale: ambientGlowScale,
                opacity: ambientGlowOpacity,
              }}
            />
            <motion.div
              className="absolute inset-[15%] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(74, 222, 128, 0.1) 0%, transparent 60%)",
                filter: "blur(40px)",
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: isCardHovered 
            ? "radial-gradient(ellipse at 70% 50%, rgba(0, 173, 181, 0.08) 0%, transparent 50%)"
            : "radial-gradient(ellipse at 70% 50%, rgba(0, 173, 181, 0) 0%, transparent 50%)",
        }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
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
          animate={{
            backgroundColor: isCardHovered ? "rgba(0, 173, 181, 0.15)" : "rgba(57, 62, 70, 0.2)",
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full blur-[80px]"
          animate={{
            backgroundColor: isCardHovered ? "rgba(74, 222, 128, 0.12)" : "rgba(0, 173, 181, 0.1)",
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
            ref={cardContainerRef}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ y: imageY }}
            className="relative flex items-center justify-center flex-shrink-0 lg:mr-8"
          >
            <AnimatePresence>
              {isCardHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.16, 1, 0.3, 1],
                    exit: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  }}
                  className="absolute inset-0 -z-10"
                  style={{
                    width: "150%",
                    height: "150%",
                    left: "-25%",
                    top: "-25%",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(0, 173, 181, 0.2) 0%, rgba(0, 173, 181, 0.08) 30%, transparent 60%)",
                      filter: "blur(30px)",
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

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
