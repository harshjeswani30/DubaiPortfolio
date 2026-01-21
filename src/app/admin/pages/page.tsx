"use client"

import { useState, useEffect } from "react"
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
import { Save, RefreshCw, Plus, X, Image, Home, User, Sparkles, Layers } from "lucide-react"
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
}

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
  { id: "home", label: "Home Page", icon: Home },
  { id: "about", label: "About Page", icon: User },
]

export default function PagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "home"
  
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
  })

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

  const [services, setServices] = useState<ServiceRow[]>([])

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [heroRes, settingsRes, aboutRes, servicesRes] = await Promise.all([
        fetch("/api/admin/settings/hero"),
        fetch("/api/admin/settings/site"),
        fetch("/api/admin/settings/about"),
        fetch("/api/admin/services"),
      ])

      const [heroJson, settingsJson, aboutJson, servicesJson] = await Promise.all([
        heroRes.json(),
        settingsRes.json(),
        aboutRes.json(),
        servicesRes.json(),
      ])

      if (heroJson.data) {
        setHero({ ...heroJson.data, rotating_texts: heroJson.data.rotating_texts || [] })
      }
      if (settingsJson.data) {
        setSettings(settingsJson.data)
      }
      if (aboutJson.data) {
        setAbout({ ...aboutJson.data, images: aboutJson.data.images || [], stats: aboutJson.data.stats || [] })
      }
      if (servicesJson.data) {
        setServices(servicesJson.data)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveHomeData = async () => {
    setSaving(true)
    try {
      await Promise.all([
        fetch("/api/admin/settings/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hero),
        }),
        fetch("/api/admin/settings/site", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }),
      ])
      router.refresh()
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  const saveAboutData = async () => {
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

  const handleSave = () => {
    if (activeTab === "home") {
      saveHomeData()
    } else {
      saveAboutData()
    }
  }

  const updateHeroField = (field: keyof HeroSection, value: any) => {
    setHero((prev) => ({ ...prev, [field]: value }))
  }

  const updateSettingsField = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const updateAboutField = (field: keyof AboutPage, value: any) => {
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

  if (loading) {
    return (
      <AdminShell title="Pages" description="Manage page content and sections">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Pages"
      description="Manage page content and sections"
      actions={
        <AdminButton onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4" />
          Save Changes
        </AdminButton>
      }
    >
      <div className="mb-6 flex gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/admin/pages?tab=${tab.id}`)}
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

      {activeTab === "home" && (
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
                href="/admin/services"
                className="rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Manage Services
              </Link>
            </AdminCardHeader>
            <AdminCardContent>
              {services.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No services created yet</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.slice(0, 4).map((service) => (
                    <div
                      key={service.id}
                      className={cn(
                        "rounded-xl border p-4 transition-all",
                        service.is_active
                          ? "border-green-500/20 bg-green-500/5"
                          : "border-white/5 bg-white/5 opacity-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
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
                  ))}
                </div>
              )}
              {services.length > 4 && (
                <p className="mt-3 text-center text-sm text-zinc-500">+{services.length - 4} more services</p>
              )}
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <h3 className="text-lg font-semibold text-white">Site Profile & Stats</h3>
              <p className="text-sm text-zinc-500">Your profile information and statistics</p>
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
                hint="This will appear in the about section"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Email Address"
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSettingsField("email", e.target.value)}
                  placeholder="hello@example.com"
                  required
                />
                <AdminInput
                  label="Phone Number"
                  value={settings.phone}
                  onChange={(e) => updateSettingsField("phone", e.target.value)}
                  placeholder="+971 50 123 4567"
                />
              </div>
              <AdminInput
                label="Location"
                value={settings.location}
                onChange={(e) => updateSettingsField("location", e.target.value)}
                placeholder="Dubai, UAE"
              />
              <AdminSwitch
                label="Available for Work"
                description="Show a badge indicating you're open to new opportunities"
                checked={settings.available_for_work}
                onChange={(checked) => updateSettingsField("available_for_work", checked)}
              />
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
            </AdminCardContent>
          </AdminCard>
        </div>
      )}

      {activeTab === "about" && (
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
                onChange={(e) => updateAboutField("intro_eyebrow", e.target.value)}
                placeholder="Welcome"
                hint="Small text above the main title"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Intro Title"
                  value={about.intro_title}
                  onChange={(e) => updateAboutField("intro_title", e.target.value)}
                  placeholder="Creating Digital"
                />
                <AdminInput
                  label="Highlight Word"
                  value={about.intro_title_highlight}
                  onChange={(e) => updateAboutField("intro_title_highlight", e.target.value)}
                  placeholder="Experiences"
                  hint="Word shown with accent color"
                />
              </div>
              <AdminTextarea
                label="Description"
                value={about.intro_description}
                onChange={(e) => updateAboutField("intro_description", e.target.value)}
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
                onChange={(e) => updateAboutField("main_title", e.target.value)}
                placeholder="Full Stack Developer"
              />
              <AdminInput
                label="Footer Text"
                value={about.footer_text}
                onChange={(e) => updateAboutField("footer_text", e.target.value)}
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
        </div>
      )}
    </AdminShell>
  )
}
