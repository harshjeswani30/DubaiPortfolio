"use client"

import { useEffect, useState, useCallback } from "react"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const updatePosition = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
    setIsVisible(true)
  }, [])

  const checkHover = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const isInteractive = 
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.closest("a") ||
      target.closest("button") ||
      target.classList.contains("cursor-pointer")
    setIsHovering(!!isInteractive)
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mouseover", checkHover)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mouseover", checkHover)
    }
  }, [updatePosition, checkHover])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden mix-blend-difference lg:block"
        style={{
          transform: `translate(${position.x - 8}px, ${position.y - 8}px)`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className="rounded-full bg-[#A5C9CA] transition-transform duration-150 ease-out"
          style={{
            width: isHovering ? 32 : 16,
            height: isHovering ? 32 : 16,
          }}
        />
      </div>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden lg:block"
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px)`,
          opacity: isVisible ? 0.3 : 0,
        }}
      >
        <div
          className="rounded-full border border-[#A5C9CA]/50 transition-all duration-200 ease-out"
          style={{
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
          }}
        />
      </div>
    </>
  )
}
