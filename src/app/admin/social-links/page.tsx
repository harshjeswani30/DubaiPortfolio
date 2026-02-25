"use client"

import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { motion, AnimatePresence } from "framer-motion"
import {
  Github, Linkedin, Twitter, Instagram, Facebook, Youtube,
  Mail, Globe, Plus, Trash2, Edit2, Check, X, Eye, EyeOff,
  Link as LinkIcon, ArrowUpDown, Search, Filter, Sparkles
} from "lucide-react"
import { useSocialLinksQuery, useCreateSocialLink, useUpdateSocialLink, useDeleteSocialLink } from "@/hooks/use-social-links-query"

interface SocialLink {
  id: string
  platform: string
  url: string
  icon_name: string
  is_active: boolean
  display_order: number
}

const SOCIAL_PLATFORMS = [
  { name: "GitHub", icon: Github, color: "#333", placeholder: "https://github.com/yourusername" },
  { name: "LinkedIn", icon: Linkedin, color: "#0077B5", placeholder: "https://linkedin.com/in/yourprofile" },
  { name: "Twitter", icon: Twitter, color: "#1DA1F2", placeholder: "https://twitter.com/yourusername" },
  { name: "Instagram", icon: Instagram, color: "#E4405F", placeholder: "https://instagram.com/yourusername" },
  { name: "Facebook", icon: Facebook, color: "#1877F2", placeholder: "https://facebook.com/yourprofile" },
  { name: "Youtube", icon: Youtube, color: "#FF0000", placeholder: "https://youtube.com/@yourchannel" },
  { name: "Email", icon: Mail, color: "#00ADB5", placeholder: "mailto:your@email.com" },
  { name: "Website", icon: Globe, color: "#00ADB5", placeholder: "https://yourwebsite.com" },
]

export default function SocialLinksPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<typeof SOCIAL_PLATFORMS[0] | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ url: "" })
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")

  const { data: links = [], isLoading } = useSocialLinksQuery()
  const createLink = useCreateSocialLink()
  const updateLink = useUpdateSocialLink()
  const deleteLink = useDeleteSocialLink()

  const handleAddLink = () => {
    if (!selectedPlatform || !formData.url) return
    createLink.mutate({
      platform: selectedPlatform.name,
      url: formData.url,
      icon_name: selectedPlatform.name,
      is_active: true,
      display_order: links.length,
    }, {
      onSuccess: () => {
        setShowAddModal(false)
        setSelectedPlatform(null)
        setFormData({ url: "" })
      }
    })
  }

  const handleUpdateLink = (id: string) => {
    updateLink.mutate({ id, payload: { url: formData.url } }, {
      onSuccess: () => {
        setEditingId(null)
        setFormData({ url: "" })
      }
    })
  }

  const handleDeleteLink = (id: string) => {
    if (!confirm("Delete this social link?")) return
    deleteLink.mutate(id)
  }

  const handleToggleActive = (id: string, currentValue: boolean) => {
    updateLink.mutate({ id, payload: { is_active: !currentValue } })
  }

  const filteredLinks = links
    .filter((link: any) => {
      if (filter === "active") return link.is_active
      if (filter === "inactive") return !link.is_active
      return true
    })
    .filter((link: any) =>
      link.platform.toLowerCase().includes(search.toLowerCase()) ||
      link.url.toLowerCase().includes(search.toLowerCase())
    )

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (platform) => !links.some((link: any) => link.platform === platform.name)
  )

  const stats = {
    total: links.length,
    active: links.filter((l: any) => l.is_active).length,
    inactive: links.filter((l: any) => !l.is_active).length,
  }

  return (
    <AdminShell title="Social Links" description="Manage your social media presence">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-[#00ADB5]/20 bg-gradient-to-br from-[#222831] to-[#393E46] p-6"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#00ADB5]/10" />
            <div className="relative">
              <LinkIcon className="h-8 w-8 text-[#00ADB5] mb-2" />
              <p className="text-3xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-[#EEEEEE]/60">Total Links</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 p-6"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-green-500/10" />
            <div className="relative">
              <Eye className="h-8 w-8 text-green-400 mb-2" />
              <p className="text-3xl font-bold text-green-400">{stats.active}</p>
              <p className="text-sm text-[#EEEEEE]/60">Active</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-[#393E46] bg-gradient-to-br from-[#393E46]/30 to-[#222831] p-6"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#393E46]/30" />
            <div className="relative">
              <EyeOff className="h-8 w-8 text-[#EEEEEE]/40 mb-2" />
              <p className="text-3xl font-bold text-[#EEEEEE]/60">{stats.inactive}</p>
              <p className="text-sm text-[#EEEEEE]/60">Inactive</p>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#EEEEEE]/40" />
            <input
              type="text"
              placeholder="Search social links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#393E46] bg-[#222831]/80 py-3 pl-12 pr-4 text-sm text-[#EEEEEE] placeholder-[#EEEEEE]/30 outline-none transition-all focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/20"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex rounded-xl border border-[#393E46] bg-[#222831]/80 p-1">
              {(["all", "active", "inactive"] as const).map((f) => (
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
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00ADB5] to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-[#00ADB5]/30 transition-all hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Add Link
            </motion.button>
          </div>
        </div>

        {/* Links Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 rounded-full border-4 border-[#00ADB5]/20 border-t-[#00ADB5]"
            />
          </div>
        ) : filteredLinks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-[#393E46] bg-[#222831]/50 p-12 text-center"
          >
            <LinkIcon className="mx-auto h-16 w-16 text-[#00ADB5]/30 mb-4" />
            <h3 className="text-xl font-semibold text-[#EEEEEE] mb-2">No social links yet</h3>
            <p className="text-[#EEEEEE]/60 mb-6">Add your first social link to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00ADB5] px-6 py-3 font-semibold text-white"
            >
              <Plus className="h-5 w-5" />
              Add Social Link
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredLinks.map((link, index) => {
                const platform = SOCIAL_PLATFORMS.find((p) => p.name === link.platform)
                const IconComponent = platform?.icon || Globe

                return (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className={`group relative overflow-hidden rounded-2xl border transition-all ${link.is_active
                        ? "border-[#00ADB5]/30 bg-[#222831]/80 shadow-lg shadow-[#00ADB5]/5"
                        : "border-[#393E46] bg-[#222831]/40 opacity-60"
                      }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${platform?.color}20, ${platform?.color}05)`,
                            }}
                          >
                            <IconComponent
                              className="h-7 w-7"
                              style={{ color: platform?.color || "#00ADB5" }}
                            />
                          </motion.div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#EEEEEE]">{link.platform}</h3>
                            <p className="text-xs text-[#EEEEEE]/40">Social Platform</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleActive(link.id, link.is_active)}
                            className={`rounded-lg p-2 transition-all ${link.is_active
                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                : "bg-[#393E46] text-[#EEEEEE]/60 hover:bg-[#393E46]/80"
                              }`}
                            title={link.is_active ? "Active" : "Inactive"}
                          >
                            {link.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </motion.button>
                        </div>
                      </div>

                      {editingId === link.id ? (
                        <div className="space-y-3">
                          <input
                            type="url"
                            value={formData.url}
                            onChange={(e) => setFormData({ url: e.target.value })}
                            placeholder={platform?.placeholder}
                            className="w-full rounded-lg border border-[#393E46] bg-[#393E46]/30 px-4 py-2 text-sm text-[#EEEEEE] placeholder-[#EEEEEE]/30 outline-none focus:border-[#00ADB5]"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateLink(link.id)}
                              className="flex items-center gap-2 rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/30"
                            >
                              <Check className="h-4 w-4" />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null)
                                setFormData({ url: "" })
                              }}
                              className="flex items-center gap-2 rounded-lg bg-[#393E46] px-4 py-2 text-sm font-medium text-[#EEEEEE]/60 hover:bg-[#393E46]/80"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-sm text-[#00ADB5] hover:underline mb-4"
                          >
                            {link.url}
                          </a>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingId(link.id)
                                setFormData({ url: link.url })
                              }}
                              className="flex items-center gap-2 rounded-lg bg-[#393E46]/50 px-4 py-2 text-sm font-medium text-[#EEEEEE]/80 transition-all hover:bg-[#393E46]"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl rounded-2xl border border-[#393E46] bg-[#222831] p-6 shadow-2xl"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#EEEEEE]">Add Social Link</h2>
                    <p className="text-sm text-[#EEEEEE]/60">Choose a platform and add your profile URL</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="rounded-lg p-2 text-[#EEEEEE]/60 transition-colors hover:bg-[#393E46] hover:text-[#EEEEEE]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {!selectedPlatform ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {availablePlatforms.map((platform) => (
                      <motion.button
                        key={platform.name}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPlatform(platform)}
                        className="flex flex-col items-center gap-3 rounded-xl border border-[#393E46] bg-[#393E46]/30 p-6 transition-all hover:border-[#00ADB5]/50 hover:shadow-lg"
                      >
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-xl shadow-lg"
                          style={{ background: `${platform.color}20` }}
                        >
                          <platform.icon className="h-8 w-8" style={{ color: platform.color }} />
                        </div>
                        <span className="text-sm font-medium text-[#EEEEEE]">{platform.name}</span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 rounded-xl border border-[#00ADB5]/30 bg-[#00ADB5]/5 p-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl shadow-lg"
                        style={{ background: `${selectedPlatform.color}20` }}
                      >
                        <selectedPlatform.icon className="h-7 w-7" style={{ color: selectedPlatform.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#EEEEEE]">{selectedPlatform.name}</h3>
                        <p className="text-sm text-[#EEEEEE]/60">Enter your profile URL below</p>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#EEEEEE]">Profile URL</label>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ url: e.target.value })}
                        placeholder={selectedPlatform.placeholder}
                        className="w-full rounded-xl border border-[#393E46] bg-[#393E46]/30 px-4 py-3 text-[#EEEEEE] placeholder-[#EEEEEE]/30 outline-none transition-all focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/20"
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleAddLink}
                        disabled={!formData.url}
                        className="flex-1 rounded-xl bg-gradient-to-r from-[#00ADB5] to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Link
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlatform(null)
                          setFormData({ url: "" })
                        }}
                        className="rounded-xl bg-[#393E46] px-6 py-3 font-medium text-[#EEEEEE]/80 transition-all hover:bg-[#393E46]/80"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminShell>
  )
}
