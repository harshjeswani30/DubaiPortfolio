"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    if (!textRef.current) return

    const chars = textRef.current.querySelectorAll(".char")
    gsap.fromTo(
      chars,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 1,
        ease: "power4.out",
        delay: 2,
      }
    )
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 grid-background" />
      
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-indigo-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-[120px]"
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-sm text-zinc-300">Available for freelance work</span>
        </motion.div>

        <div ref={textRef} className="overflow-hidden">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl">
            {"Full-Stack".split("").map((char, i) => (
              <span key={i} className="char inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <h1 className="mt-2 text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            {"Developer".split("").map((char, i) => (
              <span key={i} className="char inline-block gradient-text">
                {char}
              </span>
            ))}
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.6 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-zinc-400 md:text-xl"
        >
          Building digital experiences that matter. I craft modern, performant
          web applications with clean code and exceptional user experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/projects">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-black transition-all hover:bg-zinc-200"
            >
              View My Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
            >
              Get In Touch
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-zinc-500">
            Scroll to explore
          </span>
          <ChevronDown className="h-5 w-5 text-zinc-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}
