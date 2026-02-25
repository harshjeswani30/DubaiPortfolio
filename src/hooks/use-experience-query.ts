import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminExperience,
    fetchAdminExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
} from "@/lib/supabase-queries"

export function useExperienceQuery() {
    return useQuery({
        queryKey: queryKeys.experience.list(),
        queryFn: fetchAdminExperience,
    })
}

export function useExperienceItemQuery(id: string) {
    return useQuery({
        queryKey: queryKeys.experience.all,
        queryFn: () => fetchAdminExperienceById(id),
        enabled: !!id,
    })
}

export function useCreateExperience() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createExperience,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.experience.all })
        },
    })
}

export function useUpdateExperience() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateExperience(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.experience.all })
        },
    })
}

export function useDeleteExperience() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteExperience,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.experience.all })
        },
    })
}
