"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  color?: string
}

const categoryColors: Record<string, string> = {
  Frontend: "#00ADB5",
  Backend: "#8B5CF6",
  Languages: "#F59E0B",
  Database: "#10B981",
  DevOps: "#EF4444",
  Design: "#EC4899",
}

const categoryIcons: Record<string, string> = {
  Frontend: "🎨",
  Backend: "⚙️",
  Languages: "💻",
  Database: "🗄️",
  DevOps: "🚀",
  Design: "✨",
}

function BentoCard({ 
  children, 
  className = "", 
  delay = 0,
  size = "default"
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
  size?: "small" | "default" | "large" | "wide" | "tall"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const sizeClasses = {
    small: "col-span-1 row-span-1",
    default: "col-span-1 row-span-1 md:col-span-1 md:row-span-1",
    large: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
    wide: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
    tall: "col-span-1 row-span-1 md:col-span-1 md:row-span-2",
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl transition-all duration-500 hover:border-white/[0.15] hover:shadow-2xl hover:shadow-white/[0.05] ${sizeClasses[size]} ${className}`}
      style={{
        background: isHovered 
          ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 173, 181, 0.06), transparent 40%)` 
          : undefined,
      }}
    >
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.03), transparent 40%)`,
        }}
      />
      
      <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-gradient-to-br from-zinc-900/90 to-black/95" />
      
      <div className="relative z-10 h-full p-6 md:p-8">
        {children}
      </div>
    </motion.div>
  )
}

function SkillPill({ skill, delay = 0 }: { skill: Skill; delay?: number }) {
  const color = skill.color || categoryColors[skill.category] || "#00ADB5"
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.05, duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
    >
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
      >
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ 
            background: `linear-gradient(135deg, ${color}15, transparent 60%)` 
          }}
        />
        
        <div className="relative flex items-center gap-3">
          <div 
            className="h-2.5 w-2.5 rounded-full transition-all duration-300 group-hover:scale-125"
            style={{ 
              backgroundColor: color,
              boxShadow: isHovered ? `0 0 12px ${color}80` : 'none'
            }}
          />
          <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-white">
            {skill.name}
          </span>
          <span 
            className="ml-auto text-xs font-semibold transition-colors"
            style={{ color: isHovered ? color : 'rgba(255,255,255,0.4)' }}
          >
            {skill.proficiency}%
          </span>
        </div>
        
        <motion.div
          className="mt-2 h-1 overflow-hidden rounded-full bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: isHovered ? `${skill.proficiency}%` : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function CategoryCard({ 
  category, 
  skills, 
  index 
}: { 
  category: string
  skills: Skill[]
  index: number
}) {
  const color = categoryColors[category] || "#00ADB5"
  const icon = categoryIcons[category] || "⚡"
  const avgProficiency = Math.round(
    skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length
  )
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-6 backdrop-blur-sm transition-all duration-500 hover:border-white/[0.15]"
    >
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ 
          background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)` 
        }}
      />
      
      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-white">{category}</h3>
          <div 
            className="ml-auto rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {avgProficiency}%
          </div>
        </div>
        
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${avgProficiency}%` } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill.id}
              className="rounded-xl px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:text-white"
              style={{ backgroundColor: `${color}15` }}
            >
              {skill.name}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="rounded-xl bg-white/5 px-3 py-1.5 text-xs font-medium text-white/40">
              +{skills.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function FloatingOrb({ delay, size, color, x, y }: { 
  delay: number
  size: number
  color: string
  x: string
  y: string
}) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: x,
        top: y,
        opacity: 0.15,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  )
}

function StatsCard({ value, label, color }: { value: string; label: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="text-center"
    >
      <motion.div 
        className="text-4xl font-bold md:text-5xl"
        style={{ color }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
      >
        {value}
      </motion.div>
      <div className="mt-1 text-sm text-zinc-500">{label}</div>
    </motion.div>
  )
}

export function SkillsContent({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const headerY = useTransform(smoothProgress, [0, 0.3], [0, -100])
  const headerOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0])
  const gridY = useTransform(smoothProgress, [0.1, 0.4], [100, 0])
  const gridOpacity = useTransform(smoothProgress, [0.1, 0.25], [0, 1])
  
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)
  
  const frontendSkills = skillsByCategory["Frontend"] || []
  const backendSkills = skillsByCategory["Backend"] || []
  const languageSkills = skillsByCategory["Languages"] || []
  const databaseSkills = skillsByCategory["Database"] || []
  const devopsSkills = skillsByCategory["DevOps"] || []
  const designSkills = skillsByCategory["Design"] || []

  const totalSkills = skills.length
  const avgProficiency = Math.round(skills.reduce((a, s) => a + s.proficiency, 0) / totalSkills)
  const topSkillsCount = skills.filter(s => s.proficiency >= 90).length

  return (
    <div ref={containerRef} className="relative min-h-[400vh] bg-black">
      <div className="fixed inset-0 overflow-hidden">
        <FloatingOrb delay={0} size={600} color="#00ADB5" x="10%" y="20%" />
        <FloatingOrb delay={2} size={400} color="#8B5CF6" x="70%" y="60%" />
        <FloatingOrb delay={4} size={300} color="#F59E0B" x="80%" y="10%" />
        <FloatingOrb delay={1} size={350} color="#10B981" x="20%" y="70%" />
        <FloatingOrb delay={3} size={250} color="#EC4899" x="50%" y="40%" />
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>
      
      <motion.section 
        className="sticky top-0 flex h-screen items-center justify-center"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="mb-6 inline-block rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-4 py-2 text-sm font-medium uppercase tracking-[0.3em] text-[#00ADB5]">
              Technical Arsenal
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-6xl text-white md:text-8xl lg:text-9xl"
          >
            Skills & <br />
            <em className="bg-gradient-to-r from-[#00ADB5] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              Expertise
            </em>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg text-zinc-400"
          >
            A curated collection of technologies, frameworks, and tools I use to build exceptional digital experiences
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-12 flex justify-center gap-12"
          >
            <StatsCard value={`${totalSkills}+`} label="Technologies" color="#00ADB5" />
            <StatsCard value={`${avgProficiency}%`} label="Avg. Proficiency" color="#8B5CF6" />
            <StatsCard value={`${topSkillsCount}`} label="Expert Level" color="#EC4899" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-zinc-500"
            >
              <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.section 
        className="relative z-10 min-h-screen py-32"
        style={{ y: gridY, opacity: gridOpacity }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid auto-rows-[200px] gap-4 md:grid-cols-4 md:auto-rows-[180px]">
            <BentoCard size="large" delay={0}>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl">🎨</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">Frontend</h3>
                    <p className="text-sm text-zinc-500">UI/UX Development</p>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden">
                  {frontendSkills.map((skill, i) => (
                    <SkillPill key={skill.id} skill={skill} delay={i} />
                  ))}
                </div>
              </div>
            </BentoCard>
            
            <BentoCard size="default" delay={1}>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="mb-4 h-20 w-20 rounded-full border border-[#00ADB5]/30 bg-gradient-to-br from-[#00ADB5]/20 to-transparent p-4"
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#00ADB5]/10 text-3xl">
                    ⚛️
                  </div>
                </motion.div>
                <div className="text-4xl font-bold text-white">React</div>
                <div className="text-sm text-[#00ADB5]">Primary Framework</div>
              </div>
            </BentoCard>
            
            <BentoCard size="default" delay={2}>
              <div className="flex h-full flex-col justify-between">
                <div className="text-4xl">⚙️</div>
                <div>
                  <div className="text-3xl font-bold text-white">Backend</div>
                  <div className="text-sm text-zinc-500">Server-side Magic</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {backendSkills.slice(0, 3).map((skill) => (
                    <span 
                      key={skill.id}
                      className="rounded-lg bg-[#8B5CF6]/20 px-2 py-1 text-xs text-[#8B5CF6]"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>
            
            <BentoCard size="tall" delay={3}>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  <h3 className="text-lg font-bold text-white">Languages</h3>
                </div>
                <div className="flex-1 space-y-2">
                  {languageSkills.map((skill, i) => (
                    <SkillPill key={skill.id} skill={skill} delay={i} />
                  ))}
                </div>
              </div>
            </BentoCard>
            
            <BentoCard size="wide" delay={4}>
              <div className="flex h-full items-center gap-8">
                <div className="flex-1">
                  <div className="mb-2 text-sm uppercase tracking-widest text-zinc-500">Database</div>
                  <div className="text-2xl font-bold text-white">Data Management</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {databaseSkills.map((skill) => (
                      <span 
                        key={skill.id}
                        className="rounded-xl bg-[#10B981]/20 px-3 py-1.5 text-sm text-[#10B981]"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-7xl"
                  >
                    🗄️
                  </motion.div>
                </div>
              </div>
            </BentoCard>
            
            <BentoCard size="default" delay={5}>
              <div className="flex h-full flex-col justify-center text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4 text-5xl"
                >
                  🚀
                </motion.div>
                <div className="text-2xl font-bold text-white">DevOps</div>
                <div className="mt-2 flex justify-center gap-1">
                  {devopsSkills.slice(0, 3).map((skill) => (
                    <span 
                      key={skill.id}
                      className="rounded-lg bg-[#EF4444]/20 px-2 py-1 text-xs text-[#EF4444]"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>
            
            <BentoCard size="default" delay={6}>
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <span className="text-lg font-bold text-white">Design</span>
                </div>
                <div className="space-y-2">
                  {designSkills.map((skill, i) => (
                    <SkillPill key={skill.id} skill={skill} delay={i} />
                  ))}
                </div>
              </div>
            </BentoCard>
            
            <BentoCard size="wide" delay={7}>
              <div className="flex h-full items-center justify-between">
                <div>
                  <div className="mb-2 text-sm uppercase tracking-widest text-[#00ADB5]">Experience</div>
                  <div className="text-3xl font-bold text-white">5+ Years</div>
                  <div className="text-sm text-zinc-500">Building Digital Products</div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="h-12 w-2 rounded-full bg-gradient-to-t from-[#00ADB5] to-[#8B5CF6]"
                      style={{ height: `${30 + i * 15}px` }}
                    />
                  ))}
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </motion.section>
      
      <section className="relative z-10 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Skill Categories
            </h2>
            <p className="text-zinc-400">
              Hover to explore proficiency levels
            </p>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
              <CategoryCard
                key={category}
                category={category}
                skills={categorySkills}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section className="relative z-10 py-32">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8 text-4xl font-bold text-white md:text-5xl">
              Always <span className="text-[#00ADB5]">Learning</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-zinc-400">
              Technology evolves rapidly, and so do I. Currently exploring AI/ML integration, 
              WebGPU, and advanced animation techniques.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {["AI/ML", "WebGPU", "Rust", "WebAssembly", "Edge Computing"].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-[#00ADB5]/50 hover:bg-[#00ADB5]/10"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
