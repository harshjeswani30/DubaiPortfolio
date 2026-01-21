"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Mail, ArrowRight, Shield } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const nextPath = useMemo(() => search.get("next") || "/admin/dashboard", [search])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || "Login failed")
        return
      }
      router.replace(nextPath)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#222831] p-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-[#00ADB5]/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-[#00ADB5]/5 blur-[100px]" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(0, 173, 181, 0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00ADB5] to-[#00ADB5]/70 shadow-lg shadow-[#00ADB5]/25"
          >
            <Shield className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[#EEEEEE]">Admin Portal</h1>
          <p className="mt-2 text-[#EEEEEE]/50">Sign in to manage your portfolio</p>
        </div>

        <div className="rounded-2xl border border-[#393E46]/50 bg-[#393E46]/20 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#EEEEEE]/70">
                <Mail className="h-4 w-4 text-[#00ADB5]" />
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#393E46] bg-[#222831]/80 px-4 py-3 text-[#EEEEEE] outline-none transition-all duration-200 placeholder:text-[#EEEEEE]/30 focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/20"
                placeholder="admin@example.com"
                type="email"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#EEEEEE]/70">
                <Lock className="h-4 w-4 text-[#00ADB5]" />
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#393E46] bg-[#222831]/80 px-4 py-3 text-[#EEEEEE] outline-none transition-all duration-200 placeholder:text-[#EEEEEE]/30 focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/20"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#00ADB5] to-[#00ADB5]/80 px-4 py-3.5 font-semibold text-white shadow-lg shadow-[#00ADB5]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#00ADB5]/30 disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#00ADB5]/0 via-white/20 to-[#00ADB5]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[#EEEEEE]/30">
          Protected admin area. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </div>
  )
}
