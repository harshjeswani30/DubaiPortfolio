"use client"

import { useState, useEffect } from "react"
import { Save, Plus, X, Loader2 } from "lucide-react"

interface HeroData {
  title: string
  title_highlight: string
  subtitle: string
  description: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  rotating_texts: string[]
  stats: { icon: string; value: string; label: string }[]
  profile_image: string
}

export default function HeroAdminPage() {
  const [data, setData] = useState<HeroData>({
    title: "",
    title_highlight: "",
    subtitle: "",
    description: "",
    primary_button_text: "",
    primary_button_link: "",
    secondary_button_text: "",
    secondary_button_link: "",
    rotating_texts: [],
    stats: [],
    profile_image: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newText, setNewText] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/hero")
      if (res.ok) {
        const heroData = await res.json()
        if (heroData) {
          setData({
            ...heroData,
            rotating_texts: heroData.rotating_texts || [],
            stats: heroData.stats || [],
          })
        }
      }
    } catch (error) {
      console.error("Error fetching hero data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        alert("Hero section saved successfully!")
      }
    } catch (error) {
      console.error("Error saving:", error)
      alert("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const addRotatingText = () => {
    if (newText.trim()) {
      setData({ ...data, rotating_texts: [...data.rotating_texts, newText.trim()] })
      setNewText("")
    }
  }

  const removeRotatingText = (index: number) => {
    setData({ ...data, rotating_texts: data.rotating_texts.filter((_, i) => i !== index) })
  }

  const addStat = () => {
    setData({
      ...data,
      stats: [...data.stats, { icon: "Star", value: "0", label: "New Stat" }],
    })
  }

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...data.stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setData({ ...data, stats: newStats })
  }

  const removeStat = (index: number) => {
    setData({ ...data, stats: data.stats.filter((_, i) => i !== index) })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Hero Section</h1>
          <p className="text-gray-400 mt-2">Customize your homepage hero section</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Main Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Crafting Digital Experiences"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Highlighted Word</label>
                <input
                  type="text"
                  value={data.title_highlight}
                  onChange={(e) => setData({ ...data, title_highlight: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Digital"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={data.subtitle}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Full-Stack Web Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Your introduction..."
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Buttons</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Button Text</label>
                <input
                  type="text"
                  value={data.primary_button_text}
                  onChange={(e) => setData({ ...data, primary_button_text: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Button Link</label>
                <input
                  type="text"
                  value={data.primary_button_link}
                  onChange={(e) => setData({ ...data, primary_button_link: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Button Text</label>
                <input
                  type="text"
                  value={data.secondary_button_text}
                  onChange={(e) => setData({ ...data, secondary_button_text: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Button Link</label>
                <input
                  type="text"
                  value={data.secondary_button_link}
                  onChange={(e) => setData({ ...data, secondary_button_link: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Rotating Texts</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addRotatingText()}
                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Add rotating text..."
              />
              <button
                onClick={addRotatingText}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {data.rotating_texts.map((text, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-900/50 rounded-lg px-4 py-2">
                  <span className="flex-1 text-gray-300">{text}</span>
                  <button
                    onClick={() => removeRotatingText(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Statistics</h2>
              <button
                onClick={addStat}
                className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm"
              >
                Add Stat
              </button>
            </div>
            <div className="space-y-4">
              {data.stats.map((stat, index) => (
                <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Stat #{index + 1}</span>
                    <button
                      onClick={() => removeStat(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => updateStat(index, "icon", e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="Icon"
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, "value", e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="Value"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, "label", e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="Label"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Profile Image</h2>
            <input
              type="text"
              value={data.profile_image}
              onChange={(e) => setData({ ...data, profile_image: e.target.value })}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="/images/profile.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
