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
  {
    id: "4",
    title: "Explore the unknown",
    slug: "adventure-gear",
    description: "Discover new horizons with gear designed for the modern explorer. Built to withstand the elements while keeping you comfortable on every journey.",
    tech_stack: ["Vue.js", "Tailwind"],
    category: "Adventure Gear",
    featured_image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1920&q=80",
  },
  {
    id: "5",
    title: "Sustainable living",
    slug: "eco-lifestyle",
    description: "Make conscious choices that benefit both you and the planet. Our eco-friendly products are designed with sustainability at their core.",
    tech_stack: ["Next.js", "Prisma"],
    category: "Eco Lifestyle",
    featured_image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80",
  },
]

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const displayProjects = projects.length > 0 ? projects : mockProjects

  const slideCount = displayProjects.length
  const timelineScope = `--scroller, ${displayProjects.map((_, i) => `--slide-${i + 1}`).join(", ")}`

  return (
    <div
      className="carousel-container h-screen relative isolate flex flex-col supports-sda:pointer-events-none overflow-hidden bg-black text-white"
      style={{
        // @ts-expect-error CSS custom properties
        timelineScope: timelineScope,
        "--slides": slideCount,
      }}
    >
      <div className="absolute -z-20 inset-0 h-full w-full overlap">
        {displayProjects.map((project, index) => (
          <img
            key={project.id}
            className="h-full w-full object-cover animate-grow"
            style={{ 
              animationTimeline: `--slide-${index + 1}`,
              zIndex: displayProjects.length - index,
            }}
            src={project.featured_image || `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80`}
            alt={project.title}
          />
        ))}
      </div>

      <div
        className="absolute -z-10 inset-0 h-full w-full overflow-x-auto snap-mandatory scroll-smooth snap-x scrollbar-hidden pointer-events-auto"
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

        <div className="flex-1 px-7 py-8 relative flex flex-col justify-between min-h-0">
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

        <div className="w-60">
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

        <div className="overlap items-end w-full max-w-[31rem]">
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
                className="pb-7 font-serif text-5xl md:text-7xl lg:text-8xl animate-text translate-y-[205%] skew-y-6"
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


    </div>
  )
}
