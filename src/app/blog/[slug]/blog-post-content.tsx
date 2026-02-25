"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, Heart, ChevronUp, Copy, Check, Twitter, Linkedin, Facebook } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  category: string
  tags: string[]
  reading_time: number
  published_at: string
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  })

  // Raw scroll for instant parallax
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -25])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.06])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".article-header",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1 }
      )

      gsap.fromTo(
        ".article-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".article-content",
            start: "top 80%",
          },
        }
      )

      gsap.to(".parallax-image", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".image-container",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, containerRef)

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      ctx.revert()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#222831]">
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#393E46]/30"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/70"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
      </motion.div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-background opacity-10" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[300px] top-[20%] h-[600px] w-[600px] opacity-5"
        >
          <div className="absolute inset-0 rounded-full border border-[#00ADB5]/30" />
          <div className="absolute inset-[80px] rounded-full border border-[#393E46]/30" />
          <div className="absolute inset-[160px] rounded-full border border-[#00ADB5]/20" />
        </motion.div>
      </div>

      <article ref={articleRef} className="relative pt-24">
        <motion.header
          className="relative overflow-hidden"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="article-header"
            >
              <Link
                href="/blog"
                className="group mb-8 inline-flex items-center gap-2 rounded-full border border-[#393E46] bg-[#393E46]/20 px-4 py-2 text-sm text-[#EEEEEE]/70 backdrop-blur-sm transition-all hover:border-[#00ADB5] hover:text-[#00ADB5]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </Link>
            </motion.div>

            <div className="article-header mb-6 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-[#00ADB5]/10 px-4 py-1.5 text-sm font-medium text-[#00ADB5]">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-[#EEEEEE]/50">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-[#EEEEEE]/50">
                <Clock className="h-4 w-4" />
                {post.reading_time} min read
              </span>
            </div>

            <h1 className="article-header mb-6 text-4xl font-bold text-[#EEEEEE] md:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            <p className="article-header mb-8 text-xl text-[#EEEEEE]/60 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="article-header flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#393E46] bg-[#393E46]/20 text-[#EEEEEE]/70 transition-all hover:border-[#00ADB5] hover:text-[#00ADB5]"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#393E46] bg-[#393E46]/20 text-[#EEEEEE]/70 transition-all hover:border-[#00ADB5] hover:text-[#00ADB5]"
                >
                  <Twitter className="h-4 w-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#393E46] bg-[#393E46]/20 text-[#EEEEEE]/70 transition-all hover:border-[#00ADB5] hover:text-[#00ADB5]"
                >
                  <Linkedin className="h-4 w-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#393E46] bg-[#393E46]/20 text-[#EEEEEE]/70 transition-all hover:border-[#00ADB5] hover:text-[#00ADB5]"
                >
                  <Facebook className="h-4 w-4" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.header>

        {post.featured_image && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="image-container relative mx-auto max-w-5xl px-6 mb-16"
          >
            <div className="relative aspect-[21/9] overflow-hidden rounded-3xl border border-[#393E46]/30">
              <motion.div
                className="parallax-image absolute inset-[-20%] w-[140%] h-[140%]"
                style={{ scale: imageScale, opacity: imageOpacity }}
              >
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#222831]/50 via-transparent to-transparent" />
            </div>
          </motion.div>
        )}

        <div className="relative mx-auto max-w-3xl px-6">
          <div className="lg:grid lg:grid-cols-[1fr_auto] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="article-content prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-[#EEEEEE] prose-headings:scroll-mt-24
                prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-[#393E46]/30 prose-h2:pb-4
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-[#00ADB5]
                prose-p:text-[#EEEEEE]/70 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-[#00ADB5] prose-a:no-underline prose-a:border-b prose-a:border-[#00ADB5]/30 hover:prose-a:border-[#00ADB5]
                prose-strong:text-[#EEEEEE] prose-strong:font-semibold
                prose-code:rounded-lg prose-code:bg-[#393E46]/50 prose-code:px-2 prose-code:py-1 prose-code:text-[#00ADB5] prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#1a1d24] prose-pre:border prose-pre:border-[#393E46]/50 prose-pre:rounded-2xl prose-pre:shadow-xl
                prose-blockquote:border-l-4 prose-blockquote:border-[#00ADB5] prose-blockquote:bg-[#393E46]/10 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-[#EEEEEE]/80
                prose-ul:text-[#EEEEEE]/70 prose-ol:text-[#EEEEEE]/70
                prose-li:marker:text-[#00ADB5]
                prose-img:rounded-2xl prose-img:border prose-img:border-[#393E46]/30
                prose-hr:border-[#393E46]/30
              "
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </motion.div>
          </div>

          <motion.footer
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-16 border-t border-[#393E46]/30 pt-8"
          >
            <div className="mb-8">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#EEEEEE]/50">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-full border border-[#393E46] bg-[#393E46]/20 px-4 py-1.5 text-sm text-[#EEEEEE]/70 transition-all hover:border-[#00ADB5] hover:text-[#00ADB5]"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#393E46]/30 bg-[#393E46]/10 p-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#EEEEEE]/50">Share this article</span>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#393E46]/50 text-[#EEEEEE]/70 transition-all hover:bg-[#00ADB5] hover:text-[#222831]"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </motion.button>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#393E46]/50 text-[#EEEEEE]/70 transition-all hover:bg-[#00ADB5] hover:text-[#222831]"
                  >
                    <Twitter className="h-4 w-4" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#393E46]/50 text-[#EEEEEE]/70 transition-all hover:bg-[#00ADB5] hover:text-[#222831]"
                  >
                    <Linkedin className="h-4 w-4" />
                  </motion.a>
                </div>
              </div>
              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl bg-[#00ADB5] px-5 py-2.5 text-sm font-semibold text-[#222831] transition-all hover:shadow-lg hover:shadow-[#00ADB5]/25"
                >
                  <ArrowLeft className="h-4 w-4" />
                  More Articles
                </motion.button>
              </Link>
            </div>
          </motion.footer>
        </div>
      </article>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
          pointerEvents: showScrollTop ? "auto" : "none" as const
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#00ADB5] text-[#222831] shadow-lg shadow-[#00ADB5]/25"
      >
        <ChevronUp className="h-5 w-5" />
      </motion.button>

      <section className="relative z-10 pb-20 pt-10">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-3xl border border-[#393E46]/50 bg-gradient-to-br from-[#00ADB5]/5 via-[#393E46]/10 to-transparent p-8 text-center backdrop-blur-sm"
          >
            <h3 className="mb-3 text-xl font-bold text-[#EEEEEE]">Enjoyed this article?</h3>
            <p className="mb-6 text-[#EEEEEE]/60">Subscribe to get notified when new articles are published.</p>
            <div className="mx-auto flex max-w-sm flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-[#393E46] bg-[#393E46]/20 px-4 py-3 text-sm text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 transition-all focus:border-[#00ADB5] focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-[#00ADB5] px-5 py-3 text-sm font-semibold text-[#222831] transition-all hover:shadow-lg hover:shadow-[#00ADB5]/25"
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
