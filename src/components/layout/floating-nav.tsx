"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code2 } from "lucide-react"
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

export function FloatingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  
  const floatY = useTransform(scrollY, [0, 100], [0, 8])

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
        className="fixed top-6 left-0 right-0 z-[110] px-4 md:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-[#393E46]/50 bg-[#222831]/80 px-4 py-3 shadow-xl backdrop-blur-xl"
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#393E46] glow-sm"
                >
                  <Code2 className="h-4 w-4 text-[#00ADB5]" />
                </motion.div>
                <span className="hidden text-lg font-bold text-[#EEEEEE] sm:block">Portfolio</span>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden rounded-2xl border border-[#393E46]/50 bg-[#222831]/80 px-4 py-3 shadow-xl backdrop-blur-xl md:block"
          >
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "text-[#EEEEEE]"
                        : "text-[#00ADB5]/70 hover:text-[#EEEEEE]"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pathname === item.href && (
                      <motion.div
                        layoutId="floating-nav-indicator"
                        className="absolute inset-0 rounded-lg bg-[#393E46]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl border border-[#393E46]/50 bg-[#222831]/80 px-3 py-3 shadow-xl backdrop-blur-xl"
          >
            <MenuButton
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-[120]"
            />
          </motion.div>
        </div>
      </motion.nav>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
