"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ArrowDown } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row lg:items-center lg:justify-between px-6 py-20 lg:py-0">
        <motion.div 
          style={{ y }}
          className="flex flex-col justify-center lg:max-w-xl pt-20 lg:pt-0"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-block rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
              Full-Stack Developer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            I build
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              digital products
            </span>
            that people love
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 max-w-md text-base text-zinc-400 md:text-lg"
          >
            Crafting seamless web experiences with modern technologies. 
            From concept to deployment, I bring ideas to life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
              >
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-zinc-700 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
              >
                Let&apos;s Talk
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 flex items-center gap-8"
          >
            <div>
              <div className="text-2xl font-bold text-white">5+</div>
              <div className="text-xs text-zinc-500">Years Experience</div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-xs text-zinc-500">Projects Completed</div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <div className="text-2xl font-bold text-white">30+</div>
              <div className="text-xs text-zinc-500">Happy Clients</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ scale: imageScale }}
          className="relative mt-12 lg:mt-0 lg:ml-8"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
            
            <div className="relative h-[400px] w-[320px] sm:h-[500px] sm:w-[400px] lg:h-[550px] lg:w-[440px] overflow-hidden"
              style={{
                clipPath: "url(#leaf-mask)",
                WebkitClipPath: "url(#leaf-mask)"
              }}
            >
              <Image
                src="/owner.jpg"
                alt="Developer Portrait"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
            </div>

            <svg className="absolute h-0 w-0">
              <defs>
                <clipPath id="leaf-mask" clipPathUnits="objectBoundingBox">
                  <path d="M0.5,0 C0.75,0 0.95,0.15 0.98,0.35 C1,0.5 0.95,0.7 0.85,0.85 C0.7,1 0.5,1 0.5,1 C0.5,1 0.3,1 0.15,0.85 C0.05,0.7 0,0.5 0.02,0.35 C0.05,0.15 0.25,0 0.5,0" />
                </clipPath>
              </defs>
            </svg>

            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 top-10 rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-zinc-300">Available for work</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-4 bottom-20 rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🚀</span>
                <span className="text-xs text-zinc-300">Based in Dubai</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <ArrowDown className="h-5 w-5 text-zinc-600" />
        </motion.div>
      </motion.div>
    </section>
  )
}
