"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { RefreshCw, Plus, FileText, Edit, Trash2, ExternalLink, Star, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  cover_image: string
  is_published: boolean
  is_featured: boolean
  created_at: string
}

export default function BlogPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/blog")
      const json = await res.json()
      if (json.data) {
        setPosts(json.data)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" })
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Blog Page" description="Manage your blog posts">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  const featuredPosts = posts.filter(p => p.is_featured)
  const publishedPosts = posts.filter(p => p.is_published)
  const draftPosts = posts.filter(p => !p.is_published)

  return (
    <AdminShell
      title="Blog Page"
      description="Manage your blog posts"
      actions={
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      }
    >
      <div className="space-y-6">
        {featuredPosts.length > 0 && (
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Featured Posts</h3>
                  <p className="text-sm text-zinc-500">Highlighted posts ({featuredPosts.length} featured)</p>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/5"
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-800">
                      {post.cover_image && (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white line-clamp-1">{post.title}</h4>
                        <Star className="h-4 w-4 text-amber-400" />
                      </div>
                      <p className="mt-1 text-sm text-zinc-500 line-clamp-1">{post.excerpt}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCardContent>
          </AdminCard>
        )}

        <AdminCard>
          <AdminCardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">All Posts</h3>
                <p className="text-sm text-zinc-500">{publishedPosts.length} published, {draftPosts.length} drafts</p>
              </div>
            </div>
          </AdminCardHeader>
          <AdminCardContent>
            {posts.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">No blog posts yet</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-4 transition-all",
                      post.is_featured
                        ? "border-amber-500/20 bg-amber-500/5"
                        : post.is_published
                          ? "border-green-500/20 bg-green-500/5"
                          : "border-white/5 bg-white/5 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-zinc-800">
                        {post.cover_image && (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{post.title}</h4>
                          {post.is_featured && <Star className="h-4 w-4 text-amber-400" />}
                          {post.is_published ? (
                            <Eye className="h-4 w-4 text-green-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-zinc-500" />
                          )}
                        </div>
                        <p className="text-sm text-zinc-500 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCardContent>
        </AdminCard>
      </div>
    </AdminShell>
  )
}
