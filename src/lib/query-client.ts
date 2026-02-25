import { QueryClient } from "@tanstack/react-query"

// 5 minutes stale time — data is "fresh" for 5 min after fetch
export const STALE_TIME = 5 * 60 * 1000
// 10 minutes garbage collection — keep unused data 10 min in memory
export const GC_TIME = 10 * 60 * 1000
// 24 hours — discard localStorage cache older than 1 day
export const PERSIST_MAX_AGE = 24 * 60 * 60 * 1000

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: STALE_TIME,
                gcTime: GC_TIME,
                refetchOnWindowFocus: true,
                retry: 2,
            },
        },
    })
}

// Singleton for client-side use (avoids new instance on every hot reload)
let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
    if (typeof window === "undefined") {
        // Server: always make a new client (no shared state)
        return makeQueryClient()
    }
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
}
