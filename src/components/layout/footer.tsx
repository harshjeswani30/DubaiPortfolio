"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail, ArrowUp, Heart, Code2 } from "lucide-react"

const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "mailto:hello@portfolio.com", icon: Mail, label: "Email" },
]

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative border-t border-[#395B64]/30 bg-[#2C3333]">
      <div className="absolute inset-0 dot-background opacity-30" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#395B64] glow-sm">
                    <Code2 className="h-6 w-6 text-[#A5C9CA]" />
                </div>
                <span className="text-xl font-bold text-[#E7F6F2]">Portfolio</span>
              </motion.div>
            </Link>
            <p className="mt-4 max-w-sm text-[#A5C9CA]/70 leading-relaxed">
              Building digital experiences that matter. Full-stack developer passionate about
              creating beautiful, performant applications.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#395B64]/50 bg-[#395B64]/10 text-[#A5C9CA]/70 transition-all hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 hover:text-[#A5C9CA]"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#E7F6F2]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A5C9CA]/70 transition-colors hover:text-[#A5C9CA]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#E7F6F2]">
              Get in Touch
            </h3>
            <p className="text-[#A5C9CA]/70">hello@portfolio.com</p>
            <p className="mt-2 text-[#A5C9CA]/70">Dubai, UAE</p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <span className="inline-flex items-center gap-2 rounded-xl border border-[#395B64]/50 bg-[#395B64]/10 px-4 py-2 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A5C9CA] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A5C9CA]" />
                </span>
                <span className="text-[#A5C9CA]">Available for work</span>
              </span>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#395B64]/30 pt-8 md:flex-row">
          <p className="flex items-center gap-2 text-sm text-[#A5C9CA]/50">
            © {new Date().getFullYear()} Portfolio. Made with 
            <Heart className="h-4 w-4 fill-[#A5C9CA]/50 text-[#A5C9CA]/50" />
            in Dubai
          </p>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#395B64]/50 bg-[#395B64]/10 text-[#A5C9CA]/70 transition-all hover:border-[#A5C9CA]/50 hover:bg-[#395B64]/30 hover:text-[#A5C9CA]"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
