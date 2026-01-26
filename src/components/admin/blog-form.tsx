"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminTextarea,
  AdminSwitch,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
  AdminTagInput,
} from "@/components/admin/form-elements"
import { Save, X, Trash2, AlertCircle, CheckCircle, FileText, Image as ImageIcon } from "lucide-react"
import { slugify, calculateReadingTime } from "@/lib/utils"
import { cn } from "@/lib/utils"

type BlogData = {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category: string
  tags: string[]
  reading_time: number
  is_published: boolean
  is_featured: boolean
  published_at: string | null
}

const defaultBlog: BlogData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  category: "General",
  tags: [],
  reading_time: 0,
  is_published: false,
  is_featured: false,
  published_at: null,
}

const categoryOptions = [
  "General", "Development", "Design", "Tutorial", "Case Study", "News", "Personal"
]

type Tab = "content" | "media" | "settings"

export function BlogForm({
  initialData,
  isEdit = false,
}: {
  initialData?: Partial<BlogData>
  isEdit?: boolean
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("content")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<BlogData>({
    ...defaultBlog,
    ...initialData,
    tags: initialData?.tags || [],
  })

  const [featuredCount, setFeaturedCount] = useState(0)
  const [loadingFeaturedCount, setLoadingFeaturedCount] = useState(false)

  // Fetch featured count on mount
  useEffect(() => {
    const fetchFeaturedCount = async () => {
      setLoadingFeaturedCount(true)
      try {
        const res = await fetch("/api/admin/blog")
        const json = await res.json()
        const count = json.data?.filter((p: any) => p.is_featured && p.is_published && p.id !== formData.id).length || 0
        setFeaturedCount(count)
      } catch (e) {
        console.error("Failed to fetch featured count:", e)
      } finally {
        setLoadingFeaturedCount(false)
      }
    }
    fetchFeaturedCount()
  }, [formData.id])

  const autoSlug = useMemo(() => (formData.title ? slugify(formData.title) : ""), [formData.title])
  const readingTime = useMemo(() => calculateReadingTime(formData.content), [formData.content])

  const updateField = <K extends keyof BlogData>(key: K, value: BlogData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate featured blogs limit
      if (formData.is_featured && !initialData?.is_featured) {
        const res = await fetch("/api/admin/blog")
        const json = await res.json()
        const featuredCount = json.data?.filter((p: any) => p.is_featured && p.is_published && p.id !== formData.id).length || 0

        if (featuredCount >= 4) {
          throw new Error("Maximum 4 featured blog posts allowed. Please unmark another post first.")
        }
      }

      const url = isEdit ? `/api/admin/blog/${formData.id}` : "/api/admin/blog"
      const method = isEdit ? "PUT" : "POST"

      const payload = {
        ...formData,
        slug: formData.slug || autoSlug,
        reading_time: readingTime,
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || `Failed to ${isEdit ? "update" : "create"} post`)

      setSuccess(true)
      if (!isEdit) {
        router.replace(`/admin/blog/${json.data.id}`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/blog/${formData.id}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to delete")
      router.replace("/admin/blog")
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "content", label: "Content", icon: FileText },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "settings", label: "Settings", icon: () => <span className="text-xs">...</span> },
  ]

  return (
    <AdminShell
      title={isEdit ? "Edit Blog Post" : "New Blog Post"}
      description={isEdit ? `Editing: ${formData.title || "Untitled"}` : "Create a new blog post"}
      actions={
        <div className="flex items-center gap-3">
          {isEdit && (
            <AdminButton variant="danger" onClick={handleDelete} loading={deleting}>
              <Trash2 className="h-4 w-4" />
              Delete
            </AdminButton>
          )}
          <AdminButton variant="secondary" onClick={() => router.back()}>
            <X className="h-4 w-4" />
            Cancel
          </AdminButton>
          <AdminButton onClick={() => handleSubmit()} loading={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Post"}
          </AdminButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-200">
            <CheckCircle className="h-5 w-5 shrink-0" />
            Post saved successfully!
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto border-b border-white/10 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "content" && (
          <div className="space-y-6 max-w-4xl">
            <AdminCard>
              <AdminCardHeader>
                <h3 className="text-lg font-semibold text-white">Post Details</h3>
                <p className="text-sm text-zinc-500">Title and URL slug</p>
              </AdminCardHeader>
              <AdminCardContent className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <AdminInput
                    label="Title"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="My Awesome Blog Post"
                    required
                  />
                  <AdminInput
                    label="URL Slug"
                    value={formData.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder={autoSlug || "auto-generated-from-title"}
                  />
                </div>
                <AdminTextarea
                  label="Excerpt"
                  value={formData.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  placeholder="A short summary of your post..."
                  required
                />
              </AdminCardContent>
            </AdminCard>

            <AdminCard>
              <AdminCardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Content</h3>
                    <p className="text-sm text-zinc-500">Write your blog post (supports Markdown)</p>
                  </div>
                  <span className="text-sm text-zinc-400">{readingTime} min read</span>
                </div>
              </AdminCardHeader>
              <AdminCardContent>
                <textarea
                  value={formData.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="# Your content here...

Write your blog post using Markdown syntax.

## Section Title

Your content here..."
                  className="w-full min-h-[400px] rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-cyan-500/50 resize-y"
                  required
                />
              </AdminCardContent>
            </AdminCard>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-6 max-w-3xl">
            <AdminCard>
              <AdminCardHeader>
                <h3 className="text-lg font-semibold text-white">Featured Image</h3>
                <p className="text-sm text-zinc-500">Cover image for your post</p>
              </AdminCardHeader>
              <AdminCardContent className="space-y-5">
                <AdminInput
                  label="Image URL"
                  value={formData.featured_image}
                  onChange={(e) => updateField("featured_image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.featured_image ? (
                  <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={formData.featured_image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-zinc-500">
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-2 h-8 w-8" />
                      <p className="text-sm">No image added</p>
                    </div>
                  </div>
                )}
              </AdminCardContent>
            </AdminCard>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl">
            <AdminCard>
              <AdminCardHeader>
                <h3 className="text-lg font-semibold text-white">Category & Tags</h3>
                <p className="text-sm text-zinc-500">Organize your post</p>
              </AdminCardHeader>
              <AdminCardContent className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-500/50"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat} className="bg-zinc-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <AdminTagInput
                  label="Tags"
                  value={formData.tags}
                  onChange={(tags) => updateField("tags", tags)}
                  placeholder="Add tag (press Enter)"
                  hint="Press Enter to add tags"
                />
              </AdminCardContent>
            </AdminCard>

            <AdminCard>
              <AdminCardHeader>
                <h3 className="text-lg font-semibold text-white">Publishing</h3>
              </AdminCardHeader>
              <AdminCardContent className="space-y-5">
                <AdminSwitch
                  label="Published"
                  description="Make this post visible to visitors"
                  checked={formData.is_published}
                  onChange={(checked) => updateField("is_published", checked)}
                />
                <div className="space-y-2">
                  <AdminSwitch
                    label="Featured"
                    description={
                      featuredCount >= 4 && !formData.is_featured
                        ? `Maximum 4 featured posts reached (${featuredCount}/4). Unmark another post first.`
                        : `Show in carousel on blog page (${featuredCount}/4 featured posts)`
                    }
                    checked={formData.is_featured}
                    onChange={(checked) => {
                      if (checked && featuredCount >= 4 && !initialData?.is_featured) {
                        return // Prevent toggling on if limit reached
                      }
                      updateField("is_featured", checked)
                    }}
                    disabled={loadingFeaturedCount || (featuredCount >= 4 && !formData.is_featured)}
                  />
                  {featuredCount >= 4 && !formData.is_featured && (
                    <p className="text-xs text-amber-400">
                      ⚠️ Featured posts limit reached. Please unmark another post to feature this one.
                    </p>
                  )}
                </div>
              </AdminCardContent>
            </AdminCard>
          </div>
        )}
      </form>
    </AdminShell>
  )
}
