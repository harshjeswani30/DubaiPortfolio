"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

export function AboutContent() {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let cleanup: (() => void) | null = null
    let checkInterval: NodeJS.Timeout | null = null

    const initAnimation = () => {
      const gsap = (window as any).gsap
      const ScrollTrigger = (window as any).ScrollTrigger
      const Flip = (window as any).Flip
      const Lenis = (window as any).Lenis
      const imagesLoaded = (window as any).imagesLoaded

      if (!gsap || !ScrollTrigger || !Flip || !Lenis || !imagesLoaded) {
        return false
      }

      ScrollTrigger.getAll().forEach((t: any) => t.kill())
      gsap.registerPlugin(ScrollTrigger, Flip)

      const lenis = new Lenis({ lerp: 0.1 })
      lenis.on("scroll", ScrollTrigger.update)
      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000)
      }
      gsap.ticker.add(tickerCallback)
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

      cleanup = () => {
        flipCtx && flipCtx.revert()
        ScrollTrigger.getAll().forEach((t: any) => t.kill())
        gsap.ticker.remove(tickerCallback)
        lenis.destroy()
        window.removeEventListener("resize", createFlipOnScrollAnimation)
      }

      return true
    }

    if (typeof window !== "undefined") {
      document.body.classList.add("loading")
      checkInterval = setInterval(() => {
        if (
          (window as any).gsap &&
          (window as any).ScrollTrigger &&
          (window as any).Flip &&
          (window as any).Lenis &&
          (window as any).imagesLoaded
        ) {
          if (checkInterval) clearInterval(checkInterval)
          initAnimation()
        }
      }, 100)
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval)
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        .about-page-wrapper {
          --color-text: #EEEEEE;
          --color-bg: #222831;
          --color-accent: #00ADB5;
          --color-medium: #393E46;
          --color-title: #EEEEEE;
          --page-padding: 2rem;
          --gradient-1: rgba(34, 40, 49, 0.8);
          --gradient-2: rgba(0, 173, 181, 0.15);
        }

        .about-page-wrapper {
          color: var(--color-text);
          background-color: var(--color-bg);
          font-family: inherit;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          width: 100vw;
          overflow-x: hidden;
          min-height: 100vh;
          background-image: 
            radial-gradient(ellipse at top, var(--gradient-1), transparent), 
            radial-gradient(ellipse at bottom, var(--gradient-2), transparent);
          background-size: 100%, 200%;
          background-attachment: fixed;
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
          color: var(--color-text);
        }

        .content__text strong {
          color: var(--color-accent);
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

        .footer-text {
          text-align: center;
          padding: 10vh 0;
          font-size: 1.5rem;
          color: var(--color-accent);
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
                  "url(https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200)",
              }}
            />
          </section>

          <section className="content content--center content--blend">
            <div data-step className="content__img" />
            <h1 className="content__title font-alt">
              <span>Full Stack</span>
              <br />
              <span>Developer</span>
            </h1>
          </section>

          <section className="content content--column">
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600)",
              }}
            />
            <div data-step className="content__img content__img--mid" />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=600)",
              }}
            />
          </section>

          <section className="content content--lines">
            <h2 className="content__title content__title--medium font-alt">
              <span>Clean</span>
              <div data-step className="content__img" />
              <span>Code</span>
            </h2>
            <h2 className="content__title content__title--medium font-alt">
              <span>Built with</span>
              <div
                className="content__img"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=600)",
                }}
              />
              <span>passion</span>
            </h2>
            <h2 className="content__title content__title--medium font-alt">
              <span>and</span>
              <div
                className="content__img"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600)",
                }}
              />
              <span>precision</span>
            </h2>
          </section>

          <section className="content content--sides">
            <div data-step className="content__img" />
            <div className="content__text">
              <p>
                <strong>Welcome to my digital space</strong> where creativity meets technology. I specialize in
                building modern web applications—crafting seamless user experiences with cutting-edge
                frameworks and scalable architectures.
              </p>
            </div>
          </section>

          <section className="content content--center content--center-tall">
            <div data-step className="content__img" />
            <div className="content__text content__text--large">
              <p>
                I believe in writing clean, maintainable code that stands the test of time—collaborating
                with teams to deliver products that users love and businesses rely on.
              </p>
            </div>
          </section>

          <section className="content content--grid">
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600)",
              }}
            />
            <div data-step className="content__img" />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1537432376149-e84978a29b5d?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1562813733-b31f71025d54?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=600)",
              }}
            />
            <div
              className="content__img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=600)",
              }}
            />
          </section>

          <div className="footer-text font-alt">Let&apos;s build something amazing</div>
        </main>
      </div>
    </>
  )
}
