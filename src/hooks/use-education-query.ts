import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminEducation,
    fetchAdminEducationById,
    createEducation,
    updateEducation,
    deleteEducation,
} from "@/lib/supabase-queries"

export function useEducationQuery() {
    return useQuery({
        queryKey: queryKeys.education.list(),
        queryFn: fetchAdminEducation,
    })
}

export function useEducationItemQuery(id: string) {
    return useQuery({
        queryKey: queryKeys.education.all,
        queryFn: () => fetchAdminEducationById(id),
        enabled: !!id,
    })
}

export function useCreateEducation() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createEducation,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.education.all })
        },
    })
}

export function useUpdateEducation() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateEducation(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.education.all })
        },
    })
}

export function useDeleteEducation() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteEducation,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.education.all })
        },
    })
}
