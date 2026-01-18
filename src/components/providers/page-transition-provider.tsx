"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useRouter } from "next/navigation"

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
  completeTransition: () => void
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionData, setTransitionData] = useState<TransitionData | null>(null)
  const router = useRouter()

  const startTransition = useCallback((data: TransitionData, href: string) => {
    setTransitionData(data)
    setIsTransitioning(true)
    
    setTimeout(() => {
      router.push(href)
    }, 600)
  }, [router])

  const completeTransition = useCallback(() => {
    setIsTransitioning(false)
    setTransitionData(null)
  }, [])

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, transitionData, startTransition, completeTransition }}>
      {children}
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
