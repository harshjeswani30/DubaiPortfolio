"use client"

import { useEffect } from "react"

export function ScrollRestore() {
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('homeScrollPosition')
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10))
        sessionStorage.removeItem('homeScrollPosition')
      }, 100)
    }
  }, [])

  return null
}
