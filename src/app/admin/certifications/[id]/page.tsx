"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    issuer: "",
    year: "",
    credential_url: "",
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetch(`/api/admin/certifications/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setForm({
            name: json.data.name || "",
            issuer: json.data.issuer || "",
            year: json.data.year || "",
            credential_url: json.data.credential_url || "",
            display_order: json.data.display_order || 0,
            is_active: json.data.is_active ?? true,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to update")
      router.push("/admin/certifications")
    } catch (err) {
      console.error(err)
      alert("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Edit Certification" description="Loading...">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Edit Certification"
      description="Update certification details"
      actions={
        <Link
          href="/admin/certifications"
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
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Certification Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Issuer *</label>
              <input
                type="text"
                required
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Year</label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Credential URL</label>
              <input
                type="url"
                value={form.credential_url}
                onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </AdminShell>
  )
}
