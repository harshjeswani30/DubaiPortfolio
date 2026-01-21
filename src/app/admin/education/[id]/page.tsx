"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"

export default function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    degree: "",
    institution: "",
    location: "",
    start_year: "",
    end_year: "",
    gpa: "",
    highlights: [] as string[],
    display_order: 0,
    is_active: true,
  })
  const [newHighlight, setNewHighlight] = useState("")

  useEffect(() => {
    fetch(`/api/admin/education/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setForm({
            degree: json.data.degree || "",
            institution: json.data.institution || "",
            location: json.data.location || "",
            start_year: json.data.start_year || "",
            end_year: json.data.end_year || "",
            gpa: json.data.gpa || "",
            highlights: json.data.highlights || [],
            display_order: json.data.display_order || 0,
            is_active: json.data.is_active ?? true,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setForm({ ...form, highlights: [...form.highlights, newHighlight.trim()] })
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setForm({ ...form, highlights: form.highlights.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/education/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to update")
      router.push("/admin/education")
    } catch (err) {
      console.error(err)
      alert("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Edit Education" description="Loading...">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Edit Education"
      description="Update education entry"
      actions={
        <Link
          href="/admin/education"
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
              <label className="mb-2 block text-sm font-medium text-zinc-300">Degree *</label>
              <input
                type="text"
                required
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Institution *</label>
              <input
                type="text"
                required
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">GPA</label>
              <input
                type="text"
                value={form.gpa}
                onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Start Year</label>
              <input
                type="text"
                value={form.start_year}
                onChange={(e) => setForm({ ...form, start_year: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">End Year</label>
              <input
                type="text"
                value={form.end_year}
                onChange={(e) => setForm({ ...form, end_year: e.target.value })}
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Highlights</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                  className="flex-1 rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500/50"
                  placeholder="Add highlight"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="rounded-xl bg-cyan-500/20 px-4 py-3 text-cyan-400 hover:bg-cyan-500/30"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              {form.highlights.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">
                      {h}
                      <button type="button" onClick={() => removeHighlight(i)} className="hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
