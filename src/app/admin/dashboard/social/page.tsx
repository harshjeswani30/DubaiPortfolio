"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Loader2, X, Save } from "lucide-react"

interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  display_order: number
  is_active: boolean
}

export default function SocialAdminPage() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<SocialLink | null>(null)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/admin/social")
      if (res.ok) {
        setLinks(await res.json())
      }
    } catch (error) {
      console.error("Error fetching social links:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editing) return

    try {
      const url = isNew ? "/api/admin/social" : `/api/admin/social/${editing.id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      })

      if (res.ok) {
        fetchLinks()
        setEditing(null)
        setIsNew(false)
      }
    } catch (error) {
      console.error("Error saving link:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return

    try {
      const res = await fetch(`/api/admin/social/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchLinks()
      }
    } catch (error) {
      console.error("Error deleting link:", error)
    }
  }

  const openNew = () => {
    setIsNew(true)
    setEditing({
      id: "",
      platform: "",
      url: "",
      icon: "",
      display_order: links.length + 1,
      is_active: true,
    })
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
          <h1 className="text-3xl font-bold text-white">Social Links</h1>
          <p className="text-gray-400 mt-2">Manage your social media links</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Link
        </button>
      </div>

      <div className="max-w-2xl space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                {link.icon?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-white font-medium">{link.platform}</p>
                <p className="text-gray-500 text-sm truncate max-w-[300px]">{link.url}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(link); setIsNew(false) }}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(link.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {links.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No social links yet. Add your first one!
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {isNew ? "Add Social Link" : "Edit Social Link"}
              </h2>
              <button
                onClick={() => { setEditing(null); setIsNew(false) }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                <input
                  type="text"
                  value={editing.platform}
                  onChange={(e) => setEditing({ ...editing, platform: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="GitHub, LinkedIn, Twitter..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                <input
                  type="text"
                  value={editing.url}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon Name</label>
                <input
                  type="text"
                  value={editing.icon}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Github, Linkedin, Twitter..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                <input
                  type="number"
                  value={editing.display_order}
                  onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-gray-300">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-4 p-6 border-t border-gray-700">
              <button
                onClick={() => { setEditing(null); setIsNew(false) }}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
