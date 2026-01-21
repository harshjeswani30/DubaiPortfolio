"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ProjectForm } from "@/components/admin/project-form"
import { AdminShell } from "@/components/admin/admin-shell"

export default function EditProjectPage() {
  const params = useParams<{ id: string }>()
  const [project, setProject] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params?.id) return
    
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/admin/projects/${params.id}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load project")
        setProject(json.data)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params?.id])

  if (loading) {
    return (
      <AdminShell title="Edit Project" description="Loading...">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  if (error) {
    return (
      <AdminShell title="Edit Project" description="Error loading project">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
          {error}
        </div>
      </AdminShell>
    )
  }

  if (!project) {
    return (
      <AdminShell title="Edit Project" description="Project not found">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 text-center text-zinc-400">
          Project not found
        </div>
      </AdminShell>
    )
  }

  return <ProjectForm initialData={project} isEdit />
}
