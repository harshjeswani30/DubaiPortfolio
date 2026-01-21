"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminTextarea,
  AdminSwitch,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
  AdminTagInput,
} from "@/components/admin/form-elements"
import { Save, X, Trash2, AlertCircle, CheckCircle } from "lucide-react"

type ServiceData = {
  id?: string
  title: string
  description: string
  icon_name: string
  skills: string[]
  color: string
  gradient: string
  display_order: number
  is_active: boolean
}

const defaultService: ServiceData = {
  title: "",
  description: "",
  icon_name: "Code",
  skills: [],
  color: "#3b82f6",
  gradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  display_order: 0,
  is_active: true,
}

const iconOptions = [
  "Code", "Palette", "Globe", "Smartphone", "Server", "Database",
  "Shield", "Zap", "Layout", "Terminal", "Cloud", "Settings"
]

export function ServiceForm({
  initialData,
  isEdit = false,
}: {
  initialData?: Partial<ServiceData>
  isEdit?: boolean
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ServiceData>({
    ...defaultService,
    ...initialData,
    skills: initialData?.skills || [],
  })

  const updateField = <K extends keyof ServiceData>(key: K, value: ServiceData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const url = isEdit ? `/api/admin/services/${formData.id}` : "/api/admin/services"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || `Failed to ${isEdit ? "update" : "create"} service`)

      setSuccess(true)
      if (!isEdit) {
        router.replace(`/admin/services/${json.data.id}`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this service? This cannot be undone.")) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/services/${formData.id}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to delete")
      router.replace("/admin/services")
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminShell
      title={isEdit ? "Edit Service" : "New Service"}
      description={isEdit ? `Editing: ${formData.title || "Untitled"}` : "Create a new service offering"}
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
            {saving ? "Saving..." : "Save Service"}
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
            Service saved successfully!
          </div>
        )}

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            <p className="text-sm text-zinc-500">Service details and description</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <AdminInput
              label="Service Title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Web Development"
              required
            />
            <AdminTextarea
              label="Description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe what this service offers..."
              required
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Skills & Technologies</h3>
            <p className="text-sm text-zinc-500">Related skills for this service</p>
          </AdminCardHeader>
          <AdminCardContent>
            <AdminTagInput
              label="Skills"
              value={formData.skills}
              onChange={(skills) => updateField("skills", skills)}
              placeholder="Add skill (press Enter)"
              hint="Press Enter or comma to add a skill"
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
            <p className="text-sm text-zinc-500">Icon and color settings</p>
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
              <AdminInput
                label="Display Order"
                type="number"
                value={formData.display_order}
                onChange={(e) => updateField("display_order", Number(e.target.value))}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
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
              <AdminInput
                label="Gradient"
                value={formData.gradient}
                onChange={(e) => updateField("gradient", e.target.value)}
                placeholder="linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                hint="CSS gradient for background effect"
              />
            </div>
            <div
              className="h-20 rounded-xl border border-white/10"
              style={{ background: formData.gradient || formData.color }}
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
              description="Show this service on your portfolio"
              checked={formData.is_active}
              onChange={(checked) => updateField("is_active", checked)}
            />
          </AdminCardContent>
        </AdminCard>
      </form>
    </AdminShell>
  )
}
