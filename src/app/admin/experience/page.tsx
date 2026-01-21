"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"

type ExperienceRow = {
  id: string
  company?: string
  position?: string
  location?: string
  start_date?: string
  end_date?: string
  display_order?: number
  is_active?: boolean
}

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExperienceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/admin/experience")
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load experience")
        if (mounted) setItems(json.data || [])
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load experience")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <AdminShell
      title="Experience"
      description="Manage professional experience timeline."
      actions={
        <Link
          href="/admin/experience/new"
          className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white"
        >
          New Experience
        </Link>
      }
    >
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50">
        <div className="border-b border-white/10 px-6 py-4 text-sm text-zinc-300">
          {loading ? "Loading..." : error ? error : `${items.length} entry(s)`}
        </div>
        <div className="divide-y divide-white/5">
          {items.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">
                  {p.position || "(role)"} @ {p.company || "(company)"}
                </div>
                <div className="truncate text-xs text-zinc-500">
                  {p.location || "location"} • {p.start_date || "start"} - {p.end_date || "present"} • order{" "}
                  {p.display_order ?? "-"}
                </div>
              </div>
              <Link
                href={`/admin/experience/${p.id}`}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 hover:bg-white/10"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}

