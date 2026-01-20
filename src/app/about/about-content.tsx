"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

export function AboutContent() {
  const mainRef = useRef<HTMLElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const initAnimation = () => {
      const gsap = (window as any).gsap
      const ScrollTrigger = (window as any).ScrollTrigger
      const Flip = (window as any).Flip
      const Lenis = (window as any).Lenis
      const imagesLoaded = (window as any).imagesLoaded

      if (!gsap || !ScrollTrigger || !Flip || !Lenis || !imagesLoaded) {
        setTimeout(initAnimation, 100)
        return
      }

      gsap.registerPlugin(ScrollTrigger, Flip)

      const lenis = new Lenis({ lerp: 0.1 })
      lenis.on("scroll", ScrollTrigger.update)
      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)

      const oneElement = document.querySelector(".one") as HTMLElement
      const parentElement = oneElement?.parentNode as HTMLElement
      const stepElements = [...document.querySelectorAll("[data-step]")]

      let flipCtx: any

      const createFlipOnScrollAnimation = () => {
        flipCtx && flipCtx.revert()
        flipCtx = gsap.context(() => {
          const flipConfig = { duration: 1, ease: "sine.inOut" }
          const states = stepElements.map((stepElement) => Flip.getState(stepElement))
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: parentElement,
              start: "clamp(center center)",
              endTrigger: stepElements[stepElements.length - 1],
              end: "clamp(center center)",
              scrub: true,
            },
          })

          states.forEach((state: any, index: number) => {
            tl.add(
              Flip.fit(oneElement, state, {
                ...flipConfig,
                ease: index === 0 ? "none" : flipConfig.ease,
              }),
              index ? "+=0.5" : 0
            )
          })
        })
      }

      const animateSpansOnScroll = () => {
        document.querySelectorAll(".content__title > span").forEach((span, index) => {
          const direction = index % 2 === 0 ? -150 : 150
          const triggerElement = span.closest(".content--center") ? span.parentNode : span
          gsap.from(span, {
            x: direction,
            duration: 1,
            ease: "sine",
            scrollTrigger: {
              trigger: triggerElement,
              start: "top bottom",
              end: "+=45%",
              scrub: true,
            },
          })
        })
      }

      const animateImagesOnScroll = () => {
        document
          .querySelectorAll(
            ".content--lines .content__img:not([data-step]), .content--grid .content__img:not([data-step])"
          )
          .forEach((image) => {
            gsap.fromTo(
              image,
              { scale: 0, autoAlpha: 0, filter: "brightness(180%) saturate(0%)" },
              {
                scale: 1,
                autoAlpha: 1,
                filter: "brightness(100%) saturate(100%)",
                duration: 1,
                ease: "sine",
                scrollTrigger: { trigger: image, start: "top bottom", end: "+=45%", scrub: true },
              }
            )
          })
      }

      const addParallaxToColumnImages = () => {
        const columnImages = [
          ...document.querySelectorAll(".content--column .content__img:not([data-step])"),
        ]
        const middleIndex = (columnImages.length - 1) / 2
        columnImages.forEach((image, index) => {
          const intensity = Math.abs(index - middleIndex) * 75
          gsap.fromTo(
            image,
            { y: intensity },
            {
              y: -intensity,
              ease: "sine",
              scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: true },
            }
          )
        })
      }

      const preloadImages = (selector = "img") => {
        return new Promise((resolve) => {
          imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve)
        })
      }

      preloadImages(".one, .content__img").then(() => {
        document.body.classList.remove("loading")
        createFlipOnScrollAnimation()
        animateSpansOnScroll()
        animateImagesOnScroll()
        addParallaxToColumnImages()
        window.addEventListener("resize", createFlipOnScrollAnimation)
      })

      return () => {
        flipCtx && flipCtx.revert()
        lenis.destroy()
      }
    }

    if (typeof window !== "undefined") {
      document.body.classList.add("loading")
      const checkLibraries = setInterval(() => {
        if (
          (window as any).gsap &&
          (window as any).ScrollTrigger &&
          (window as any).Flip &&
          (window as any).Lenis &&
          (window as any).imagesLoaded
        ) {
          clearInterval(checkLibraries)
          initAnimation()
        }
      }, 100)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        .about-page-wrapper {
          --color-text: #503717;
          --color-bg: rgb(234 234 234);
          --color-link: #b19162;
          --color-link-hover: #e1c093;
          --color-title: #000;
          --page-padding: 2rem;
          --gradient-1: rgb(234 234 234 / 80%);
          --gradient-2: rgb(229 134 27 / 30%);
        }

        .about-page-wrapper {
          color: var(--color-text);
          background-color: var(--color-bg);
          font-family: "capitana", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          width: 100vw;
          overflow-x: hidden;
          background-image: radial-gradient(ellipse at top, var(--gradient-1), transparent),
            radial-gradient(ellipse at bottom, var(--gradient-2), transparent);
          background-size: 100%, 200%;
          background-attachment: fixed;
          min-height: 100vh;
        }

        .font-alt {
          font-family: "harpagan", sans-serif;
          font-weight: 500;
        }

        .js .loading:before {
          content: "";
          position: fixed;
          z-index: 10000;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--color-bg);
        }

        .about-main {
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
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-areas: unset;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto 20vh;
          z-index: 80;
          justify-items: center;
        }

        .content--grid {
          display: grid;
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

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Flip.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js"
        strategy="beforeInteractive"
      />

      <link rel="stylesheet" href="https://use.typekit.net/klj1rev.css" />

      <div className="about-page-wrapper">
        <main ref={mainRef} className="about-main">
          <section className="content content--inital">
            <div
              className="one"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1555529669-2269763671c0?q=80&w=1200)",
              }}
            />
          </section>

          <section className="content content--center content--blend">
            <div data-step className="content__img" />
            <h1 className="content__title font-alt">
              <span>Seraph</span>
              <br />
              <span>Kamos</span>
            </h1>
          </section>

          <section className="content content--column">
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1539109132314-34a9c66d1822?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600)",
              }}
            />
            <div data-step className="content__img content__img--mid" />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600)",
              }}
            />
          </section>

          <section className="content content--lines">
            <h2 className="content__title content__title--medium font-alt">
              <span>Natural</span>
              <div data-step className="content__img" />
              <span>Garments</span>
            </h2>
            <h2 className="content__title content__title--medium font-alt">
              <span>Crafted with</span>
              <div
                className="content__img"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=600)",
                }}
              />
              <span>love</span>
            </h2>
            <h2 className="content__title content__title--medium font-alt">
              <span>with</span>
              <div
                className="content__img"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600)",
                }}
              />
              <span>respect</span>
            </h2>
          </section>

          <section className="content content--sides">
            <div data-step className="content__img" />
            <div className="content__text">
              <p>
                <strong>Welcome to Seraph Kamos</strong> where time meets the eternal. We believe in
                crafting more than garments—we create connections. Connections to the earth, to
                human hands, and to the moments that matter.
              </p>
            </div>
          </section>

          <section className="content content--center content--center-tall">
            <div data-step className="content__img" />
            <div className="content__text content__text--large">
              <p>
                We honor the hands that touch every thread, partnering with artisans and communities
                to ensure fairness, respect, and dignity at every step.
              </p>
            </div>
          </section>

          <section className="content content--grid">
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600)",
              }}
            />
            <div data-step className="content__img" />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1532453288454-ba56657463a0?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1475184414782-5965fb047dd7?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=600)",
              }}
            />
          </section>

          <div
            style={{ textAlign: "center", padding: "10vh 0", fontSize: "1.5rem" }}
            className="font-alt"
          >
            More you might like
          </div>
        </main>
      </div>
    </>
  )
}
