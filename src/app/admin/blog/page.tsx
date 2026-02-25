"use client"

import Link from "next/link"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Plus, Search, Eye, EyeOff, Star, Edit2, Trash2, FileText, Clock, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBlogQuery, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/use-blog-query"

type BlogRow = {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  category: string
  tags: string[]
  reading_time: number
  is_published: boolean
  is_featured: boolean
  published_at: string | null
  created_at: string
}

export default function AdminBlogPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "featured">("all")

  const { data: items = [], isLoading, isError } = useBlogQuery()
  const updatePost = useUpdateBlogPost()
  const deletePostMutation = useDeleteBlogPost()

  const togglePublish = (id: string, currentValue: boolean) => {
    updatePost.mutate({ id, payload: { is_published: !currentValue } })
  }

  const toggleFeatured = (id: string, currentValue: boolean) => {
    updatePost.mutate({ id, payload: { is_featured: !currentValue } })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return
    deletePostMutation.mutate(id)
  }

  const filteredItems = items.filter((p: any) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && p.is_published) ||
      (filter === "draft" && !p.is_published) ||
      (filter === "featured" && p.is_featured)
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: items.length,
    published: items.filter((p: any) => p.is_published).length,
    draft: items.filter((p: any) => !p.is_published).length,
    featured: items.filter((p: any) => p.is_featured).length,
  }

  return (
    <AdminShell
      title="Blog Posts"
      description="Manage your blog content"
      actions={
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all",
              filter === "all"
                ? "border-cyan-500/50 bg-cyan-500/10"
                : "border-white/10 bg-zinc-900/50 hover:border-white/20"
            )}
          >
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Posts</p>
          </button>
          <button
            onClick={() => setFilter("published")}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all",
              filter === "published"
                ? "border-green-500/50 bg-green-500/10"
                : "border-white/10 bg-zinc-900/50 hover:border-white/20"
            )}
          >
            <p className="text-2xl font-bold text-green-400">{stats.published}</p>
            <p className="text-sm text-zinc-400">Published</p>
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all",
              filter === "draft"
                ? "border-amber-500/50 bg-amber-500/10"
                : "border-white/10 bg-zinc-900/50 hover:border-white/20"
            )}
          >
            <p className="text-2xl font-bold text-amber-400">{stats.draft}</p>
            <p className="text-sm text-zinc-400">Drafts</p>
          </button>
          <button
            onClick={() => setFilter("featured")}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all",
              filter === "featured"
                ? "border-purple-500/50 bg-purple-500/10"
                : "border-white/10 bg-zinc-900/50 hover:border-white/20"
            )}
          >
            <p className="text-2xl font-bold text-purple-400">{stats.featured}</p>
            <p className="text-sm text-zinc-400">Featured</p>
          </button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
            Failed to load blog posts
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No posts found</h3>
            <p className="mb-6 text-sm text-zinc-400">Create your first blog post</p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Create Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((post: any) => (
              <div
                key={post.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition-all hover:border-white/20"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative aspect-video w-full sm:aspect-[4/3] sm:w-48 lg:w-56">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-zinc-800">
                        <FileText className="h-10 w-10 text-zinc-700" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {post.title || "(Untitled)"}
                          </h3>
                          {post.is_featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-300">
                              <Star className="h-3 w-3" />
                              Featured
                            </span>
                          )}
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              post.is_published
                                ? "bg-green-500/20 text-green-300"
                                : "bg-amber-500/20 text-amber-300"
                            )}
                          >
                            {post.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="mb-3 text-sm text-zinc-400 line-clamp-2">
                          {post.excerpt || "No excerpt"}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {post.category || "General"}
                          </span>
                          {post.reading_time > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.reading_time} min read
                            </span>
                          )}
                          <span>/{post.slug || "no-slug"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => togglePublish(post.id, post.is_published)}
                          className={cn(
                            "rounded-lg p-2 transition-colors",
                            post.is_published
                              ? "text-green-400 hover:bg-green-500/10"
                              : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                          )}
                          title={post.is_published ? "Unpublish" : "Publish"}
                        >
                          {post.is_published ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleFeatured(post.id, post.is_featured)}
                          className={cn(
                            "rounded-lg p-2 transition-colors",
                            post.is_featured
                              ? "text-purple-400 hover:bg-purple-500/10"
                              : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                          )}
                          title={post.is_featured ? "Unfeature" : "Feature"}
                        >
                          <Star className={cn("h-4 w-4", post.is_featured && "fill-current")} />
                        </button>
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="rounded-lg p-2 text-cyan-400 transition-colors hover:bg-cyan-500/10"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deletePostMutation.isPending}
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-auto pt-3 flex flex-wrap gap-1 border-t border-white/5">
                        {post.tags.slice(0, 4).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded bg-white/5 px-2 py-0.5 text-xs text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 4 && (
                          <span className="text-xs text-zinc-500">+{post.tags.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
