"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { SideMenu, MenuButton } from "@/components/ui/side-menu"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
]

const hasMountedRef = { current: false }

function MagneticLink({ 
  children, 
  href, 
  isActive 
}: { 
  children: React.ReactNode, 
  href: string, 
  isActive: boolean 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 }
    const centerX = left + width / 2
    const centerY = top + height / 2
    const distanceX = clientX - centerX
    const distanceY = clientY - centerY
    
    x.set(distanceX * 0.4)
    y.set(distanceY * 0.4)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        className={cn(
          "relative rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
          isActive
            ? "text-[#EEEEEE]"
            : "text-[#00ADB5]/70 hover:text-[#EEEEEE]"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="floating-nav-indicator"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00ADB5]/20 to-[#393E46] border border-[#00ADB5]/30 shadow-[0_0_15px_rgba(0,173,181,0.2)]"
            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          {isActive && <Zap className="h-3 w-3 text-[#00ADB5] animate-pulse" />}
          {children}
        </span>
      </motion.div>
    </Link>
  )
}

export function FloatingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(hasMountedRef.current)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [10, -10]), { damping: 20, stiffness: 150 })
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-10, 10]), { damping: 20, stiffness: 150 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }
  
  const floatY = useTransform(scrollY, [0, 100], [0, 8])

  useEffect(() => {
    hasMountedRef.current = true
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1)
      }
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [isMenuOpen])

  return (
    <>
      <motion.nav
        initial={hasMounted ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ y: floatY, perspective: 1000 }}
        className="floating-nav fixed top-6 left-0 right-0 z-[110] px-4 md:px-8"
      >
        <motion.div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 transition-transform duration-200 ease-out"
        >
          <motion.div
            initial={hasMounted ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group rounded-2xl border border-[#393E46]/50 bg-[#222831]/90 px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:border-[#00ADB5]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,173,181,0.3)]"
          >
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#393E46] shadow-inner transition-colors group-hover:bg-[#00ADB5]/10"
                >
                  <Code2 className="h-5 w-5 text-[#00ADB5]" />
                </motion.div>
                <span className="hidden text-xl font-bold tracking-tight text-[#EEEEEE] sm:block">
                  Portfolio<span className="text-[#00ADB5]">.</span>
                </span>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={hasMounted ? false : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden rounded-2xl border border-[#393E46]/50 bg-[#222831]/90 px-2 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl md:block"
          >
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <MagneticLink 
                  key={item.href} 
                  href={item.href} 
                  isActive={pathname === item.href}
                >
                  {item.label}
                </MagneticLink>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={hasMounted ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl border border-[#393E46]/50 bg-[#222831]/90 px-3 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:border-[#00ADB5]/30"
          >
            <MenuButton
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-[120]"
            />
          </motion.div>
        </motion.div>
      </motion.nav>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

