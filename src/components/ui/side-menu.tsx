'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

const menuLinks = [
  { href: '/', label: 'Home', number: '01' },
  { href: '/about', label: 'About', number: '02' },
  { href: '/projects', label: 'Projects', number: '03' },
  { href: '/skills', label: 'Skills', number: '04' },
  { href: '/blog', label: 'Blog', number: '05' },
  { href: '/resume', label: 'Resume', number: '06' },
  { href: '/contact', label: 'Contact', number: '07' },
]

const socialLinks = [
  { href: '#', label: 'LinkedIn' },
  { href: '#', label: 'GitHub' },
  { href: '#', label: 'Twitter' },
  { href: '#', label: 'Dribbble' },
]

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const bgPanelsRef = useRef<HTMLDivElement[]>([])
  const menuLinksRef = useRef<HTMLAnchorElement[]>([])
  const fadeTargetsRef = useRef<HTMLElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    tlRef.current = gsap.timeline({ paused: true })
    
    return () => {
      tlRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (!tlRef.current || !navRef.current) return

    const tl = tlRef.current
    tl.clear()

    if (isOpen) {
      tl.set(navRef.current, { display: 'block' })
        .set(menuRef.current, { xPercent: 0 })
        .fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo(
          bgPanelsRef.current,
          { xPercent: 101 },
          { xPercent: 0, stagger: 0.12, duration: 0.575, ease: 'power3.out' },
          '<'
        )
        .fromTo(
          menuLinksRef.current,
          { yPercent: 140, rotate: 10 },
          { yPercent: 0, rotate: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out' },
          '<+=0.35'
        )
        .fromTo(
          fadeTargetsRef.current,
          { autoAlpha: 0, yPercent: 50 },
          { autoAlpha: 1, yPercent: 0, stagger: 0.04, duration: 0.7, ease: 'power3.out' },
          '<+=0.2'
        )
      tl.play()
    } else {
      tl.to(overlayRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power3.inOut' })
        .to(menuRef.current, { xPercent: 120, duration: 0.5, ease: 'power3.inOut' }, '<')
        .set(navRef.current, { display: 'none' })
      tl.play()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      ref={navRef}
      className="fixed inset-0 z-[100] hidden"
      style={{ width: '100%', height: '100vh' }}
    >
      <div
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 z-0 cursor-pointer bg-[#131313]/40"
        style={{ opacity: 0 }}
      />

      <nav
        ref={menuRef}
        className="relative ml-auto flex h-full w-full flex-col justify-between overflow-auto pb-8 pt-24 md:w-[35rem]"
        style={{ gap: '5rem' }}
      >
        <div className="absolute inset-0 z-0">
          <div
            ref={(el) => { if (el) bgPanelsRef.current[0] = el }}
            className="absolute inset-0 rounded-l-[1.25rem] bg-[#00ADB5]"
          />
          <div
            ref={(el) => { if (el) bgPanelsRef.current[1] = el }}
            className="absolute inset-0 rounded-l-[1.25rem] bg-[#393E46]"
          />
          <div
            ref={(el) => { if (el) bgPanelsRef.current[2] = el }}
            className="absolute inset-0 rounded-l-[1.25rem] bg-[#222831]"
          />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between overflow-auto" style={{ gap: '5rem' }}>
          <ul className="m-0 flex w-full list-none flex-col p-0">
            {menuLinks.map((link, index) => (
              <li key={link.href} className="relative overflow-hidden">
                <Link
                  href={link.href}
                  ref={(el) => { if (el) menuLinksRef.current[index] = el }}
                  onClick={onClose}
                  className={cn(
                    "group relative flex w-full items-center gap-3 py-3 pl-8 text-decoration-none",
                    pathname === link.href ? "text-[#00ADB5]" : "text-[#EEEEEE]"
                  )}
                >
                  <p 
                    className="relative z-10 m-0 font-bold uppercase leading-[0.75] transition-transform duration-500"
                    style={{ 
                      fontFamily: "'PP Neue Corp Tight', Arial, sans-serif",
                      fontSize: 'clamp(2.5rem, 5.625vw, 5.625rem)',
                      textShadow: '0px 1em 0px #393E46'
                    }}
                  >
                    {link.label}
                  </p>
                  <p className="relative z-10 m-0 font-mono text-sm uppercase text-[#00ADB5]">
                    {link.number}
                  </p>
                  <div className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-[#393E46] transition-transform duration-500 group-hover:scale-y-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-5 pl-8">
            <p
              ref={(el) => { if (el) fadeTargetsRef.current[0] = el }}
              className="m-0 text-sm text-[#EEEEEE]/60"
            >
              Socials
            </p>
            <div className="flex flex-row gap-6">
              {socialLinks.map((link, index) => (
                <a
                  key={link.label}
                  ref={(el) => { if (el) fadeTargetsRef.current[index + 1] = el }}
                  href={link.href}
                  className="relative text-lg text-[#EEEEEE] no-underline after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-[#00ADB5] after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

interface MenuButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function MenuButton({ isOpen, onClick, className }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 border-none bg-transparent p-4 -m-4",
        className
      )}
    >
      <div className="flex h-[1.125rem] flex-col items-end justify-start overflow-hidden">
        <p 
          className="m-0 text-lg text-[#EEEEEE] transition-transform duration-300"
          style={{ transform: isOpen ? 'translateY(-100%)' : 'translateY(0)' }}
        >
          Menu
        </p>
        <p 
          className="m-0 text-lg text-[#EEEEEE] transition-transform duration-300"
          style={{ transform: isOpen ? 'translateY(-100%)' : 'translateY(0)' }}
        >
          Close
        </p>
      </div>
      <div 
        className="transition-transform duration-300"
        style={{ transform: isOpen ? 'rotate(315deg)' : 'rotate(0deg)' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="h-4 w-4"
        >
          <path
            d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
            fill="currentColor"
            className="text-[#EEEEEE]"
          />
          <path
            d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
            fill="currentColor"
            className="text-[#EEEEEE]"
          />
          <path
            d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
            fill="currentColor"
            className="text-[#EEEEEE]"
          />
          <path
            d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
            fill="currentColor"
            className="text-[#EEEEEE]"
          />
          <path
            d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
            fill="currentColor"
            className="text-[#EEEEEE]"
          />
          <path
            d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
            fill="currentColor"
            className="text-[#EEEEEE]"
          />
        </svg>
      </div>
    </button>
  )
}
