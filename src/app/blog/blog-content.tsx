"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Clock, ArrowUpRight } from "lucide-react"

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
  return (
    <div className="min-h-screen bg-black pt-24">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-background opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px]"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-indigo-400">
              Blog
            </span>
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              Articles & Insights
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Thoughts, tutorials, and insights about web development and
              technology.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-4xl px-6">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <p className="text-zinc-500">No blog posts yet. Check back soon!</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <motion.div
                      whileHover={{ x: 8 }}
                      className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition-colors hover:border-white/20 md:p-8"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="mb-3 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                              {post.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                              <Clock className="h-3 w-3" />
                              {post.reading_time} min read
                            </span>
                          </div>
                          <h2 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-indigo-400 md:text-2xl">
                            {post.title}
                          </h2>
                          <p className="mb-4 line-clamp-2 text-zinc-400">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 px-2 py-1 text-xs text-zinc-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-500 md:flex-col md:items-end">
                          <span>{formatDate(post.published_at)}</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
