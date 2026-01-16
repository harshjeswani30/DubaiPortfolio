"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Clock, Calendar } from "lucide-react"

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
  return (
    <div className="min-h-screen bg-black pt-24">
      <article className="relative py-20">
        <div className="absolute inset-0 grid-background opacity-50" />

        <div className="relative mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </motion.div>

          <motion.header
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-400">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-zinc-500">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1 text-sm text-zinc-500">
                <Clock className="h-4 w-4" />
                {post.reading_time} min read
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-6 text-lg text-zinc-400">{post.excerpt}</p>
          </motion.header>

          {post.featured_image && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-12 overflow-hidden rounded-2xl"
            >
              <img
                src={post.featured_image}
                alt={post.title}
                className="h-auto w-full"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-zinc-400 prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:rounded prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:text-indigo-400 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </motion.div>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 border-t border-white/10 pt-8"
          >
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.footer>
        </div>
      </article>
    </div>
  )
}
