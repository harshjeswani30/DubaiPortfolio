"use client"

import { Suspense, useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Float, OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

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

function SkillOrb({ 
  skill, 
  position, 
  isSelected, 
  onSelect 
}: { 
  skill: Skill
  position: [number, number, number]
  isSelected: boolean
  onSelect: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const color = skill.color || categoryColors[skill.category] || "#00ADB5"
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  const scale = (skill.proficiency / 100) * 0.5 + 0.5

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
      position={position}
    >
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onSelect}
      >
        <Sphere
          ref={meshRef}
          args={[scale, 64, 64]}
          scale={hovered || isSelected ? 1.2 : 1}
        >
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
          />
        </Sphere>
        
        <Text
          position={[0, scale + 0.4, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-medium.woff"
        >
          {skill.name}
        </Text>
        
        {(hovered || isSelected) && (
          <Text
            position={[0, scale + 0.7, 0]}
            fontSize={0.15}
            color="#888888"
            anchorX="center"
            anchorY="middle"
          >
            {skill.proficiency}%
          </Text>
        )}
      </group>
    </Float>
  )
}

function ParticleField() {
  const count = 500
  const particlesRef = useRef<THREE.Points>(null)
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00ADB5"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function Scene({ skills, selectedSkill, onSelectSkill }: { 
  skills: Skill[]
  selectedSkill: string | null
  onSelectSkill: (id: string | null) => void
}) {
  const positions = useMemo(() => {
    const pos: [number, number, number][] = []
    const radius = 5
    const layers = 3
    
    skills.forEach((_, index) => {
      const layer = Math.floor(index / 6)
      const angleOffset = layer * 0.5
      const angle = ((index % 6) / 6) * Math.PI * 2 + angleOffset
      const layerRadius = radius - layer * 1.5
      const y = (layer - layers / 2) * 2
      
      pos.push([
        Math.cos(angle) * layerRadius,
        y + (Math.random() - 0.5) * 1,
        Math.sin(angle) * layerRadius
      ])
    })
    
    return pos
  }, [skills])

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ADB5" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
      <spotLight position={[0, 15, 0]} intensity={0.8} angle={0.5} penumbra={1} color="#ffffff" />
      
      <ParticleField />
      
      {skills.map((skill, index) => (
        <SkillOrb
          key={skill.id}
          skill={skill}
          position={positions[index]}
          isSelected={selectedSkill === skill.id}
          onSelect={() => onSelectSkill(selectedSkill === skill.id ? null : skill.id)}
        />
      ))}
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

function SkillCard({ skill, isActive }: { skill: Skill; isActive: boolean }) {
  const color = skill.color || categoryColors[skill.category] || "#00ADB5"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 ${
        isActive 
          ? "border-white/30 bg-white/10" 
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
    >
      <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 50% 0%, ${color}40, transparent 70%)` }} />
      
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-white">{skill.name}</span>
          <span 
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: `${color}30`, color }}
          >
            {skill.category}
          </span>
        </div>
        
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-zinc-400">Proficiency</span>
          <span className="font-semibold text-white">{skill.proficiency}%</span>
        </div>
        
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${skill.proficiency}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function CategoryFilter({ 
  categories, 
  activeCategory, 
  onSelect 
}: { 
  categories: string[]
  activeCategory: string
  onSelect: (category: string) => void
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => {
        const color = categoryColors[category] || "#00ADB5"
        const isActive = activeCategory === category
        
        return (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(category)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              isActive
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }`}
            style={{
              backgroundColor: isActive ? `${color}30` : "transparent",
              border: `1px solid ${isActive ? color : "rgba(255,255,255,0.1)"}`,
            }}
          >
            {category}
          </motion.button>
        )
      })}
    </div>
  )
}

export function SkillsContent({ skills }: { skills: Skill[] }) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("All")
  
  const categories = useMemo(() => {
    const cats = [...new Set(skills.map(s => s.category))]
    return ["All", ...cats]
  }, [skills])
  
  const filteredSkills = useMemo(() => {
    if (activeCategory === "All") return skills
    return skills.filter(s => s.category === activeCategory)
  }, [skills, activeCategory])
  
  const selectedSkillData = skills.find(s => s.id === selectedSkill)

  return (
    <div className="min-h-screen bg-black">
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 12], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <Scene
                skills={skills}
                selectedSkill={selectedSkill}
                onSelectSkill={setSelectedSkill}
              />
            </Suspense>
          </Canvas>
        </div>
        
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.3em] text-[#00ADB5]">
              Technical Expertise
            </span>
            <h1 className="font-serif text-5xl text-white md:text-7xl">
              Skills & <em className="text-white/70">Technologies</em>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Interact with the 3D visualization - click orbs to explore skills
            </p>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {selectedSkillData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="pointer-events-auto w-full max-w-md px-6"
              >
                <SkillCard skill={selectedSkillData} isActive={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
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
        </div>
      </section>
      
      <section className="relative py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-[#00ADB5]/10 blur-[150px]" />
          <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[150px]" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              All Skills
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-zinc-400">
              Filter by category to explore my technical proficiencies
            </p>
            
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </motion.div>
          
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SkillCard skill={skill} isActive={selectedSkill === skill.id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Skill Distribution
            </h2>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categoryColors).map(([category, color]) => {
              const categorySkills = skills.filter(s => s.category === category)
              if (categorySkills.length === 0) return null
              
              const avgProficiency = Math.round(
                categorySkills.reduce((acc, s) => acc + s.proficiency, 0) / categorySkills.length
              )
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
                  />
                  
                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">{category}</h3>
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-zinc-400">Average Proficiency</span>
                        <span className="font-semibold" style={{ color }}>{avgProficiency}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${avgProficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-full px-3 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: `${color}30` }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
