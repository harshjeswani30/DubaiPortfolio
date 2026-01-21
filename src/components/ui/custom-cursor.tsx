"use client"

import { useEffect, useRef, useCallback } from "react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: -100, y: -100 })
  const isHoveringRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  const updateCursor = useCallback(() => {
    if (cursorRef.current && outerRef.current) {
      const { x, y } = positionRef.current
      cursorRef.current.style.transform = `translate3d(${x - 8}px, ${y - 8}px, 0)`
      outerRef.current.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`
    }
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    positionRef.current = { x: e.clientX, y: e.clientY }
    
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "1"
    }
    if (outerRef.current) {
      outerRef.current.style.opacity = "0.3"
    }
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = requestAnimationFrame(updateCursor)
  }, [updateCursor])

  const checkHover = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const isInteractive = 
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.closest("a") ||
      target.closest("button") ||
      target.classList.contains("cursor-pointer")
    
    const hovering = !!isInteractive
    if (hovering !== isHoveringRef.current) {
      isHoveringRef.current = hovering
      if (dotRef.current) {
        dotRef.current.style.width = hovering ? "32px" : "16px"
        dotRef.current.style.height = hovering ? "32px" : "16px"
      }
      if (ringRef.current) {
        ringRef.current.style.width = hovering ? "48px" : "32px"
        ringRef.current.style.height = hovering ? "48px" : "32px"
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseover", checkHover, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", checkHover)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleMouseMove, checkHover])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden mix-blend-difference will-change-transform lg:block"
        style={{ opacity: 0 }}
      >
        <div
          ref={dotRef}
          className="rounded-full bg-[#00ADB5]"
          style={{
            width: 16,
            height: 16,
            transition: "width 0.15s ease-out, height 0.15s ease-out",
          }}
        />
      </div>
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden will-change-transform lg:block"
        style={{ opacity: 0 }}
      >
        <div
          ref={ringRef}
          className="rounded-full border border-[#A5C9CA]/50"
          style={{
            width: 32,
            height: 32,
            transition: "width 0.2s ease-out, height 0.2s ease-out",
          }}
        />
      </div>
    </>
  )
}
