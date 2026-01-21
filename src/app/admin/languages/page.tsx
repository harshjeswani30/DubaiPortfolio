"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

type LanguageRow = {
  id: string
  name: string
  level: string
  proficiency: number
  display_order: number
  is_active: boolean
}

export default function AdminLanguagesPage() {
  const [items, setItems] = useState<LanguageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchLanguages()
  }, [])

  const fetchLanguages = async () => {
    try {
      const res = await fetch("/api/admin/languages")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load languages")
      setItems(json.data || [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load languages")
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (lang: LanguageRow) => {
    try {
      const res = await fetch(`/api/admin/languages/${lang.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !lang.is_active }),
      })
      if (!res.ok) throw new Error("Failed to update")
      setItems((prev) =>
        prev.map((l) => (l.id === lang.id ? { ...l, is_active: !l.is_active } : l))
      )
    } catch (e) {
      console.error(e)
    }
  }

  const deleteLanguage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this language?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/languages/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setItems((prev) => prev.filter((l) => l.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(null)
    }
  }

  const filteredItems = items.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.level?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: items.length,
    active: items.filter((l) => l.is_active).length,
  }

  return (
    <AdminShell
      title="Languages"
      description="Manage your language skills"
      actions={
        <Link
          href="/admin/languages/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
        >
          <Plus className="h-4 w-4" />
          New Language
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Languages</p>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            <p className="text-sm text-zinc-400">Active</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search languages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <Globe className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No languages found</h3>
            <p className="mb-6 text-sm text-zinc-400">Add your first language</p>
            <Link
              href="/admin/languages/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Add Language
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {filteredItems.map((lang) => (
              <div
                key={lang.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-5 text-center transition-all hover:border-white/20"
              >
                <div className="relative mx-auto mb-4 h-20 w-20">
                  <svg className="h-20 w-20 -rotate-90 transform">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-zinc-800"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      className="text-cyan-500"
                      strokeDasharray={`${(lang.proficiency / 100) * 226} 226`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{lang.proficiency}%</span>
                  </div>
                </div>

                <h3 className="mb-1 text-lg font-semibold text-white">{lang.name}</h3>
                <p className="text-sm text-cyan-400">{lang.level}</p>

                <span
                  className={cn(
                    "mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                    lang.is_active
                      ? "bg-green-500/20 text-green-300"
                      : "bg-amber-500/20 text-amber-300"
                  )}
                >
                  {lang.is_active ? "Active" : "Inactive"}
                </span>

                <div className="mt-4 flex items-center justify-center gap-1">
                  <button
                    onClick={() => toggleActive(lang)}
                    className={cn(
                      "rounded-lg p-2 transition-colors",
                      lang.is_active
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-zinc-500 hover:bg-zinc-800"
                    )}
                  >
                    {lang.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <Link
                    href={`/admin/languages/${lang.id}`}
                    className="rounded-lg p-2 text-cyan-400 transition-colors hover:bg-cyan-500/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => deleteLanguage(lang.id)}
                    disabled={deleting === lang.id}
                    className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
