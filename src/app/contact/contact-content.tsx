"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle, 
  Loader2, 
  ArrowRight,
  MessageSquare,
  User,
  AtSign,
  FileText,
  Phone
} from "lucide-react"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

const inputVariants = {
  focus: { scale: 1.02, transition: { duration: 0.2 } },
  blur: { scale: 1, transition: { duration: 0.2 } },
}

const FloatingParticle = ({ delay, duration, size, left, top }: { 
  delay: number; duration: number; size: number; left: string; top: string 
}) => (
  <motion.div
    className="absolute rounded-full bg-[#00ADB5]/20"
    style={{ width: size, height: size, left, top }}
    animate={{
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      opacity: [0.2, 0.5, 0.2],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
)

export function ContactContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(formRef, { once: true, margin: "-100px" })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const watchedFields = watch()

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

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "hello@portfolio.com",
      color: "from-[#00ADB5] to-[#00CED6]",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Location",
      value: "Dubai, UAE",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Phone",
      value: "+971 50 123 4567",
      color: "from-amber-500 to-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-[#222831] pt-20 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingParticle delay={0} duration={8} size={6} left="10%" top="20%" />
        <FloatingParticle delay={1} duration={10} size={8} left="80%" top="15%" />
        <FloatingParticle delay={2} duration={12} size={4} left="60%" top="70%" />
        <FloatingParticle delay={3} duration={9} size={10} left="25%" top="80%" />
        <FloatingParticle delay={4} duration={11} size={5} left="90%" top="50%" />
        <FloatingParticle delay={5} duration={7} size={7} left="5%" top="60%" />
        
        <motion.div
          className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-[#00ADB5]/10 blur-[150px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[150px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      <section className="relative py-16 md:py-24">
        <div className="relative mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-[#EEEEEE] md:text-6xl lg:text-7xl">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="block bg-gradient-to-r from-[#00ADB5] to-[#00CED6] bg-clip-text text-transparent"
                >
                  Contact
                </motion.span>
              </h1>
            </motion.div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="relative rounded-2xl border border-[#393E46]/60 bg-[#222831]/80 p-8 backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00ADB5]/20 to-transparent rounded-bl-full" />
                
                <h2 className="relative mb-2 text-2xl font-bold text-[#EEEEEE]">
                  Let&apos;s Connect
                </h2>
                <p className="relative mb-8 text-[#EEEEEE]/50">
                  I&apos;m always excited to discuss new projects and creative collaborations.
                </p>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                      className="group flex items-center gap-4 rounded-xl border border-[#393E46]/40 bg-[#393E46]/20 p-4 cursor-pointer transition-all hover:border-[#00ADB5]/30 hover:bg-[#393E46]/40"
                    >
                      <div className={`rounded-xl bg-gradient-to-br ${info.color} p-3 shadow-lg`}>
                        <span className="text-white">{info.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-[#EEEEEE]/40">
                          {info.label}
                        </p>
                        <p className="text-[#EEEEEE] font-medium group-hover:text-[#00ADB5] transition-colors">
                          {info.value}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#EEEEEE]/20 group-hover:text-[#00ADB5] transition-all group-hover:translate-x-1" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="rounded-2xl border border-[#393E46]/60 bg-gradient-to-br from-[#00ADB5]/10 to-[#393E46]/30 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                    <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#EEEEEE]">Available for new projects</p>
                    <p className="text-sm text-[#EEEEEE]/50">Currently accepting freelance work</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="hidden lg:block rounded-2xl border border-[#393E46]/60 bg-[#222831]/80 p-6 backdrop-blur-xl"
              >
                <h3 className="mb-4 text-lg font-semibold text-[#EEEEEE]">Response Time</h3>
                <div className="space-y-3">
                  {[
                    { label: "Email", time: "< 24 hours", progress: 90 },
                    { label: "Project Inquiry", time: "< 48 hours", progress: 75 },
                    { label: "Consultation", time: "Within a week", progress: 60 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#EEEEEE]/60">{item.label}</span>
                        <span className="text-[#00ADB5]">{item.time}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#393E46]/50 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#00ADB5] to-[#00CED6]"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-3xl border border-[#393E46]/60 bg-[#222831]/80 p-12 text-center backdrop-blur-xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-6"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <CheckCircle className="h-16 w-16 text-emerald-400" />
                      </motion.div>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-3 text-3xl font-bold text-[#EEEEEE]"
                    >
                      Message Sent!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-8 max-w-sm text-[#EEEEEE]/60"
                    >
                      Thank you for reaching out. I&apos;ll review your message and get back to you as soon as possible.
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      onClick={() => setIsSubmitted(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#00ADB5]/50 bg-[#00ADB5]/10 px-6 py-3 font-medium text-[#00ADB5] transition-all hover:bg-[#00ADB5]/20"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Send another message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="relative rounded-3xl border border-[#393E46]/60 bg-[#222831]/80 p-8 md:p-10 backdrop-blur-xl overflow-hidden"
                  >
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00ADB5]/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                    
                    <div className="relative space-y-6">
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-[#EEEEEE] mb-2">Send a Message</h3>
                        <p className="text-[#EEEEEE]/50">Fill out the form below and I&apos;ll get back to you shortly.</p>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <motion.div
                          variants={inputVariants}
                          animate={focusedField === "name" ? "focus" : "blur"}
                          className="relative"
                        >
                          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#EEEEEE]/70">
                            <User className="h-4 w-4 text-[#00ADB5]" />
                            Name
                          </label>
                          <input
                            {...register("name")}
                            type="text"
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full rounded-xl border bg-[#393E46]/30 px-4 py-4 text-[#EEEEEE] outline-none transition-all placeholder:text-[#EEEEEE]/30 ${
                              focusedField === "name"
                                ? "border-[#00ADB5] shadow-lg shadow-[#00ADB5]/10"
                                : "border-[#393E46]/60 hover:border-[#393E46]"
                            } ${errors.name ? "border-red-500/50" : ""}`}
                            placeholder="John Doe"
                          />
                          <AnimatePresence>
                            {errors.name && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-2 text-sm text-red-400"
                              >
                                {errors.name.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <motion.div
                          variants={inputVariants}
                          animate={focusedField === "email" ? "focus" : "blur"}
                          className="relative"
                        >
                          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#EEEEEE]/70">
                            <AtSign className="h-4 w-4 text-[#00ADB5]" />
                            Email
                          </label>
                          <input
                            {...register("email")}
                            type="email"
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full rounded-xl border bg-[#393E46]/30 px-4 py-4 text-[#EEEEEE] outline-none transition-all placeholder:text-[#EEEEEE]/30 ${
                              focusedField === "email"
                                ? "border-[#00ADB5] shadow-lg shadow-[#00ADB5]/10"
                                : "border-[#393E46]/60 hover:border-[#393E46]"
                            } ${errors.email ? "border-red-500/50" : ""}`}
                            placeholder="john@example.com"
                          />
                          <AnimatePresence>
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-2 text-sm text-red-400"
                              >
                                {errors.email.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>

                      <motion.div
                        variants={inputVariants}
                        animate={focusedField === "subject" ? "focus" : "blur"}
                        className="relative"
                      >
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#EEEEEE]/70">
                          <FileText className="h-4 w-4 text-[#00ADB5]" />
                          Subject
                        </label>
                        <input
                          {...register("subject")}
                          type="text"
                          onFocus={() => setFocusedField("subject")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full rounded-xl border bg-[#393E46]/30 px-4 py-4 text-[#EEEEEE] outline-none transition-all placeholder:text-[#EEEEEE]/30 ${
                            focusedField === "subject"
                              ? "border-[#00ADB5] shadow-lg shadow-[#00ADB5]/10"
                              : "border-[#393E46]/60 hover:border-[#393E46]"
                          } ${errors.subject ? "border-red-500/50" : ""}`}
                          placeholder="Project inquiry, collaboration, etc."
                        />
                        <AnimatePresence>
                          {errors.subject && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-400"
                            >
                              {errors.subject.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        variants={inputVariants}
                        animate={focusedField === "message" ? "focus" : "blur"}
                        className="relative"
                      >
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#EEEEEE]/70">
                          <MessageSquare className="h-4 w-4 text-[#00ADB5]" />
                          Message
                        </label>
                        <textarea
                          {...register("message")}
                          rows={5}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full resize-none rounded-xl border bg-[#393E46]/30 px-4 py-4 text-[#EEEEEE] outline-none transition-all placeholder:text-[#EEEEEE]/30 ${
                            focusedField === "message"
                              ? "border-[#00ADB5] shadow-lg shadow-[#00ADB5]/10"
                              : "border-[#393E46]/60 hover:border-[#393E46]"
                          } ${errors.message ? "border-red-500/50" : ""}`}
                          placeholder="Tell me about your project, goals, timeline, and any specific requirements..."
                        />
                        <AnimatePresence>
                          {errors.message && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-400"
                            >
                              {errors.message.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                        <div className="mt-2 flex justify-end">
                          <span className={`text-xs ${(watchedFields.message?.length || 0) >= 20 ? 'text-emerald-400' : 'text-[#EEEEEE]/40'}`}>
                            {watchedFields.message?.length || 0} / 20 min characters
                          </span>
                        </div>
                      </motion.div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#00ADB5] to-[#00CED6] px-8 py-4 font-semibold text-[#222831] shadow-xl shadow-[#00ADB5]/20 transition-all hover:shadow-2xl hover:shadow-[#00ADB5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative flex items-center justify-center gap-3">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Send Message
                              <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight className="h-5 w-5" />
                              </motion.div>
                            </>
                          )}
                        </span>
                      </motion.button>

                      <p className="text-center text-xs text-[#EEEEEE]/40">
                        By submitting, you agree to receive a response via email.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
