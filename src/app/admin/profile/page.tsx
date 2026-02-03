"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminTextarea,
  AdminSwitch,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { Save, RefreshCw, Plus, Edit, Trash2, Link as LinkIcon, Github, Linkedin, Twitter, Instagram, Youtube, Globe } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
}

interface SocialLink {
  id: string
  platform: string
  url: string
  icon_name: string
  display_order: number
  is_active: boolean
}

const socialIconMap: Record<string, any> = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Link: LinkIcon,
}

export default function SiteSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
  })
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [newSocial, setNewSocial] = useState({ platform: "", url: "", icon_name: "Globe" })
  const [addingSocial, setAddingSocial] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [settingsRes, socialRes] = await Promise.all([
        fetch("/api/admin/settings/site"),
        fetch("/api/admin/social-links"),
      ])
      const [settingsJson, socialJson] = await Promise.all([
        settingsRes.json(),
        socialRes.json(),
      ])
      if (settingsJson.data) {
        // Ensure all string fields are strings, not null
        setSettings({
          ...settingsJson.data,
          name: settingsJson.data.name || "",
          role: settingsJson.data.role || "",
          bio: settingsJson.data.bio || "",
          email: settingsJson.data.email || "",
          phone: settingsJson.data.phone || "",
          location: settingsJson.data.location || "",
          profile_image: settingsJson.data.profile_image || "",
        })
      }
      if (socialJson.data) {
        setSocialLinks(socialJson.data)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch("/api/admin/settings/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setSaving(false)
    }
  }

  const addSocialLink = async () => {
    if (!newSocial.platform || !newSocial.url) return
    setAddingSocial(true)
    try {
      const res = await fetch("/api/admin/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSocial,
          display_order: socialLinks.length,
          is_active: true,
        }),
      })
      const json = await res.json()
      if (json.data) {
        setSocialLinks((prev) => [...prev, json.data])
        setNewSocial({ platform: "", url: "", icon_name: "Globe" })
      }
    } catch (error) {
      console.error("Failed to add social link:", error)
    } finally {
      setAddingSocial(false)
    }
  }

  const deleteSocialLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return
    try {
      await fetch(`/api/admin/social-links/${id}`, { method: "DELETE" })
      setSocialLinks((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const toggleSocialActive = async (link: SocialLink) => {
    try {
      await fetch(`/api/admin/social-links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...link, is_active: !link.is_active }),
      })
      setSocialLinks((prev) =>
        prev.map((s) => (s.id === link.id ? { ...s, is_active: !s.is_active } : s))
      )
    } catch (error) {
      console.error("Failed to toggle:", error)
    }
  }

  const updateField = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <AdminShell title="Site Settings" description="Configure your portfolio profile">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Site Settings"
      description="Configure your portfolio profile and contact information"
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
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            <p className="text-sm text-zinc-500">Basic details about yourself</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Full Name"
                value={settings.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="John Doe"
                required
              />
              <AdminInput
                label="Professional Role"
                value={settings.role}
                onChange={(e) => updateField("role", e.target.value)}
                placeholder="Full Stack Developer"
                required
              />
            </div>
            <AdminTextarea
              label="Bio / About"
              value={settings.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="A short description about yourself..."
              hint="This will appear in the about section"
            />
            <AdminInput
              label="Profile Image URL"
              value={settings.profile_image}
              onChange={(e) => updateField("profile_image", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              hint="Direct URL to your profile photo"
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Contact Information</h3>
            <p className="text-sm text-zinc-500">How people can reach you</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="hello@example.com"
                required
              />
              <AdminInput
                label="Phone Number"
                value={settings.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+971 50 123 4567"
              />
            </div>
            <AdminInput
              label="Location"
              value={settings.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Dubai, UAE"
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Stats & Availability</h3>
            <p className="text-sm text-zinc-500">Numbers displayed on your portfolio</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <AdminSwitch
              label="Available for Work"
              description="Show a badge indicating you're open to new opportunities"
              checked={settings.available_for_work}
              onChange={(checked) => updateField("available_for_work", checked)}
            />
            <div className="grid gap-5 sm:grid-cols-3">
              <AdminInput
                label="Years of Experience"
                type="number"
                value={settings.years_experience}
                onChange={(e) => updateField("years_experience", parseInt(e.target.value) || 0)}
                min={0}
              />
              <AdminInput
                label="Projects Completed"
                type="number"
                value={settings.projects_completed}
                onChange={(e) => updateField("projects_completed", parseInt(e.target.value) || 0)}
                min={0}
              />
              <AdminInput
                label="Happy Clients"
                type="number"
                value={settings.happy_clients}
                onChange={(e) => updateField("happy_clients", parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
          </AdminCardContent>
        </AdminCard>
      </form>

      <AdminCard className="mt-6">
        <AdminCardHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Social Links</h3>
          </div>
          <p className="text-sm text-zinc-500">Links shown in footer and contact page</p>
        </AdminCardHeader>
        <AdminCardContent className="space-y-4">
          {socialLinks.length > 0 && (
            <div className="space-y-3">
              {socialLinks.map((link) => {
                const Icon = socialIconMap[link.icon_name] || Globe
                return (
                  <div
                    key={link.id}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-4 transition-all",
                      link.is_active
                        ? "border-green-500/20 bg-green-500/5"
                        : "border-white/5 bg-white/5 opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                        <Icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{link.platform}</h4>
                        <p className="text-sm text-zinc-500 truncate max-w-xs">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSocialActive(link)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                          link.is_active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-zinc-500/20 text-zinc-400"
                        )}
                      >
                        {link.is_active ? "Active" : "Inactive"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSocialLink(link.id)}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="rounded-xl border border-dashed border-white/10 p-4">
            <p className="mb-3 text-sm font-medium text-white">Add New Social Link</p>
            <div className="flex flex-wrap gap-3">
              <AdminInput
                placeholder="Platform (e.g., GitHub)"
                value={newSocial.platform}
                onChange={(e) => setNewSocial((prev) => ({ ...prev, platform: e.target.value }))}
                className="flex-1 min-w-[150px]"
              />
              <AdminInput
                placeholder="URL"
                value={newSocial.url}
                onChange={(e) => setNewSocial((prev) => ({ ...prev, url: e.target.value }))}
                className="flex-1 min-w-[200px]"
              />
              <select
                value={newSocial.icon_name}
                onChange={(e) => setNewSocial((prev) => ({ ...prev, icon_name: e.target.value }))}
                className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
              >
                {Object.keys(socialIconMap).map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <AdminButton
                type="button"
                onClick={addSocialLink}
                loading={addingSocial}
                disabled={!newSocial.platform || !newSocial.url}
              >
                <Plus className="h-4 w-4" />
                Add
              </AdminButton>
            </div>
          </div>
        </AdminCardContent>
      </AdminCard>
    </AdminShell>
  )
}
