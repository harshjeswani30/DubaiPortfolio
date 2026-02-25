"use client"

import Link from "next/link"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, Palette, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useServicesQuery, useUpdateService, useDeleteService } from "@/hooks/use-services-query"

type ServiceRow = {
  id: string
  title: string
  description: string
  icon_name: string
  skills: string[]
  color: string
  gradient: string
  display_order: number
  is_active: boolean
  is_featured: boolean
}

export default function AdminServicesPage() {
  const [search, setSearch] = useState("")

  const { data: items = [], isLoading, isError } = useServicesQuery()
  const updateService = useUpdateService()
  const deleteServiceMutation = useDeleteService()

  const toggleActive = (id: string, currentValue: boolean) => {
    updateService.mutate({ id, payload: { is_active: !currentValue } })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    deleteServiceMutation.mutate(id)
  }

  const filteredItems = items.filter((s: any) =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: items.length,
    active: items.filter((s: any) => s.is_active).length,
    featured: items.filter((s: any) => s.is_featured && s.is_active).length,
    inactive: items.filter((s: any) => !s.is_active).length,
  }

  return (
    <AdminShell
      title="Services"
      description="Manage your portfolio services"
      actions={
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
        >
          <Plus className="h-4 w-4" />
          New Service
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Services</p>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            <p className="text-sm text-zinc-400">Active</p>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="text-2xl font-bold text-cyan-400">{stats.featured}</p>
            <p className="text-sm text-zinc-400">Featured</p>
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
            placeholder="Search services..."
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
            Failed to load services
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <Zap className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No services found</h3>
            <p className="mb-6 text-sm text-zinc-400">Create your first service to get started</p>
            <Link
              href="/admin/services/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Create Service
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((service: any) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition-all hover:border-white/20"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl" style={{ background: service.gradient || service.color || '#3b82f6' }} />

                <div className="relative">
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                      style={{ background: `${service.color || '#3b82f6'}20` }}
                    >
                      <Palette className="h-6 w-6" style={{ color: service.color || '#3b82f6' }} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          service.is_active
                            ? "bg-green-500/20 text-green-300"
                            : "bg-amber-500/20 text-amber-300"
                        )}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </span>
                      {service.is_featured && service.is_active && (
                        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-medium text-cyan-300">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-white">{service.title || "(Untitled)"}</h3>
                  <p className="mb-4 text-sm text-zinc-400 line-clamp-2">{service.description || "No description"}</p>

                  {service.skills && service.skills.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {service.skills.slice(0, 3).map((skill: string, idx: number) => (
                        <span key={idx} className="rounded bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                          {skill}
                        </span>
                      ))}
                      {service.skills.length > 3 && (
                        <span className="text-xs text-zinc-500">+{service.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-xs text-zinc-500">Order: {service.display_order ?? 0}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleActive(service.id, service.is_active)}
                        className={cn(
                          "rounded-lg p-2 transition-colors",
                          service.is_active
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-zinc-500 hover:bg-zinc-800"
                        )}
                        title={service.is_active ? "Deactivate" : "Activate"}
                      >
                        {service.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="rounded-lg p-2 text-cyan-400 transition-colors hover:bg-cyan-500/10"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deleteServiceMutation.isPending}
                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
