"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"

export default function EditSkillPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = useMemo(() => params?.id, [params])

  const [jsonText, setJsonText] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/skills/${id}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load skill")
        if (mounted) setJsonText(JSON.stringify(json.data, null, 2))
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load skill")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [id])

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = JSON.parse(jsonText)
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to save")
      setJsonText(JSON.stringify(json.data, null, 2))
    } catch (e: any) {
      setError(e?.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const del = async () => {
    if (!confirm("Delete this skill? This cannot be undone.")) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to delete")
      router.replace("/admin/skills")
    } catch (e: any) {
      setError(e?.message || "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminShell
      title="Edit Skill"
      description={loading ? "Loading..." : `ID: ${id}`}
      actions={
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving || loading}
            className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={del}
            disabled={deleting || loading}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200 hover:bg-red-500/15 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      }
    >
      <div className="max-w-3xl space-y-4">
        {error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <label className="mb-2 block text-sm text-zinc-300">Skill JSON</label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="min-h-[520px] w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white outline-none focus:border-indigo-500/60"
            spellCheck={false}
          />
          <p className="mt-2 text-xs text-zinc-500">
            You can edit any columns such as <span className="font-mono">is_active</span> or{" "}
            <span className="font-mono">display_order</span>.
          </p>
        </div>
      </div>
    </AdminShell>
  )
}

