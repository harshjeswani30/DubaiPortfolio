"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Search, MessageSquare, Trash2, Mail, User, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

type MessageRow = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  is_read?: boolean
}

export default function AdminMessagesPage() {
  const [items, setItems] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/messages")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load messages")
      setItems(json.data || [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to delete")
      setItems((prev) => prev.filter((m) => m.id !== id))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete message")
    } finally {
      setDeletingId(null)
    }
  }

  const filteredItems = items.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: items.length,
    thisWeek: items.filter((m) => {
      const date = new Date(m.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date > weekAgo
    }).length,
  }

  return (
    <AdminShell title="Messages" description="Contact form submissions">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-sm text-zinc-400">Total Messages</p>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="text-2xl font-bold text-cyan-400">{stats.thisWeek}</p>
            <p className="text-sm text-zinc-400">This Week</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
            <h3 className="mb-2 text-lg font-medium text-white">No messages found</h3>
            <p className="text-sm text-zinc-400">Messages from your contact form will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((message) => (
              <div
                key={message.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition-all hover:border-white/20"
              >
                <div
                  className="flex cursor-pointer items-center justify-between p-4"
                  onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                      <User className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate">{message.name}</h3>
                        <span className="text-xs text-zinc-500 hidden sm:inline">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 truncate">{message.subject || "(No subject)"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMessage(message.id)
                      }}
                      disabled={deletingId === message.id}
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedId === message.id ? (
                      <ChevronUp className="h-5 w-5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-zinc-400" />
                    )}
                  </div>
                </div>

                {expandedId === message.id && (
                  <div className="border-t border-white/10 p-4 pt-4 space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Mail className="h-4 w-4" />
                        <a
                          href={`mailto:${message.email}`}
                          className="text-cyan-400 hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 sm:hidden">
                        <Calendar className="h-4 w-4" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap">{message.message}</p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/30"
                      >
                        <Mail className="h-4 w-4" />
                        Reply
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
