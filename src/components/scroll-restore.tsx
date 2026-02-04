"use client"

import { useEffect } from "react"

export function ScrollRestore() {
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('lastScrollPosition')
    if (savedPosition) {
      // Wait for all content to render and smooth scroll to initialize
      const scrollDelay = setTimeout(() => {
        const position = parseInt(savedPosition, 10)
        window.scrollTo({
          top: position,
          behavior: 'instant'
        })
        sessionStorage.removeItem('lastScrollPosition')
      }, 500)

      return () => clearTimeout(scrollDelay)
    }
  }, [])

  return null
}
