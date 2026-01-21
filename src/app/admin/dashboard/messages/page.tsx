"use client"

import { useState, useEffect } from "react"
import { Trash2, Loader2, Mail, MailOpen } from "lucide-react"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    const res = await fetch("/api/admin/messages")
    const data = await res.json()
    setMessages(data)
    setLoading(false)
  }

  async function markAsRead(id: string) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: true }),
    })
    await loadMessages()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
    setSelectedMessage(null)
    await loadMessages()
  }

  function openMessage(msg: Message) {
    setSelectedMessage(msg)
    if (!msg.is_read) {
      markAsRead(msg.id)
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-zinc-400">
          Contact form submissions {unreadCount > 0 && `(${unreadCount} unread)`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="divide-y divide-zinc-800 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No messages yet</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors ${
                    selectedMessage?.id === msg.id ? "bg-zinc-800/50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {msg.is_read ? (
                        <MailOpen className="w-5 h-5 text-zinc-500 mt-0.5" />
                      ) : (
                        <Mail className="w-5 h-5 text-cyan-400 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium ${msg.is_read ? "text-zinc-400" : "text-white"}`}>
                          {msg.name}
                        </p>
                        <p className="text-zinc-500 text-sm">{msg.subject || "No subject"}</p>
                        <p className="text-zinc-600 text-xs mt-1">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!msg.is_read && (
                      <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedMessage ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedMessage.name}</h2>
                <a href={`mailto:${selectedMessage.email}`} className="text-cyan-400 hover:underline text-sm">
                  {selectedMessage.email}
                </a>
              </div>
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-zinc-400 text-sm">Subject</p>
              <p className="text-white">{selectedMessage.subject || "No subject"}</p>
            </div>

            <div className="mb-4">
              <p className="text-zinc-400 text-sm">Message</p>
              <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <p className="text-zinc-500 text-sm">
                Received: {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </div>

            <div className="mt-6">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-center justify-center text-zinc-500">
            Select a message to view
          </div>
        )}
      </div>
    </div>
  )
}
