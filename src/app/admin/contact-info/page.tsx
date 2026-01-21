"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, Mail, Phone, MapPin, Globe, Link as LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type ContactRow = {
  id: string
  label: string
  type: string
  value: string
  icon_name: string
  link: string
  display_order: number
  is_active: boolean
}

const iconMap: Record<string, React.ElementType> = {
  Mail: Mail,
  Phone: Phone,
  MapPin: MapPin,
  Globe: Globe,
  Link: LinkIcon,
}

export default function AdminContactInfoPage() {
  const [items, setItems] = useState<ContactRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const res = await fetch("/api/admin/contact-info")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load contact info")
      setItems(json.data || [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load contact info")
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (contact: ContactRow) => {
    try {
      const res = await fetch(`/api/admin/contact-info/${contact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !contact.is_active }),
      })
      if (!res.ok) throw new Error("Failed to update")
      setItems((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, is_active: !c.is_active } : c))
      )
    } catch (e) {
      console.error(e)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact info?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/contact-info/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setItems((prev) => prev.filter((c) => c.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(null)
    }
  }

  const filteredItems = items.filter(
    (c) =>
      c.label?.toLowerCase().includes(search.toLowerCase()) ||
      c.value?.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: items.length,
    active: items.filter((c) => c.is_active).length,
    inactive: items.filter((c) => !c.is_active).length,
  }

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Mail
    return Icon
  }

  return (
    <AdminShell
      title="Contact Info"
      description="Manage your contact methods"
      actions={
        <Link
          href="/admin/contact-info/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
        >
          <Plus className="h-4 w-4" />
          New Contact
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Items</p>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            <p className="text-sm text-zinc-400">Active</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-2xl font-bold text-amber-400">{stats.inactive}</p>
            <p className="text-sm text-zinc-400">Inactive</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search contact info..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <Mail className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No contact info found</h3>
            <p className="mb-6 text-sm text-zinc-400">Add your contact methods</p>
            <Link
              href="/admin/contact-info/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Add Contact
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((contact) => {
              const Icon = getIcon(contact.icon_name)
              return (
                <div
                  key={contact.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-5 transition-all hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
                        <Icon className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{contact.label || "(Untitled)"}</h3>
                        <p className="text-xs text-zinc-500 capitalize">{contact.type || "Other"}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        contact.is_active
                          ? "bg-green-500/20 text-green-300"
                          : "bg-amber-500/20 text-amber-300"
                      )}
                    >
                      {contact.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-zinc-300 break-all">{contact.value || "(No value)"}</p>
                    {contact.link && (
                      <a
                        href={contact.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                      >
                        <LinkIcon className="h-3 w-3" />
                        {contact.link.length > 30 ? contact.link.slice(0, 30) + "..." : contact.link}
                      </a>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-xs text-zinc-500">Order: {contact.display_order ?? 0}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleActive(contact)}
                        className={cn(
                          "rounded-lg p-1.5 transition-colors",
                          contact.is_active
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-zinc-500 hover:bg-zinc-800"
                        )}
                        title={contact.is_active ? "Deactivate" : "Activate"}
                      >
                        {contact.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <Link
                        href={`/admin/contact-info/${contact.id}`}
                        className="rounded-lg p-1.5 text-cyan-400 transition-colors hover:bg-cyan-500/10"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        disabled={deleting === contact.id}
                        className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
