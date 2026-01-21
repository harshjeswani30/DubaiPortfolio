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
import { Save, RefreshCw } from "lucide-react"

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
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/settings/site")
      const json = await res.json()
      if (json.data) {
        setSettings(json.data)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setSaving(false)
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
    </AdminShell>
  )
}
