"use client"

import Link from "next/link"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, Briefcase, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import { useExperienceQuery, useUpdateExperience, useDeleteExperience } from "@/hooks/use-experience-query"

type ExperienceRow = {
  id: string
  company: string
  position: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  display_order: number
  is_active: boolean
}

export default function AdminExperiencePage() {
  const [search, setSearch] = useState("")

  const { data: items = [], isLoading, isError } = useExperienceQuery()
  const updateExp = useUpdateExperience()
  const deleteExpMutation = useDeleteExperience()

  const toggleActive = (id: string, currentValue: boolean) => {
    updateExp.mutate({ id, payload: { is_active: !currentValue } })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return
    deleteExpMutation.mutate(id)
  }

  const filteredItems = items.filter((e: any) =>
    e.company?.toLowerCase().includes(search.toLowerCase()) ||
    e.position?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: items.length,
    active: items.filter((e: any) => e.is_active).length,
    current: items.filter((e: any) => e.is_current || !e.end_date).length,
  }

  const formatDateRange = (start: string, end: string | null, isCurrent: boolean) => {
    const startDate = start ? new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
    if (isCurrent || !end) return `${startDate} - Present`
    const endDate = new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    return `${startDate} - ${endDate}`
  }

  return (
    <AdminShell
      title="Experience"
      description="Manage your professional experience"
      actions={
        <Link
          href="/admin/experience/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
        >
          <Plus className="h-4 w-4" />
          New Experience
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Entries</p>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            <p className="text-sm text-zinc-400">Active</p>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="text-2xl font-bold text-cyan-400">{stats.current}</p>
            <p className="text-sm text-zinc-400">Current Positions</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search experience..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
            Failed to load experience
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No experience found</h3>
            <p className="mb-6 text-sm text-zinc-400">Add your first work experience</p>
            <Link
              href="/admin/experience/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((exp: any, index: number) => (
              <div
                key={exp.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition-all hover:border-white/20"
              >
                <div className="flex">
                  <div className="hidden sm:flex w-24 flex-col items-center justify-center border-r border-white/10 bg-white/5 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
                      <Briefcase className="h-6 w-6 text-cyan-400" />
                    </div>
                    <span className="mt-2 text-xs text-zinc-500">#{index + 1}</span>
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">
                            {exp.position || "(No title)"}
                          </h3>
                          {(exp.is_current || !exp.end_date) && (
                            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-medium text-cyan-300">
                              Current
                            </span>
                          )}
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              exp.is_active
                                ? "bg-green-500/20 text-green-300"
                                : "bg-amber-500/20 text-amber-300"
                            )}
                          >
                            {exp.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-cyan-400">{exp.company || "(No company)"}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleActive(exp.id, exp.is_active)}
                          className={cn(
                            "rounded-lg p-2 transition-colors",
                            exp.is_active
                              ? "text-green-400 hover:bg-green-500/10"
                              : "text-zinc-500 hover:bg-zinc-800"
                          )}
                          title={exp.is_active ? "Deactivate" : "Activate"}
                        >
                          {exp.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <Link
                          href={`/admin/experience/${exp.id}`}
                          className="rounded-lg p-2 text-cyan-400 transition-colors hover:bg-cyan-500/10"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          disabled={deleteExpMutation.isPending}
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exp.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="mt-3 text-sm text-zinc-400 line-clamp-2">{exp.description}</p>
                    )}

                    <div className="mt-3 pt-3 border-t border-white/5 text-xs text-zinc-500">
                      Order: {exp.display_order ?? 0}
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
