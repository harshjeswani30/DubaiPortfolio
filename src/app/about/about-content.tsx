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

          .bento-wrapper {
            position: relative;
            z-index: 100;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
          }

          .bento-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, minmax(150px, auto));
            gap: 1rem;
            width: 100%;
          }

          .bento-item {
            background: rgba(57, 62, 70, 0.5);
            border: 1px solid rgba(0, 173, 181, 0.2);
            border-radius: 1rem;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            overflow: hidden;
            position: relative;
          }

          .bento-item:hover {
            border-color: var(--color-accent);
            transform: translateY(-4px);
            box-shadow: 0 10px 40px rgba(0, 173, 181, 0.15);
          }

          .bento-item--large {
            grid-column: span 2;
            grid-row: span 2;
          }

          .bento-item--wide {
            grid-column: span 2;
          }

          .bento-item--tall {
            grid-row: span 2;
          }

          .bento-item__title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--color-title);
            margin-bottom: 0.5rem;
          }

          .bento-item__subtitle {
            font-size: 0.875rem;
            color: var(--color-accent);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 0.75rem;
          }

          .bento-item__text {
            font-size: 0.9rem;
            color: var(--color-text);
            opacity: 0.8;
            line-height: 1.6;
          }

          .bento-item__icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }

          .bento-item__stats {
            display: flex;
            gap: 2rem;
            margin-top: auto;
          }

          .bento-stat {
            text-align: center;
          }

          .bento-stat__number {
            font-size: 2rem;
            font-weight: 700;
            color: var(--color-accent);
            display: block;
          }

          .bento-stat__label {
            font-size: 0.75rem;
            color: var(--color-text);
            opacity: 0.6;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .bento-item__tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
          }

          .bento-tag {
            background: rgba(0, 173, 181, 0.15);
            color: var(--color-accent);
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .bento-item__image {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            opacity: 0.3;
            z-index: -1;
          }

          .bento-item__list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .bento-item__list li {
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
          }

          .bento-item__list li:last-child {
            border-bottom: none;
          }

          .bento-item__list li::before {
            content: "→";
            color: var(--color-accent);
          }

          .bento-progress {
            margin-top: auto;
          }

          .bento-progress__bar {
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-top: 0.5rem;
          }

          .bento-progress__fill {
            height: 100%;
            background: linear-gradient(90deg, var(--color-accent), #00d4dd);
            border-radius: 3px;
          }

          .bento-progress__label {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: var(--color-text);
            opacity: 0.6;
          }

          @media screen and (max-width: 1024px) {
            .bento-grid {
              grid-template-columns: repeat(2, 1fr);
              grid-template-rows: auto;
            }
            .bento-item--large {
              grid-column: span 2;
              grid-row: span 1;
            }
          }

          @media screen and (max-width: 640px) {
            .bento-grid {
              grid-template-columns: 1fr;
            }
            .bento-item--large,
            .bento-item--wide {
              grid-column: span 1;
            }
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

            <div className="bento-wrapper">
              <div className="bento-grid">
                <div className="bento-item bento-item--large">
                  <div className="bento-item__subtitle">About Me</div>
                  <h3 className="bento-item__title font-alt">Full Stack Developer & UI/UX Enthusiast</h3>
                  <p className="bento-item__text">
                    Welcome to my digital space where creativity meets technology. I specialize in building modern web applications—crafting seamless user experiences with cutting-edge frameworks and scalable architectures.
                  </p>
                  <div className="bento-item__stats">
                    <div className="bento-stat">
                      <span className="bento-stat__number">5+</span>
                      <span className="bento-stat__label">Years Exp</span>
                    </div>
                    <div className="bento-stat">
                      <span className="bento-stat__number">50+</span>
                      <span className="bento-stat__label">Projects</span>
                    </div>
                    <div className="bento-stat">
                      <span className="bento-stat__number">30+</span>
                      <span className="bento-stat__label">Clients</span>
                    </div>
                  </div>
                </div>

                <div className="bento-item">
                  <div className="bento-item__icon">🎯</div>
                  <h3 className="bento-item__title">Mission</h3>
                  <p className="bento-item__text">Creating digital experiences that matter</p>
                </div>

                <div className="bento-item">
                  <div className="bento-item__icon">📍</div>
                  <h3 className="bento-item__title">Based In</h3>
                  <p className="bento-item__text">Dubai, UAE</p>
                </div>

                <div className="bento-item bento-item--wide">
                  <div className="bento-item__subtitle">Tech Stack</div>
                  <h3 className="bento-item__title">Technologies I Work With</h3>
                  <div className="bento-item__tags">
                    <span className="bento-tag">React</span>
                    <span className="bento-tag">Next.js</span>
                    <span className="bento-tag">TypeScript</span>
                    <span className="bento-tag">Node.js</span>
                    <span className="bento-tag">Python</span>
                    <span className="bento-tag">PostgreSQL</span>
                    <span className="bento-tag">AWS</span>
                    <span className="bento-tag">Docker</span>
                  </div>
                </div>

                <div className="bento-item bento-item--tall">
                  <div className="bento-item__subtitle">Services</div>
                  <h3 className="bento-item__title">What I Do</h3>
                  <ul className="bento-item__list">
                    <li>Web Development</li>
                    <li>Mobile Apps</li>
                    <li>UI/UX Design</li>
                    <li>API Development</li>
                    <li>Cloud Solutions</li>
                  </ul>
                </div>

                <div className="bento-item">
                  <div
                    className="bento-item__image"
                    style={{
                      backgroundImage: "url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600)",
                    }}
                  />
                  <h3 className="bento-item__title">Clean Code</h3>
                  <p className="bento-item__text">Built with passion and precision</p>
                </div>

                <div className="bento-item bento-item--wide">
                  <div className="bento-item__subtitle">Philosophy</div>
                  <h3 className="bento-item__title">My Approach</h3>
                  <p className="bento-item__text">
                    I believe in writing clean, maintainable code that stands the test of time—collaborating with teams to deliver products that users love and businesses rely on.
                  </p>
                </div>

                <div className="bento-item">
                  <div className="bento-item__icon">🚀</div>
                  <h3 className="bento-item__title">Performance</h3>
                  <div className="bento-progress">
                    <div className="bento-progress__label">
                      <span>Optimization</span>
                      <span>95%</span>
                    </div>
                    <div className="bento-progress__bar">
                      <div className="bento-progress__fill" style={{ width: "95%" }} />
                    </div>
                  </div>
                </div>

                <div className="bento-item">
                  <div className="bento-item__icon">💡</div>
                  <h3 className="bento-item__title">Innovation</h3>
                  <p className="bento-item__text">Always exploring new technologies</p>
                </div>

                <div className="bento-item bento-item--wide">
                  <div
                    className="bento-item__image"
                    style={{
                      backgroundImage: "url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600)",
                    }}
                  />
                  <div className="bento-item__subtitle">Let&apos;s Connect</div>
                  <h3 className="bento-item__title font-alt">Ready to Build Something Amazing?</h3>
                  <p className="bento-item__text">Let&apos;s turn your ideas into reality</p>
                </div>
              </div>
            </div>
        </main>
      </div>
    </>
  )
}
