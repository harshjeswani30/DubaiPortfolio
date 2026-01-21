"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { formatDate } from "@/lib/utils"

type MessageRow = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export default function AdminMessagesPage() {
  const [items, setItems] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/messages")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load messages")
      setItems(json.data || [])
    } catch (e: any) {
      setError(e?.message || "Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to delete")
      setItems((prev) => prev.filter((m) => m.id !== id))
    } catch (e: any) {
      alert(e?.message || "Failed to delete message")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminShell title="Messages" description="Contact form submissions.">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50">
        <div className="border-b border-white/10 px-6 py-4 text-sm text-zinc-300">
          {loading ? "Loading..." : error ? error : `${items.length} message(s)`}
        </div>
        <div className="divide-y divide-white/5">
          {items.map((m) => (
            <div key={m.id} className="px-6 py-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-zinc-300">
                <div className="truncate">
                  <span className="font-semibold text-white">{m.name}</span> • {m.email}
                </div>
                <span className="text-xs text-zinc-500">{formatDate(m.created_at)}</span>
              </div>
              <div className="text-sm font-medium text-white">{m.subject}</div>
              <div className="text-sm text-zinc-400 whitespace-pre-line">{m.message}</div>
              <div className="pt-2">
                <button
                  onClick={() => del(m.id)}
                  disabled={deletingId === m.id}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200 hover:bg-red-500/15 disabled:opacity-60"
                >
                  {deletingId === m.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}

