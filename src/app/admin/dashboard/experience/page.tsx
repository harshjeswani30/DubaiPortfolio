"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Loader2, Save, X } from "lucide-react"

interface Experience {
  id?: string
  company: string
  position: string
  location: string
  start_date: string
  end_date: string
  description: string
  achievements: string[]
  is_current: boolean
  display_order: number
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newAchievement, setNewAchievement] = useState("")

  useEffect(() => {
    loadExperiences()
  }, [])

  async function loadExperiences() {
    const res = await fetch("/api/admin/experience")
    const data = await res.json()
    setExperiences(data)
    setLoading(false)
  }

  function openNew() {
    setEditingExp({
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      description: "",
      achievements: [],
      is_current: false,
      display_order: experiences.length + 1,
    })
    setIsNew(true)
  }

  function openEdit(exp: Experience) {
    setEditingExp({ ...exp, achievements: exp.achievements || [] })
    setIsNew(false)
  }

  async function handleSave() {
    if (!editingExp) return
    setSaving(true)

    if (isNew) {
      await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExp),
      })
    } else {
      await fetch(`/api/admin/experience/${editingExp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExp),
      })
    }

    await loadExperiences()
    setEditingExp(null)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this experience?")) return
    await fetch(`/api/admin/experience/${id}`, { method: "DELETE" })
    await loadExperiences()
  }

  function addAchievement() {
    if (newAchievement.trim() && editingExp) {
      setEditingExp({ ...editingExp, achievements: [...editingExp.achievements, newAchievement.trim()] })
      setNewAchievement("")
    }
  }

  function removeAchievement(index: number) {
    if (editingExp) {
      setEditingExp({ ...editingExp, achievements: editingExp.achievements.filter((_, i) => i !== index) })
    }
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
          <h1 className="text-2xl font-bold text-white">Experience</h1>
          <p className="text-zinc-400">Manage your work experience</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                  {exp.is_current && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Current</span>
                  )}
                </div>
                <p className="text-cyan-400">{exp.company}</p>
                <p className="text-zinc-500 text-sm">{exp.location} | {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(exp)} className="p-1.5 text-zinc-400 hover:text-white">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(exp.id!)} className="p-1.5 text-zinc-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingExp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{isNew ? "Add Experience" : "Edit Experience"}</h2>
              <button onClick={() => setEditingExp(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Company</label>
                <input
                  type="text"
                  value={editingExp.company}
                  onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Position</label>
                <input
                  type="text"
                  value={editingExp.position}
                  onChange={(e) => setEditingExp({ ...editingExp, position: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Location</label>
                <input
                  type="text"
                  value={editingExp.location}
                  onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={editingExp.start_date}
                    onChange={(e) => setEditingExp({ ...editingExp, start_date: e.target.value })}
                    placeholder="Jan 2022"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">End Date</label>
                  <input
                    type="text"
                    value={editingExp.end_date}
                    onChange={(e) => setEditingExp({ ...editingExp, end_date: e.target.value })}
                    placeholder="Dec 2023"
                    disabled={editingExp.is_current}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingExp.is_current}
                  onChange={(e) => setEditingExp({ ...editingExp, is_current: e.target.checked })}
                  className="rounded bg-zinc-800 border-zinc-700"
                />
                <label className="text-sm text-zinc-400">Current Position</label>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Description</label>
                <textarea
                  value={editingExp.description}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Achievements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add achievement..."
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                    onKeyDown={(e) => e.key === "Enter" && addAchievement()}
                  />
                  <button onClick={addAchievement} className="p-2 bg-cyan-500 rounded-lg hover:bg-cyan-600">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {editingExp.achievements.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                      <span className="flex-1 text-white text-sm">{item}</span>
                      <button onClick={() => removeAchievement(i)} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingExp(null)}
                  className="flex-1 px-4 py-2 border border-zinc-700 rounded-lg text-white hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
