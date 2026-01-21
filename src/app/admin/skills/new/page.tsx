"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"

export default function NewSkillPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [category, setCategory] = useState("General")
  const [proficiency, setProficiency] = useState(70)
  const [displayOrder, setDisplayOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name,
        category,
        proficiency: Number(proficiency) || 0,
        display_order: Number(displayOrder) || 0,
        is_active: isActive,
      }

      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to create skill")
      router.replace(`/admin/skills/${json.data.id}`)
    } catch (e: any) {
      setError(e?.message || "Failed to create skill")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell title="New Skill" description="Add a skill to your profile.">
      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-zinc-300">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-300">Proficiency (0-100)</label>
              <input
                type="number"
                value={proficiency}
                onChange={(e) => setProficiency(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-300">Display order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>

          {error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </AdminShell>
  )
}

