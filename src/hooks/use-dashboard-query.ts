import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchDashboardStats,
    fetchDashboardRecentMessages,
    fetchDashboardRecentProjects,
} from "@/lib/supabase-queries"

export function useDashboardStats() {
    return useQuery({
        queryKey: queryKeys.dashboard.stats(),
        queryFn: fetchDashboardStats,
    })
}

export function useDashboardRecentMessages() {
    return useQuery({
        queryKey: queryKeys.dashboard.recentMessages(),
        queryFn: fetchDashboardRecentMessages,
    })
}

export function useDashboardRecentProjects() {
    return useQuery({
        queryKey: queryKeys.dashboard.recentProjects(),
        queryFn: fetchDashboardRecentProjects,
    })
}

/** Convenience hook — returns all dashboard data */
export function useDashboard() {
    const stats = useDashboardStats()
    const recentMessages = useDashboardRecentMessages()
    const recentProjects = useDashboardRecentProjects()

    return {
        stats: stats.data,
        recentMessages: recentMessages.data ?? [],
        recentProjects: recentProjects.data ?? [],
        isLoading: stats.isLoading || recentMessages.isLoading || recentProjects.isLoading,
        isError: stats.isError || recentMessages.isError || recentProjects.isError,
    }
}
