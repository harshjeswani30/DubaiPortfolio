import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminSkills,
    fetchAdminSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
} from "@/lib/supabase-queries"

export function useSkillsQuery() {
    return useQuery({
        queryKey: queryKeys.skills.list(),
        queryFn: fetchAdminSkills,
    })
}

export function useSkillQuery(id: string) {
    return useQuery({
        queryKey: queryKeys.skills.all,
        queryFn: () => fetchAdminSkillById(id),
        enabled: !!id,
    })
}

export function useCreateSkill() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createSkill,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.skills.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}

export function useUpdateSkill() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateSkill(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.skills.all })
        },
    })
}

export function useDeleteSkill() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteSkill,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.skills.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}
