import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminServices,
    fetchAdminServiceById,
    createService,
    updateService,
    deleteService,
} from "@/lib/supabase-queries"

export function useServicesQuery() {
    return useQuery({
        queryKey: queryKeys.services.list(),
        queryFn: fetchAdminServices,
    })
}

export function useServiceQuery(id: string) {
    return useQuery({
        queryKey: queryKeys.services.all,
        queryFn: () => fetchAdminServiceById(id),
        enabled: !!id,
    })
}

export function useCreateService() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createService,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.services.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}

export function useUpdateService() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateService(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.services.all })
        },
    })
}

export function useDeleteService() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.services.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}
