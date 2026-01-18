"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
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

interface CreativeImageCardProps {
  onHoverChange?: (isHovered: boolean) => void
}

export function CreativeImageCard({ onHoverChange }: CreativeImageCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const cardRotateX = useMotionValue(0)
  const cardRotateY = useMotionValue(0)
  const smoothRotateX = useSpring(cardRotateX, { stiffness: 100, damping: 20 })
  const smoothRotateY = useSpring(cardRotateY, { stiffness: 100, damping: 20 })

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHoverChange?.(true)
  }

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
    onHoverChange?.(false)
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
      onMouseEnter={handleMouseEnter}
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
