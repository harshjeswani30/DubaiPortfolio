"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { format } from "date-fns"
import Link from "next/link"
import {
  Users,
  Code,
  BookOpen,
  UsersRound,
  Github,
  PenTool,
  Gamepad2,
  Camera,
  Dumbbell,
  Plane,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  ArrowRight,
  Sparkles,
  Heart,
  Linkedin,
  Globe,
  Star,
  Zap,
  Target,
  Rocket,
  ChevronRight,
} from "lucide-react"
import type { AboutPage, SiteSettings, Experience, Skill, Education, Service, SocialLink } from "@/lib/data"

interface AboutContentProps {
  aboutPage: AboutPage | null
  siteSettings: SiteSettings | null
  experiences: Experience[]
  skills: Skill[]
  education: Education[]
  services: Service[]
  socialLinks: SocialLink[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  code: Code,
  "book-open": BookOpen,
  "users-round": UsersRound,
  github: Github,
  "pen-tool": PenTool,
  "gamepad-2": Gamepad2,
  camera: Camera,
  dumbbell: Dumbbell,
  plane: Plane,
  linkedin: Linkedin,
  globe: Globe,
  star: Star,
  zap: Zap,
  target: Target,
  rocket: Rocket,
  heart: Heart,
}

const serviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  globe: Globe,
  zap: Zap,
  target: Target,
  rocket: Rocket,
  users: Users,
  star: Star,
}

export function AboutContent({
  aboutPage,
  siteSettings,
  experiences,
  skills,
  education,
  services,
  socialLinks,
}: AboutContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])

  const stats = aboutPage?.stats?.length
    ? aboutPage.stats
    : [
        { value: `${siteSettings?.years_experience || 5}+`, label: "Years Experience" },
        { value: `${siteSettings?.projects_completed || 50}+`, label: "Projects Completed" },
        { value: `${siteSettings?.happy_clients || 30}+`, label: "Happy Clients" },
      ]

  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )

  return (
    <div ref={containerRef} className="min-h-screen bg-[#222831]">
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00ADB5]/5 via-transparent to-transparent" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute -right-[400px] -top-[400px] h-[800px] w-[800px] opacity-10"
          >
            <div className="absolute inset-0 rounded-full border border-[#00ADB5]/30" />
            <div className="absolute inset-[100px] rounded-full border border-[#00ADB5]/20" />
            <div className="absolute inset-[200px] rounded-full border border-[#00ADB5]/10" />
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-4 py-2"
              >
                <Sparkles className="h-4 w-4 text-[#00ADB5]" />
                <span className="text-sm text-[#00ADB5]">
                  {aboutPage?.intro_eyebrow || "About Me"}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-4 text-4xl font-bold text-[#EEEEEE] md:text-6xl"
              >
                {aboutPage?.intro_title || "Creating Digital"}
                <br />
                <span className="bg-gradient-to-r from-[#00ADB5] to-cyan-400 bg-clip-text text-transparent">
                  {aboutPage?.intro_title_highlight || "Experiences"}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-lg text-[#EEEEEE]/70 leading-relaxed"
              >
                {aboutPage?.intro_description ||
                  "Passionate about transforming ideas into elegant, functional solutions."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8 flex flex-wrap items-center gap-4 text-sm text-[#EEEEEE]/60"
              >
                {siteSettings?.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#00ADB5]" />
                    {siteSettings.location}
                  </span>
                )}
                {siteSettings?.email && (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#00ADB5]" />
                    {siteSettings.email}
                  </span>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-2 rounded-xl bg-[#00ADB5] px-6 py-3 font-semibold text-[#222831] transition-all hover:shadow-lg hover:shadow-[#00ADB5]/25"
                  >
                    Get in Touch
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
                <Link href="/resume">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-xl border border-[#393E46] bg-[#393E46]/20 px-6 py-3 font-semibold text-[#EEEEEE] transition-all hover:border-[#00ADB5]"
                  >
                    View Resume
                  </motion.button>
                </Link>
              </motion.div>

              {socialLinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex items-center gap-3"
                >
                  {socialLinks.map((link) => {
                    const Icon = iconMap[link.icon_name?.toLowerCase()] || Globe
                    return (
                      <motion.a
                        key={link.id}
                        whileHover={{ scale: 1.1, y: -2 }}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#393E46] bg-[#393E46]/20 text-[#EEEEEE]/60 transition-all hover:border-[#00ADB5] hover:text-[#00ADB5]"
                      >
                        <Icon className="h-5 w-5" />
                      </motion.a>
                    )
                  })}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="rounded-2xl border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/30 to-transparent p-6 backdrop-blur-sm"
                  >
                    <p className="text-3xl font-bold text-[#00ADB5] md:text-4xl">{stat.value}</p>
                    <p className="mt-1 text-sm text-[#EEEEEE]/60">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {aboutPage?.images?.[0] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 overflow-hidden rounded-2xl border border-[#393E46]/50"
                >
                  <img
                    src={aboutPage.images[0]}
                    alt="About"
                    className="h-64 w-full object-cover"
                  />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-[#00ADB5]/60">Scroll to explore</span>
            <div className="h-10 w-5 rounded-full border border-[#393E46] p-1">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-[#00ADB5]"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {aboutPage?.story_content && (
          <section className="py-16">
            <SectionHeader
              icon={<Heart className="h-5 w-5" />}
              title={aboutPage.story_title || "My Story"}
            />
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {aboutPage.story_content.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-4 text-[#EEEEEE]/70 leading-relaxed last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>
              {aboutPage.story_image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="overflow-hidden rounded-2xl border border-[#393E46]/50">
                    <img
                      src={aboutPage.story_image}
                      alt="My Story"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl border border-[#00ADB5]/20 -z-10" />
                </motion.div>
              )}
            </div>
          </section>
        )}

        {aboutPage?.values && aboutPage.values.length > 0 && (
          <section className="py-16">
            <SectionHeader
              icon={<Target className="h-5 w-5" />}
              title={aboutPage.values_title || "My Values"}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {aboutPage.values.map((value, index) => {
                const Icon = iconMap[value.icon] || Star
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="group rounded-2xl border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/20 to-transparent p-6 transition-all hover:border-[#00ADB5]/50"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ADB5]/10">
                      <Icon className="h-6 w-6 text-[#00ADB5]" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-[#EEEEEE] group-hover:text-[#00ADB5] transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm text-[#EEEEEE]/60 leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {experiences.length > 0 && aboutPage?.show_experience !== false && (
          <section className="py-16">
            <SectionHeader
              icon={<Briefcase className="h-5 w-5" />}
              title="Work Experience"
            />
            <div className="relative">
              <div className="absolute left-[19px] top-0 h-full w-[2px] bg-gradient-to-b from-[#00ADB5] via-[#00ADB5]/50 to-transparent md:left-1/2 md:-translate-x-1/2" />

              <div className="space-y-12">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-[12px] top-0 z-10 h-4 w-4 rounded-full border-4 border-[#222831] bg-[#00ADB5] md:left-1/2 md:-translate-x-1/2" />

                    <div
                      className={`ml-12 md:ml-0 md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="group rounded-2xl border border-[#393E46]/50 bg-[#393E46]/10 p-6 transition-all hover:border-[#00ADB5]/50"
                      >
                        <div
                          className={`mb-2 flex items-center gap-2 text-sm text-[#00ADB5] ${
                            index % 2 === 0 ? "md:justify-end" : ""
                          }`}
                        >
                          <Calendar className="h-4 w-4" />
                          {format(new Date(exp.start_date), "MMM yyyy")} -{" "}
                          {exp.end_date
                            ? format(new Date(exp.end_date), "MMM yyyy")
                            : "Present"}
                        </div>
                        <h3 className="mb-1 text-xl font-bold text-[#EEEEEE] group-hover:text-[#00ADB5] transition-colors">
                          {exp.position}
                        </h3>
                        <p className="mb-3 font-medium text-[#00ADB5]/80">
                          {exp.company}
                        </p>
                        {exp.location && (
                          <p className="mb-3 flex items-center gap-1 text-sm text-[#EEEEEE]/50">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </p>
                        )}
                        <p className="text-sm text-[#EEEEEE]/70 leading-relaxed">
                          {exp.description}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {Object.keys(skillsByCategory).length > 0 && aboutPage?.show_skills !== false && (
          <section className="py-16">
            <SectionHeader icon={<Code className="h-5 w-5" />} title="Technical Skills" />
            <div className="space-y-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills], catIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <h3 className="mb-4 text-lg font-semibold text-[#EEEEEE]">{category}</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {categorySkills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        whileHover={{ scale: 1.03, y: -2 }}
                        className="group relative overflow-hidden rounded-xl border border-[#393E46]/50 bg-[#393E46]/10 p-4 transition-all hover:border-[#00ADB5]/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#EEEEEE] group-hover:text-[#00ADB5] transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-sm text-[#00ADB5]">{skill.proficiency}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#393E46]/50">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full rounded-full bg-gradient-to-r from-[#00ADB5] to-cyan-400"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && aboutPage?.show_education !== false && (
          <section className="py-16">
            <SectionHeader icon={<GraduationCap className="h-5 w-5" />} title="Education" />
            <div className="grid gap-6 md:grid-cols-2">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group rounded-2xl border border-[#393E46]/50 bg-[#393E46]/10 p-6 transition-all hover:border-[#00ADB5]/50"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00ADB5]/10">
                      <GraduationCap className="h-6 w-6 text-[#00ADB5]" />
                    </div>
                    <span className="rounded-full bg-[#393E46]/50 px-3 py-1 text-xs text-[#EEEEEE]/70">
                      {edu.start_year}
                      {edu.end_year && edu.end_year !== edu.start_year
                        ? ` - ${edu.end_year}`
                        : ""}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#EEEEEE] group-hover:text-[#00ADB5] transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="mb-1 font-medium text-[#00ADB5]/80">{edu.institution}</p>
                  {edu.location && (
                    <p className="mb-4 flex items-center gap-1 text-sm text-[#EEEEEE]/50">
                      <MapPin className="h-3 w-3" />
                      {edu.location}
                    </p>
                  )}
                  {edu.gpa && <p className="mb-3 text-sm text-[#EEEEEE]/70">GPA: {edu.gpa}</p>}
                  {edu.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {edu.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-[#00ADB5]/10 px-3 py-1 text-xs text-[#00ADB5]"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {services.length > 0 && aboutPage?.show_services !== false && (
          <section className="py-16">
            <SectionHeader icon={<Rocket className="h-5 w-5" />} title="What I Do" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = serviceIconMap[service.icon_name?.toLowerCase()] || Code
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="group rounded-2xl border border-[#393E46]/50 bg-gradient-to-br from-[#393E46]/20 to-transparent p-6 transition-all hover:border-[#00ADB5]/50"
                  >
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: service.gradient || "rgba(0, 173, 181, 0.1)" }}
                    >
                      <Icon className="h-6 w-6 text-[#00ADB5]" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-[#EEEEEE] group-hover:text-[#00ADB5] transition-colors">
                      {service.title}
                    </h3>
                    <p className="mb-4 text-sm text-[#EEEEEE]/60 leading-relaxed">
                      {service.description}
                    </p>
                    {service.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {service.skills.slice(0, 4).map((skill, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-[#393E46]/50 px-2 py-0.5 text-xs text-[#EEEEEE]/70"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {aboutPage?.achievements && aboutPage.achievements.length > 0 && (
          <section className="py-16">
            <SectionHeader
              icon={<Trophy className="h-5 w-5" />}
              title={aboutPage.achievements_title || "Achievements"}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {aboutPage.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="group flex items-start gap-4 rounded-xl border border-[#393E46]/50 bg-[#393E46]/10 p-5 transition-all hover:border-[#00ADB5]/50"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#00ADB5]/10">
                    <Award className="h-6 w-6 text-[#00ADB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-[#EEEEEE] group-hover:text-[#00ADB5] transition-colors">
                        {achievement.title}
                      </h3>
                      <span className="flex-shrink-0 rounded-full bg-[#00ADB5]/10 px-2 py-0.5 text-xs text-[#00ADB5]">
                        {achievement.year}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#EEEEEE]/60">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {aboutPage?.interests && aboutPage.interests.length > 0 && (
          <section className="py-16">
            <SectionHeader
              icon={<Heart className="h-5 w-5" />}
              title={aboutPage.interests_title || "Beyond Code"}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aboutPage.interests.map((interest, index) => {
                const Icon = iconMap[interest.icon] || Star
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="group flex items-center gap-4 rounded-xl border border-[#393E46]/50 bg-[#393E46]/10 p-4 transition-all hover:border-[#00ADB5]/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ADB5]/10">
                      <Icon className="h-5 w-5 text-[#00ADB5]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#EEEEEE] group-hover:text-[#00ADB5] transition-colors">
                        {interest.title}
                      </h4>
                      <p className="text-sm text-[#EEEEEE]/50">{interest.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="rounded-3xl border border-[#393E46]/50 bg-gradient-to-br from-[#00ADB5]/10 via-[#393E46]/20 to-transparent p-8 text-center md:p-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 text-3xl font-bold text-[#EEEEEE] md:text-4xl"
            >
              {aboutPage?.footer_text || "Let's Build Something Amazing"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mx-auto mb-8 max-w-2xl text-[#EEEEEE]/70"
            >
              I&apos;m always excited to collaborate on new projects and bring ideas to life.
              Whether you have a project in mind or just want to chat, feel free to reach out!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-2 rounded-xl bg-[#00ADB5] px-8 py-4 font-semibold text-[#222831] transition-all hover:shadow-lg hover:shadow-[#00ADB5]/25"
                >
                  <Mail className="h-5 w-5" />
                  Get in Touch
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl border-2 border-[#393E46] px-8 py-4 font-semibold text-[#EEEEEE] transition-all hover:border-[#00ADB5] hover:bg-[#393E46]/20"
                >
                  View My Work
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8 flex items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ADB5]/10 text-[#00ADB5]">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-[#EEEEEE]">{title}</h2>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-[#00ADB5]/50 to-transparent" />
    </motion.div>
  )
}
