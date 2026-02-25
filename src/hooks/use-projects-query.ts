import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminProjects,
    fetchAdminProjectById,
    createProject,
    updateProject,
    deleteProject,
} from "@/lib/supabase-queries"

export function useProjectsQuery() {
    return useQuery({
        queryKey: queryKeys.projects.list(),
        queryFn: fetchAdminProjects,
    })
}

export function useProjectQuery(id: string) {
    return useQuery({
        queryKey: queryKeys.projects.detail(id),
        queryFn: () => fetchAdminProjectById(id),
        enabled: !!id,
    })
}

export function useCreateProject() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.projects.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}

export function useUpdateProject() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateProject(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.projects.all })
        },
    })
}

export function useDeleteProject() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.projects.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}
