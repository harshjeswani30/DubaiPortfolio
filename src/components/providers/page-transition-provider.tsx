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
  const [isReverse, setIsReverse] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'expanding' | 'collapsing'>('idle')
  const router = useRouter()

  const startTransition = useCallback((data: TransitionData, href: string) => {
    if (data.originRect) {
      sessionStorage.setItem('lastCardRect', JSON.stringify({
        left: data.originRect.left,
        top: data.originRect.top,
        width: data.originRect.width,
        height: data.originRect.height,
      }))
      sessionStorage.setItem('lastProjectData', JSON.stringify({
        targetSlug: data.targetSlug,
        projectTitle: data.projectTitle,
        projectCategory: data.projectCategory,
        projectImage: data.projectImage,
      }))
    }
    setTransitionData(data)
    setIsTransitioning(true)
    setShowOverlay(true)
    setIsReverse(false)
    setAnimationPhase('expanding')
    
    setTimeout(() => {
      router.push(href)
    }, 500)
  }, [router])

  const startReverseTransition = useCallback((href: string) => {
    const savedRect = sessionStorage.getItem('lastCardRect')
    const savedData = sessionStorage.getItem('lastProjectData')
    
    if (savedRect && savedData) {
      const rect = JSON.parse(savedRect)
      const data = JSON.parse(savedData)
      
      setTransitionData({
        originRect: rect as DOMRect,
        targetSlug: data.targetSlug,
        projectTitle: data.projectTitle,
        projectCategory: data.projectCategory,
        projectImage: data.projectImage,
      })
      setIsTransitioning(true)
      setShowOverlay(true)
      setIsReverse(true)
      setAnimationPhase('collapsing')
      
      setTimeout(() => {
        router.push(href)
      }, 50)
      
      setTimeout(() => {
        setShowOverlay(false)
        setIsTransitioning(false)
        setTransitionData(null)
        setIsReverse(false)
        setAnimationPhase('idle')
        sessionStorage.removeItem('lastCardRect')
        sessionStorage.removeItem('lastProjectData')
      }, 600)
    } else {
      router.push(href)
    }
  }, [router])

  const completeTransition = useCallback(() => {
    setShowOverlay(false)
    setAnimationPhase('idle')
    setTimeout(() => {
      setIsTransitioning(false)
      setTransitionData(null)
    }, 100)
  }, [])

  const originRect = transitionData?.originRect

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, transitionData, startTransition, startReverseTransition, completeTransition }}>
      {children}
      
      <AnimatePresence mode="wait">
        {showOverlay && transitionData && originRect && (
          <motion.div
            key="transition-overlay"
            className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: isReverse ? 0.4 : 0 }}
          >
            <motion.div
              className="absolute bg-[#222831] overflow-hidden"
              initial={isReverse ? {
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
              } : {
                left: originRect.left,
                top: originRect.top,
                width: originRect.width,
                height: originRect.height,
                borderRadius: 16,
              }}
              animate={isReverse ? {
                left: originRect.left,
                top: originRect.top,
                width: originRect.width,
                height: originRect.height,
                borderRadius: 16,
              } : {
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
              }}
              transition={{
                duration: 0.55,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              {transitionData.projectImage && (
                <motion.div 
                  className="absolute inset-0"
                  initial={{ opacity: isReverse ? 1 : 0.9 }}
                  animate={{ opacity: isReverse ? 0.9 : 1 }}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                >
                  <Image
                    src={transitionData.projectImage}
                    alt={transitionData.projectTitle}
                    fill
                    className="object-cover"
                    priority
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/50 to-[#222831]/30"
                    initial={{ opacity: isReverse ? 0.5 : 1 }}
                    animate={{ opacity: isReverse ? 1 : 0.5 }}
                    transition={{ duration: 0.5 }}
                  />
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
