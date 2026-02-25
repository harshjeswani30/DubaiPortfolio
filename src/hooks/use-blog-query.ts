import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchAdminBlogPosts,
    fetchAdminBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
} from "@/lib/supabase-queries"

export function useBlogQuery() {
    return useQuery({
        queryKey: queryKeys.blog.list(),
        queryFn: fetchAdminBlogPosts,
    })
}

export function useBlogPostQuery(id: string) {
    return useQuery({
        queryKey: queryKeys.blog.detail(id),
        queryFn: () => fetchAdminBlogPostById(id),
        enabled: !!id,
    })
}

export function useCreateBlogPost() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createBlogPost,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.blog.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}

export function useUpdateBlogPost() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
            updateBlogPost(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.blog.all })
        },
    })
}

export function useDeleteBlogPost() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteBlogPost,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.blog.all })
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        },
    })
}
