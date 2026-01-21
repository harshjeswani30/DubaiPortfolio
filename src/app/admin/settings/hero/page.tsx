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
import { Save, RefreshCw } from "lucide-react"

interface HeroSection {
  id?: string
  tagline: string
  highlight_text: string
  description: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  rotating_texts: string[]
}

export default function HeroSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hero, setHero] = useState<HeroSection>({
    tagline: "",
    highlight_text: "",
    description: "",
    primary_button_text: "View My Work",
    primary_button_link: "/projects",
    secondary_button_text: "Get in Touch",
    secondary_button_link: "/contact",
    rotating_texts: [],
  })

  useEffect(() => {
    loadHero()
  }, [])

  const loadHero = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/settings/hero")
      const json = await res.json()
      if (json.data) {
        setHero({
          ...json.data,
          rotating_texts: json.data.rotating_texts || [],
        })
      }
    } catch (error) {
      console.error("Failed to load hero:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to save hero:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof HeroSection, value: any) => {
    setHero((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <AdminShell title="Hero Section" description="Configure your homepage hero">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Hero Section"
      description="Configure the main hero section on your homepage"
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
            <h3 className="text-lg font-semibold text-white">Main Content</h3>
            <p className="text-sm text-zinc-500">The primary text visitors see</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Tagline"
                value={hero.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="Crafting Digital Experiences"
                hint="Main headline text"
                required
              />
              <AdminInput
                label="Highlight Text"
                value={hero.highlight_text}
                onChange={(e) => updateField("highlight_text", e.target.value)}
                placeholder="Digital"
                hint="Word to highlight in the tagline"
              />
            </div>
            <AdminTextarea
              label="Description"
              value={hero.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Full-stack developer based in Dubai..."
              hint="Supporting text below the headline"
            />
            <AdminTagInput
              label="Rotating Texts"
              value={hero.rotating_texts}
              onChange={(value) => updateField("rotating_texts", value)}
              placeholder="Full-Stack Developer"
              hint="Press Enter to add. These rotate in the hero section."
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Call-to-Action Buttons</h3>
            <p className="text-sm text-zinc-500">Configure the hero buttons</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Primary Button Text"
                value={hero.primary_button_text}
                onChange={(e) => updateField("primary_button_text", e.target.value)}
                placeholder="View My Work"
              />
              <AdminInput
                label="Primary Button Link"
                value={hero.primary_button_link}
                onChange={(e) => updateField("primary_button_link", e.target.value)}
                placeholder="/projects"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Secondary Button Text"
                value={hero.secondary_button_text}
                onChange={(e) => updateField("secondary_button_text", e.target.value)}
                placeholder="Get in Touch"
              />
              <AdminInput
                label="Secondary Button Link"
                value={hero.secondary_button_link}
                onChange={(e) => updateField("secondary_button_link", e.target.value)}
                placeholder="/contact"
              />
            </div>
          </AdminCardContent>
        </AdminCard>
      </form>
    </AdminShell>
  )
}
