"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { RefreshCw, Plus, Code, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon_name: string
  display_order: number
}

export default function SkillsPage() {
  const [loading, setLoading] = useState(true)
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/skills")
      const json = await res.json()
      if (json.data) {
        setSkills(json.data)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return
    try {
      await fetch(`/api/admin/skills/${id}`, { method: "DELETE" })
      setSkills((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Skills Page" description="Manage your skills and expertise">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  const categories = [...new Set(skills.map(s => s.category))].filter(Boolean)

  return (
    <AdminShell
      title="Skills Page"
      description="Manage your skills and expertise"
      actions={
        <Link
          href="/admin/skills/new"
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </Link>
      }
    >
      <div className="space-y-6">
        {categories.length > 0 ? (
          categories.map((category) => (
            <AdminCard key={category}>
              <AdminCardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{category}</h3>
                    <p className="text-sm text-zinc-500">
                      {skills.filter(s => s.category === category).length} skills
                    </p>
                  </div>
                </div>
              </AdminCardHeader>
              <AdminCardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {skills
                    .filter(s => s.category === category)
                    .map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{skill.name}</h4>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-zinc-700">
                              <div
                                className="h-full rounded-full bg-cyan-500"
                                style={{ width: `${skill.proficiency}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-400">{skill.proficiency}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-3">
                          <Link
                            href={`/admin/skills/${skill.id}`}
                            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deleteSkill(skill.id)}
                            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </AdminCardContent>
            </AdminCard>
          ))
        ) : (
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Skills</h3>
                  <p className="text-sm text-zinc-500">{skills.length} total skills</p>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              {skills.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No skills added yet</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{skill.name}</h4>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-zinc-700">
                            <div
                              className="h-full rounded-full bg-cyan-500"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-400">{skill.proficiency}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <Link
                          href={`/admin/skills/${skill.id}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteSkill(skill.id)}
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
        )}
      </div>
    </AdminShell>
  )
}
