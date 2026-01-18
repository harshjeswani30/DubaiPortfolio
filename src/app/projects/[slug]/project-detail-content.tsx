"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Layers, Code2, Sparkles, Eye, ArrowUpRight } from "lucide-react"
import { usePageTransition } from "@/components/providers/page-transition-provider"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  tech_stack: string[]
  category: string
  featured_image?: string
  images?: string[]
  live_url?: string
  github_url?: string
  created_at?: string
}

export function ProjectDetailContent({ project }: { project: Project }) {
  const { completeTransition, isTransitioning } = usePageTransition()
  const router = useRouter()
  const [isRevealed, setIsRevealed] = useState(false)
  const [backUrl, setBackUrl] = useState("/projects")
  const [backLabel, setBackLabel] = useState("Back to Projects")
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" })
  const hasInitialized = useRef(false)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(smoothProgress, [0, 0.5], [0, 50])
  const imageScale = useTransform(smoothProgress, [0, 0.5], [1, 1.1])

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const source = sessionStorage.getItem('projectSource')
    if (source === 'home') {
      setBackUrl('/#projects')
      setBackLabel('Back to Home')
    }
    
    const delay = isTransitioning ? 300 : 50
    const timer = setTimeout(() => {
      setIsRevealed(true)
      completeTransition()
    }, delay)
    return () => clearTimeout(timer)
  }, [completeTransition, isTransitioning])

  const handleBack = () => {
    sessionStorage.removeItem('projectSource')
    router.push(backUrl)
  }

  const titleWords = project.title.split(" ")

  return (
    <div className="min-h-screen bg-[#222831] overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealed ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <section ref={heroRef} className="relative min-h-[100vh] overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            style={{ scale: imageScale }}
          >
            {project.featured_image ? (
              <Image
                src={project.featured_image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#393E46]/30 via-[#2a2f38] to-[#222831]">
                <motion.div
                  className="absolute inset-0"
                  animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                  style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(0, 173, 181, 0.08) 0%, transparent 50%)',
                    backgroundSize: '100% 100%'
                  }}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/80 to-[#222831]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#222831]/60 via-transparent to-[#222831]/60" />
          </motion.div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-[10%]"
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Layers className="h-8 w-8 text-[#00ADB5]/10" />
            </motion.div>
            <motion.div
              className="absolute top-1/3 right-[15%]"
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Code2 className="h-10 w-10 text-[#EEEEEE]/5" />
            </motion.div>
            <motion.div
              className="absolute bottom-1/3 left-[20%]"
              animate={{ y: [0, 12, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <Sparkles className="h-6 w-6 text-[#00ADB5]/15" />
            </motion.div>
          </div>

          <motion.div 
            className="relative z-10 flex min-h-[100vh] flex-col justify-end px-6 pb-20 pt-32 lg:px-12"
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
            <div className="mx-auto w-full max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={handleBack}
                  className="group mb-10 inline-flex items-center gap-3 text-sm text-[#EEEEEE]/60 transition-all hover:text-[#00ADB5]"
                >
                  <motion.div
                    whileHover={{ x: -4 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#393E46]/60 bg-[#222831]/50 backdrop-blur-sm transition-all group-hover:border-[#00ADB5]/50 group-hover:bg-[#00ADB5]/10"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </motion.div>
                  <span className="font-medium tracking-wide">{backLabel}</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isRevealed ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-5 py-2.5 backdrop-blur-sm"
              >
                <motion.span
                  className="h-2.5 w-2.5 rounded-full bg-[#00ADB5]"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-semibold text-[#00ADB5] uppercase tracking-widest">{project.category}</span>
              </motion.div>

              <div className="overflow-hidden">
                <h1 className="text-5xl font-bold text-[#EEEEEE] md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] tracking-tight">
                  {titleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-4 md:mr-6"
                      initial={{ y: 120, opacity: 0 }}
                      animate={isRevealed ? { y: 0, opacity: 1 } : {}}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>
              </div>

              <motion.p
                className="mt-8 max-w-2xl text-lg text-[#EEEEEE]/55 leading-relaxed md:text-xl"
                initial={{ opacity: 0, y: 25 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {project.description}
              </motion.p>

              <motion.div
                className="mt-10 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 25 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {project.live_url && (
                  <motion.a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/90 px-8 py-4 font-semibold text-[#222831] shadow-xl shadow-[#00ADB5]/20 transition-all hover:shadow-2xl hover:shadow-[#00ADB5]/30"
                  >
                    <Eye className="h-5 w-5" />
                    <span>View Live Project</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </motion.div>
                  </motion.a>
                )}
                {project.github_url && (
                  <motion.a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-3 rounded-2xl border border-[#393E46]/60 bg-[#222831]/60 px-8 py-4 font-semibold text-[#EEEEEE] backdrop-blur-sm transition-all hover:border-[#00ADB5]/50 hover:bg-[#393E46]/40"
                  >
                    <Github className="h-5 w-5" />
                    <span>View Source Code</span>
                  </motion.a>
                )}
              </motion.div>

              <motion.div
                className="mt-16 h-px w-full max-w-md bg-gradient-to-r from-[#00ADB5] via-[#00ADB5]/40 to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={isRevealed ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-[#EEEEEE]/40 uppercase tracking-widest">Scroll</span>
              <div className="h-10 w-6 rounded-full border border-[#393E46]/60 p-1.5">
                <motion.div
                  className="h-2 w-full rounded-full bg-[#00ADB5]"
                  animate={{ y: [0, 14, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section ref={contentRef} className="relative bg-[#222831] py-24 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#00ADB5]/5 to-transparent blur-[100px]" />
            <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[#393E46]/10 to-transparent blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#393E46] to-transparent" />
                <span className="text-xs text-[#00ADB5] uppercase tracking-widest font-semibold">Tech Stack</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#393E46] to-transparent" />
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {project.tech_stack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={isContentInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="rounded-xl border border-[#393E46]/50 bg-[#393E46]/20 px-5 py-2.5 text-sm font-medium text-[#EEEEEE]/80 backdrop-blur-sm transition-all hover:border-[#00ADB5]/40 hover:bg-[#00ADB5]/10 hover:text-[#00ADB5]"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {project.featured_image && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-20"
              >
                <div className="group relative overflow-hidden rounded-3xl border border-[#393E46]/40 bg-[#2a2f38]/50 p-2 shadow-2xl shadow-black/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00ADB5]/5 via-transparent to-[#393E46]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative aspect-video overflow-hidden rounded-2xl">
                    <Image
                      src={project.featured_image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {project.content && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-20"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#393E46] to-transparent" />
                  <span className="text-xs text-[#00ADB5] uppercase tracking-widest font-semibold">About This Project</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#393E46] to-transparent" />
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="prose prose-lg prose-invert max-w-none">
                    <p className="text-lg text-[#EEEEEE]/65 leading-relaxed">{project.content}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {project.images && project.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-20"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#393E46] to-transparent" />
                  <span className="text-xs text-[#00ADB5] uppercase tracking-widest font-semibold">Gallery</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#393E46] to-transparent" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {project.images.map((image, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group relative overflow-hidden rounded-2xl border border-[#393E46]/40 bg-[#2a2f38]/50 shadow-lg transition-all hover:border-[#00ADB5]/30 hover:shadow-xl hover:shadow-[#00ADB5]/5"
                    >
                      <div className="aspect-video">
                        <Image
                          src={image}
                          alt={`${project.title} screenshot ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex justify-center"
            >
              <motion.button
                onClick={handleBack}
                whileHover={{ scale: 1.03, x: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-4 rounded-2xl border border-[#393E46]/60 bg-[#2a2f38]/50 px-8 py-4 text-[#EEEEEE] backdrop-blur-sm transition-all hover:border-[#00ADB5]/50 hover:bg-[#393E46]/40"
              >
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                <span className="font-semibold">{backLabel}</span>
              </motion.button>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  )
}
