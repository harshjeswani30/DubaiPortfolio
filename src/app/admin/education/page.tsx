"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, GraduationCap, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

type EducationRow = {
  id: string
  degree: string
  institution: string
  location: string | null
  start_year: string | null
  end_year: string | null
  gpa: string | null
  highlights: string[]
  display_order: number
  is_active: boolean
}

export default function AdminEducationPage() {
  const [items, setItems] = useState<EducationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/admin/education")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load education")
      setItems(json.data || [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load education")
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (edu: EducationRow) => {
    try {
      const res = await fetch(`/api/admin/education/${edu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !edu.is_active }),
      })
      if (!res.ok) throw new Error("Failed to update")
      setItems((prev) =>
        prev.map((e) => (e.id === edu.id ? { ...e, is_active: !e.is_active } : e))
      )
    } catch (e) {
      console.error(e)
    }
  }

  const deleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/education/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setItems((prev) => prev.filter((e) => e.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(null)
    }
  }

  const filteredItems = items.filter((e) =>
    e.degree?.toLowerCase().includes(search.toLowerCase()) ||
    e.institution?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: items.length,
    active: items.filter((e) => e.is_active).length,
  }

  return (
    <AdminShell
      title="Education"
      description="Manage your educational background"
      actions={
        <Link
          href="/admin/education/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
        >
          <Plus className="h-4 w-4" />
          New Education
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Entries</p>
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
            placeholder="Search education..."
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
            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No education found</h3>
            <p className="mb-6 text-sm text-zinc-400">Add your first education entry</p>
            <Link
              href="/admin/education/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Add Education
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((edu, index) => (
              <div
                key={edu.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition-all hover:border-white/20"
              >
                <div className="flex">
                  <div className="hidden sm:flex w-24 flex-col items-center justify-center border-r border-white/10 bg-white/5 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
                      <GraduationCap className="h-6 w-6 text-cyan-400" />
                    </div>
                    <span className="mt-2 text-xs text-zinc-500">#{index + 1}</span>
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">
                            {edu.degree || "(No degree)"}
                          </h3>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              edu.is_active
                                ? "bg-green-500/20 text-green-300"
                                : "bg-amber-500/20 text-amber-300"
                            )}
                          >
                            {edu.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-cyan-400">{edu.institution || "(No institution)"}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleActive(edu)}
                          className={cn(
                            "rounded-lg p-2 transition-colors",
                            edu.is_active
                              ? "text-green-400 hover:bg-green-500/10"
                              : "text-zinc-500 hover:bg-zinc-800"
                          )}
                          title={edu.is_active ? "Deactivate" : "Activate"}
                        >
                          {edu.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <Link
                          href={`/admin/education/${edu.id}`}
                          className="rounded-lg p-2 text-cyan-400 transition-colors hover:bg-cyan-500/10"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteEducation(edu.id)}
                          disabled={deleting === edu.id}
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                      {edu.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {edu.location}
                        </span>
                      )}
                      {edu.start_year && (
                        <span>
                          {edu.start_year}{edu.end_year && edu.end_year !== edu.start_year ? ` - ${edu.end_year}` : ""}
                        </span>
                      )}
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>

                    {edu.highlights && edu.highlights.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {edu.highlights.slice(0, 3).map((h, i) => (
                          <span key={i} className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300">
                            {h}
                          </span>
                        ))}
                        {edu.highlights.length > 3 && (
                          <span className="text-xs text-zinc-500">+{edu.highlights.length - 3} more</span>
                        )}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-white/5 text-xs text-zinc-500">
                      Order: {edu.display_order ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
