"use client"

import { useEffect, useRef } from "react"
import React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Flip } from "gsap/dist/Flip"
import Lenis from "@studio-freight/lenis"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip)
}

interface AboutSection {
  id: string
  type: "hero" | "center" | "column" | "lines" | "sides" | "center-tall" | "grid"
  title?: string
  text?: string
  images?: string[]
  order: number
}

interface AboutContentProps {
  heroImage: string
  mainTitle: string
  sections: AboutSection[]
}

export function AboutContent({ heroImage, mainTitle, sections }: AboutContentProps) {
  const oneRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const flipCtxRef = useRef<any>(null)

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const lenis = new Lenis({ 
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: false, // Disable smooth scroll on touch devices for better performance
      touchMultiplier: 2,
    })
    
    lenis.on("scroll", ScrollTrigger.update)
    
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000)
    })
    
    gsap.ticker.lagSmoothing(0)

    // Handle resize and orientation changes for mobile
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
      lenis.destroy()
      gsap.ticker.remove((time: number) => lenis.raf(time * 1000))
    }
  }, [])

  useEffect(() => {
    if (!oneRef.current || !mainRef.current || typeof window === "undefined") return

    const oneElement = oneRef.current
    const stepElements = [...document.querySelectorAll("[data-step]")]

    if (stepElements.length === 0) return

    // Cleanup previous context
    if (flipCtxRef.current) {
      flipCtxRef.current.revert()
    }

    // Create flip animation
    flipCtxRef.current = gsap.context(() => {
      const flipConfig = {
        duration: 1,
        ease: "sine.inOut",
      }

      const states = stepElements.map((stepElement) => Flip.getState(stepElement))

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: oneElement.parentNode as Element,
          start: "clamp(center center)",
          endTrigger: stepElements[stepElements.length - 1],
          end: "clamp(center center)",
          scrub: true,
          immediateRender: false,
          invalidateOnRefresh: true,
        },
      })

      states.forEach((state, index) => {
        const customFlipConfig = {
          ...flipConfig,
          ease: index === 0 ? "none" : flipConfig.ease,
        }
        const flipTween = Flip.fit(oneElement, state, customFlipConfig)
        if (flipTween) {
          tl.add(flipTween as any, index ? "+=0.5" : 0)
        }
      })
    })

    // Animate title spans
    const spans = document.querySelectorAll(".content__title > span")
    spans.forEach((span, index) => {
      const direction = index % 2 === 0 ? -150 : 150
      const triggerElement = span.closest(".content--center") ? span.parentNode : span

      gsap.from(span, {
        x: direction,
        duration: 1,
        ease: "sine",
        scrollTrigger: {
          trigger: triggerElement as Element,
          start: "top bottom",
          end: "+=45%",
          scrub: true,
        },
      })
    })

    // Animate images
    const images = document.querySelectorAll(
      ".content--lines .content__img:not([data-step]), .content--grid .content__img:not([data-step])"
    )
    images.forEach((image) => {
      gsap.fromTo(
        image,
        {
          scale: 0,
          autoAlpha: 0,
          filter: "brightness(180%) saturate(0%)",
        },
        {
          scale: 1,
          autoAlpha: 1,
          filter: "brightness(100%) saturate(100%)",
          duration: 1,
          ease: "sine",
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "+=45%",
            scrub: true,
          },
        }
      )
    })

    // Parallax text
    const firstTextElement = document.querySelector(".content__text")
    if (firstTextElement) {
      gsap.fromTo(
        firstTextElement,
        { y: 250 },
        {
          y: -250,
          ease: "sine",
          scrollTrigger: {
            trigger: firstTextElement,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }
      )
    }

    // Parallax column images
    const columnImages = [...document.querySelectorAll(".content--column .content__img:not([data-step])")]
    const totalImages = columnImages.length
    const middleIndex = (totalImages - 1) / 2

    columnImages.forEach((image, index) => {
      const intensity = Math.abs(index - middleIndex) * 75

      gsap.fromTo(
        image,
        { y: intensity },
        {
          y: -intensity,
          ease: "sine",
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      )
    })

    // Filter animation
    gsap.fromTo(
      oneElement,
      { filter: "brightness(80%)" },
      {
        filter: "brightness(100%)",
        ease: "sine",
        scrollTrigger: {
          trigger: oneElement.parentNode as Element,
          start: "clamp(top bottom)",
          end: "clamp(bottom top)",
          scrub: true,
        },
      }
    )

    // Refresh ScrollTrigger after all animations are set up
    // Important for mobile devices to recalculate positions
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      if (flipCtxRef.current) {
        flipCtxRef.current.revert()
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [sections])

  const renderSection = (section: AboutSection) => {
    switch (section.type) {
      case "center":
        return (
          <section key={section.id} className="content content--center content--blend">
            <div data-step className="content__img"></div>
            <h1 className="content__title font-alt">
              {section.title?.split(" ").map((word, i) => (
                <span key={i}>
                  {word}
                  <br />
                </span>
              ))}
            </h1>
          </section>
        )

      case "column":
        return (
          <section key={section.id} className="content content--column">
            {section.images?.slice(0, 5).map((img, i) => {
              if (i === 2) {
                return <div key={i} data-step className="content__img content__img--mid"></div>
              }
              return <div key={i} className="content__img" style={{ backgroundImage: `url(${img})` }}></div>
            })}
          </section>
        )

      case "lines":
        return (
          <section key={section.id} className="content content--lines">
            {section.title?.split("|").map((line, lineIndex) => {
              const parts = line.split("{{img}}")
              const imageUrl = section.images?.[lineIndex]
              const hasImage = imageUrl && imageUrl.trim() !== ''
              
              return (
                <h2 key={lineIndex} className="content__title content__title--medium font-alt">
                  {parts.map((part, partIndex) => (
                    <React.Fragment key={partIndex}>
                      <span>{part}</span>
                      {partIndex < parts.length - 1 && (
                        <div
                          {...(lineIndex === 0 ? { "data-step": true } : {})}
                          className="content__img"
                          style={
                            lineIndex === 0 || !hasImage
                              ? undefined
                              : { backgroundImage: `url(${imageUrl})` }
                          }
                        ></div>
                      )}
                    </React.Fragment>
                  ))}
                </h2>
              )
            })}
          </section>
        )

      case "sides":
        return (
          <section key={section.id} className="content content--sides">
            <div data-step className="content__img"></div>
            <div className="content__text">
              <p dangerouslySetInnerHTML={{ __html: section.text || "" }} />
            </div>
          </section>
        )

      case "center-tall":
        return (
          <section key={section.id} className="content content--center content--center-tall">
            <div data-step className="content__img"></div>
            <div className="content__text content__text--large">
              <p>{section.text}</p>
            </div>
          </section>
        )

      case "grid":
        return (
          <section key={section.id} className="content content--grid">
            {Array.from({ length: 9 }).map((_, i) => {
              if (i === 1) {
                return <div key={i} data-step className="content__img"></div>
              }
              const img = section.images?.[i]
              return (
                <div 
                  key={i} 
                  className="content__img" 
                  style={img && img.trim() ? { backgroundImage: `url(${img})` } : undefined}
                ></div>
              )
            })}
          </section>
        )

      default:
        return null
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://use.typekit.net/klj1rev.css");

        :root {
          --color-text: #eeeeee;
          --color-bg: #222831;
          --color-link: #00adb5;
          --color-link-hover: #00d4dd;
          --color-title: #eeeeee;
          --page-padding: 2rem;
          --gradient-1: rgb(34 40 49 / 80%);
          --gradient-2: rgb(0 173 181 / 30%);
        }

        .font-alt {
          font-family: "harpagan", sans-serif;
          font-weight: 500;
        }

        main {
          position: relative;
          overflow: hidden;
          width: 100vw;
        }

        .content {
          display: grid;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          grid-template-columns: 1fr;
          grid-template-rows: auto;
          grid-template-areas: "content";
          position: relative;
          z-index: 90;
        }

        .content--blend {
          mix-blend-mode: overlay;
        }

        .content--center {
          height: 100vh;
          text-align: center;
          justify-items: center;
          display: grid;
          gap: 1.5rem;
          align-content: center;
          position: relative;
        }

        .content--column {
          grid-template-columns: repeat(5, 1fr);
          grid-template-areas: unset;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto 20vh;
          z-index: 80;
          justify-items: center;
        }

        .content--grid {
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          grid-template-areas: unset;
          width: 120%;
          height: 100vh;
          left: -10%;
          gap: 1rem;
          margin: 0 auto;
        }

        .content--grid .content__img {
          width: 100%;
          height: 100%;
        }

        .content__title {
          grid-area: content;
          margin: 0;
          line-height: 0.9;
          text-transform: uppercase;
          font-size: clamp(3rem, 19vw, 8rem);
          max-width: 1000px;
          color: var(--color-title);
        }

        .content__title span {
          display: inline-block;
        }

        .content__title--medium {
          line-height: 1.1;
          max-width: none;
          font-size: clamp(2rem, 12vw, 6rem);
        }

        .content__text {
          grid-area: content;
          padding: var(--page-padding);
          margin: 0 auto;
          font-size: 1rem;
          font-weight: 400;
          position: relative;
          max-width: 500px;
          color: var(--color-text);
        }

        .content__text--large {
          font-size: clamp(1rem, 4vw, 2rem);
          max-width: none;
        }

        .one {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 10;
          background-size: cover;
          background-position: 50% 50%;
          will-change: transform, width, height, filter;
        }

        .content__img {
          background-size: cover;
          background-position: 50% 50%;
          will-change: transform, filter, opacity;
        }

        .content--sides {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-areas: "img" "content";
        }

        .content--sides .content__img {
          grid-area: img;
          height: 50vh;
        }

        .content--center .content__img {
          height: 38vh;
          width: auto;
          aspect-ratio: 0.8;
          grid-area: 1 / 1 / -1 / -1;
        }

        .content--center-tall {
          padding-top: 20vh;
          margin-bottom: 30vh;
        }

        .content--center-tall .content__img {
          height: 30vh;
          width: auto;
          aspect-ratio: 0.8;
        }

        .content--column .content__img {
          height: auto;
          width: 100%;
          max-width: 150px;
          aspect-ratio: 0.8;
          background-size: cover;
          background-position: 50% 50%;
        }

        .content--lines {
          display: flex;
          flex-direction: column;
        }

        .content--lines .content__title {
          display: flex;
          flex-wrap: wrap;
          align-self: center;
          gap: 10px;
        }

        .content--lines .content__img {
          height: 0.725em;
          width: auto;
          aspect-ratio: 16/9;
          background-size: cover;
          align-self: center;
          flex: none;
        }

        @media screen and (min-width: 53em) {
          .content--sides {
            grid-template-columns: 40% 1fr;
            grid-template-areas: "img content";
          }
          .content--lines .content__title {
            white-space: nowrap;
            flex-wrap: nowrap;
          }
          .content--grid {
            height: 160vh;
          }
        }
      `}</style>

      <main ref={mainRef}>
        <section className="content content--inital">
          <div ref={oneRef} className="one" style={{ backgroundImage: `url(${heroImage})` }}></div>
        </section>

        {sections
          .sort((a, b) => a.order - b.order)
          .map((section) => renderSection(section))}
      </main>
    </>
  )
}
