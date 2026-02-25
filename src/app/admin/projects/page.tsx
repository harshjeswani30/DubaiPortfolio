"use client"

import Link from "next/link"
import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Plus, Search, Eye, EyeOff, Star, ExternalLink, Edit2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProjectsQuery, useUpdateProject, useDeleteProject } from "@/hooks/use-projects-query"

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "featured">("all")

  const { data: items = [], isLoading, isError } = useProjectsQuery()
  const updateProject = useUpdateProject()
  const deleteProjectMutation = useDeleteProject()

  const togglePublish = (id: string, currentValue: boolean) => {
    updateProject.mutate({ id, payload: { is_published: !currentValue } })
  }

  const toggleFeatured = (id: string, currentValue: boolean) => {
    updateProject.mutate({ id, payload: { is_featured: !currentValue } })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return
    deleteProjectMutation.mutate(id)
  }

  const filteredItems = items.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && p.is_published) ||
      (filter === "draft" && !p.is_published) ||
      (filter === "featured" && p.is_featured)
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: items.length,
    published: items.filter((p) => p.is_published).length,
    draft: items.filter((p) => !p.is_published).length,
    featured: items.filter((p) => p.is_featured).length,
  }

  return (
    <AdminShell
      title="Projects"
      description="Manage your portfolio projects"
      actions={
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { key: "total", label: "Total Projects", color: "cyan" },
            { key: "published", label: "Published", color: "green" },
            { key: "draft", label: "Drafts", color: "amber" },
            { key: "featured", label: "Featured", color: "purple" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key === "total" ? "all" : (key as typeof filter))}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all",
                filter === (key === "total" ? "all" : key)
                  ? `border-${color}-500/50 bg-${color}-500/10`
                  : "border-white/10 bg-zinc-900/50 hover:border-white/20"
              )}
            >
              <p className={`text-2xl font-bold text-${color === "cyan" ? "white" : color + "-400"}`}>
                {stats[key as keyof typeof stats]}
              </p>
              <p className="text-sm text-zinc-400">{label}</p>
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects..."
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
            Failed to load projects
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No projects found</h3>
            <p className="mb-6 text-sm text-zinc-400">
              {search ? "Try a different search term" : "Create your first project to get started"}
            </p>
            {!search && (
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                Create Project
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition-all hover:border-white/20"
              >
                <div className="flex flex-col p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {project.title || "(Untitled)"}
                        </h3>
                        {project.is_featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-300">
                            <Star className="h-3 w-3" />
                            Featured
                          </span>
                        )}
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            project.is_published
                              ? "bg-green-500/20 text-green-300"
                              : "bg-amber-500/20 text-amber-300"
                          )}
                        >
                          {project.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="mb-3 text-sm text-zinc-400 line-clamp-2">
                        {project.description || "No description"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                          {project.category || "General"}
                        </span>
                        {project.tech_stack?.slice(0, 3).map((tech: string) => (
                          <span key={tech} className="rounded-lg bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePublish(project.id, project.is_published)}
                        className={cn(
                          "rounded-lg p-2 transition-colors",
                          project.is_published
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                        )}
                        title={project.is_published ? "Unpublish" : "Publish"}
                      >
                        {project.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => toggleFeatured(project.id, project.is_featured)}
                        className={cn(
                          "rounded-lg p-2 transition-colors",
                          project.is_featured
                            ? "text-purple-400 hover:bg-purple-500/10"
                            : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                        )}
                        title={project.is_featured ? "Unfeature" : "Feature"}
                      >
                        <Star className={cn("h-4 w-4", project.is_featured && "fill-current")} />
                      </button>
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="rounded-lg p-2 text-cyan-400 transition-colors hover:bg-cyan-500/10"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deleteProjectMutation.isPending}
                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-xs text-zinc-500">Order: {project.display_order ?? 0}</span>
                    <span className="text-xs text-zinc-500">/{project.slug || "no-slug"}</span>
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
