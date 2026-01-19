"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      setProgress((scrolled / scrollHeight) * 100)
    }

    window.addEventListener("scroll", updateProgress)
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <motion.div
      className="scroll-progress fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-indigo-500 to-purple-600"
      style={{ scaleX: progress / 100 }}
    />
  )
}
