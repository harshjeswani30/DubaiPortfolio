"use client"

import Link from "next/link"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, Award, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCertificationsQuery, useUpdateCertification, useDeleteCertification } from "@/hooks/use-certifications-query"

type CertificationRow = {
  id: string
  name: string
  issuer: string
  year: string | null
  credential_url: string | null
  display_order: number
  is_active: boolean
}

export default function AdminCertificationsPage() {
  const [search, setSearch] = useState("")

  const { data: items = [], isLoading, isError } = useCertificationsQuery()
  const updateCert = useUpdateCertification()
  const deleteCertMutation = useDeleteCertification()

  const toggleActive = (id: string, currentValue: boolean) => {
    updateCert.mutate({ id, payload: { is_active: !currentValue } })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return
    deleteCertMutation.mutate(id)
  }

  const filteredItems = items.filter((c: any) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: items.length,
    active: items.filter((c: any) => c.is_active).length,
  }

  return (
    <AdminShell
      title="Certifications"
      description="Manage your professional certifications"
      actions={
        <Link
          href="/admin/certifications/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
        >
          <Plus className="h-4 w-4" />
          New Certification
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Certifications</p>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            <p className="text-sm text-zinc-400">Active</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search certifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
            Failed to load certifications
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No certifications found</h3>
            <p className="mb-6 text-sm text-zinc-400">Add your first certification</p>
            <Link
              href="/admin/certifications/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Add Certification
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredItems.map((cert: any) => (
              <div
                key={cert.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-5 transition-all hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/20">
                      <Award className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{cert.name}</h3>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            cert.is_active
                              ? "bg-green-500/20 text-green-300"
                              : "bg-amber-500/20 text-amber-300"
                          )}
                        >
                          {cert.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm text-cyan-400">{cert.issuer}</p>
                      {cert.year && <p className="mt-1 text-sm text-zinc-500">{cert.year}</p>}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Credential
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleActive(cert.id, cert.is_active)}
                      className={cn(
                        "rounded-lg p-2 transition-colors",
                        cert.is_active
                          ? "text-green-400 hover:bg-green-500/10"
                          : "text-zinc-500 hover:bg-zinc-800"
                      )}
                    >
                      {cert.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <Link
                      href={`/admin/certifications/${cert.id}`}
                      className="rounded-lg p-2 text-cyan-400 transition-colors hover:bg-cyan-500/10"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      disabled={deleteCertMutation.isPending}
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
