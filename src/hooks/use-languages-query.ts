import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminLanguages,
    fetchAdminLanguageById,
    createLanguage,
    updateLanguage,
    deleteLanguage,
} from "@/lib/supabase-queries"

export function useLanguagesQuery() {
    return useQuery({
        queryKey: queryKeys.languages.list(),
        queryFn: fetchAdminLanguages,
    })
}

export function useLanguageQuery(id: string) {
    return useQuery({
        queryKey: queryKeys.languages.all,
        queryFn: () => fetchAdminLanguageById(id),
        enabled: !!id,
    })
}

export function useCreateLanguage() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createLanguage,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.languages.all })
        },
    })
}

export function useUpdateLanguage() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateLanguage(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.languages.all })
        },
    })
}

export function useDeleteLanguage() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteLanguage,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.languages.all })
        },
    })
}
