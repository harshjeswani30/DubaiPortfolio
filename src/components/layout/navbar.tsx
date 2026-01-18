"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Command, Code2 } from "lucide-react"
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

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed left-0 right-0 top-0 z-[110] transition-all duration-300",
          scrolled && "bg-[#222831]/80 backdrop-blur-xl"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="relative z-50">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#393E46] glow-sm"
              >
                  <Code2 className="h-5 w-5 text-[#00ADB5]" />
              </motion.div>
              <span className="text-xl font-bold text-[#EEEEEE]">Portfolio</span>
            </motion.div>
          </Link>

          <div className="hidden items-center gap-1 rounded-2xl border border-[#393E46]/50 bg-[#393E46]/10 px-2 py-2 backdrop-blur-xl md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    "relative rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-[#EEEEEE]"
                      : "text-[#00ADB5]/70 hover:text-[#EEEEEE]"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pathname === item.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-xl bg-[#393E46]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const event = new KeyboardEvent("keydown", { key: "k", metaKey: true })
                document.dispatchEvent(event)
              }}
              className="hidden items-center gap-2 rounded-xl border border-[#393E46]/50 bg-[#393E46]/10 px-3 py-2 text-sm text-[#00ADB5]/70 backdrop-blur-xl transition-all hover:border-[#00ADB5]/50 hover:text-[#00ADB5] md:flex"
            >
              <Command className="h-3 w-3" />
              <span>K</span>
            </motion.button>

            <MenuButton
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-[120]"
            />
          </div>
        </nav>
      </motion.header>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
