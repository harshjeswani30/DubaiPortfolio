import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminMessages,
    updateMessage,
    deleteMessage,
} from "@/lib/supabase-queries"

export function useMessagesQuery() {
    return useQuery({
        queryKey: queryKeys.messages.list(),
        queryFn: fetchAdminMessages,
    })
}

export function useUpdateMessage() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateMessage(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.messages.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}

export function useDeleteMessage() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteMessage,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.messages.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}
