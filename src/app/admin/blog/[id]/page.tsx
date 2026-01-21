"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { BlogForm } from "@/components/admin/blog-form"
import { AdminShell } from "@/components/admin/admin-shell"

export default function EditBlogPage() {
  const params = useParams<{ id: string }>()
  const [post, setPost] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params?.id) return

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${params.id}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load post")
        setPost(json.data)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params?.id])

  if (loading) {
    return (
      <AdminShell title="Edit Blog Post" description="Loading...">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  if (error) {
    return (
      <AdminShell title="Edit Blog Post" description="Error loading post">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
          {error}
        </div>
      </AdminShell>
    )
  }

  if (!post) {
    return (
      <AdminShell title="Edit Blog Post" description="Post not found">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 text-center text-zinc-400">
          Post not found
        </div>
      </AdminShell>
    )
  }

  return <BlogForm initialData={post} isEdit />
}
