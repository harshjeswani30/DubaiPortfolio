"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Home, User, FolderKanban, Wrench, BookOpen, FileText, Mail, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/skills", label: "Skills", icon: Wrench },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/contact", label: "Contact", icon: Mail },
]

export function LeftSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-[200] flex h-12 w-12 items-center justify-center rounded-xl bg-[#222831] border border-[#393E46]/50 backdrop-blur-xl md:hidden"
      >
        <Menu className="h-5 w-5 text-[#EEEEEE]" />
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-[198] bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isExpanded ? 240 : 80,
          x: isMobileOpen ? 0 : (typeof window !== "undefined" && window.innerWidth < 768 ? -100 : 0)
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={cn(
          "fixed left-0 top-0 z-[199] flex h-screen flex-col bg-[#1a1f27] border-r border-[#393E46]/30",
          "transition-[width] duration-300 ease-out",
          "max-md:translate-x-[-100%] max-md:data-[open=true]:translate-x-0"
        )}
        data-open={isMobileOpen}
        style={{
          width: isMobileOpen ? 280 : undefined,
        }}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#393E46]/50 md:hidden"
        >
          <X className="h-5 w-5 text-[#EEEEEE]" />
        </button>

        <div className="flex h-20 items-center justify-center border-b border-[#393E46]/30 px-4">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <motion.div
              className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00ADB5] to-[#00878d]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-bogard text-xl font-bold text-white">P</span>
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity hover:opacity-100" />
            </motion.div>
            <AnimatePresence mode="wait">
              {(isExpanded || isMobileOpen) && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-bogard text-lg font-bold tracking-wider text-[#EEEEEE] whitespace-nowrap"
                >
                  PORTFOLIO
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200",
                      isActive
                        ? "bg-[#00ADB5]/10 text-[#00ADB5]"
                        : "text-[#EEEEEE]/60 hover:bg-[#393E46]/30 hover:text-[#EEEEEE]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#00ADB5]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <div className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-[#00ADB5]/20" 
                        : "bg-[#393E46]/30 group-hover:bg-[#393E46]/50"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-[#00ADB5]" : ""
                      )} />
                    </div>
                    <AnimatePresence mode="wait">
                      {(isExpanded || isMobileOpen) && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.15 }}
                          className="text-sm font-medium whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (isExpanded || isMobileOpen) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto h-2 w-2 rounded-full bg-[#00ADB5]"
                      />
                    )}
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-[#393E46]/30 p-4">
          <div className={cn(
            "flex items-center gap-3 overflow-hidden",
            !isExpanded && !isMobileOpen && "justify-center"
          )}>
            <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#393E46] to-[#222831] p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1a1f27]">
                <span className="text-sm font-bold text-[#00ADB5]">DC</span>
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1a1f27] bg-green-500" />
            </div>
            <AnimatePresence mode="wait">
              {(isExpanded || isMobileOpen) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col overflow-hidden"
                >
                  <span className="text-sm font-medium text-[#EEEEEE] truncate">Developer</span>
                  <span className="text-xs text-[#EEEEEE]/50 truncate">Available for work</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
