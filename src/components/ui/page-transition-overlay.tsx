"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePageTransition } from "@/components/providers/page-transition-provider"

export function PageTransitionOverlay() {
  const { isTransitioning, transitionData } = usePageTransition()
  const [clipPath, setClipPath] = useState("circle(0% at 50% 50%)")
  const [originPoint, setOriginPoint] = useState({ x: 50, y: 50 })

  useEffect(() => {
    if (transitionData?.originRect) {
      const rect = transitionData.originRect
      const centerX = ((rect.left + rect.width / 2) / window.innerWidth) * 100
      const centerY = ((rect.top + rect.height / 2) / window.innerHeight) * 100
      setOriginPoint({ x: centerX, y: centerY })
      setClipPath(`circle(0% at ${centerX}% ${centerY}%)`)
    }
  }, [transitionData])

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#222831]"
            initial={{ clipPath: `circle(0% at ${originPoint.x}% ${originPoint.y}%)` }}
            animate={{ clipPath: `circle(150% at ${originPoint.x}% ${originPoint.y}%)` }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#222831] via-[#2a2f38] to-[#1a1e24]" />
            
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,173,181,0.08),transparent_70%)]" />
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative max-w-4xl px-8 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-4 py-2"
                >
                  <motion.span
                    className="h-2 w-2 rounded-full bg-[#00ADB5]"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-[#00ADB5] uppercase tracking-wider">
                    {transitionData?.projectCategory || "Loading"}
                  </span>
                </motion.div>

                <div className="overflow-hidden">
                  <motion.h1
                    className="text-5xl font-bold text-[#EEEEEE] md:text-7xl lg:text-8xl"
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {transitionData?.projectTitle?.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        className="inline-block mr-4"
                        initial={{ y: 100, opacity: 0, scale: 1.1 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.25 + i * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <span className="gradient-text">{word}</span>
                      </motion.span>
                    ))}
                  </motion.h1>
                </div>

                <motion.div
                  className="mt-10 flex justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-1 w-12 rounded-full bg-[#393E46]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        delay: 0.9 + i * 0.1,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/60"
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: [0, 1, 0] }}
                        transition={{
                          delay: 1 + i * 0.1,
                          duration: 0.8,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 0.3,
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ADB5] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${originPoint.x}% ${originPoint.y}%, rgba(0,173,181,0.15) 0%, transparent 50%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
