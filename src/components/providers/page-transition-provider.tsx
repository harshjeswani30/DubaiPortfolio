"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
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
  completeTransition: () => void
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionData, setTransitionData] = useState<TransitionData | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const router = useRouter()

  const startTransition = useCallback((data: TransitionData, href: string) => {
    setTransitionData(data)
    setIsTransitioning(true)
    setShowOverlay(true)
    
    setTimeout(() => {
      router.push(href)
    }, 800)
  }, [router])

  const completeTransition = useCallback(() => {
    setShowOverlay(false)
    setTimeout(() => {
      setIsTransitioning(false)
      setTransitionData(null)
    }, 100)
  }, [])

  const originRect = transitionData?.originRect

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, transitionData, startTransition, completeTransition }}>
      {children}
      
      <AnimatePresence>
        {showOverlay && transitionData && originRect && (
          <motion.div
            className="fixed inset-0 z-[9999] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute bg-[#222831]"
              initial={{
                left: originRect.left,
                top: originRect.top,
                width: originRect.width,
                height: originRect.height,
                borderRadius: 16,
              }}
              animate={{
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              {transitionData.projectImage && (
                <motion.div 
                  className="absolute inset-0"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                >
                  <Image
                    src={transitionData.projectImage}
                    alt={transitionData.projectTitle}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/70 to-[#222831]/40" />
                </motion.div>
              )}

              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-4 py-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <motion.span
                    className="h-2 w-2 rounded-full bg-[#00ADB5]"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm font-semibold text-[#00ADB5] uppercase tracking-wider">
                    {transitionData.projectCategory}
                  </span>
                </motion.div>

                <motion.h2
                  className="text-center text-4xl font-bold text-[#EEEEEE] md:text-6xl lg:text-7xl"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {transitionData.projectTitle}
                </motion.h2>

                <motion.div
                  className="mt-8 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.3 }}
                >
                  <motion.div
                    className="h-1 w-1 rounded-full bg-[#00ADB5]"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="h-1 w-1 rounded-full bg-[#00ADB5]"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="h-1 w-1 rounded-full bg-[#00ADB5]"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </motion.div>
              </motion.div>
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
