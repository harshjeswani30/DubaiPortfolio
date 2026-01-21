"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminSwitch,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { Save, X, Trash2, AlertCircle, CheckCircle } from "lucide-react"

type SkillData = {
  id?: string
  name: string
  category: string
  proficiency: number
  icon_name: string
  color: string
  display_order: number
  is_active: boolean
}

const defaultSkill: SkillData = {
  name: "",
  category: "General",
  proficiency: 80,
  icon_name: "Code",
  color: "#3b82f6",
  display_order: 0,
  is_active: true,
}

const categoryOptions = [
  "Frontend", "Backend", "Database", "DevOps", "Mobile", "Design", "Tools", "General"
]

const iconOptions = [
  "Code", "Database", "Server", "Globe", "Smartphone", "Palette",
  "Terminal", "Cloud", "Shield", "Zap", "Settings", "Layout"
]

export function SkillForm({
  initialData,
  isEdit = false,
}: {
  initialData?: Partial<SkillData>
  isEdit?: boolean
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<SkillData>({
    ...defaultSkill,
    ...initialData,
  })

  const updateField = <K extends keyof SkillData>(key: K, value: SkillData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const url = isEdit ? `/api/admin/skills/${formData.id}` : "/api/admin/skills"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || `Failed to ${isEdit ? "update" : "create"} skill`)

      setSuccess(true)
      if (!isEdit) {
        router.replace(`/admin/skills/${json.data.id}`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this skill? This cannot be undone.")) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/skills/${formData.id}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to delete")
      router.replace("/admin/skills")
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminShell
      title={isEdit ? "Edit Skill" : "New Skill"}
      description={isEdit ? `Editing: ${formData.name || "Untitled"}` : "Add a new skill to your profile"}
      actions={
        <div className="flex items-center gap-3">
          {isEdit && (
            <AdminButton variant="danger" onClick={handleDelete} loading={deleting}>
              <Trash2 className="h-4 w-4" />
              Delete
            </AdminButton>
          )}
          <AdminButton variant="secondary" onClick={() => router.back()}>
            <X className="h-4 w-4" />
            Cancel
          </AdminButton>
          <AdminButton onClick={() => handleSubmit()} loading={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Skill"}
          </AdminButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-200">
            <CheckCircle className="h-5 w-5 shrink-0" />
            Skill saved successfully!
          </div>
        )}

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Skill Information</h3>
            <p className="text-sm text-zinc-500">Name and category</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Skill Name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="React.js"
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-500/50"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Proficiency</h3>
            <p className="text-sm text-zinc-500">Your skill level</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">Proficiency Level</label>
                <span className="text-sm font-semibold text-cyan-400">{formData.proficiency}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={(e) => updateField("proficiency", Number(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
            <div
              className="h-3 rounded-full bg-zinc-800 overflow-hidden"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${formData.proficiency}%` }}
              />
            </div>
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
            <p className="text-sm text-zinc-500">Icon and display settings</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Icon</label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => updateField("icon_name", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-500/50"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon} className="bg-zinc-900">
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => updateField("color", e.target.value)}
                    className="h-12 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => updateField("color", e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-500/50"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>
            <AdminInput
              label="Display Order"
              type="number"
              value={formData.display_order}
              onChange={(e) => updateField("display_order", Number(e.target.value))}
              hint="Lower numbers appear first"
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Status</h3>
          </AdminCardHeader>
          <AdminCardContent>
            <AdminSwitch
              label="Active"
              description="Show this skill on your portfolio"
              checked={formData.is_active}
              onChange={(checked) => updateField("is_active", checked)}
            />
          </AdminCardContent>
        </AdminCard>
      </form>
    </AdminShell>
  )
}
