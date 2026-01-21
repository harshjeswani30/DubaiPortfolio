"use client"

import { ReactNode } from "react"

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="min-h-screen flex-1">
        <div className="mx-auto max-w-7xl p-4 lg:p-8">
          <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-8">
            <div>
              <h1 className="text-2xl font-bold text-white lg:text-3xl tracking-tight">{title}</h1>
              {description && <p className="mt-2 text-zinc-400">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
