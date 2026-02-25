import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
} from "@/lib/supabase-queries"

export function useSocialLinksQuery() {
    return useQuery({
        queryKey: queryKeys.socialLinks.list(),
        queryFn: fetchAdminSocialLinks,
    })
}

export function useCreateSocialLink() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createSocialLink,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.socialLinks.all })
        },
    })
}

export function useUpdateSocialLink() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateSocialLink(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.socialLinks.all })
        },
    })
}

export function useDeleteSocialLink() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteSocialLink,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.socialLinks.all })
        },
    })
}
