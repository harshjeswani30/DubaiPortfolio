"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface TransitionData {
  originRect: DOMRect | null
  targetSlug: string
  projectTitle: string
  projectCategory: string
  projectImage?: string
}

interface PageTransitionContextType {
  isTransitioning: boolean
  transitionData: TransitionData | null
  startTransition: (data: TransitionData, href: string) => void
  startReverseTransition: (href: string) => void
  completeTransition: () => void
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionData, setTransitionData] = useState<TransitionData | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [targetRect, setTargetRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const router = useRouter()

  const startTransition = useCallback((data: TransitionData, href: string) => {
    if (data.originRect) {
      const scrollY = window.scrollY
      sessionStorage.setItem('lastProjectSlug', data.targetSlug)
      sessionStorage.setItem('lastScrollPosition', scrollY.toString())
    }
    setTransitionData(data)
    setIsTransitioning(true)
    setShowOverlay(true)
    setTargetRect(data.originRect ? {
      left: data.originRect.left,
      top: data.originRect.top,
      width: data.originRect.width,
      height: data.originRect.height,
    } : null)
    
    setTimeout(() => {
      router.push(href)
    }, 500)
  }, [router])

  const startReverseTransition = useCallback((href: string) => {
    const scrollPosition = sessionStorage.getItem('lastScrollPosition')
    
    sessionStorage.removeItem('lastProjectSlug')
    sessionStorage.removeItem('lastScrollPosition')
    
    if (scrollPosition) {
      router.push(href)
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition))
      }, 100)
    } else {
      router.push(href)
    }
  }, [router])

  const completeTransition = useCallback(() => {
    setShowOverlay(false)
    setTimeout(() => {
      setIsTransitioning(false)
      setTransitionData(null)
    }, 100)
  }, [])

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, transitionData, startTransition, startReverseTransition, completeTransition }}>
      {children}
      
      <AnimatePresence mode="wait">
        {showOverlay && transitionData && (
          <motion.div
            key="transition-overlay"
            className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="absolute bg-[#222831] overflow-hidden"
              initial={targetRect ? {
                left: targetRect.left,
                top: targetRect.top,
                width: targetRect.width,
                height: targetRect.height,
                borderRadius: 16,
              } : {
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
              }}
              animate={{
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              {transitionData.projectImage && (
                <motion.div 
                  className="absolute inset-0"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={transitionData.projectImage}
                    alt={transitionData.projectTitle}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/50 to-[#222831]/30" />
                </motion.div>
              )}
              
              {!transitionData.projectImage && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#393E46]/30 via-[#2a2f38] to-[#222831]" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext)
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider")
  }
  return context
}
