"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { SkillForm } from "@/components/admin/skill-form"
import { AdminShell } from "@/components/admin/admin-shell"

export default function EditSkillPage() {
  const params = useParams<{ id: string }>()
  const [skill, setSkill] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params?.id) return

    const fetchSkill = async () => {
      try {
        const res = await fetch(`/api/admin/skills/${params.id}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load skill")
        setSkill(json.data)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load skill")
      } finally {
        setLoading(false)
      }
    }

    fetchSkill()
  }, [params?.id])

  if (loading) {
    return (
      <AdminShell title="Edit Skill" description="Loading...">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  if (error) {
    return (
      <AdminShell title="Edit Skill" description="Error loading skill">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
          {error}
        </div>
      </AdminShell>
    )
  }

  if (!skill) {
    return (
      <AdminShell title="Edit Skill" description="Skill not found">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 text-center text-zinc-400">
          Skill not found
        </div>
      </AdminShell>
    )
  }

  return <SkillForm initialData={skill} isEdit />
}
