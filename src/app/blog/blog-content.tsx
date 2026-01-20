"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Clock, ArrowUpRight, Search, Sparkles, BookOpen, ChevronRight, Calendar, X, Filter } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image?: string
  category: string
  tags: string[]
  reading_time: number
  published_at: string
}

export function BlogContent({ posts }: { posts: BlogPost[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map(post => post.category))]
    return ["All", ...uniqueCategories]
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [posts, searchQuery, selectedCategory])
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -100])
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-text",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      )

      gsap.fromTo(
        ".floating-card",
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".cards-section",
            start: "top 80%",
          },
        }
      )

      gsap.to(".parallax-bg", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })

      const magnetCards = document.querySelectorAll(".magnetic-card")
      magnetCards.forEach((card) => {
        card.addEventListener("mousemove", (e: Event) => {
          const mouseEvent = e as MouseEvent
          const rect = (card as HTMLElement).getBoundingClientRect()
          const x = mouseEvent.clientX - rect.left - rect.width / 2
          const y = mouseEvent.clientY - rect.top - rect.height / 2
          gsap.to(card, {
            rotationY: x * 0.03,
            rotationX: -y * 0.03,
            duration: 0.5,
            ease: "power2.out",
          })
        })
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.5,
            ease: "power2.out",
          })
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [posts])

  const featuredPost = filteredPosts[0]
  const regularPosts = filteredPosts.slice(1)

  return (
    <div ref={containerRef} className="min-h-screen bg-[#222831] overflow-hidden">
      <div className="parallax-bg fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-background opacity-20" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[400px] -top-[400px] h-[800px] w-[800px] opacity-10"
        >
          <div className="absolute inset-0 rounded-full border border-[#00ADB5]/30" />
          <div className="absolute inset-[100px] rounded-full border border-[#393E46]/30" />
          <div className="absolute inset-[200px] rounded-full border border-[#00ADB5]/20" />
          <div className="absolute inset-[300px] rounded-full border border-[#EEEEEE]/10" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -left-[200px] top-[40%] h-[500px] w-[500px] rounded-full bg-[#00ADB5]/10 blur-[150px]"
        />
      </div>

      <motion.section
        ref={heroRef}
        className="relative min-h-[50vh] flex items-center justify-center pt-32 pb-8"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <h1 className="hero-text mb-6 text-5xl font-bold text-[#EEEEEE] md:text-7xl lg:text-8xl">
            <span className="inline">The Developer </span>
            <span className="bg-gradient-to-r from-[#00ADB5] via-[#00ADB5] to-[#EEEEEE] bg-clip-text text-transparent">
              Blog
            </span>
          </h1>

          <p className="hero-text mx-auto mb-8 max-w-2xl text-lg text-[#EEEEEE]/60 md:text-xl">
            Deep dives into web development, design systems, and the latest tech trends
          </p>
        </div>
      </motion.section>

      <section className="relative z-10 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-[#393E46]/50 bg-[#393E46]/10 p-6 backdrop-blur-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#EEEEEE]/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics, or tags..."
                  className="w-full rounded-xl border border-[#393E46] bg-[#222831]/80 py-3.5 pl-12 pr-10 text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 transition-all focus:border-[#00ADB5] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#EEEEEE]/40 hover:bg-[#393E46] hover:text-[#EEEEEE]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                <Filter className="h-4 w-4 text-[#EEEEEE]/40 flex-shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-[#00ADB5] text-[#222831]"
                        : "border border-[#393E46] bg-transparent text-[#EEEEEE]/70 hover:border-[#00ADB5]/50 hover:text-[#00ADB5]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {(searchQuery || selectedCategory !== "All") && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#EEEEEE]/60">
                <span>Found {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}</span>
                {(searchQuery || selectedCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All")
                    }}
                    className="ml-2 text-[#00ADB5] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 cards-section py-12">
        <div ref={cardsRef} className="mx-auto max-w-7xl px-6">
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#393E46]/20">
                <Search className="h-10 w-10 text-[#00ADB5]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#EEEEEE]">No articles found</h3>
              <p className="text-[#EEEEEE]/60 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
                className="text-[#00ADB5] hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <>
              {featuredPost && (
                <div className="mb-16">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-8 flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ADB5]/10">
                      <Sparkles className="h-5 w-5 text-[#00ADB5]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#EEEEEE]">Featured Article</h2>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-[#00ADB5]/50 to-transparent" />
                  </motion.div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                      whileHover={{ y: -8 }}
                      className="magnetic-card floating-card group relative overflow-hidden rounded-3xl border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/30 via-[#393E46]/10 to-transparent backdrop-blur-sm"
                      style={{ perspective: "1000px" }}
                    >
                      <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                          {featuredPost.featured_image ? (
                            <Image
                              src={featuredPost.featured_image}
                              alt={featuredPost.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00ADB5]/20 to-[#393E46]/20 flex items-center justify-center">
                              <BookOpen className="h-20 w-20 text-[#00ADB5]/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-transparent to-transparent md:bg-gradient-to-r" />
                        </div>
                        
                        <div className="relative p-8 md:p-12 flex flex-col justify-center">
                          <div className="mb-4 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-[#00ADB5]/10 px-4 py-1.5 text-sm font-medium text-[#00ADB5]">
                              {featuredPost.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-[#EEEEEE]/50">
                              <Clock className="h-4 w-4" />
                              {featuredPost.reading_time} min read
                            </span>
                          </div>

                          <h3 className="mb-4 text-2xl font-bold text-[#EEEEEE] transition-colors group-hover:text-[#00ADB5] md:text-3xl lg:text-4xl">
                            {featuredPost.title}
                          </h3>

                          <p className="mb-6 text-[#EEEEEE]/60 line-clamp-3 md:text-lg">
                            {featuredPost.excerpt}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                              {featuredPost.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-[#393E46] px-3 py-1 text-xs text-[#EEEEEE]/50"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#00ADB5]">
                              <span>Read Article</span>
                              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                          </div>

                          <div className="mt-6 flex items-center gap-2 text-sm text-[#EEEEEE]/40">
                            <Calendar className="h-4 w-4" />
                            {formatDate(featuredPost.published_at)}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </div>
              )}

              {regularPosts.length > 0 && (
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-8 flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ADB5]/10">
                      <BookOpen className="h-5 w-5 text-[#00ADB5]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#EEEEEE]">Latest Articles</h2>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-[#00ADB5]/50 to-transparent" />
                  </motion.div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {regularPosts.map((post, i) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <motion.article
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="magnetic-card floating-card group h-full overflow-hidden rounded-2xl border border-[#393E46]/50 bg-[#393E46]/10 backdrop-blur-sm transition-all hover:border-[#00ADB5]/50 hover:shadow-xl hover:shadow-[#00ADB5]/5"
                          style={{ perspective: "1000px" }}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden">
                            {post.featured_image ? (
                              <Image
                                src={post.featured_image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-[#00ADB5]/10 to-[#393E46]/30 flex items-center justify-center">
                                <BookOpen className="h-12 w-12 text-[#00ADB5]/30" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                              <span className="rounded-full bg-[#00ADB5]/90 px-3 py-1 text-xs font-medium text-[#222831]">
                                {post.category}
                              </span>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="mb-3 flex items-center gap-3 text-xs text-[#EEEEEE]/50">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(post.published_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.reading_time} min
                              </span>
                            </div>

                            <h3 className="mb-3 text-lg font-bold text-[#EEEEEE] transition-colors group-hover:text-[#00ADB5] line-clamp-2">
                              {post.title}
                            </h3>

                            <p className="mb-4 text-sm text-[#EEEEEE]/60 line-clamp-2">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1.5">
                                {post.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-[#393E46]/50 px-2 py-0.5 text-xs text-[#EEEEEE]/40"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <ArrowUpRight className="h-4 w-4 text-[#393E46] transition-all group-hover:text-[#00ADB5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                          </div>
                        </motion.article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mt-16 text-center"
              >
                <button className="group inline-flex items-center gap-2 rounded-xl border border-[#393E46] bg-[#393E46]/20 px-8 py-4 font-semibold text-[#EEEEEE] transition-all hover:border-[#00ADB5] hover:bg-[#00ADB5]/10 hover:text-[#00ADB5]">
                  Load More Articles
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </>
          )}
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-3xl border border-[#393E46]/50 bg-gradient-to-br from-[#00ADB5]/5 via-[#393E46]/10 to-transparent p-8 md:p-12 text-center backdrop-blur-sm"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ADB5]/10">
              <Sparkles className="h-8 w-8 text-[#00ADB5]" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-[#EEEEEE] md:text-3xl">
              Stay Updated
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-[#EEEEEE]/60">
              Subscribe to get the latest articles, tutorials, and insights delivered straight to your inbox.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-[#393E46] bg-[#393E46]/20 px-5 py-3 text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 transition-all focus:border-[#00ADB5] focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-[#00ADB5] px-6 py-3 font-semibold text-[#222831] transition-all hover:shadow-lg hover:shadow-[#00ADB5]/25"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
