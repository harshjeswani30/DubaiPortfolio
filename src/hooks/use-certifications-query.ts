import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminCertifications,
    fetchAdminCertificationById,
    createCertification,
    updateCertification,
    deleteCertification,
} from "@/lib/supabase-queries"

export function useCertificationsQuery() {
    return useQuery({
        queryKey: queryKeys.certifications.list(),
        queryFn: fetchAdminCertifications,
    })
}

export function useCertificationQuery(id: string) {
    return useQuery({
        queryKey: queryKeys.certifications.all,
        queryFn: () => fetchAdminCertificationById(id),
        enabled: !!id,
    })
}

export function useCreateCertification() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createCertification,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.certifications.all })
        },
    })
}

export function useUpdateCertification() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateCertification(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.certifications.all })
        },
    })
}

export function useDeleteCertification() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteCertification,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.certifications.all })
        },
    })
}
