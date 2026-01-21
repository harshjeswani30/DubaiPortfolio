"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { RefreshCw, Plus, FolderKanban, Edit, Trash2, ExternalLink, Star } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  image: string
  category: string
  is_featured: boolean
  created_at: string
}

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/projects")
      const json = await res.json()
      if (json.data) {
        setProjects(json.data)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      await fetch(`/api/admin/projects/${id}`, { method: "DELETE" })
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Projects Page" description="Manage your portfolio projects">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  const featuredProjects = projects.filter(p => p.is_featured)
  const otherProjects = projects.filter(p => !p.is_featured)

  return (
    <AdminShell
      title="Projects Page"
      description="Manage your portfolio projects"
      actions={
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      }
    >
      <div className="space-y-6">
        {featuredProjects.length > 0 && (
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Featured Projects</h3>
                  <p className="text-sm text-zinc-500">These appear on the homepage ({featuredProjects.length} featured)</p>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/5"
                  >
                    <div className="aspect-video overflow-hidden bg-zinc-800">
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{project.title}</h4>
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                          Featured
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">{project.category}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCardContent>
          </AdminCard>
        )}

        <AdminCard>
          <AdminCardHeader>
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-cyan-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">All Projects</h3>
                <p className="text-sm text-zinc-500">{projects.length} total projects</p>
              </div>
            </div>
          </AdminCardHeader>
          <AdminCardContent>
            {projects.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">No projects created yet</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-4 transition-all",
                      project.is_featured
                        ? "border-amber-500/20 bg-amber-500/5"
                        : "border-white/5 bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-zinc-800">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{project.title}</h4>
                          {project.is_featured && (
                            <Star className="h-4 w-4 text-amber-400" />
                          )}
                        </div>
                        <p className="text-sm text-zinc-500">{project.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCardContent>
        </AdminCard>
      </div>
    </AdminShell>
  )
}
