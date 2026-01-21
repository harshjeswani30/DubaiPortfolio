"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminTextarea,
  AdminTagInput,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { Save, RefreshCw, Plus, X, Image } from "lucide-react"

interface AboutPage {
  id?: string
  intro_eyebrow: string
  intro_title: string
  intro_title_highlight: string
  intro_description: string
  main_title: string
  footer_text: string
  images: string[]
  stats: { value: string; label: string }[]
}

export default function AboutSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [about, setAbout] = useState<AboutPage>({
    intro_eyebrow: "",
    intro_title: "",
    intro_title_highlight: "",
    intro_description: "",
    main_title: "",
    footer_text: "",
    images: [],
    stats: [],
  })

  useEffect(() => {
    loadAbout()
  }, [])

  const loadAbout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/settings/about")
      const json = await res.json()
      if (json.data) {
        setAbout({
          ...json.data,
          images: json.data.images || [],
          stats: json.data.stats || [],
        })
      }
    } catch (error) {
      console.error("Failed to load about:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to save about:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof AboutPage, value: any) => {
    setAbout((prev) => ({ ...prev, [field]: value }))
  }

  const addStat = () => {
    setAbout((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: "", label: "" }],
    }))
  }

  const updateStat = (index: number, field: "value" | "label", value: string) => {
    setAbout((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      ),
    }))
  }

  const removeStat = (index: number) => {
    setAbout((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }))
  }

  const addImage = () => {
    setAbout((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }))
  }

  const updateImage = (index: number, value: string) => {
    setAbout((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }))
  }

  const removeImage = (index: number) => {
    setAbout((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <AdminShell title="About Page" description="Configure your about page">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="About Page"
      description="Configure the about page content"
      actions={
        <AdminButton onClick={handleSubmit} loading={saving}>
          <Save className="h-4 w-4" />
          Save Changes
        </AdminButton>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Introduction Section</h3>
            <p className="text-sm text-zinc-500">The intro text at the top of the about page</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <AdminInput
              label="Eyebrow Text"
              value={about.intro_eyebrow}
              onChange={(e) => updateField("intro_eyebrow", e.target.value)}
              placeholder="Welcome"
              hint="Small text above the main title"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Intro Title"
                value={about.intro_title}
                onChange={(e) => updateField("intro_title", e.target.value)}
                placeholder="Creating Digital"
              />
              <AdminInput
                label="Highlight Word"
                value={about.intro_title_highlight}
                onChange={(e) => updateField("intro_title_highlight", e.target.value)}
                placeholder="Experiences"
                hint="Word shown with accent color"
              />
            </div>
            <AdminTextarea
              label="Description"
              value={about.intro_description}
              onChange={(e) => updateField("intro_description", e.target.value)}
              placeholder="Passionate about transforming ideas..."
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Page Content</h3>
            <p className="text-sm text-zinc-500">Main title and footer</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <AdminInput
              label="Main Title"
              value={about.main_title}
              onChange={(e) => updateField("main_title", e.target.value)}
              placeholder="Full Stack Developer"
            />
            <AdminInput
              label="Footer Text"
              value={about.footer_text}
              onChange={(e) => updateField("footer_text", e.target.value)}
              placeholder="Let's build something amazing"
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Stats</h3>
              <p className="text-sm text-zinc-500">Statistics displayed on the about page</p>
            </div>
            <AdminButton type="button" variant="secondary" size="sm" onClick={addStat}>
              <Plus className="h-4 w-4" />
              Add Stat
            </AdminButton>
          </AdminCardHeader>
          <AdminCardContent>
            {about.stats.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">No stats added yet</p>
            ) : (
              <div className="space-y-3">
                {about.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <AdminInput
                      placeholder="5+"
                      value={stat.value}
                      onChange={(e) => updateStat(index, "value", e.target.value)}
                      className="w-24"
                    />
                    <AdminInput
                      placeholder="Years Exp"
                      value={stat.label}
                      onChange={(e) => updateStat(index, "label", e.target.value)}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Images</h3>
              <p className="text-sm text-zinc-500">Gallery images for the about page</p>
            </div>
            <AdminButton type="button" variant="secondary" size="sm" onClick={addImage}>
              <Plus className="h-4 w-4" />
              Add Image
            </AdminButton>
          </AdminCardHeader>
          <AdminCardContent>
            {about.images.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">No images added yet</p>
            ) : (
              <div className="space-y-3">
                {about.images.map((image, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-zinc-800">
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      ) : (
                        <Image className="h-5 w-5 text-zinc-500" />
                      )}
                    </div>
                    <AdminInput
                      placeholder="https://images.unsplash.com/..."
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </AdminCardContent>
        </AdminCard>
      </form>
    </AdminShell>
  )
}
