"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminSwitch,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { Save, RefreshCw, Plus, Phone, Mail, MapPin, Edit, Trash2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ContactInfo {
  id: string
  type: string
  label: string
  value: string
  icon_name: string
  color_gradient: string
  display_order: number
}

interface SiteSettings {
  available_for_work: boolean
  email: string
  phone: string
  location: string
}

const tabs = [
  { id: "info", label: "Contact Info", icon: Phone },
  { id: "settings", label: "Settings", icon: MessageSquare },
]

function ContactPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "info"
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [settings, setSettings] = useState<SiteSettings>({
    available_for_work: true,
    email: "",
    phone: "",
    location: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [contactRes, settingsRes] = await Promise.all([
        fetch("/api/admin/contact-info"),
        fetch("/api/admin/settings/site"),
      ])
      const [contactJson, settingsJson] = await Promise.all([
        contactRes.json(),
        settingsRes.json(),
      ])
      if (contactJson.data) {
        setContactInfo(contactJson.data)
      }
      if (settingsJson.data) {
        setSettings(settingsJson.data)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await fetch("/api/admin/settings/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  const deleteContactInfo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact info?")) return
    try {
      await fetch(`/api/admin/contact-info/${id}`, { method: "DELETE" })
      setContactInfo((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const updateField = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <AdminShell title="Contact Page" description="Manage contact information">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Contact Page"
      description="Manage contact information"
      actions={
        activeTab === "settings" ? (
          <AdminButton onClick={saveSettings} loading={saving}>
            <Save className="h-4 w-4" />
            Save Changes
          </AdminButton>
        ) : (
          <Link
            href="/admin/contact-info/new"
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </Link>
        )
      }
    >
      <div className="mb-6 flex gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/admin/pages/contact?tab=${tab.id}`)}
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

      {activeTab === "info" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                  <p className="text-sm text-zinc-500">Contact details shown on the contact page ({contactInfo.length} items)</p>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              {contactInfo.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No contact info added yet</p>
              ) : (
                <div className="space-y-3">
                  {contactInfo.map((info) => (
                    <div
                      key={info.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("rounded-xl p-3 bg-gradient-to-br", info.color_gradient || "from-cyan-500 to-cyan-600")}>
                          {info.icon_name === "Mail" && <Mail className="h-5 w-5 text-white" />}
                          {info.icon_name === "Phone" && <Phone className="h-5 w-5 text-white" />}
                          {info.icon_name === "MapPin" && <MapPin className="h-5 w-5 text-white" />}
                          {!["Mail", "Phone", "MapPin"].includes(info.icon_name) && <Phone className="h-5 w-5 text-white" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{info.label}</h4>
                          <p className="text-sm text-zinc-400">{info.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/contact-info/${info.id}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteContactInfo(info.id)}
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

      {activeTab === "settings" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <h3 className="text-lg font-semibold text-white">Contact Settings</h3>
              <p className="text-sm text-zinc-500">General contact page settings</p>
            </AdminCardHeader>
            <AdminCardContent className="space-y-5">
              <AdminSwitch
                label="Available for Work"
                description="Show availability status on contact page"
                checked={settings.available_for_work}
                onChange={(checked) => updateField("available_for_work", checked)}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Email Address"
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="hello@example.com"
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
        </div>
      )}
    </AdminShell>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <AdminShell title="Contact Page" description="Manage contact information">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    }>
      <ContactPageContent />
    </Suspense>
  )
}
