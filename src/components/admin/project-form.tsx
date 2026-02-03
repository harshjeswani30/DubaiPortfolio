"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { slugify } from "@/lib/utils"
import {
  Save,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Tag,
  Layers,
  Quote,
  CheckCircle,
  AlertCircle,
  Target,
  User,
  Clock,
  Building,
  Upload,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

type ProjectData = {
  id?: string
  title: string
  slug: string
  description: string
  content: string
  category: string
  tech_stack: string[]
  tagline: string
  tagline_highlight: string
  featured_image: string
  images: string[]
  live_url: string
  github_url: string
  is_featured: boolean
  is_published: boolean
  display_order: number
  duration: string
  client: string
  role: string
  challenges: string[]
  solutions: string[]
  results: string[]
  testimonial_quote: string
  testimonial_author: string
  testimonial_position: string
}

const defaultProject: ProjectData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  category: "Web Development",
  tech_stack: [],
  tagline: "",
  tagline_highlight: "",
  featured_image: "",
  images: [],
  live_url: "",
  github_url: "",
  is_featured: false,
  is_published: false,
  display_order: 0,
  duration: "",
  client: "",
  role: "",
  challenges: [],
  solutions: [],
  results: [],
  testimonial_quote: "",
  testimonial_author: "",
  testimonial_position: "",
}

const categories = [
  "Web Development",
  "Mobile App",
  "FinTech",
  "Healthcare",
  "E-Commerce",
  "IoT / AI",
  "SaaS",
  "Enterprise",
  "Other"
]

type Tab = "basic" | "media" | "details" | "case-study"

export function ProjectForm({
  initialData,
  isEdit = false
}: {
  initialData?: Partial<ProjectData>
  isEdit?: boolean
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("basic")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ProjectData>({
    ...defaultProject,
    ...initialData,
    tech_stack: initialData?.tech_stack || [],
    images: initialData?.images || [],
    challenges: initialData?.challenges || [],
    solutions: initialData?.solutions || [],
    results: initialData?.results || [],
  })

  const [newTech, setNewTech] = useState("")
  const [newImage, setNewImage] = useState("")
  const [newChallenge, setNewChallenge] = useState("")
  const [newSolution, setNewSolution] = useState("")
  const [newResult, setNewResult] = useState("")

  // Upload states
  const [uploadingFeatured, setUploadingFeatured] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [featuredMode, setFeaturedMode] = useState<"url" | "upload">("url")
  const [galleryMode, setGalleryMode] = useState<"url" | "upload">("url")

  const autoSlug = useMemo(() => (formData.title ? slugify(formData.title) : ""), [formData.title])

  const updateField = <K extends keyof ProjectData>(key: K, value: ProjectData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const addToArray = (key: "tech_stack" | "images" | "challenges" | "solutions" | "results", value: string, setValue: (v: string) => void) => {
    if (!value.trim()) return
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), value.trim()],
    }))
    setValue("")
  }

  const removeFromArray = (key: "tech_stack" | "images" | "challenges" | "solutions" | "results", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }))
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      // Check if response is JSON
      const contentType = res.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        const error = await res.json().catch(() => ({ error: "Upload failed" }))
        throw new Error(error.error || "Failed to upload image")
      } else {
        // Non-JSON response (likely auth redirect or server error)
        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.")
        }
        throw new Error(`Upload failed with status ${res.status}`)
      }
    }

    // Check if response is JSON before parsing
    const contentType = res.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      throw new Error("Invalid response from server. Please try again.")
    }

    const data = await res.json()
    return data.url
  }

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setUploadingFeatured(true)
    setError(null)

    try {
      const url = await uploadImage(file)
      updateField("featured_image", url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setUploadingFeatured(false)
    }
  }

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("All files must be images")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be less than 5MB")
        return
      }
    }

    setUploadingGallery(true)
    setError(null)

    try {
      const uploadPromises = files.map(async (file, index) => {
        const url = await uploadImage(file)
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: ((index + 1) / files.length) * 100,
        }))
        return url
      })

      const urls = await Promise.all(uploadPromises)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }))
      setUploadProgress({})
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images")
    } finally {
      setUploadingGallery(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const payload = {
        ...formData,
        slug: formData.slug || autoSlug,
      }

      const url = isEdit ? `/api/admin/projects/${formData.id}` : "/api/admin/projects"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || `Failed to ${isEdit ? "update" : "create"} project`)

      setSuccess(true)
      if (!isEdit) {
        router.replace(`/admin/projects/${json.data.id}`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "details", label: "Project Details", icon: Layers },
    { id: "case-study", label: "Case Study", icon: Target },
  ]

  return (
    <AdminShell
      title={isEdit ? "Edit Project" : "New Project"}
      description={isEdit ? `Editing: ${formData.title || "Untitled"}` : "Create a new portfolio project"}
      actions={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Project"}
          </button>
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
            Project saved successfully!
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

        {activeTab === "basic" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="My Awesome Project"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      placeholder={autoSlug || "auto-generated-from-title"}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Short Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="A brief description of your project (shown in cards)"
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Full Content / Description
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    placeholder="Detailed project description (supports markdown)"
                    rows={8}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50 resize-none font-mono text-sm"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-zinc-900">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => updateField("display_order", Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Tech Stack</h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("tech_stack", newTech, setNewTech))}
                  placeholder="Add technology (e.g., React)"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={() => addToArray("tech_stack", newTech, setNewTech)}
                  className="rounded-xl bg-cyan-500/20 px-4 py-3 text-cyan-400 transition-colors hover:bg-cyan-500/30"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tech_stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="group inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-300"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeFromArray("tech_stack", idx)}
                      className="ml-1 rounded p-0.5 text-cyan-400/60 transition-colors hover:bg-cyan-500/20 hover:text-cyan-300"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                {formData.tech_stack.length === 0 && (
                  <span className="text-sm text-zinc-500">No technologies added yet</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Status & Visibility</h3>
              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => updateField("is_published", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-zinc-700 peer-checked:bg-green-500 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-zinc-300">Published</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => updateField("is_featured", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-zinc-700 peer-checked:bg-purple-500 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-zinc-300">Featured</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Featured Image</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFeaturedMode("url")}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      featuredMode === "url"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <LinkIcon className="inline h-3.5 w-3.5 mr-1" />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedMode("upload")}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      featuredMode === "upload"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Upload className="inline h-3.5 w-3.5 mr-1" />
                    Upload
                  </button>
                </div>
              </div>

              {featuredMode === "url" ? (
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => updateField("featured_image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                />
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-black/40 px-4 py-3 text-zinc-400 transition-colors hover:border-cyan-500/50 hover:bg-black/60">
                        <Upload className="h-5 w-5" />
                        <span className="text-sm">Choose image file</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImageUpload}
                        className="hidden"
                        disabled={uploadingFeatured}
                      />
                    </label>
                  </div>
                  {uploadingFeatured && (
                    <div className="flex items-center gap-2 text-sm text-cyan-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
              )}

              {formData.featured_image && (
                <div className="mt-4 relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={formData.featured_image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateField("featured_image", "")}
                    className="absolute right-2 top-2 rounded-lg bg-red-500/80 p-2 text-white transition-opacity hover:bg-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Gallery Images</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGalleryMode("url")}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      galleryMode === "url"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <LinkIcon className="inline h-3.5 w-3.5 mr-1" />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryMode("upload")}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      galleryMode === "upload"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Upload className="inline h-3.5 w-3.5 mr-1" />
                    Upload
                  </button>
                </div>
              </div>

              {galleryMode === "url" ? (
                <div className="mb-4 flex gap-2">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("images", newImage, setNewImage))}
                    placeholder="https://example.com/gallery-image.jpg"
                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => addToArray("images", newImage, setNewImage)}
                    className="rounded-xl bg-cyan-500/20 px-4 py-3 text-cyan-400 transition-colors hover:bg-cyan-500/30"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="mb-4 space-y-3">
                  <label
                    className="block cursor-pointer"
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add("border-cyan-500/50", "bg-cyan-500/5")
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove("border-cyan-500/50", "bg-cyan-500/5")
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove("border-cyan-500/50", "bg-cyan-500/5")
                      const files = Array.from(e.dataTransfer.files)
                      if (files.length > 0) {
                        const input = e.currentTarget.querySelector("input[type=file]") as HTMLInputElement
                        if (input) {
                          const dataTransfer = new DataTransfer()
                          files.forEach(file => dataTransfer.items.add(file))
                          input.files = dataTransfer.files
                          input.dispatchEvent(new Event("change", { bubbles: true }))
                        }
                      }
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-black/40 px-4 py-8 text-zinc-400 transition-colors hover:border-cyan-500/50 hover:bg-black/60">
                      <div className="text-center">
                        <Upload className="mx-auto mb-2 h-8 w-8" />
                        <p className="text-sm font-medium">Drop images here or click to browse</p>
                        <p className="mt-1 text-xs text-zinc-500">Support for multiple images (JPG, PNG, WebP, GIF - Max 5MB each)</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesUpload}
                      className="hidden"
                      disabled={uploadingGallery}
                    />
                  </label>
                  {uploadingGallery && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-cyan-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading images...
                      </div>
                      {Object.entries(uploadProgress).map(([filename, progress]) => (
                        <div key={filename} className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="truncate max-w-[200px]">{filename}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="group relative aspect-video overflow-hidden rounded-xl border border-white/10">
                    <img src={img} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFromArray("images", idx)}
                      className="absolute right-2 top-2 rounded-lg bg-red-500/80 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.images.length === 0 && (
                  <div className="col-span-full flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 text-zinc-500">
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-2 h-8 w-8" />
                      <p className="text-sm">No gallery images</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Project Links</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <LinkIcon className="h-4 w-4" />
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => updateField("live_url", e.target.value)}
                    placeholder="https://myproject.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => updateField("github_url", e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Tagline</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">Tagline Text</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    placeholder="Perfect for luxury"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">Highlight Word</label>
                  <input
                    type="text"
                    value={formData.tagline_highlight}
                    onChange={(e) => updateField("tagline_highlight", e.target.value)}
                    placeholder="living"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Project Info</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <Clock className="h-4 w-4" />
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                    placeholder="4 months"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <Building className="h-4 w-4" />
                    Client
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => updateField("client", e.target.value)}
                    placeholder="Company Name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <User className="h-4 w-4" />
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    placeholder="Lead Developer"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "case-study" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                Challenges
              </h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("challenges", newChallenge, setNewChallenge))}
                  placeholder="Add a challenge you faced"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={() => addToArray("challenges", newChallenge, setNewChallenge)}
                  className="rounded-xl bg-amber-500/20 px-4 py-3 text-amber-400 transition-colors hover:bg-amber-500/30"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-2">
                {formData.challenges.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 rounded-lg bg-amber-500/5 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span className="flex-1 text-sm text-zinc-300">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray("challenges", idx)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Target className="h-5 w-5 text-blue-400" />
                Solutions
              </h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("solutions", newSolution, setNewSolution))}
                  placeholder="Add a solution you implemented"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={() => addToArray("solutions", newSolution, setNewSolution)}
                  className="rounded-xl bg-blue-500/20 px-4 py-3 text-blue-400 transition-colors hover:bg-blue-500/30"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-2">
                {formData.solutions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 rounded-lg bg-blue-500/5 p-3">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    <span className="flex-1 text-sm text-zinc-300">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray("solutions", idx)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Results
              </h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newResult}
                  onChange={(e) => setNewResult(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("results", newResult, setNewResult))}
                  placeholder="Add a result or achievement"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={() => addToArray("results", newResult, setNewResult)}
                  className="rounded-xl bg-green-500/20 px-4 py-3 text-green-400 transition-colors hover:bg-green-500/30"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-2">
                {formData.results.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 rounded-lg bg-green-500/5 p-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    <span className="flex-1 text-sm text-zinc-300">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray("results", idx)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Quote className="h-5 w-5 text-purple-400" />
                Client Testimonial
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">Quote</label>
                  <textarea
                    value={formData.testimonial_quote}
                    onChange={(e) => updateField("testimonial_quote", e.target.value)}
                    placeholder="What did your client say about the project?"
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50 resize-none"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Author Name</label>
                    <input
                      type="text"
                      value={formData.testimonial_author}
                      onChange={(e) => updateField("testimonial_author", e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Author Position</label>
                    <input
                      type="text"
                      value={formData.testimonial_position}
                      onChange={(e) => updateField("testimonial_position", e.target.value)}
                      placeholder="CEO, Company Name"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminShell>
  )
}
