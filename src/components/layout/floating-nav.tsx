"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code2, Command, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
]

export function FloatingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  
  const floatY = useTransform(scrollY, [0, 100], [0, 8])
  const bgOpacity = useTransform(scrollY, [0, 100], [0.1, 0.8])
  const borderOpacity = useTransform(scrollY, [0, 100], [0.3, 0.6])
  const blur = useTransform(scrollY, [0, 100], [10, 20])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ y: floatY }}
        className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
      >
        <motion.div
          style={{
            backgroundColor: `rgba(44, 51, 51, ${bgOpacity.get()})`,
            borderColor: `rgba(57, 91, 100, ${borderOpacity.get()})`,
            backdropFilter: `blur(${blur.get()}px)`,
          }}
          className="flex items-center gap-4 rounded-2xl border px-4 py-3 shadow-xl"
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
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#395B64] glow-sm"
              >
                <Code2 className="h-4 w-4 text-[#A5C9CA]" />
              </motion.div>
              <span className="hidden text-lg font-bold text-[#E7F6F2] sm:block">Portfolio</span>
            </motion.div>
          </Link>

          <div className="hidden h-6 w-px bg-[#395B64]/50 md:block" />

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-[#E7F6F2]"
                      : "text-[#A5C9CA]/70 hover:text-[#E7F6F2]"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pathname === item.href && (
                    <motion.div
                      layoutId="floating-nav-indicator"
                      className="absolute inset-0 rounded-lg bg-[#395B64]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="hidden h-6 w-px bg-[#395B64]/50 md:block" />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden items-center gap-1.5 rounded-lg border border-[#395B64]/50 bg-[#395B64]/20 px-2.5 py-1.5 text-xs text-[#A5C9CA]/70 transition-all hover:border-[#A5C9CA]/50 hover:text-[#A5C9CA] md:flex"
          >
            <Command className="h-3 w-3" />
            <span>K</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#395B64]/50 bg-[#395B64]/20 text-[#E7F6F2] md:hidden"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.button>
        </motion.div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#2C3333]/98 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="flex h-full flex-col items-center justify-center gap-6"
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "relative block text-3xl font-bold transition-colors",
                      pathname === item.href ? "text-[#A5C9CA]" : "text-[#E7F6F2]/60 hover:text-[#E7F6F2]"
                    )}
                  >
                    {pathname === item.href && (
                      <motion.span
                        layoutId="mobile-nav-indicator"
                        className="absolute -left-6 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#A5C9CA]"
                      />
                    )}
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl border border-[#395B64] bg-[#395B64]/20 px-4 py-2 text-sm text-[#A5C9CA]"
                >
                  <Command className="h-4 w-4" />
                  <span>Press K for search</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
