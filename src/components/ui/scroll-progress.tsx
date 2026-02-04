"use client"

import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    let ticking = false

    const updateProgress = () => {
      if (!progressRef.current) return
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = Math.min(Math.max((scrolled / scrollHeight), 0), 1)
      progressRef.current.style.transform = `scaleX(${progress})`
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    updateProgress()
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={progressRef}
      className="scroll-progress fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-indigo-500 to-purple-600 will-change-transform"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}
