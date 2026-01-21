"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminTextarea,
  AdminTagInput,
  AdminSwitch,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { Save, RefreshCw, Plus, Sparkles, Layers, BarChart3, Edit, Trash2, Megaphone, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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

interface SiteSettings {
  id?: string
  name: string
  role: string
  bio: string
  email: string
  phone: string
  location: string
  available_for_work: boolean
  years_experience: number
  projects_completed: number
  happy_clients: number
  profile_image: string
  hero_tags: { icon: string; text: string; color: string }[]
}

interface CTASection {
  id?: string
  title: string
  title_highlight: string
  description: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  availability_text: string
  response_time: string
}

type ServiceRow = {
  id: string
  title: string
  description: string
  icon_name: string
  skills: string[]
  color: string
  gradient: string
  display_order: number
  is_active: boolean
}

const tabs = [
  { id: "hero", label: "Hero Section", icon: Sparkles },
  { id: "services", label: "Services", icon: Layers },
  { id: "cta", label: "CTA Section", icon: Megaphone },
  { id: "profile", label: "Profile & Stats", icon: BarChart3 },
]

function HomePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "hero"
  
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

  const [settings, setSettings] = useState<SiteSettings>({
    name: "",
    role: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    available_for_work: true,
    years_experience: 5,
    projects_completed: 50,
    happy_clients: 30,
    profile_image: "",
    hero_tags: [],
  })

  const [cta, setCta] = useState<CTASection>({
    title: "Let's Work",
    title_highlight: "Together",
    description: "",
    primary_button_text: "Get in Touch",
    primary_button_link: "/contact",
    secondary_button_text: "View My Work",
    secondary_button_link: "/projects",
    availability_text: "Available for work",
    response_time: "< 24hrs",
  })

  const [services, setServices] = useState<ServiceRow[]>([])

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [heroRes, settingsRes, servicesRes, ctaRes] = await Promise.all([
        fetch("/api/admin/settings/hero"),
        fetch("/api/admin/settings/site"),
        fetch("/api/admin/services"),
        fetch("/api/admin/settings/cta"),
      ])

      const [heroJson, settingsJson, servicesJson, ctaJson] = await Promise.all([
        heroRes.json(),
        settingsRes.json(),
        servicesRes.json(),
        ctaRes.json(),
      ])

      if (heroJson.data) {
        setHero({ ...heroJson.data, rotating_texts: heroJson.data.rotating_texts || [] })
      }
      if (settingsJson.data) {
        setSettings({ ...settingsJson.data, hero_tags: settingsJson.data.hero_tags || [] })
      }
      if (servicesJson.data) {
        setServices(servicesJson.data)
      }
      if (ctaJson.data) {
        setCta(ctaJson.data)
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
      if (activeTab === "hero") {
        await fetch("/api/admin/settings/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hero),
        })
      } else if (activeTab === "profile") {
        await fetch("/api/admin/settings/site", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        })
      } else if (activeTab === "cta") {
        await fetch("/api/admin/settings/cta", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cta),
        })
      }
      router.refresh()
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateHeroField = (field: keyof HeroSection, value: any) => {
    setHero((prev) => ({ ...prev, [field]: value }))
  }

  const updateSettingsField = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const updateCtaField = (field: keyof CTASection, value: any) => {
    setCta((prev) => ({ ...prev, [field]: value }))
  }

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    try {
      await fetch(`/api/admin/services/${id}`, { method: "DELETE" })
      setServices((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const addHeroTag = () => {
    setSettings((prev) => ({
      ...prev,
      hero_tags: [...prev.hero_tags, { icon: "Code2", text: "New Tag", color: "#00ADB5" }],
    }))
  }

  const updateHeroTag = (index: number, field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      hero_tags: prev.hero_tags.map((tag, i) => (i === index ? { ...tag, [field]: value } : tag)),
    }))
  }

  const removeHeroTag = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      hero_tags: prev.hero_tags.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <AdminShell title="Home Page" description="Manage homepage content and sections">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Home Page"
      description="Manage homepage content and sections"
      actions={
        activeTab !== "services" && (
          <AdminButton onClick={saveData} loading={saving}>
            <Save className="h-4 w-4" />
            Save Changes
          </AdminButton>
        )
      }
    >
      <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/admin/pages/home?tab=${tab.id}`)}
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

      {activeTab === "hero" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Hero Section</h3>
              </div>
              <p className="text-sm text-zinc-500">The main hero section on your homepage</p>
            </AdminCardHeader>
            <AdminCardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Tagline"
                  value={hero.tagline}
                  onChange={(e) => updateHeroField("tagline", e.target.value)}
                  placeholder="Crafting Digital Experiences"
                  hint="Main headline text"
                  required
                />
                <AdminInput
                  label="Highlight Text"
                  value={hero.highlight_text}
                  onChange={(e) => updateHeroField("highlight_text", e.target.value)}
                  placeholder="Digital"
                  hint="Word to highlight in the tagline"
                />
              </div>
              <AdminTextarea
                label="Description"
                value={hero.description}
                onChange={(e) => updateHeroField("description", e.target.value)}
                placeholder="Full-stack developer based in Dubai..."
                hint="Supporting text below the headline"
              />
              <AdminTagInput
                label="Rotating Texts"
                value={hero.rotating_texts}
                onChange={(value) => updateHeroField("rotating_texts", value)}
                placeholder="Full-Stack Developer"
                hint="Press Enter to add. These rotate in the hero section."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Primary Button Text"
                  value={hero.primary_button_text}
                  onChange={(e) => updateHeroField("primary_button_text", e.target.value)}
                  placeholder="View My Work"
                />
                <AdminInput
                  label="Primary Button Link"
                  value={hero.primary_button_link}
                  onChange={(e) => updateHeroField("primary_button_link", e.target.value)}
                  placeholder="/projects"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Secondary Button Text"
                  value={hero.secondary_button_text}
                  onChange={(e) => updateHeroField("secondary_button_text", e.target.value)}
                  placeholder="Get in Touch"
                />
                <AdminInput
                  label="Secondary Button Link"
                  value={hero.secondary_button_link}
                  onChange={(e) => updateHeroField("secondary_button_link", e.target.value)}
                  placeholder="/contact"
                />
              </div>
            </AdminCardContent>
          </AdminCard>
        </div>
      )}

      {activeTab === "services" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Services Section</h3>
                  <p className="text-sm text-zinc-500">Services displayed on homepage ({services.filter(s => s.is_active).length} active)</p>
                </div>
              </div>
              <Link
                href="/admin/services/new"
                className="flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </Link>
            </AdminCardHeader>
            <AdminCardContent>
              {services.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No services created yet</p>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-4 transition-all",
                        service.is_active
                          ? "border-green-500/20 bg-green-500/5"
                          : "border-white/5 bg-white/5 opacity-50"
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-white">{service.title}</h4>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs",
                              service.is_active ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-zinc-400"
                            )}
                          >
                            {service.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500 line-clamp-1">{service.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteService(service.id)}
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

      {activeTab === "cta" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">CTA Section</h3>
              </div>
              <p className="text-sm text-zinc-500">Call-to-action section at the bottom of homepage</p>
            </AdminCardHeader>
            <AdminCardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Title"
                  value={cta.title}
                  onChange={(e) => updateCtaField("title", e.target.value)}
                  placeholder="Let's Work"
                />
                <AdminInput
                  label="Title Highlight"
                  value={cta.title_highlight}
                  onChange={(e) => updateCtaField("title_highlight", e.target.value)}
                  placeholder="Together"
                  hint="Word to highlight with gradient"
                />
              </div>
              <AdminTextarea
                label="Description"
                value={cta.description}
                onChange={(e) => updateCtaField("description", e.target.value)}
                placeholder="Have a project in mind? I'd love to hear about it."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Primary Button Text"
                  value={cta.primary_button_text}
                  onChange={(e) => updateCtaField("primary_button_text", e.target.value)}
                  placeholder="Get in Touch"
                />
                <AdminInput
                  label="Primary Button Link"
                  value={cta.primary_button_link}
                  onChange={(e) => updateCtaField("primary_button_link", e.target.value)}
                  placeholder="/contact"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Secondary Button Text"
                  value={cta.secondary_button_text}
                  onChange={(e) => updateCtaField("secondary_button_text", e.target.value)}
                  placeholder="View My Work"
                />
                <AdminInput
                  label="Secondary Button Link"
                  value={cta.secondary_button_link}
                  onChange={(e) => updateCtaField("secondary_button_link", e.target.value)}
                  placeholder="/projects"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Availability Text"
                  value={cta.availability_text}
                  onChange={(e) => updateCtaField("availability_text", e.target.value)}
                  placeholder="Available for work"
                />
                <AdminInput
                  label="Response Time"
                  value={cta.response_time}
                  onChange={(e) => updateCtaField("response_time", e.target.value)}
                  placeholder="< 24hrs"
                />
              </div>
            </AdminCardContent>
          </AdminCard>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Profile Image</h3>
              </div>
              <p className="text-sm text-zinc-500">Your photo displayed in the hero section</p>
            </AdminCardHeader>
            <AdminCardContent className="space-y-5">
              <div className="flex items-start gap-6">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-800">
                  {settings.profile_image ? (
                    <img
                      src={settings.profile_image}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <AdminInput
                    label="Profile Image URL"
                    value={settings.profile_image}
                    onChange={(e) => updateSettingsField("profile_image", e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    hint="Enter a direct URL to your profile photo"
                  />
                </div>
              </div>
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              <p className="text-sm text-zinc-500">Your basic information shown across the site</p>
            </AdminCardHeader>
            <AdminCardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Full Name"
                  value={settings.name}
                  onChange={(e) => updateSettingsField("name", e.target.value)}
                  placeholder="John Doe"
                  required
                />
                <AdminInput
                  label="Professional Role"
                  value={settings.role}
                  onChange={(e) => updateSettingsField("role", e.target.value)}
                  placeholder="Full Stack Developer"
                  required
                />
              </div>
              <AdminTextarea
                label="Bio / About"
                value={settings.bio}
                onChange={(e) => updateSettingsField("bio", e.target.value)}
                placeholder="A short description about yourself..."
              />
              <AdminInput
                label="Location"
                value={settings.location}
                onChange={(e) => updateSettingsField("location", e.target.value)}
                placeholder="Dubai, UAE"
              />
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <h3 className="text-lg font-semibold text-white">Statistics</h3>
              <p className="text-sm text-zinc-500">Numbers displayed in hero and CTA sections</p>
            </AdminCardHeader>
            <AdminCardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-3">
                <AdminInput
                  label="Years of Experience"
                  type="number"
                  value={settings.years_experience}
                  onChange={(e) => updateSettingsField("years_experience", parseInt(e.target.value) || 0)}
                  min={0}
                />
                <AdminInput
                  label="Projects Completed"
                  type="number"
                  value={settings.projects_completed}
                  onChange={(e) => updateSettingsField("projects_completed", parseInt(e.target.value) || 0)}
                  min={0}
                />
                <AdminInput
                  label="Happy Clients"
                  type="number"
                  value={settings.happy_clients}
                  onChange={(e) => updateSettingsField("happy_clients", parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
              <AdminSwitch
                label="Available for Work"
                description="Show a badge indicating you're open to new opportunities"
                checked={settings.available_for_work}
                onChange={(checked) => updateSettingsField("available_for_work", checked)}
              />
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Hero Floating Tags</h3>
                <p className="text-sm text-zinc-500">Skill tags that float around your profile image</p>
              </div>
              <AdminButton type="button" variant="secondary" size="sm" onClick={addHeroTag}>
                <Plus className="h-4 w-4" />
                Add Tag
              </AdminButton>
            </AdminCardHeader>
            <AdminCardContent>
              {settings.hero_tags.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No tags added yet. Add tags like "React", "UI/UX", etc.</p>
              ) : (
                <div className="space-y-3">
                  {settings.hero_tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                      <AdminInput
                        placeholder="Code2"
                        value={tag.icon}
                        onChange={(e) => updateHeroTag(index, "icon", e.target.value)}
                        className="w-28"
                      />
                      <AdminInput
                        placeholder="React"
                        value={tag.text}
                        onChange={(e) => updateHeroTag(index, "text", e.target.value)}
                        className="flex-1"
                      />
                      <AdminInput
                        type="color"
                        value={tag.color}
                        onChange={(e) => updateHeroTag(index, "color", e.target.value)}
                        className="w-16"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeroTag(index)}
                        className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

export default function HomePage() {
  return (
    <Suspense fallback={
      <AdminShell title="Home Page" description="Manage homepage content and sections">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    }>
      <HomePageContent />
    </Suspense>
  )
}
