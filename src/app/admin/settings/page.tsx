"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"

type EditorBlockProps = {
  title: string
  endpoint: string
}

function JsonEditorBlock({ title, endpoint }: EditorBlockProps) {
  const [jsonText, setJsonText] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(endpoint)
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load")
      setJsonText(JSON.stringify(json.data, null, 2))
    } catch (e: any) {
      setError(e?.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint])

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = JSON.parse(jsonText)
      const res = await fetch(endpoint, {
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

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-zinc-500">{loading ? "Loading..." : endpoint}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving || loading}
            className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={load}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
          >
            Refresh
          </button>
        </div>
      </div>
      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      ) : null}
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        className="min-h-[360px] w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white outline-none focus:border-indigo-500/60"
        spellCheck={false}
      />
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Settings" description="Singleton content blocks.">
      <div className="grid gap-6 lg:grid-cols-2">
        <JsonEditorBlock title="Site Settings" endpoint="/api/admin/settings/site" />
        <JsonEditorBlock title="Hero Section" endpoint="/api/admin/settings/hero" />
        <JsonEditorBlock title="About Page" endpoint="/api/admin/settings/about" />
      </div>
    </AdminShell>
  )
}

