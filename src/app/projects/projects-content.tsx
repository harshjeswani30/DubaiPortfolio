"use client"

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

const mockProjects = [
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

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const displayProjects = projects.length > 0 ? projects : mockProjects

  const slideCount = displayProjects.length
  const timelineScope = `--scroller, ${displayProjects.map((_, i) => `--slide-${i + 1}`).join(", ")}`

  return (
    <div
      className="carousel-container h-screen relative isolate flex flex-col gap-8 overflow-clip pointer-events-none bg-black text-white"
      style={{
        // @ts-expect-error CSS custom properties
        timelineScope: timelineScope,
        "--slides": slideCount,
      }}
    >
      {displayProjects.map((project, index) => (
        <img
          key={project.id}
          className="bg-image absolute inset-0 h-full w-full object-cover -z-20 animate-grow"
          style={{ animationTimeline: `--slide-${index + 1}` }}
          src={project.featured_image || `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80`}
          alt={project.title}
        />
      ))}

      <div
        className="scroller absolute inset-0 h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth -z-10 scrollbar-hidden pointer-events-auto"
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
              role="none"
              id={`slide-${index + 1}`}
              className="snap-start"
              style={{ viewTimeline: `--slide-${index + 1} x` }}
            />
          ))}
        </div>
      </div>

      <div className="content flex-1 px-7 relative flex flex-col gap-8">
        <div className="overlap w-[17rem]">
          {displayProjects.map((project, index) => (
            <p
              key={project.id}
              className="animate-text text-sm leading-relaxed"
              style={{
                animationTimeline: `--slide-${index + 1}`,
                animationRangeStart: "30cqw",
                transform: "translateY(50%) skewY(1.5deg)",
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
                className="animate-page pointer-events-auto"
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

        <div className="overlap items-end w-[31rem] flex gap-8">
          {displayProjects.map((project, index) => (
            <div key={project.id}>
              <span className="block overlap">
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
                className="pb-7 font-serif text-6xl md:text-7xl lg:text-8xl animate-text"
                style={{
                  animationTimeline: `--slide-${index + 1}`,
                  animationRangeStart: "30cqw",
                  transform: "translateY(205%) skewY(6deg)",
                }}
              >
                {project.title.split(" ").slice(0, -1).join(" ")}{" "}
                <em>{project.title.split(" ").slice(-1)[0]}</em>
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="absolute z-50 bottom-7 right-7 pointer-events-auto font-medium hover:opacity-100 opacity-60 transition-opacity"
        >
          Back to Home
        </Link>
      </div>

      <noscript>
        <div className="px-7 pb-7 pointer-events-auto">
          Your browser does not support scroll-driven animations. See{" "}
          <a
            className="underline"
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations"
          >
            MDN
          </a>{" "}
          for browser compatibility tables.
        </div>
      </noscript>
    </div>
  )
}
