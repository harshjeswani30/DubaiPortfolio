"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminTextarea,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { Save, RefreshCw, Plus, X, Image, FileText, BarChart3, Briefcase, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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

interface Experience {
  id: string
  company: string
  role: string
  period: string
  description: string
  is_current: boolean
  display_order: number
}

const tabs = [
  { id: "intro", label: "Introduction", icon: FileText },
  { id: "stats", label: "Stats & Images", icon: BarChart3 },
  { id: "experience", label: "Experience", icon: Briefcase },
]

function AboutPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "intro"
  
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

  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [aboutRes, experienceRes] = await Promise.all([
        fetch("/api/admin/settings/about"),
        fetch("/api/admin/experience"),
      ])
      const [aboutJson, experienceJson] = await Promise.all([
        aboutRes.json(),
        experienceRes.json(),
      ])
      if (aboutJson.data) {
        setAbout({ ...aboutJson.data, images: aboutJson.data.images || [], stats: aboutJson.data.stats || [] })
      }
      if (experienceJson.data) {
        setExperiences(experienceJson.data)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveData = async () => {
    setSaving(true)
    try {
      await fetch("/api/admin/settings/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to save:", error)
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
      stats: prev.stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)),
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

  const deleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return
    try {
      await fetch(`/api/admin/experience/${id}`, { method: "DELETE" })
      setExperiences((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  if (loading) {
    return (
      <AdminShell title="About Page" description="Manage about page content">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="About Page"
      description="Manage about page content"
      actions={
        activeTab !== "experience" && (
          <AdminButton onClick={saveData} loading={saving}>
            <Save className="h-4 w-4" />
            Save Changes
          </AdminButton>
        )
      }
    >
      <div className="mb-6 flex gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/admin/pages/about?tab=${tab.id}`)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "intro" && (
        <div className="space-y-6">
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
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-6">
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
        </div>
      )}

      {activeTab === "experience" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Work Experience</h3>
                  <p className="text-sm text-zinc-500">Your professional experience ({experiences.length} entries)</p>
                </div>
              </div>
              <Link
                href="/admin/experience/new"
                className="flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Link>
            </AdminCardHeader>
            <AdminCardContent>
              {experiences.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No experience added yet</p>
              ) : (
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-white">{exp.role}</h4>
                          {exp.is_current && (
                            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400">{exp.company} &bull; {exp.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/experience/${exp.id}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteExperience(exp.id)}
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
      )}
    </AdminShell>
  )
}

export default function AboutPage() {
  return (
    <Suspense fallback={
      <AdminShell title="About Page" description="Manage about page content">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    }>
      <AboutPageContent />
    </Suspense>
  )
}
