"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Layers, Code2, Trophy, Eye, ArrowUpRight, Calendar, Clock, Zap, Target, CheckCircle2, X, ChevronLeft, ChevronRight, Quote, Briefcase, User, AlertCircle, Lightbulb, TrendingUp } from "lucide-react"
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
  duration?: string
  client?: string
  role?: string
  challenges?: string[]
  solutions?: string[]
  results?: string[]
  testimonial?: {
    quote: string
    author: string
    position: string
  }
}

function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-[120%] w-full">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: {
  images: string[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.button
        className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </motion.button>

      <motion.button
        className="absolute left-6 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        whileHover={{ scale: 1.1, x: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => { e.stopPropagation(); onPrev() }}
      >
        <ChevronLeft className="h-8 w-8" />
      </motion.button>

      <motion.button
        className="absolute right-6 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        whileHover={{ scale: 1.1, x: 4 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => { e.stopPropagation(); onNext() }}
      >
        <ChevronRight className="h-8 w-8" />
      </motion.button>

      <motion.div
        className="relative h-[80vh] w-[90vw] max-w-6xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="rounded-2xl object-contain"
        />
      </motion.div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${i === currentIndex ? 'bg-[#00ADB5] w-6' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </motion.div>
  )
}

function MagneticCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 400, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 400, damping: 30 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FloatingParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute h-1 w-1 rounded-full bg-[#00ADB5]/30"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -100],
        x: [0, Math.random() * 50 - 25],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
      style={{
        left: `${Math.random() * 100}%`,
        bottom: `${Math.random() * 30}%`,
      }}
    />
  )
}

export function ProjectDetailContent({ project }: { project: Project }) {
  const { completeTransition, startReverseTransition } = usePageTransition()
  const router = useRouter()
  const [isRevealed, setIsRevealed] = useState(true)
  const [backUrl, setBackUrl] = useState("/projects")
  const [backLabel, setBackLabel] = useState("Back to Projects")
  const [fromHome, setFromHome] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" })
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const isGalleryInView = useInView(galleryRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  // Raw scroll — no spring for instant parallax; remove blur-on-scroll (GPU expensive)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 25])
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08])

  useEffect(() => {
    const source = sessionStorage.getItem('projectSource')
    if (source === 'home') {
      setBackUrl('/#projects')
      setBackLabel('Back to Home')
      setFromHome(true)
    } else if (source === 'projects') {
      setBackUrl('/projects')
      setBackLabel('Back to Projects')
    }
    completeTransition()
  }, [completeTransition])

  const handleBack = () => {
    const source = sessionStorage.getItem('projectSource')
    sessionStorage.removeItem('projectSource')

    if (fromHome || source === 'home') {
      startReverseTransition('/')
    } else {
      router.back()
    }
  }

  const titleWords = project.title.split(" ")
  const allImages = project.images || []

  const projectFeatures = [
    { icon: <Zap className="h-5 w-5" />, label: "Lightning Fast", desc: "Optimized performance" },
    { icon: <Target className="h-5 w-5" />, label: "Pixel Perfect", desc: "Attention to detail" },
    { icon: <CheckCircle2 className="h-5 w-5" />, label: "Fully Tested", desc: "Production ready" },
  ]

  return (
    <div className="min-h-screen bg-[#222831] overflow-hidden pt-20">
      <AnimatePresence>
        {lightboxIndex !== null && allImages.length > 0 && (
          <Lightbox
            images={allImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNext={() => setLightboxIndex((prev) => prev !== null ? (prev + 1) % allImages.length : 0)}
            onPrev={() => setLightboxIndex((prev) => prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealed ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <section ref={heroRef} className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/80 to-[#222831]/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#222831]/60 via-transparent to-[#222831]/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_0%,#222831_70%)]" />
          </motion.div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <FloatingParticle key={i} delay={i * 0.3} />
            ))}
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
              <Trophy className="h-6 w-6 text-[#00ADB5]/15" />
            </motion.div>
          </div>

          <motion.div
            className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-center px-6 pb-12 pt-8 lg:px-12"
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
            <div className="mx-auto w-full max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={handleBack}
                  className="group mb-6 inline-flex items-center gap-3 text-sm text-[#EEEEEE]/60 transition-all hover:text-[#00ADB5]"
                >
                  <motion.div
                    whileHover={{ x: -4 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#393E46]/60 bg-[#222831]/50 backdrop-blur-sm transition-all group-hover:border-[#00ADB5]/50 group-hover:bg-[#00ADB5]/10"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </motion.div>
                  <span className="font-medium tracking-wide">{backLabel}</span>
                </button>
              </motion.div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isRevealed ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.25, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-4 py-1.5 backdrop-blur-sm"
                >
                  <motion.span
                    className="h-2 w-2 rounded-full bg-[#00ADB5]"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-semibold text-[#00ADB5] uppercase tracking-widest">{project.category}</span>
                </motion.div>

                {project.created_at && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={isRevealed ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-2 text-xs text-[#EEEEEE]/40"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </motion.div>
                )}
              </div>

              <div className="overflow-hidden">
                <h1 className="text-4xl font-bold text-[#EEEEEE] md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight">
                  {titleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-4 md:mr-6"
                      initial={{ y: 120, opacity: 0, rotateX: -80 }}
                      animate={isRevealed ? { y: 0, opacity: 1, rotateX: 0 } : {}}
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
                className="mt-4 max-w-2xl text-base text-[#EEEEEE]/55 leading-relaxed md:text-lg"
                initial={{ opacity: 0, y: 25 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {project.description}
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 25 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {project.live_url && (
                  <motion.a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#00ADB5] to-[#00CED6] px-6 py-3 font-semibold text-[#222831] shadow-xl shadow-[#00ADB5]/20 transition-all hover:shadow-2xl hover:shadow-[#00ADB5]/30"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">View Live Project</span>
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
                    className="inline-flex items-center gap-3 rounded-xl border border-[#393E46]/60 bg-[#222831]/60 px-6 py-3 font-semibold text-[#EEEEEE] backdrop-blur-sm transition-all hover:border-[#00ADB5]/50 hover:bg-[#393E46]/40"
                  >
                    <Github className="h-4 w-4" />
                    <span className="text-sm">View Source Code</span>
                  </motion.a>
                )}
              </motion.div>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={isRevealed ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
              >
                <div className="flex gap-8">
                  {projectFeatures.map((feature, i) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00ADB5]/10 text-[#00ADB5]">
                        {feature.icon}
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-xs font-semibold text-[#EEEEEE]">{feature.label}</div>
                        <div className="text-[10px] text-[#EEEEEE]/40">{feature.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
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
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0z' fill='%23393E46' fill-opacity='0.1'/%3E%3C/svg%3E\")" }} />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
            {(project.client || project.role || project.duration) && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16"
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {project.client && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.1 }}
                      className="rounded-2xl border border-[#393E46]/40 bg-gradient-to-br from-[#393E46]/20 to-transparent p-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="h-5 w-5 text-[#00ADB5]" />
                        <span className="text-xs font-semibold text-[#EEEEEE]/50 uppercase tracking-wider">Client</span>
                      </div>
                      <p className="text-lg font-semibold text-[#EEEEEE]">{project.client}</p>
                    </motion.div>
                  )}
                  {project.role && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.15 }}
                      className="rounded-2xl border border-[#393E46]/40 bg-gradient-to-br from-[#393E46]/20 to-transparent p-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-[#00ADB5]" />
                        <span className="text-xs font-semibold text-[#EEEEEE]/50 uppercase tracking-wider">My Role</span>
                      </div>
                      <p className="text-lg font-semibold text-[#EEEEEE]">{project.role}</p>
                    </motion.div>
                  )}
                  {project.duration && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.2 }}
                      className="rounded-2xl border border-[#393E46]/40 bg-gradient-to-br from-[#393E46]/20 to-transparent p-6"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-5 w-5 text-[#00ADB5]" />
                        <span className="text-xs font-semibold text-[#EEEEEE]/50 uppercase tracking-wider">Duration</span>
                      </div>
                      <p className="text-lg font-semibold text-[#EEEEEE]">{project.duration}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24"
            >
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  className="h-12 w-1 rounded-full bg-gradient-to-b from-[#00ADB5] to-[#00ADB5]/30"
                  initial={{ scaleY: 0 }}
                  animate={isContentInView ? { scaleY: 1 } : {}}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                <h2 className="text-sm font-semibold text-[#00ADB5] uppercase tracking-widest">Technologies Used</h2>
              </div>

              <div className="flex flex-wrap gap-4">
                {project.tech_stack.map((tech, i) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={isContentInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <MagneticCard className="perspective-1000">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="rounded-2xl border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/30 to-[#393E46]/10 px-6 py-4 backdrop-blur-sm transition-all hover:border-[#00ADB5]/40 hover:shadow-lg hover:shadow-[#00ADB5]/5"
                      >
                        <span className="text-base font-medium text-[#EEEEEE]/90">{tech}</span>
                      </motion.div>
                    </MagneticCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {project.featured_image && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-24"
              >
                <MagneticCard className="perspective-1000">
                  <div className="group relative overflow-hidden rounded-3xl border border-[#393E46]/40 bg-[#2a2f38]/50 p-2 shadow-2xl shadow-black/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00ADB5]/5 via-transparent to-[#393E46]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#00ADB5]/20 via-transparent to-[#393E46]/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative aspect-video overflow-hidden rounded-2xl">
                      <Image
                        src={project.featured_image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#222831]/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  </div>
                </MagneticCard>
              </motion.div>
            )}

            {project.content && (
              <motion.div
                ref={featuresRef}
                initial={{ opacity: 0, y: 40 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-24"
              >
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="h-12 w-1 rounded-full bg-gradient-to-b from-[#00ADB5] to-[#00ADB5]/30"
                    initial={{ scaleY: 0 }}
                    animate={isFeaturesInView ? { scaleY: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <h2 className="text-sm font-semibold text-[#00ADB5] uppercase tracking-widest">About This Project</h2>
                </div>

                <div className="space-y-6">
                  {project.content.split('\n\n').map((paragraph, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                      className="text-lg text-[#EEEEEE]/65 leading-relaxed max-w-4xl"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}

            {project.challenges && project.challenges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-24"
              >
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="h-12 w-1 rounded-full bg-gradient-to-b from-[#00ADB5] to-[#00ADB5]/30"
                    initial={{ scaleY: 0 }}
                    animate={isFeaturesInView ? { scaleY: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  />
                  <h2 className="text-sm font-semibold text-[#00ADB5] uppercase tracking-widest">Challenges & Solutions</h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#EEEEEE]">Challenges</h3>
                    </div>
                    {project.challenges.map((challenge, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isFeaturesInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex gap-3 rounded-xl border border-[#393E46]/30 bg-[#393E46]/10 p-4"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                          {i + 1}
                        </span>
                        <p className="text-sm text-[#EEEEEE]/70">{challenge}</p>
                      </motion.div>
                    ))}
                  </div>

                  {project.solutions && project.solutions.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ADB5]/10">
                          <Lightbulb className="h-5 w-5 text-[#00ADB5]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#EEEEEE]">Solutions</h3>
                      </div>
                      {project.solutions.map((solution, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={isFeaturesInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="flex gap-3 rounded-xl border border-[#00ADB5]/20 bg-[#00ADB5]/5 p-4"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00ADB5]/20 text-xs font-bold text-[#00ADB5]">
                            {i + 1}
                          </span>
                          <p className="text-sm text-[#EEEEEE]/70">{solution}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {project.results && project.results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-24"
              >
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="h-12 w-1 rounded-full bg-gradient-to-b from-[#00ADB5] to-[#00ADB5]/30"
                    initial={{ scaleY: 0 }}
                    animate={isFeaturesInView ? { scaleY: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  />
                  <h2 className="text-sm font-semibold text-[#00ADB5] uppercase tracking-widest">Results & Impact</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {project.results.map((result, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-start gap-4 rounded-2xl border border-[#393E46]/40 bg-gradient-to-br from-[#393E46]/20 to-transparent p-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00ADB5]/10">
                        <TrendingUp className="h-5 w-5 text-[#00ADB5]" />
                      </div>
                      <p className="text-[#EEEEEE]/80 font-medium">{result}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {project.testimonial && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-24"
              >
                <div className="relative rounded-3xl border border-[#00ADB5]/20 bg-gradient-to-br from-[#00ADB5]/10 via-[#00ADB5]/5 to-transparent p-8 md:p-12">
                  <Quote className="absolute top-6 left-6 h-12 w-12 text-[#00ADB5]/20" />
                  <div className="relative">
                    <p className="text-xl md:text-2xl text-[#EEEEEE]/80 leading-relaxed italic mb-6">
                      &ldquo;{project.testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00ADB5] to-[#00ADB5]/50 flex items-center justify-center text-[#222831] font-bold text-lg">
                        {project.testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#EEEEEE]">{project.testimonial.author}</p>
                        <p className="text-sm text-[#EEEEEE]/50">{project.testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {allImages.length > 0 && (
              <motion.div
                ref={galleryRef}
                initial={{ opacity: 0, y: 40 }}
                animate={isGalleryInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-24"
              >
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="h-12 w-1 rounded-full bg-gradient-to-b from-[#00ADB5] to-[#00ADB5]/30"
                    initial={{ scaleY: 0 }}
                    animate={isGalleryInView ? { scaleY: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <h2 className="text-sm font-semibold text-[#00ADB5] uppercase tracking-widest">Project Gallery</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {allImages.map((image, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isGalleryInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setLightboxIndex(i)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#393E46]/40 bg-[#2a2f38]/50 shadow-lg transition-all hover:border-[#00ADB5]/30 hover:shadow-xl hover:shadow-[#00ADB5]/5"
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={image}
                          alt={`${project.title} screenshot ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#222831]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00ADB5]/90 text-[#222831]">
                            <Eye className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isGalleryInView || isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-[#393E46] to-transparent" />

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
