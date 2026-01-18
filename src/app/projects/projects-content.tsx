"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  tech_stack: string[]
  category: string
  featured_image?: string
  live_url?: string
  github_url?: string
}

interface ProjectsContentProps {
  projects: Project[]
  categories: string[]
}

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [supportsScrollDriven, setSupportsScrollDriven] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supported = CSS.supports("timeline-scope", "none")
    setSupportsScrollDriven(supported)
  }, [])

  const slideCount = projects.length || 3
  const timelineScopes = projects.map((_, i) => `--slide-${i + 1}`).join(", ")

  if (!supportsScrollDriven) {
    return <FallbackProjectsView projects={projects} />
  }

  return (
    <div
      ref={containerRef}
      className="@container min-h-screen relative isolate flex flex-col gap-8 pointer-events-none overflow-clip bg-[#222831]"
      style={{
        timelineScope: `--scroller, ${timelineScopes}`,
        // @ts-expect-error CSS custom property
        "--slides": slideCount,
      }}
    >
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="absolute -z-20 inset-0 h-full w-full"
          style={{
            animationTimeline: `--slide-${index + 1}`,
          }}
        >
          {project.featured_image ? (
            <Image
              src={project.featured_image}
              alt={project.title}
              fill
              className="object-cover animate-grow"
              style={{ animationTimeline: `--slide-${index + 1}` }}
              priority={index < 2}
            />
          ) : (
            <div 
              className="h-full w-full bg-gradient-to-br from-accent-light/30 via-primary-medium to-primary-dark animate-grow"
              style={{ animationTimeline: `--slide-${index + 1}` }}
            />
          )}
        </div>
      ))}

      <div 
        className="absolute -z-10 inset-0 h-full w-full overflow-x-auto snap-mandatory scroll-smooth snap-x scrollbar-hidden pointer-events-auto"
        style={{ scrollTimeline: "--scroller x" }}
      >
        <div 
          className="grid grid-flow-col h-full w-fit"
          style={{ gridAutoColumns: "70cqw", paddingRight: "30cqw" }}
        >
          {projects.map((_, index) => (
            <div
              key={index}
              id={`slide-${index + 1}`}
              className="snap-start"
              style={{ viewTimeline: `--slide-${index + 1} x` }}
            />
          ))}
        </div>
      </div>

      <header className="relative z-50 mx-7 flex max-lg:flex-col justify-between py-6 border-b gap-2 border-white/60 pointer-events-auto">
        <div className="whitespace-nowrap">
          <h1 className="font-bold inline align-middle text-white text-xl">Projects</h1>
          <Link href="/" className="ml-2">
            <ArrowUpRight className="h-4 w-4 inline-block align-middle text-white" />
          </Link>
        </div>
        <nav className="flex items-center gap-10 text-white/80">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>
      </header>

      <div className="flex-1 px-7 relative flex flex-col gap-8">
        <div className="overlap w-[20rem]">
          {projects.map((project, index) => (
            <p
              key={project.id}
              className="animate-text translate-y-[50%] skew-y-[1.5deg] text-white/90 text-sm leading-relaxed"
              style={{
                animationTimeline: `--slide-${index + 1}`,
                animationRangeStart: "30cqw",
              }}
            >
              {project.description}
            </p>
          ))}
        </div>

        <div className="w-60 my-auto">
          <nav className="flex font-medium text-sm gap-5">
            {projects.map((_, index) => (
              <a
                key={index}
                href={`#slide-${index + 1}`}
                className="animate-page text-white pointer-events-auto hover:text-accent-light transition-colors"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </a>
            ))}
          </nav>
          <div className="bg-white/60 mt-2">
            <div
              className="bg-accent-light h-0.5 animate-progress origin-left"
              style={{ animationTimeline: "--scroller" }}
            />
          </div>
        </div>

        <div className="overlap items-end w-full max-w-2xl">
          {projects.map((project, index) => (
            <div key={project.id}>
              <span className="block overflow-clip">
                <span
                  className="block uppercase font-medium tracking-[0.3em] mb-4 text-accent-light text-sm animate-text-up"
                  style={{
                    animationTimeline: `--slide-${index + 1}`,
                    animationRangeStart: "30cqw",
                  }}
                >
                  {project.category}
                </span>
              </span>
              <p
                className="pb-7 font-serif text-5xl md:text-7xl lg:text-8xl text-white animate-text translate-y-[205%] skew-y-6"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                }}
              >
                {project.title.split(" ").map((word, i) => (
                  <span key={i}>
                    {i > 0 && " "}
                    {i === project.title.split(" ").length - 1 ? (
                      <em className="text-accent-light">{word}</em>
                    ) : (
                      word
                    )}
                  </span>
                ))}
              </p>
              <div className="flex gap-4 pb-8">
                <Link
                  href={`/projects/${project.slug}`}
                  className="pointer-events-auto inline-flex items-center gap-2 px-6 py-3 bg-accent-light text-primary-dark font-medium rounded-full hover:bg-accent-lightest transition-colors animate-text"
                  style={{
                    animationTimeline: `--slide-${index + 1}`,
                    animationRangeStart: "30cqw",
                  }}
                >
                  View Project <ArrowUpRight className="h-4 w-4" />
                </Link>
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div
                    className="flex items-center gap-2 animate-text"
                    style={{
                      animationTimeline: `--slide-${index + 1}`,
                      animationRangeStart: "30cqw",
                    }}
                  >
                    {project.tech_stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs text-white/70 border border-white/20 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FallbackProjectsView({ projects }: { projects: Project[] }) {
  return (
    <div className="min-h-screen bg-[#222831] pt-24">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-background opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-accent-light">
              Portfolio
            </span>
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              My Projects
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
              A collection of projects I&apos;ve built, from web applications to
              creative experiments.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-primary-medium/50 hover:-translate-y-2 transition-transform duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden bg-primary-dark">
                    {project.featured_image ? (
                      <Image
                        src={project.featured_image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent-light/20 to-primary-medium">
                        <span className="text-6xl font-bold text-white/10">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
                        View Project <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="rounded-full bg-accent-light/10 px-3 py-1 text-xs font-medium text-accent-light">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-accent-light">
                      {project.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-white/60">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 px-2 py-1 text-xs text-white/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-white/50">No projects found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
