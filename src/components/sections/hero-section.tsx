"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Briefcase, Users, Clock } from "lucide-react"
import RotatingText from "@/components/ui/rotating-text"
import { CreativeImageCard } from "@/components/ui/creative-image-card"

interface HeroData {
  tagline: string
  highlight_text: string
  description: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  rotating_texts: string[]
}

interface SiteSettings {
  years_experience: number
  projects_completed: number
  happy_clients: number
  profile_image?: string
  hero_tags?: { icon: string; text: string; color: string }[]
  location?: string
}

interface HeroSectionProps {
  heroData?: HeroData | null
  siteSettings?: SiteSettings | null
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

export function HeroSection({ heroData, siteSettings }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [cardPosition, setCardPosition] = useState<"left" | "center" | "right">("center")

  const tagline = heroData?.tagline || "Crafting Digital Experiences"
  const highlightText = heroData?.highlight_text || "Digital"
  const description = heroData?.description || "Full-stack developer based in Dubai, turning complex problems into elegant solutions. Let's build something extraordinary together."
  const primaryButtonText = heroData?.primary_button_text || "View My Work"
  const primaryButtonLink = heroData?.primary_button_link || "/projects"
  const secondaryButtonText = heroData?.secondary_button_text || "Get in Touch"
  const secondaryButtonLink = heroData?.secondary_button_link || "/contact"
  const rotatingTexts = heroData?.rotating_texts?.length ? heroData.rotating_texts : ['Full-Stack Web Developer', 'Creative UI/UX Designer', 'Software Engineer']

  const stats = [
    { icon: Clock, value: `${siteSettings?.years_experience || 5}+`, label: "Years Experience" },
    { icon: Briefcase, value: `${siteSettings?.projects_completed || 50}+`, label: "Projects Completed" },
    { icon: Users, value: `${siteSettings?.happy_clients || 30}+`, label: "Happy Clients" },
  ]

  const taglineParts = tagline.split(highlightText)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Use raw scrollYProgress - no spring wrapper for instant parallax response
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"])
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.8, 0])

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 1.3])
  const circleOpacity = useTransform(scrollYProgress, [0, 0.5], [0.2, 0])

  const floatingY1 = useTransform(scrollYProgress, [0, 1], [0, 40])
  const floatingY2 = useTransform(scrollYProgress, [0, 1], [0, -60])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  // High stiffness = snappy, instant-feeling mouse tracking
  const smoothX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.2 })
  const smoothY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.2 })

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
        className="absolute inset-0 pointer-events-none transition-all duration-200"
        style={{
          background: isCardHovered
            ? `linear-gradient(${hoverGradient.angle}deg, ${hoverGradient.color1} 0%, transparent 50%, ${hoverGradient.color2} 100%)`
            : `linear-gradient(${defaultGradient.angle}deg, ${defaultGradient.color1} 0%, transparent 50%, ${defaultGradient.color2} 100%)`,
          opacity: isCardHovered ? 1 : 0.5,
        }}
      />

      <AnimatePresence>
        {isCardHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute pointer-events-none"
            style={{
              right: "15%",
              top: "50%",
              transform: "translate(50%, -50%)",
              width: "600px",
              height: "600px",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(0, 173, 181, 0.12) 0%, rgba(0, 173, 181, 0.04) 40%, transparent 70%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: isCardHovered
            ? "radial-gradient(ellipse at 70% 50%, rgba(0, 173, 181, 0.08) 0%, transparent 50%)"
            : "none",
        }}
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
          style={{ opacity }}
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col lg:flex-row lg:items-center lg:justify-between px-6 pt-24 pb-8 gap-6"
        >
          <motion.div
            style={{ y: textY }}
            className="flex flex-col justify-center lg:max-w-lg flex-shrink-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="mb-4"
            >
              <div className="group relative inline-flex items-center gap-3 rounded-full border border-[#393E46] bg-[#393E46]/20 px-5 py-2.5 overflow-hidden cursor-pointer hover:border-[#00ADB5]/50 transition-colors">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#00ADB5]/0 via-[#00ADB5]/10 to-[#00ADB5]/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ADB5] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ADB5]" />
                </span>
                <div className="relative flex items-center">
                  <RotatingText
                    texts={rotatingTexts}
                    mainClassName="overflow-hidden justify-center text-sm font-medium text-[#EEEEEE]"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.02}
                    splitLevelClassName="overflow-hidden pb-0.5"
                    transition={{ type: "spring", damping: 25, stiffness: 500, mass: 0.5 }}
                    rotationInterval={2000}
                  />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.08 }}
              className="text-3xl font-bold leading-[1.1] tracking-tight text-[#EEEEEE] sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {taglineParts[0]}
              {highlightText && (
                <span className="relative mx-2 inline-block">
                  <span className="gradient-text">{highlightText}</span>
                  <motion.span
                    animate={{ width: ["0%", "100%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r from-[#00ADB5] to-[#EEEEEE]"
                  />
                </span>
              )}
              {taglineParts[1] && (
                <>
                  <br />
                  {taglineParts[1]}
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="mt-4 max-w-md text-sm text-[#00ADB5]/80 md:text-base leading-relaxed"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Link href={primaryButtonLink}>
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
                  {primaryButtonText}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
              <Link href={secondaryButtonLink}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl border-2 border-[#393E46] bg-transparent px-5 py-3 text-sm font-semibold text-[#EEEEEE] transition-all hover:border-[#00ADB5] hover:bg-[#393E46]/20"
                >
                  {secondaryButtonText}
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.25 }}
              className="mt-8 -mx-6 px-6 sm:mx-0 sm:px-0"
            >
              <div className="flex gap-3 overflow-x-auto pb-2 sm:overflow-visible scrollbar-hide">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.04, duration: 0.2 }}
                    className="group relative flex-shrink-0 w-[45%] sm:flex-1 sm:w-auto"
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
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            ref={cardContainerRef}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
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
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
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
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <CreativeImageCard
              onHoverChange={setIsCardHovered}
              profileImage={siteSettings?.profile_image}
              heroTags={siteSettings?.hero_tags}
              location={siteSettings?.location}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
          className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
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
