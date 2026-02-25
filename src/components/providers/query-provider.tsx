"use client"

import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { makeQueryClient, PERSIST_MAX_AGE } from "@/lib/query-client"

export function QueryProvider({ children }: { children: React.ReactNode }) {
    // useState ensures a single client instance per component lifecycle
    const [queryClient] = useState(() => makeQueryClient())

    // localStorage persister — only runs in browser
    const [persister] = useState(() => {
        if (typeof window === "undefined") return null
        return createSyncStoragePersister({
            storage: window.localStorage,
            key: "DUBAI_PORTFOLIO_QUERY_CACHE",
        })
    })

    // If persister fails to init (SSR edge case), fall back to plain provider
    if (!persister) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: PERSIST_MAX_AGE,
                buster: process.env.NEXT_PUBLIC_CACHE_BUSTER ?? "v1",
            }}
        >
            {children}
        </PersistQueryClientProvider>
    )
}
