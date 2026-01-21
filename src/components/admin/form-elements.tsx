"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const AdminInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-zinc-300">
            {label}
            {props.required && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200",
            "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
AdminInput.displayName = "AdminInput"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-zinc-300">
            {label}
            {props.required && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200",
            "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "min-h-[120px] resize-y",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
AdminTextarea.displayName = "AdminTextarea"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
}

export const AdminSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-zinc-300">
            {label}
            {props.required && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white outline-none transition-all duration-200",
            "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
AdminSelect.displayName = "AdminSelect"

interface SwitchProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function AdminSwitch({ label, description, checked, onChange, disabled }: SwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-zinc-300">{label}</p>
        {description && <p className="text-xs text-zinc-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-cyan-500" : "bg-zinc-700",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export function AdminButton({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        {
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40": variant === "primary",
          "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white": variant === "secondary",
          "bg-red-500/10 text-red-400 hover:bg-red-500/20": variant === "danger",
          "text-zinc-400 hover:bg-white/5 hover:text-white": variant === "ghost",
        },
        {
          "px-3 py-1.5 text-xs": size === "sm",
          "px-4 py-2.5 text-sm": size === "md",
          "px-6 py-3 text-base": size === "lg",
        },
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}

export function AdminCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function AdminCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-b border-white/10 px-6 py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function AdminCardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
}

interface TagInputProps {
  label?: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  hint?: string
}

export function AdminTagInput({ label, value, onChange, placeholder, hint }: TagInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const input = e.currentTarget
      const text = input.value.trim()
      if (text && !value.includes(text)) {
        onChange([...value, text])
        input.value = ""
      }
    } else if (e.key === "Backspace" && !e.currentTarget.value && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-zinc-300">{label}</label>}
      <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-zinc-900/50 p-3">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-xs font-medium text-cyan-400"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-cyan-400/60 hover:text-cyan-400"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder={value.length === 0 ? placeholder : "Add more..."}
          onKeyDown={handleKeyDown}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
        />
      </div>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  )
}
