"use client"

import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Search, MessageSquare, Trash2, Mail, User, Calendar, ChevronDown, RefreshCw, Inbox, TrendingUp, CheckSquare, Square, Circle, X } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useMessagesQuery, useDeleteMessage } from "@/hooks/use-messages-query"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"

type MessageRow = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  is_read?: boolean
}

type FilterType = "all" | "unread" | "read"

export default function AdminMessagesPage() {
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<FilterType>("all")
  const [bulkLoading, setBulkLoading] = useState(false)

  const { data: items = [], isLoading, isError, refetch } = useMessagesQuery()
  const deleteMessageMutation = useDeleteMessage()
  const qc = useQueryClient()

  const handleDelete = (id: string) => {
    if (!confirm("Delete this message?")) return
    deleteMessageMutation.mutate(id)
    selectedIds.delete(id)
    setSelectedIds(new Set(selectedIds))
  }

  const handleBulkAction = async (action: "delete" | "mark_read" | "mark_unread") => {
    if (selectedIds.size === 0) return
    const actionText = action === "delete" ? "delete" : action === "mark_read" ? "mark as read" : "mark as unread"
    if (!confirm(`${actionText} ${selectedIds.size} selected message${selectedIds.size > 1 ? 's' : ''}?`)) return
    setBulkLoading(true)
    try {
      const res = await fetch("/api/admin/messages/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: Array.from(selectedIds) }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Bulk action failed")
      setSelectedIds(new Set())
      qc.invalidateQueries({ queryKey: queryKeys.messages.all })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Bulk action failed")
    } finally {
      setBulkLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredItems.map((m: any) => m.id)))
    }
  }

  const filteredItems = items
    .filter((m: any) => {
      if (filter === "unread" && m.is_read) return false
      if (filter === "read" && !m.is_read) return false
      return true
    })
    .filter(
      (m: any) =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase()) ||
        m.subject?.toLowerCase().includes(search.toLowerCase())
    )

  const stats = {
    total: items.length,
    unread: items.filter((m: any) => !m.is_read).length,
    thisWeek: items.filter((m: any) => {
      const date = new Date(m.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date > weekAgo
    }).length,
  }

  return (
    <AdminShell title="Messages" description="Contact form submissions">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-[#00ADB5]/20 bg-gradient-to-br from-[#222831] to-[#393E46] p-6"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#00ADB5]/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Inbox className="h-8 w-8 text-[#00ADB5]" />
                <span className="text-3xl font-bold text-white">{stats.total}</span>
              </div>
              <p className="text-sm text-[#EEEEEE]/60">Total Messages</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-6"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-amber-500/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Circle className="h-8 w-8 text-amber-400" />
                <span className="text-3xl font-bold text-amber-400">{stats.unread}</span>
              </div>
              <p className="text-sm text-[#EEEEEE]/60">Unread Messages</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-6"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-cyan-500/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-cyan-400" />
                <span className="text-3xl font-bold text-cyan-400">{stats.thisWeek}</span>
              </div>
              <p className="text-sm text-[#EEEEEE]/60">This Week</p>
            </div>
          </motion.div>
        </div>

        {/* Search, Filter, and Actions */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#EEEEEE]/40" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#393E46] bg-[#222831]/80 py-3 pl-12 pr-4 text-sm text-[#EEEEEE] placeholder-[#EEEEEE]/30 outline-none transition-all focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/20"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex rounded-xl border border-[#393E46] bg-[#222831]/80 p-1">
              {(["all", "unread", "read"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === f
                    ? "bg-[#00ADB5] text-white"
                    : "text-[#EEEEEE]/60 hover:text-[#EEEEEE]"
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-[#00ADB5] px-4 py-2 font-medium text-white transition-all hover:bg-[#00ADB5]/90 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#00ADB5]/30 bg-[#00ADB5]/10 p-4"
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-[#00ADB5]" />
                <span className="font-medium text-[#EEEEEE]">
                  {selectedIds.size} message{selectedIds.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("mark_read")}
                  disabled={bulkLoading}
                  className="rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400 transition-all hover:bg-green-500/30 disabled:opacity-50"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => handleBulkAction("mark_unread")}
                  disabled={bulkLoading}
                  className="rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/30 disabled:opacity-50"
                >
                  Mark Unread
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  disabled={bulkLoading}
                  className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/30 disabled:opacity-50"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="rounded-lg bg-[#393E46] px-3 py-2 text-[#EEEEEE]/60 transition-all hover:text-[#EEEEEE]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 rounded-full border-4 border-[#00ADB5]/20 border-t-[#00ADB5]"
            />
            <p className="mt-4 text-sm text-[#EEEEEE]/60">Loading messages...</p>
          </div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <MessageSquare className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-red-200">Failed to Load Messages</h3>
            <p className="text-sm text-red-200/80">Please try refreshing the page.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/30"
            >
              Try Again
            </button>
          </motion.div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-[#393E46] bg-[#222831]/50 p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#00ADB5]/10">
              <MessageSquare className="h-10 w-10 text-[#00ADB5]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#EEEEEE]">
              {search ? "No messages match your search" : "No messages yet"}
            </h3>
            <p className="text-sm text-[#EEEEEE]/60">
              {search ? "Try adjusting your search terms" : "Messages from your contact form will appear here"}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Select All Checkbox */}
            {filteredItems.length > 0 && (
              <div className="flex items-center gap-3 px-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm text-[#EEEEEE]/60 hover:text-[#EEEEEE] transition-colors"
                >
                  {selectedIds.size === filteredItems.length ? (
                    <CheckSquare className="h-5 w-5 text-[#00ADB5]" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                  Select All
                </button>
              </div>
            )}

            {/* Grid Layout - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((message: any, index: number) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.03 }}
                    layout
                    className={`overflow-hidden rounded-2xl border transition-all ${message.is_read
                      ? "border-[#393E46] bg-[#222831]/60"
                      : "border-[#00ADB5]/30 bg-[#222831]/80 shadow-lg shadow-[#00ADB5]/5"
                      } ${selectedIds.has(message.id) ? "ring-2 ring-[#00ADB5]" : ""
                      }`}
                  >
                    <div
                      className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-[#393E46]/30"
                      onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSelect(message.id)
                        }}
                        className="mt-1 flex-shrink-0"
                      >
                        {selectedIds.has(message.id) ? (
                          <CheckSquare className="h-5 w-5 text-[#00ADB5]" />
                        ) : (
                          <Square className="h-5 w-5 text-[#EEEEEE]/40" />
                        )}
                      </button>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${message.is_read
                          ? "from-[#393E46] to-[#393E46] shadow-[#393E46]/30"
                          : "from-[#00ADB5] to-cyan-500 shadow-[#00ADB5]/30"
                          }`}
                      >
                        <User className="h-5 w-5 text-white" />
                      </motion.div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold truncate ${message.is_read ? "text-[#EEEEEE]/70" : "text-[#EEEEEE]"
                            }`}>
                            {message.name}
                          </h3>
                          {!message.is_read && (
                            <span className="flex-shrink-0">
                              <Circle className="h-3 w-3 fill-amber-400 text-amber-400" />
                            </span>
                          )}
                        </div>
                        <p className={`text-sm truncate mb-2 ${message.is_read ? "text-[#EEEEEE]/50" : "text-[#EEEEEE]/60"
                          }`}>
                          {message.subject || "(No subject)"}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[#EEEEEE]/40">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(message.id)
                          }}
                          disabled={deleteMessageMutation.isPending}
                          className="rounded-lg p-2 text-red-400 transition-all hover:bg-red-500/10 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                        <motion.div
                          animate={{ rotate: expandedId === message.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-4 w-4 text-[#EEEEEE]/40" />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === message.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#393E46] bg-[#222831]/50 p-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-[#00ADB5]" />
                              <a
                                href={`mailto:${message.email}`}
                                className="text-[#00ADB5] hover:underline font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {message.email}
                              </a>
                            </div>

                            <div className="rounded-xl border border-[#393E46] bg-[#393E46]/30 p-4">
                              <p className="text-sm text-[#EEEEEE]/90 whitespace-pre-wrap leading-relaxed">
                                {message.message}
                              </p>
                            </div>

                            <a
                              href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || "Your message")}&body=Hi ${encodeURIComponent(message.name)},%0A%0A`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00ADB5] to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#00ADB5]/30 transition-all hover:shadow-xl hover:-translate-y-0.5"
                            >
                              <Mail className="h-4 w-4" />
                              Reply via Email
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
