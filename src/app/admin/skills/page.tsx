"use client"

import Link from "next/link"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSkillsQuery, useUpdateSkill, useDeleteSkill } from "@/hooks/use-skills-query"

export default function AdminSkillsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")

  const { data: items = [], isLoading, isError } = useSkillsQuery()
  const updateSkill = useUpdateSkill()
  const deleteSkillMutation = useDeleteSkill()

  const toggleActive = (id: string, currentValue: boolean) => {
    updateSkill.mutate({ id, payload: { is_active: !currentValue } })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return
    deleteSkillMutation.mutate(id)
  }

  const filteredItems = items.filter((s: any) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && s.is_active) ||
      (filter === "inactive" && !s.is_active)
    return matchesSearch && matchesFilter
  })

  const groupedSkills = filteredItems.reduce((acc: Record<string, any[]>, skill: any) => {
    const cat = skill.category || "General"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  const stats = {
    total: items.length,
    active: items.filter((s: any) => s.is_active).length,
    inactive: items.filter((s: any) => !s.is_active).length,
  }

  return (
    <AdminShell
      title="Skills"
      description="Manage your technical skills"
      actions={
        <Link
          href="/admin/skills/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
        >
          <Plus className="h-4 w-4" />
          New Skill
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "total", label: "Total Skills", filterVal: "all", color: "white" },
            { key: "active", label: "Active", filterVal: "active", color: "green-400" },
            { key: "inactive", label: "Inactive", filterVal: "inactive", color: "amber-400" },
          ].map(({ key, label, filterVal, color }) => (
            <button
              key={key}
              onClick={() => setFilter(filterVal as typeof filter)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all",
                filter === filterVal
                  ? "border-cyan-500/50 bg-cyan-500/10"
                  : "border-white/10 bg-zinc-900/50 hover:border-white/20"
              )}
            >
              <p className={`text-2xl font-bold text-${color}`}>{stats[key as keyof typeof stats]}</p>
              <p className="text-sm text-zinc-400">{label}</p>
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search skills..."
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
            Failed to load skills
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <Code className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No skills found</h3>
            <p className="mb-6 text-sm text-zinc-400">Create your first skill to get started</p>
            <Link
              href="/admin/skills/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Create Skill
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-medium text-zinc-400">{category}</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(skills as any[]).map((skill) => (
                    <div
                      key={skill.id}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-4 transition-all hover:border-white/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{ background: `${skill.color || "#3b82f6"}20` }}
                          >
                            <Code className="h-5 w-5" style={{ color: skill.color || "#3b82f6" }} />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{skill.name || "(Untitled)"}</h4>
                            <p className="text-xs text-zinc-500">{skill.category || "General"}</p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            skill.is_active
                              ? "bg-green-500/20 text-green-300"
                              : "bg-amber-500/20 text-amber-300"
                          )}
                        >
                          {skill.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Proficiency</span>
                          <span className="font-medium text-white">{skill.proficiency || 0}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${skill.proficiency || 0}%`,
                              background: skill.color || "#3b82f6",
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-xs text-zinc-500">Order: {skill.display_order ?? 0}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleActive(skill.id, skill.is_active)}
                            className={cn(
                              "rounded-lg p-1.5 transition-colors",
                              skill.is_active
                                ? "text-green-400 hover:bg-green-500/10"
                                : "text-zinc-500 hover:bg-zinc-800"
                            )}
                            title={skill.is_active ? "Deactivate" : "Activate"}
                          >
                            {skill.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          <Link
                            href={`/admin/skills/${skill.id}`}
                            className="rounded-lg p-1.5 text-cyan-400 transition-colors hover:bg-cyan-500/10"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            disabled={deleteSkillMutation.isPending}
                            className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
