"use client"

import { useIsFetching } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw } from "lucide-react"

export function SyncStatus() {
    const isFetching = useIsFetching()

    return (
        <AnimatePresence>
            {isFetching > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400"
                >
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Syncing
                </motion.div>
            )}
        </AnimatePresence>
    )
}
