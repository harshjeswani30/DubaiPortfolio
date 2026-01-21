"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"

export default function NewContactInfoPage() {
  const router = useRouter()
  const [label, setLabel] = useState("")
  const [type, setType] = useState("email")
  const [value, setValue] = useState("")
  const [iconName, setIconName] = useState("Mail")
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
        label,
        type,
        value,
        icon_name: iconName,
        display_order: Number(displayOrder) || 0,
        is_active: isActive,
      }

      const res = await fetch("/api/admin/contact-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to create contact info")
      router.replace(`/admin/contact-info/${json.data.id}`)
    } catch (e: any) {
      setError(e?.message || "Failed to create contact info")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell title="New Contact Info" description="Add a contact method.">
      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">Label</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-zinc-300">Type</label>
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-300">Icon name</label>
              <input
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-300">Value</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/60"
              required
            />
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

