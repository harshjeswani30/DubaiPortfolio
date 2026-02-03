"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { Save, Plus, Trash2, MoveUp, MoveDown, RefreshCw, Linkedin, Github, Twitter } from "lucide-react"

interface SocialLink {
  id: string
  platform: string
  url: string
  icon_name: string
  display_order: number
  is_active: boolean
}

const socialPlatforms = [
  { name: "LinkedIn", icon: "Linkedin", defaultUrl: "https://linkedin.com/in/" },
  { name: "GitHub", icon: "Github", defaultUrl: "https://github.com/" },
  { name: "Twitter", icon: "Twitter", defaultUrl: "https://twitter.com/" },
  { name: "Dribbble", icon: "Globe", defaultUrl: "https://dribbble.com/" },
  { name: "Instagram", icon: "Instagram", defaultUrl: "https://instagram.com/" },
]

export default function SocialsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  async function fetchSocialLinks() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/social-links")
      const json = await res.json()
      if (json.data) {
        setSocialLinks(json.data)
      }
    } catch (error) {
      console.error("Failed to load social links:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage("")
    try {
      const updatePromises = socialLinks.map((item) =>
        fetch(`/api/admin/social-links/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        })
      )
      await Promise.all(updatePromises)
      setMessage("Social links updated successfully!")
      setTimeout(() => setMessage(""), 3000)
      fetchSocialLinks()
    } catch (error) {
      setMessage("Failed to update social links")
    } finally {
      setSaving(false)
    }
  }

  async function addSocialLink(platform: string, icon: string, defaultUrl: string) {
    const newLink = {
      platform,
      url: defaultUrl,
      icon_name: icon,
      display_order: socialLinks.length,
      is_active: true,
    }
    try {
      const res = await fetch("/api/admin/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLink),
      })
      const json = await res.json()
      if (json.data) {
        setSocialLinks([...socialLinks, json.data])
      }
    } catch (error) {
      console.error("Failed to add social link:", error)
    }
  }

  async function deleteSocialLink(id: string) {
    if (!confirm("Are you sure you want to delete this social link?")) return
    try {
      await fetch(`/api/admin/social-links/${id}`, { method: "DELETE" })
      setSocialLinks(socialLinks.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Failed to delete social link:", error)
    }
  }

  function updateSocialLink(id: string, field: keyof SocialLink, value: any) {
    setSocialLinks(
      socialLinks.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  function moveItem(index: number, direction: "up" | "down") {
    const newItems = [...socialLinks]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return

    ;[newItems[index], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[index],
    ]

    newItems.forEach((item, idx) => {
      item.display_order = idx
    })

    setSocialLinks(newItems)
  }

  if (loading) {
    return (
      <AdminShell title="Social Links" description="Manage your social media links">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-[#00ADB5]" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Social Links"
      description="Manage your social media presence"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {socialPlatforms.map((platform) => (
            <AdminButton
              key={platform.name}
              onClick={() => addSocialLink(platform.name, platform.icon, platform.defaultUrl)}
              variant="secondary"
            >
              <Plus className="h-4 w-4" />
              Add {platform.name}
            </AdminButton>
          ))}
        </div>
        <AdminButton onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4" />
          Save Changes
        </AdminButton>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg p-4 ${
            message.includes("Failed")
              ? "bg-red-500/10 text-red-400"
              : "bg-green-500/10 text-green-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        {socialLinks.map((item, index) => (
          <AdminCard key={item.id}>
            <AdminCardHeader>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold text-[#EEEEEE]">
                  {item.platform || "Social Link"}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-[#EEEEEE]/60 hover:text-[#00ADB5] disabled:opacity-30"
                  >
                    <MoveUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === socialLinks.length - 1}
                    className="p-1 text-[#EEEEEE]/60 hover:text-[#00ADB5] disabled:opacity-30"
                  >
                    <MoveDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSocialLink(item.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <AdminInput
                  label="Platform Name"
                  value={item.platform}
                  onChange={(e) =>
                    updateSocialLink(item.id, "platform", e.target.value)
                  }
                  placeholder="LinkedIn"
                />
                <AdminInput
                  label="Profile URL"
                  value={item.url}
                  onChange={(e) =>
                    updateSocialLink(item.id, "url", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#EEEEEE]">
                    Visible
                  </label>
                  <div className="flex h-10 items-center">
                    <input
                      type="checkbox"
                      checked={item.is_active}
                      onChange={(e) =>
                        updateSocialLink(item.id, "is_active", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-[#393E46] bg-[#393E46]/20 text-[#00ADB5]"
                    />
                    <span className="ml-2 text-sm text-[#EEEEEE]">
                      Show on site
                    </span>
                  </div>
                </div>
              </div>
            </AdminCardContent>
          </AdminCard>
        ))}
      </div>

      {socialLinks.length === 0 && (
        <div className="rounded-lg border border-[#393E46]/50 bg-[#393E46]/10 p-8 text-center">
          <p className="text-[#EEEEEE]/70">No social links yet.</p>
          <p className="mt-2 text-sm text-[#EEEEEE]/50">
            Click one of the buttons above to add your first social media link.
          </p>
        </div>
      )}
    </AdminShell>
  )
}
