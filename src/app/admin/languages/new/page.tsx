"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewLanguagePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    level: "",
    proficiency: 50,
    display_order: 0,
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to create")
      router.push("/admin/languages")
    } catch (err) {
      console.error(err)
      alert("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell
      title="New Language"
      description="Add a new language skill"
      actions={
        <Link
          href="/admin/languages"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Language Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
                placeholder="English"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Proficiency Level *</label>
              <input
                type="text"
                required
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
                placeholder="Native/Fluent, Professional, Conversational"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Proficiency % ({form.proficiency}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.proficiency}
                onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-5 w-5 rounded border-white/10 bg-zinc-800"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-zinc-300">Active</label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Language"}
          </button>
        </div>
      </form>
    </AdminShell>
  )
}
