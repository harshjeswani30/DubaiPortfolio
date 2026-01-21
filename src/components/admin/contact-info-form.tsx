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

type ContactInfoData = {
  id?: string
  label: string
  type: string
  value: string
  icon_name: string
  link: string
  display_order: number
  is_active: boolean
}

const defaultContactInfo: ContactInfoData = {
  label: "",
  type: "email",
  value: "",
  icon_name: "Mail",
  link: "",
  display_order: 0,
  is_active: true,
}

const typeOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "address", label: "Address" },
  { value: "social", label: "Social Media" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other" },
]

const iconOptions = [
  "Mail", "Phone", "MapPin", "Globe", "Linkedin", "Github",
  "Twitter", "Instagram", "Facebook", "Youtube", "Link", "MessageCircle"
]

export function ContactInfoForm({
  initialData,
  isEdit = false,
}: {
  initialData?: Partial<ContactInfoData>
  isEdit?: boolean
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ContactInfoData>({
    ...defaultContactInfo,
    ...initialData,
  })

  const updateField = <K extends keyof ContactInfoData>(key: K, value: ContactInfoData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const url = isEdit ? `/api/admin/contact-info/${formData.id}` : "/api/admin/contact-info"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || `Failed to ${isEdit ? "update" : "create"} contact info`)

      setSuccess(true)
      if (!isEdit) {
        router.replace(`/admin/contact-info/${json.data.id}`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this contact info? This cannot be undone.")) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/contact-info/${formData.id}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to delete")
      router.replace("/admin/contact-info")
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminShell
      title={isEdit ? "Edit Contact Info" : "New Contact Info"}
      description={isEdit ? `Editing: ${formData.label || "Untitled"}` : "Add a new contact method"}
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
            {saving ? "Saving..." : "Save Contact"}
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
            Contact info saved successfully!
          </div>
        )}

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Contact Details</h3>
            <p className="text-sm text-zinc-500">Label and value</p>
          </AdminCardHeader>
          <AdminCardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Label"
                value={formData.label}
                onChange={(e) => updateField("label", e.target.value)}
                placeholder="Email Address"
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-500/50"
                >
                  {typeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-zinc-900">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <AdminInput
              label="Value"
              value={formData.value}
              onChange={(e) => updateField("value", e.target.value)}
              placeholder="hello@example.com"
              required
            />
            <AdminInput
              label="Link (optional)"
              value={formData.link}
              onChange={(e) => updateField("link", e.target.value)}
              placeholder="mailto:hello@example.com or https://..."
              hint="URL to open when clicked"
            />
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
              <AdminInput
                label="Display Order"
                type="number"
                value={formData.display_order}
                onChange={(e) => updateField("display_order", Number(e.target.value))}
                hint="Lower numbers appear first"
              />
            </div>
          </AdminCardContent>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader>
            <h3 className="text-lg font-semibold text-white">Status</h3>
          </AdminCardHeader>
          <AdminCardContent>
            <AdminSwitch
              label="Active"
              description="Show this contact method on your portfolio"
              checked={formData.is_active}
              onChange={(checked) => updateField("is_active", checked)}
            />
          </AdminCardContent>
        </AdminCard>
      </form>
    </AdminShell>
  )
}
