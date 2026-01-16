"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  User,
  Briefcase,
  Code,
  FileText,
  Mail,
  Moon,
  Sun,
  Search,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import { useTheme } from "next-themes"

const pages = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Skills", href: "/skills", icon: Code },
  { name: "Blog", href: "/blog", icon: FileText },
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "Contact", href: "/contact", icon: Mail },
]

const socials = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const toggle = useCallback(() => setOpen((o) => !o), [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggle])

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    []
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-1/4 z-[201] w-full max-w-lg -translate-x-1/2"
          >
            <Command className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-white/10 px-4">
                <Search className="h-4 w-4 text-zinc-500" />
                <Command.Input
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent py-4 text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Pages" className="px-2 py-1.5 text-xs font-medium text-zinc-500">
                  {pages.map((page) => (
                    <Command.Item
                      key={page.href}
                      value={page.name}
                      onSelect={() => runCommand(() => router.push(page.href))}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white"
                    >
                      <page.icon className="h-4 w-4" />
                      {page.name}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Theme" className="px-2 py-1.5 text-xs font-medium text-zinc-500">
                  <Command.Item
                    value="Toggle theme"
                    onSelect={() =>
                      runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))
                    }
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                    Toggle {theme === "dark" ? "Light" : "Dark"} Mode
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Social" className="px-2 py-1.5 text-xs font-medium text-zinc-500">
                  {socials.map((social) => (
                    <Command.Item
                      key={social.name}
                      value={social.name}
                      onSelect={() =>
                        runCommand(() => window.open(social.href, "_blank"))
                      }
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-white/10 aria-selected:text-white"
                    >
                      <social.icon className="h-4 w-4" />
                      {social.name}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-xs text-zinc-500">
                <span>Navigate with ↑↓</span>
                <span>Press Enter to select</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
