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

type ExperienceData = {
  id?: string
  company: string
  position: string
  location: string
  start_date: string
  end_date: string
  is_current: boolean
  description: string
  highlights: string[]
  company_logo: string
  company_url: string
  display_order: number
  is_active: boolean
}

const defaultExperience: ExperienceData = {
  company: "",
  position: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
  highlights: [],
  company_logo: "",
  company_url: "",
  display_order: 0,
  is_active: true,
}

export function ExperienceForm({
  initialData,
  isEdit = false,
}: {
  initialData?: Partial<ExperienceData>
  isEdit?: boolean
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ExperienceData>({
    ...defaultExperience,
    ...initialData,
    highlights: initialData?.highlights || [],
  })

  const updateField = <K extends keyof ExperienceData>(key: K, value: ExperienceData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const url = isEdit ? `/api/admin/experience/${formData.id}` : "/api/admin/experience"
      const method = isEdit ? "PUT" : "POST"

      const payload = {
        ...formData,
        end_date: formData.is_current ? null : formData.end_date || null,
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || `Failed to ${isEdit ? "update" : "create"} experience`)

      setSuccess(true)
      if (!isEdit) {
        router.replace(`/admin/experience/${json.data.id}`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this experience? This cannot be undone.")) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/experience/${formData.id}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to delete")
      router.replace("/admin/experience")
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminShell
      title={isEdit ? "Edit Experience" : "New Experience"}
      description={isEdit ? `Editing: ${formData.position} at ${formData.company}` : "Add a new work experience"}
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
            {saving ? "Saving..." : "Save Experience"}
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
            Experience saved successfully!
          </div>
        )}

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Position Details</h3>
            <p className="text-sm text-zinc-500">Your role and company information</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Position / Title"
                value={formData.position}
                onChange={(e) => updateField("position", e.target.value)}
                placeholder="Senior Software Engineer"
                required
              />
              <AdminInput
                label="Company"
                value={formData.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Acme Inc."
                required
              />
            </div>
            <AdminInput
              label="Location"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Dubai, UAE"
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Duration</h3>
            <p className="text-sm text-zinc-500">When you worked at this position</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <AdminSwitch
              label="Current Position"
              description="I currently work here"
              checked={formData.is_current}
              onChange={(checked) => updateField("is_current", checked)}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={(e) => updateField("start_date", e.target.value)}
                required
              />
              {!formData.is_current && (
                <AdminInput
                  label="End Date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => updateField("end_date", e.target.value)}
                />
              )}
            </div>
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Description</h3>
            <p className="text-sm text-zinc-500">What you did in this role</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <AdminTextarea
              label="Role Description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
            />
            <AdminTagInput
              label="Key Highlights"
              value={formData.highlights}
              onChange={(highlights) => updateField("highlights", highlights)}
              placeholder="Add achievement (press Enter)"
              hint="Press Enter to add highlights of your work"
            />
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Company Details</h3>
            <p className="text-sm text-zinc-500">Optional company branding</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Company Logo URL"
                value={formData.company_logo}
                onChange={(e) => updateField("company_logo", e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              <AdminInput
                label="Company Website"
                value={formData.company_url}
                onChange={(e) => updateField("company_url", e.target.value)}
                placeholder="https://company.com"
              />
            </div>
            {formData.company_logo && (
              <div className="w-20 h-20 rounded-xl border border-white/10 overflow-hidden bg-white/5 p-2">
                <img
                  src={formData.company_logo}
                  alt="Company logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Display Settings</h3>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <AdminInput
              label="Display Order"
              type="number"
              value={formData.display_order}
              onChange={(e) => updateField("display_order", Number(e.target.value))}
              hint="Lower numbers appear first"
            />
            <AdminSwitch
              label="Active"
              description="Show this experience on your portfolio"
              checked={formData.is_active}
              onChange={(checked) => updateField("is_active", checked)}
            />
          </AdminCardContent>
        </AdminCard>
      </form>
    </AdminShell>
  )
}
