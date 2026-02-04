"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Code2, Home, User, FolderKanban, Wrench, BookOpen, FileText, Mail } from "lucide-react"
import { useOnClickOutside } from "usehooks-ts"
import { cn } from "@/lib/utils"
import { SideMenu, MenuButton } from "@/components/ui/side-menu"

interface Tab {
  title: string
  icon: typeof Home
  href: string
  type?: never
}

interface Separator {
  type: "separator"
  title?: never
  icon?: never
  href?: never
}

type TabItem = Tab | Separator

const tabs: TabItem[] = [
  { title: "Home", icon: Home, href: "/" },
  { title: "About", icon: User, href: "/about" },
  { title: "Projects", icon: FolderKanban, href: "/projects" },
  { type: "separator" },
  { title: "Skills", icon: Wrench, href: "/skills" },
  { title: "Blog", icon: BookOpen, href: "/blog" },
  { type: "separator" },
  { title: "Resume", icon: FileText, href: "/resume" },
  { title: "Contact", icon: Mail, href: "/contact" },
]

const hasMountedRef = { current: false }

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
}

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
}

const transition = { delay: 0.05, type: "spring" as const, bounce: 0, duration: 0.4 }

function ExpandableTabs({
  activeColor = "text-[#00ADB5]"
}: {
  activeColor?: string
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const outsideClickRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  useOnClickOutside(outsideClickRef as React.RefObject<HTMLElement>, () => {
    setHovered(null)
  })

  const handleClick = (href: string) => {
    router.push(href)
  }

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-[#393E46]" aria-hidden="true" />
  )

  return (
    <div
      ref={outsideClickRef}
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#393E46]/50 bg-[#222831]/90 p-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      onMouseLeave={() => setHovered(null)}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />
        }

        const Icon = tab.icon
        const isActive = pathname === tab.href
        const isHovered = hovered === index
        const isExpanded = isActive || isHovered

        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={isExpanded}
            onClick={() => handleClick(tab.href)}
            onMouseEnter={() => setHovered(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
              isActive
                ? cn("bg-[#393E46]", activeColor)
                : isHovered
                  ? "bg-[#393E46]/70 text-[#EEEEEE]"
                  : "text-[#EEEEEE]/60 hover:text-[#EEEEEE]"
            )}
          >
            <Icon size={18} />
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}

export function FloatingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(hasMountedRef.current)
  const { scrollY } = useScroll()
  const pathname = usePathname()

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

  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <>
      <motion.nav
        initial={hasMounted ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ y: floatY }}
        className="floating-nav fixed top-6 left-0 right-0 z-[110] px-4 md:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="group relative z-[130]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer flex items-center gap-3 rounded-2xl border border-[#393E46]/50 bg-[#222831]/90 px-4 py-2.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:border-[#00ADB5]/30"
            >
              <motion.div
                className="relative flex h-9 w-9 items-center justify-center"
              >
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00ADB5] to-[#00ADB5]/50"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                />
                <motion.div
                  className="absolute inset-[2px] rounded-md bg-[#222831] flex items-center justify-center"
                  style={{ borderRadius: '28% 72% 72% 28% / 28% 28% 72% 72%' }}
                >
                  <Code2 className="h-4 w-4 text-[#00ADB5]" />
                </motion.div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-[0.2em] text-[#00ADB5]">DEV</span>
                <span className="text-[10px] font-medium tracking-wider text-[#EEEEEE]/60 -mt-0.5">PORTFOLIO</span>
              </div>
            </motion.div>
          </Link>


          <motion.div
            initial={hasMounted ? false : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="hidden md:block"
          >
            <ExpandableTabs />
          </motion.div>

          <motion.div
            initial={hasMounted ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="rounded-2xl border border-[#393E46]/50 bg-[#222831]/90 px-3 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:border-[#00ADB5]/30"
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
