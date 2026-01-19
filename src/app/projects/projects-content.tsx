"use client"

import Image from "next/image"
import Link from "next/link"

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
  const displayProjects = projects.length > 0 ? projects : [
    {
      id: "1",
      title: "Perfect for urban riders",
      slug: "commuter-helmet",
      description: "Move around your city safely and comfortably, while reducing your carbon footprint and helping to keep the air we breathe clean.",
      tech_stack: ["React", "Next.js"],
      category: "Commuter Helmet",
      featured_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    },
    {
      id: "2",
      title: "We're all connected",
      slug: "smart-bottle",
      description: "Let's do it responsibly and avoid having more plastic in the sea than fish. Take your refillable bottle with you and say no to plastic when drinking water.",
      tech_stack: ["TypeScript", "Node.js"],
      category: "Smart bottle",
      featured_image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1920&q=80",
    },
    {
      id: "3",
      title: "Ready for late nights",
      slug: "reflective-helmet",
      description: "The Reflective Helmet seamlessly integrates reflective technology, ensuring visibility without drawing unnecessary attention. The perfect choice for the mindful cyclist.",
      tech_stack: ["Python", "FastAPI"],
      category: "Reflective Helmet",
      featured_image: "https://images.unsplash.com/photo-1557843555-ca2d9f4e0830?w=1920&q=80",
    },
  ]

  const slideCount = displayProjects.length
  const timelineScope = `--scroller, ${displayProjects.map((_, i) => `--slide-${i + 1}`).join(", ")}`

  return (
    <div
      className="carousel-container min-h-screen relative isolate flex flex-col gap-8 supports-sda:pointer-events-none overflow-clip bg-black text-white"
      style={{
        // @ts-expect-error CSS custom properties
        timelineScope: timelineScope,
        "--slides": slideCount,
      }}
    >
      {displayProjects.map((project, index) => (
        <Image
          key={project.id}
          className="absolute hidden supports-sda:block -z-20 inset-0 h-full w-full object-cover animate-grow"
          style={{ animationTimeline: `--slide-${index + 1}` }}
          src={project.featured_image || `https://images.unsplash.com/photo-155861866${index}-fcd25c85cd64?w=1920&q=80`}
          alt={project.title}
          fill
          priority={index === 0}
        />
      ))}

      <div
        className="absolute hidden supports-sda:block -z-10 inset-0 h-full w-full overflow-x-auto snap-mandatory scroll-smooth snap-x scrollbar-hidden pointer-events-auto"
        style={{ scrollTimeline: "--scroller x" }}
      >
        <div
          className="grid grid-flow-col h-full w-fit"
          style={{
            gridAutoColumns: "70cqw",
            paddingRight: "30cqw",
          }}
        >
          {displayProjects.map((_, index) => (
            <div
              key={index}
              id={`slide-${index + 1}`}
              className="snap-start"
              style={{ viewTimeline: `--slide-${index + 1} x` }}
            />
          ))}
        </div>
      </div>

      <header className="frame relative z-50 mx-7 flex max-lg:flex-col justify-between py-6 border-b gap-2 border-white/60 pointer-events-auto">
        <div className="whitespace-nowrap">
          <h1 className="font-bold inline align-middle text-lg">Projects</h1>
        </div>
        <nav className="flex items-center gap-10 text-sm">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>
      </header>

      <div className="flex-1 px-7 relative hidden supports-sda:flex flex-col gap-8">
        <div className="overlap w-[17rem]">
          {displayProjects.map((project, index) => (
            <p
              key={project.id}
              className="animate-text translate-y-[50%] skew-y-[1.5deg] text-sm leading-relaxed"
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
            {displayProjects.map((_, index) => (
              <a
                key={index}
                href={`#slide-${index + 1}`}
                className="animate-page !text-white pointer-events-auto"
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
              className="bg-white h-0.5 animate-progress origin-left"
              style={{ animationTimeline: "--scroller" }}
            />
          </div>
        </div>

        <div className="overlap items-end w-[31rem]">
          {displayProjects.map((project, index) => (
            <div key={project.id}>
              <span className="block overflow-clip">
                <span
                  className="block uppercase font-medium tracking-[0.3em] mb-4 text-sm animate-text-up"
                  style={{
                    animationTimeline: `--slide-${index + 1}`,
                    animationRangeStart: "30cqw",
                  }}
                >
                  {project.category}
                </span>
              </span>
              <p
                className="pb-7 font-serif text-7xl lg:text-8xl animate-text translate-y-[205%] skew-y-6"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                }}
              >
                {project.title.split(" ").slice(0, -1).join(" ")}{" "}
                <em>{project.title.split(" ").slice(-1)[0]}</em>
              </p>
              <Link
                href={`/projects/${project.slug}`}
                className="inline-block px-6 py-3 bg-white text-black font-medium rounded-full pointer-events-auto hover:bg-white/90 transition-colors animate-text"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                }}
              >
                View Project →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="supports-sda:hidden px-7 pb-7 pt-20">
        <p className="mb-8 text-white/60">
          Your browser does not support scroll-driven animations.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/30 transition-colors"
            >
              <div className="relative aspect-video">
                  {project.featured_image ? (
                    <Image
                      src={project.featured_image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white/20">{project.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
              <div className="p-6">
                <span className="text-xs uppercase tracking-wider text-white/50">{project.category}</span>
                <h3 className="mt-2 text-lg font-semibold group-hover:text-white/80 transition-colors">{project.title}</h3>
                <p className="mt-2 text-sm text-white/60 line-clamp-2">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
