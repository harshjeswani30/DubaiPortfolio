"use client"

import { useRef, useState, createContext, useContext } from "react"
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from "framer-motion"

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  color?: string
}

const HoverContext = createContext<boolean>(false)

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
  size = "default",
  glowColor = "#00ADB5"
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
  size?: "small" | "default" | "large" | "wide" | "tall" | "feature"
  glowColor?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
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

    return (
      <HoverContext.Provider value={isHovered}>
        <motion.div
          ref={ref}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ 
            duration: 0.3,
            ease: "easeOut"
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`group relative overflow-hidden rounded-[2rem] border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/30 to-[#222831]/50 backdrop-blur-xl transition-all duration-500 hover:border-[#00ADB5]/50 hover:shadow-2xl hover:shadow-[#00ADB5]/20 ${className}`}
          style={{
            background: isHovered 
              ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}15, transparent 40%)` 
            : undefined,
        }}
      >
        <motion.div 
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          animate={{ opacity: isHovered ? 1 : 0 }}
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}10, transparent 40%)`,
          }}
        />
        
        <motion.div 
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${glowColor}30, transparent 50%, ${glowColor}20)`,
          }}
        />
        
        <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-gradient-to-br from-[#222831]/95 to-[#222831]" />
        
        <div className="relative z-10 h-full p-6 md:p-8">
          {children}
        </div>
      </motion.div>
    </HoverContext.Provider>
  )
}

function useCardHover() {
  return useContext(HoverContext)
}

function FrontendCard({ skills }: { skills: Skill[] }) {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-3">
        <motion.span 
          className="text-3xl"
          animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          🎨
        </motion.span>
        <div>
          <h3 className="text-xl font-bold text-[#EEEEEE]">Frontend</h3>
          <p className="text-sm text-[#00ADB5]/60">UI/UX Development</p>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2 overflow-hidden">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0.7, x: -10 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0.7, x: -10 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <SkillPill skill={skill} delay={i} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function LanguagesCard({ skills }: { skills: Skill[] }) {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2">
        <motion.span 
          className="text-2xl"
          animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          💻
        </motion.span>
        <h3 className="text-lg font-bold text-[#EEEEEE]">Languages</h3>
      </div>
      <div className="flex-1 space-y-2">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0.7, y: 5 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 5 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <SkillPill skill={skill} delay={i} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ReactCard() {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div
        className="mb-4 h-20 w-20 rounded-full border border-[#00ADB5]/30 bg-gradient-to-br from-[#00ADB5]/20 to-transparent p-4"
        animate={isHovered ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
        transition={{ duration: isHovered ? 2 : 0.5, ease: isHovered ? "linear" : "easeOut", repeat: isHovered ? Infinity : 0 }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#00ADB5]/10 text-3xl">
          ⚛️
        </div>
      </motion.div>
      <motion.div 
        className="text-4xl font-bold text-[#EEEEEE]"
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        React
      </motion.div>
      <motion.div 
        className="text-sm text-[#00ADB5]"
        animate={isHovered ? { opacity: 1 } : { opacity: 0.7 }}
      >
        Primary Framework
      </motion.div>
    </div>
  )
}

function CodeLinesCard() {
  const isHovered = useCardHover()
  const lines = [75, 90, 60, 85, 45, 70, 55]
  
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-3 flex items-end gap-1.5">
        {lines.map((height, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full bg-gradient-to-t from-[#FF6B6B] to-[#FF6B6B]/40"
            initial={{ height: 10 }}
            animate={isHovered ? { height: height } : { height: 10 }}
            transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </div>
      <motion.div 
        className="text-3xl font-bold text-[#EEEEEE]"
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
      >
        50K+
      </motion.div>
      <div className="text-sm text-[#FF6B6B]/70">Lines of Code</div>
    </div>
  )
}

function BackendCard({ skills }: { skills: Skill[] }) {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full flex-col justify-between">
      <motion.div 
        className="text-4xl"
        animate={isHovered ? { rotate: [0, 180, 360], scale: 1.1 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        ⚙️
      </motion.div>
      <div>
        <div className="text-3xl font-bold text-[#EEEEEE]">Backend</div>
        <div className="text-sm text-[#00ADB5]/60">Server-side Magic</div>
      </div>
      <div className="flex flex-wrap gap-1">
        {skills.slice(0, 3).map((skill, i) => (
          <motion.span 
            key={skill.id}
            className="rounded-lg bg-[#00ADB5]/20 px-2 py-1 text-xs text-[#00ADB5]"
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.9 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            {skill.name}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

function DevOpsCard({ skills }: { skills: Skill[] }) {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full flex-col justify-center text-center">
      <motion.div
        className="mb-4 text-5xl"
        animate={isHovered ? { y: [0, -15, 0], scale: 1.2 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        🚀
      </motion.div>
      <div className="text-2xl font-bold text-[#EEEEEE]">DevOps</div>
      <div className="mt-2 flex justify-center gap-1">
        {skills.slice(0, 3).map((skill, i) => (
          <motion.span 
            key={skill.id}
            className="rounded-lg bg-[#9B59B6]/20 px-2 py-1 text-xs text-[#9B59B6]"
            initial={{ opacity: 0.5, y: 10 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            {skill.name}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

function DatabaseCard({ skills }: { skills: Skill[] }) {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full items-center gap-8">
      <div className="flex-1">
        <div className="mb-2 text-sm uppercase tracking-widest text-[#00ADB5]/60">Database</div>
        <div className="text-2xl font-bold text-[#EEEEEE]">Data Management</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <motion.span 
              key={skill.id}
              className="rounded-xl bg-[#00ADB5]/20 px-3 py-1.5 text-sm text-[#00ADB5]"
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.9 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              {skill.name}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="hidden md:block">
        <motion.div
          className="text-7xl"
          animate={isHovered ? { rotate: [0, 10, -10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          🗄️
        </motion.div>
      </div>
    </div>
  )
}

function DesignCard({ skills }: { skills: Skill[] }) {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-2">
        <motion.span 
          className="text-2xl"
          animate={isHovered ? { rotate: [0, 20, -20, 0], scale: 1.2 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          ✨
        </motion.span>
        <span className="text-lg font-bold text-[#EEEEEE]">Design</span>
      </div>
      <div className="space-y-2">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0.7, x: -5 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0.7, x: -5 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <SkillPill skill={skill} delay={i} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function CoffeeCard() {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div
        className="mb-2 text-5xl"
        animate={isHovered ? { rotate: [0, -15, 15, 0], y: [0, -5, 0] } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ☕
      </motion.div>
      <motion.div 
        className="text-3xl font-bold text-[#EEEEEE]"
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      >
        999+
      </motion.div>
      <div className="text-sm text-[#E74C3C]/70">Cups of Coffee</div>
      <motion.div 
        className="mt-2 flex gap-1"
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="h-1 w-1 rounded-full bg-[#E74C3C]"
            animate={isHovered ? { y: [0, -3, 0] } : { y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, repeat: isHovered ? Infinity : 0 }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function ExperienceCard() {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full items-center justify-between">
      <div>
        <div className="mb-2 text-sm uppercase tracking-widest text-[#00ADB5]">Experience</div>
        <motion.div 
          className="text-3xl font-bold text-[#EEEEEE]"
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
        >
          5+ Years
        </motion.div>
        <div className="text-sm text-[#00ADB5]/60">Building Digital Products</div>
      </div>
      <div className="hidden items-center gap-4 md:flex">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full bg-gradient-to-t from-[#00ADB5] to-[#00ADB5]/40"
            initial={{ height: 10 }}
            animate={isHovered ? { height: 30 + i * 15 } : { height: 10 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          />
        ))}
      </div>
    </div>
  )
}

function ProblemSolverCard() {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div
        className="mb-3 text-5xl"
        animate={isHovered ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎯
      </motion.div>
      <div className="text-2xl font-bold text-[#EEEEEE]">Problem Solver</div>
      <motion.div 
        className="mt-1 text-sm text-[#3498DB]/70"
        animate={isHovered ? { opacity: 1 } : { opacity: 0.6 }}
      >
        Creative Solutions
      </motion.div>
    </div>
  )
}

function GitCard() {
  const isHovered = useCardHover()
  
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div 
        className="mb-2 flex items-center gap-2"
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
      >
        <motion.div
          className="text-4xl"
          animate={isHovered ? { rotate: [0, 360] } : { rotate: 0 }}
          transition={{ duration: 0.8 }}
        >
          🌿
        </motion.div>
      </motion.div>
      <div className="text-2xl font-bold text-[#EEEEEE]">500+</div>
      <div className="text-sm text-[#2ECC71]/70">Git Commits</div>
      <motion.div
        className="mt-2 flex gap-0.5"
        animate={isHovered ? { opacity: 1 } : { opacity: 0.3 }}
      >
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-sm bg-[#2ECC71]"
            initial={{ opacity: 0.2 }}
            animate={isHovered ? { opacity: [0.3, 0.5, 0.8, 1][i % 4] } : { opacity: 0.2 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function SkillPill({ skill, delay = 0 }: { skill: Skill; delay?: number }) {
  const [isPillHovered, setIsPillHovered] = useState(false)
  const isCardHovered = useCardHover()
  const isActive = isCardHovered || isPillHovered
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.05, duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setIsPillHovered(true)}
      onMouseLeave={() => setIsPillHovered(false)}
      className="group relative cursor-pointer"
    >
      <motion.div
        animate={{ scale: isPillHovered ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="relative overflow-hidden rounded-2xl border border-[#393E46]/50 bg-[#393E46]/20 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-[#00ADB5]/30 hover:bg-[#393E46]/30"
      >
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ 
            background: `linear-gradient(135deg, rgba(0, 173, 181, 0.15), transparent 60%)` 
          }}
        />
        
        <div className="relative flex items-center gap-3">
          <div 
            className="h-2.5 w-2.5 rounded-full bg-[#00ADB5] transition-all duration-300 group-hover:scale-125"
            style={{ 
              boxShadow: isActive ? `0 0 12px rgba(0, 173, 181, 0.8)` : 'none'
            }}
          />
          <span className="text-sm font-medium text-[#EEEEEE]/80 transition-colors group-hover:text-[#EEEEEE]">
            {skill.name}
          </span>
          <span 
            className="ml-auto text-xs font-semibold transition-colors"
            style={{ color: isActive ? '#00ADB5' : 'rgba(238,238,238,0.4)' }}
          >
            {skill.proficiency}%
          </span>
        </div>
        
        <motion.div
          className="mt-2 h-1 overflow-hidden rounded-full bg-[#393E46]/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.2, delay: isCardHovered ? delay * 0.05 : 0 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/70"
            initial={{ width: 0 }}
            animate={{ width: isActive ? `${skill.proficiency}%` : 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: isCardHovered ? delay * 0.05 : 0 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const categoryColors: Record<string, string> = {
  Frontend: "#00ADB5",
  Backend: "#9B59B6",
  Languages: "#3498DB",
  Database: "#2ECC71",
  DevOps: "#E74C3C",
  Design: "#F1C40F",
}

function AnimatedPieChart({ 
  data, 
  isHovered,
  selectedIndex,
  onHover
}: { 
  data: { name: string; value: number; color: string }[]
  isHovered: boolean
  selectedIndex: number | null
  onHover: (index: number | null) => void
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  let currentAngle = -90
  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360
    const startAngle = currentAngle
    currentAngle += angle
    return {
      ...d,
      startAngle,
      endAngle: currentAngle,
      angle,
      index: i
    }
  })

  const describeArc = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
    const start = polarToCartesian(50, 50, radius, endAngle)
    const end = polarToCartesian(50, 50, radius, startAngle)
    const innerStart = polarToCartesian(50, 50, innerRadius, endAngle)
    const innerEnd = polarToCartesian(50, 50, innerRadius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ")
  }

  const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => {
    const rad = (angle * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    }
  }

  return (
    <div ref={ref} className="relative">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          {segments.map((seg, i) => (
            <filter key={`glow-${i}`} id={`glow-${i}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          ))}
        </defs>
        
        {segments.map((seg, i) => {
          const isSelected = selectedIndex === i
          const baseRadius = 42
          const selectedRadius = 45
          const innerRadius = 28
          
          return (
            <motion.path
              key={seg.name}
              d={describeArc(seg.startAngle, seg.endAngle, isSelected ? selectedRadius : baseRadius, innerRadius)}
              fill={seg.color}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { 
                opacity: selectedIndex === null || isSelected ? 1 : 0.4,
                scale: 1,
              } : {}}
              transition={{ 
                duration: 0.6, 
                delay: i * 0.1,
                type: "spring",
                stiffness: 100
              }}
              style={{
                transformOrigin: "50px 50px",
                filter: isSelected ? `url(#glow-${i})` : "none",
                cursor: "pointer"
              }}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              whileHover={{ scale: 1.05 }}
            />
          )
        })}
        
        <motion.circle
          cx="50"
          cy="50"
          r="25"
          fill="#222831"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        />
        
        <motion.text
          x="50"
          y="48"
          textAnchor="middle"
          className="fill-[#EEEEEE] text-[8px] font-bold"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          {selectedIndex !== null ? `${data[selectedIndex].value}%` : `${data.length}`}
        </motion.text>
        <motion.text
          x="50"
          y="56"
          textAnchor="middle"
          className="fill-[#00ADB5]/70 text-[4px]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          {selectedIndex !== null ? data[selectedIndex].name : "Categories"}
        </motion.text>
      </svg>
    </div>
  )
}

function InteractivePieChartSection({ 
  skillsByCategory 
}: { 
  skillsByCategory: Record<string, Skill[]> 
}) {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const categoryData = Object.entries(skillsByCategory).map(([category, skills]) => ({
    name: category,
    value: Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length),
    color: categoryColors[category] || "#00ADB5",
    skills,
    icon: categoryIcons[category] || "⚡"
  }))

  const totalSkills = Object.values(skillsByCategory).flat().length
  const overallAvg = Math.round(
    Object.values(skillsByCategory).flat().reduce((acc, s) => acc + s.proficiency, 0) / totalSkills
  )

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center justify-center"
      >
        <div className="relative h-80 w-80 md:h-96 md:w-96">
          <motion.div
            className="absolute inset-0 rounded-full bg-[#00ADB5]/5"
            animate={{ 
              boxShadow: hoveredCategory !== null 
                ? `0 0 60px ${categoryData[hoveredCategory]?.color}40` 
                : "0 0 40px rgba(0, 173, 181, 0.1)"
            }}
            transition={{ duration: 0.3 }}
          />
          
          <AnimatedPieChart 
            data={categoryData}
            isHovered={hoveredCategory !== null}
            selectedIndex={hoveredCategory}
            onHover={setHoveredCategory}
          />
          
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-[#393E46]/50 bg-[#222831]/90 px-6 py-3 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00ADB5]">{totalSkills}</div>
                <div className="text-xs text-[#EEEEEE]/50">Skills</div>
              </div>
              <div className="h-8 w-px bg-[#393E46]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00ADB5]">{overallAvg}%</div>
                <div className="text-xs text-[#EEEEEE]/50">Average</div>
              </div>
              <div className="h-8 w-px bg-[#393E46]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00ADB5]">{categoryData.length}</div>
                <div className="text-xs text-[#EEEEEE]/50">Categories</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col justify-center space-y-3"
      >
        {categoryData.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 + index * 0.1 }}
            onMouseEnter={() => setHoveredCategory(index)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
              hoveredCategory === index 
                ? "border-[#00ADB5]/50 bg-[#393E46]/40" 
                : "border-[#393E46]/30 bg-[#393E46]/20"
            }`}
          >
            <motion.div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ 
                background: `linear-gradient(135deg, ${cat.color}15, transparent 60%)` 
              }}
            />
            
            <div className="relative flex items-center gap-4 p-4">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: `${cat.color}20` }}
                animate={hoveredCategory === index ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {cat.icon}
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#EEEEEE]">{cat.name}</h4>
                  <motion.span
                    className="rounded-full px-3 py-1 text-sm font-bold"
                    style={{ 
                      color: cat.color,
                      backgroundColor: `${cat.color}20`
                    }}
                    animate={hoveredCategory === index ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {cat.value}%
                  </motion.span>
                </div>
                
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#393E46]/50">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${cat.value}%` } : {}}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {cat.skills.slice(0, 3).map((skill, i) => (
                    <motion.span
                      key={skill.id}
                      className="rounded-lg bg-[#222831]/80 px-2 py-0.5 text-xs text-[#EEEEEE]/60"
                      initial={{ opacity: 0 }}
                      animate={hoveredCategory === index ? { opacity: 1 } : { opacity: 0.5 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                  {cat.skills.length > 3 && (
                    <span className="rounded-lg bg-[#222831]/80 px-2 py-0.5 text-xs text-[#EEEEEE]/40">
                      +{cat.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
              
              <motion.div
                className="h-16 w-1 rounded-full"
                style={{ backgroundColor: cat.color }}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function RadialSkillChart({ skills, category, color }: { skills: Skill[]; category: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  
  const avgProficiency = Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="group relative overflow-hidden rounded-3xl border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/20 to-[#222831]/80 p-6 backdrop-blur-sm transition-all duration-500 hover:border-[#00ADB5]/30"
    >
      <motion.div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ 
          background: `radial-gradient(circle at 50% 0%, ${color}20, transparent 70%)` 
        }}
      />
      
      <div className="relative flex flex-col items-center">
        <div className="relative mb-4 h-32 w-32">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#393E46"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={isInView ? { 
                strokeDashoffset: 2 * Math.PI * 40 * (1 - avgProficiency / 100) 
              } : {}}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold"
              style={{ color }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, type: "spring" }}
            >
              {avgProficiency}%
            </motion.span>
            <span className="text-xs text-[#EEEEEE]/50">avg</span>
          </div>
        </div>
        
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl">{categoryIcons[category]}</span>
          <h3 className="text-lg font-semibold text-[#EEEEEE]">{category}</h3>
        </div>
        
        <div className="w-full space-y-2">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              onMouseEnter={() => setHoveredSkill(skill.id)}
              onMouseLeave={() => setHoveredSkill(null)}
              className="relative"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#EEEEEE]/70">{skill.name}</span>
                <motion.span
                  style={{ color }}
                  animate={hoveredSkill === skill.id ? { scale: 1.2 } : { scale: 1 }}
                >
                  {skill.proficiency}%
                </motion.span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#393E46]/50">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.proficiency}%` } : {}}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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
      className="group relative overflow-hidden rounded-3xl border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/20 to-[#222831]/80 p-6 backdrop-blur-sm transition-all duration-500 hover:border-[#00ADB5]/30"
    >
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ 
          background: `radial-gradient(circle at 50% 0%, rgba(0, 173, 181, 0.15), transparent 70%)` 
        }}
      />
      
      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-[#EEEEEE]">{category}</h3>
          <div className="ml-auto rounded-full bg-[#00ADB5]/20 px-3 py-1 text-xs font-medium text-[#00ADB5]">
            {avgProficiency}%
          </div>
        </div>
        
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#393E46]/50">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/60"
            initial={{ width: 0 }}
            animate={isInView ? { width: `${avgProficiency}%` } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill.id}
              className="rounded-xl bg-[#00ADB5]/10 px-3 py-1.5 text-xs font-medium text-[#EEEEEE]/70 transition-colors hover:text-[#EEEEEE]"
            >
              {skill.name}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="rounded-xl bg-[#393E46]/30 px-3 py-1.5 text-xs font-medium text-[#EEEEEE]/40">
              +{skills.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function FloatingOrb({ delay, size, x, y }: { 
  delay: number
  size: number
  x: string
  y: string
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-[#00ADB5] blur-[100px]"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        opacity: 0.08,
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

function StatsCard({ value, label }: { value: string; label: string }) {
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
        className="text-4xl font-bold text-[#00ADB5] md:text-5xl"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
      >
        {value}
      </motion.div>
      <div className="mt-1 text-sm text-[#EEEEEE]/50">{label}</div>
    </motion.div>
  )
}

export function SkillsContent({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
const headerY = useTransform(smoothProgress, [0, 0.15], [0, -50])
    const headerOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0])
    
    const gridY = useTransform(smoothProgress, [0.08, 0.5], [50, -30])
    const gridScale = useTransform(smoothProgress, [0.08, 0.25], [0.98, 1])
    
    const categoriesY = useTransform(smoothProgress, [0.35, 0.7], [30, -20])
    
    const learningY = useTransform(smoothProgress, [0.55, 0.9], [40, -15])
  
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
    <div ref={containerRef} className="relative min-h-[400vh] bg-[#222831]">
      <div className="fixed inset-0 overflow-hidden">
        <FloatingOrb delay={0} size={600} x="10%" y="20%" />
        <FloatingOrb delay={2} size={400} x="70%" y="60%" />
        <FloatingOrb delay={4} size={300} x="80%" y="10%" />
        <FloatingOrb delay={1} size={350} x="20%" y="70%" />
        <FloatingOrb delay={3} size={250} x="50%" y="40%" />
        
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[#393E46]/20 blur-[100px]"
        />
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[#00ADB5]/10 blur-[80px]"
        />
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#222831_70%)]" />
        <div className="dot-background absolute inset-0 opacity-50" />
      </div>
      
      <motion.section 
        className="sticky top-0 flex h-screen items-center justify-center"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <div className="relative z-10 px-6 text-center">

          
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-5xl font-bold text-[#EEEEEE] md:text-7xl lg:text-8xl"
            >
              <span className="inline">Skills & </span>
              <span className="bg-gradient-to-r from-[#00ADB5] via-[#00ADB5] to-[#EEEEEE] bg-clip-text text-transparent">
                Expertise
              </span>
            </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg text-[#00ADB5]/70"
          >
            A curated collection of technologies, frameworks, and tools I use to build exceptional digital experiences
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-12 flex justify-center gap-12"
          >
            <StatsCard value={`${totalSkills}+`} label="Technologies" />
            <StatsCard value={`${avgProficiency}%`} label="Avg. Proficiency" />
            <StatsCard value={`${topSkillsCount}`} label="Expert Level" />
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
              className="flex flex-col items-center gap-2 text-[#00ADB5]/60"
            >
              <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
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
      </motion.section>
      
<motion.section 
          className="relative z-10 min-h-screen py-32"
          style={{ y: gridY, scale: gridScale }}
        >
          <div className="absolute inset-0 grid-background opacity-50" />
          <div className="relative mx-auto max-w-7xl px-6">
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:[grid-auto-rows:180px]">
              <BentoCard size="large" delay={0} className="md:col-span-2 md:row-span-2">
                <FrontendCard skills={frontendSkills} />
              </BentoCard>
              
              <BentoCard size="default" delay={1}>
                <ReactCard />
              </BentoCard>
              
              <BentoCard size="default" delay={2} glowColor="#FF6B6B">
                <CodeLinesCard />
              </BentoCard>
              
              <BentoCard size="default" delay={3}>
                <BackendCard skills={backendSkills} />
              </BentoCard>
              
              <BentoCard size="default" delay={4} glowColor="#9B59B6">
                <DevOpsCard skills={devopsSkills} />
              </BentoCard>
              
              <BentoCard size="wide" delay={5} className="md:col-span-2">
                <DatabaseCard skills={databaseSkills} />
              </BentoCard>
              
              <BentoCard size="tall" delay={6} className="md:row-span-2">
                <LanguagesCard skills={languageSkills} />
              </BentoCard>
              
              <BentoCard size="default" delay={7} glowColor="#F1C40F">
                <DesignCard skills={designSkills} />
              </BentoCard>
              
              <BentoCard size="default" delay={8} glowColor="#E74C3C">
                <CoffeeCard />
              </BentoCard>
              
              <BentoCard size="default" delay={9} glowColor="#3498DB">
                <ProblemSolverCard />
              </BentoCard>
              
              <BentoCard size="wide" delay={10} className="md:col-span-2">
                <ExperienceCard />
              </BentoCard>
              
              <BentoCard size="default" delay={11} glowColor="#2ECC71">
                <GitCard />
              </BentoCard>
            </div>
        </div>
      </motion.section>
      
<motion.section 
          className="relative z-10 py-32"
          style={{ y: categoriesY }}
        >
          <div className="relative mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold text-[#EEEEEE] md:text-5xl">
                Skill <span className="text-[#00ADB5]">Statistics</span>
              </h2>
              <p className="text-[#00ADB5]/70">
                Interactive overview of proficiency across categories
              </p>
            </motion.div>
            
            <InteractivePieChartSection skillsByCategory={skillsByCategory} />
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20"
            >
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-8 text-center text-2xl font-bold text-[#EEEEEE]"
              >
                Detailed Breakdown
              </motion.h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
                  <RadialSkillChart
                    key={category}
                    category={category}
                    skills={categorySkills}
                    color={categoryColors[category] || "#00ADB5"}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      
      <motion.section 
          className="relative z-10 py-32"
          style={{ y: learningY }}
        >
          <div className="absolute inset-0 grid-background opacity-50" />
          <div className="relative mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="mb-8 text-4xl font-bold text-[#EEEEEE] md:text-5xl">
                Always <span className="text-[#00ADB5]">Learning</span>
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-lg text-[#00ADB5]/70">
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
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="rounded-2xl border border-[#393E46]/50 bg-[#393E46]/20 px-6 py-3 text-sm font-medium text-[#EEEEEE] backdrop-blur-sm transition-all hover:border-[#00ADB5]/50 hover:bg-[#00ADB5]/10"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
    </div>
  )
}
