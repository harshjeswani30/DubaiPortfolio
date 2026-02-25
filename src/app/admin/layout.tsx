import { ReactNode } from "react"
import { QueryProvider } from "@/components/providers/query-provider"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-zinc-950 text-white antialiased">{children}</div>
    </QueryProvider>
  )
}

