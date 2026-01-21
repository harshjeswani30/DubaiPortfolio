"use client"

import { useState, useEffect } from "react"
import { Save, Loader2 } from "lucide-react"

interface SiteSettings {
  site_name: string
  site_description: string
  site_keywords: string
  logo_url: string
  favicon_url: string
  primary_color: string
  secondary_color: string
  google_analytics_id: string
}

export default function SettingsPage() {
  const [data, setData] = useState<SiteSettings>({
    site_name: "",
    site_description: "",
    site_keywords: "",
    logo_url: "",
    favicon_url: "",
    primary_color: "#00ADB5",
    secondary_color: "#A5C9CA",
    google_analytics_id: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((result) => {
        if (result) setData(result)
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    setSaving(true)
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-zinc-400">Global website configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">General</h2>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Site Name</label>
            <input
              type="text"
              value={data.site_name}
              onChange={(e) => setData({ ...data, site_name: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Site Description</label>
            <textarea
              value={data.site_description}
              onChange={(e) => setData({ ...data, site_description: e.target.value })}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Keywords (comma separated)</label>
            <input
              type="text"
              value={data.site_keywords}
              onChange={(e) => setData({ ...data, site_keywords: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Branding</h2>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Logo URL</label>
            <input
              type="text"
              value={data.logo_url}
              onChange={(e) => setData({ ...data, logo_url: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Favicon URL</label>
            <input
              type="text"
              value={data.favicon_url}
              onChange={(e) => setData({ ...data, favicon_url: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.primary_color}
                  onChange={(e) => setData({ ...data, primary_color: e.target.value })}
                  className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={data.primary_color}
                  onChange={(e) => setData({ ...data, primary_color: e.target.value })}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Secondary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={data.secondary_color}
                  onChange={(e) => setData({ ...data, secondary_color: e.target.value })}
                  className="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={data.secondary_color}
                  onChange={(e) => setData({ ...data, secondary_color: e.target.value })}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Analytics</h2>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Google Analytics ID</label>
            <input
              type="text"
              value={data.google_analytics_id}
              onChange={(e) => setData({ ...data, google_analytics_id: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
