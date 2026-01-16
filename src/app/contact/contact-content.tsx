"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, MapPin, Send, CheckCircle, Loader2 } from "lucide-react"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setIsSubmitted(true)
        reset()
      }
    } catch (error) {
      console.error(error)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-background opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute -right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[120px]"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-indigo-400">
              Contact
            </span>
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              Get In Touch
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Have a project in mind? Let&apos;s talk about how we can work
              together to bring your ideas to life.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:col-span-2"
            >
              <h2 className="mb-6 text-2xl font-bold text-white">
                Let&apos;s Connect
              </h2>
              <p className="mb-8 text-zinc-400">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your visions.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-indigo-500/10 p-3">
                    <Mail className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Email</h3>
                    <p className="text-zinc-400">hello@portfolio.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-indigo-500/10 p-3">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Location</h3>
                    <p className="text-zinc-400">Dubai, UAE</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Available for new projects
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="lg:col-span-3"
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center"
                >
                  <div className="mb-4 rounded-full bg-emerald-500/10 p-4">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Message Sent!
                  </h3>
                  <p className="text-zinc-400">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 text-sm text-indigo-400 hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 rounded-2xl border border-white/10 bg-zinc-900/50 p-8"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-300">
                        Name
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-indigo-500"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-300">
                        Email
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-indigo-500"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Subject
                    </label>
                    <input
                      {...register("subject")}
                      type="text"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-indigo-500"
                      placeholder="Project inquiry"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Message
                    </label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-indigo-500"
                      placeholder="Tell me about your project..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 font-medium text-white transition-shadow hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
