"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminTextarea,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { Save, RefreshCw, Plus, FileUser, Briefcase, Code, Edit, Trash2, GraduationCap, Award, Globe } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SiteSettings {
  name: string
  role: string
  bio: string
  email: string
  phone: string
  location: string
}

interface Experience {
  id: string
  company: string
  position: string
  start_date: string
  end_date: string | null
  description: string
  is_current: boolean
  display_order: number
}

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
}

interface Education {
  id: string
  degree: string
  institution: string
  location: string | null
  start_year: string | null
  end_year: string | null
  gpa: string | null
  highlights: string[]
  display_order: number
  is_active: boolean
}

interface Certification {
  id: string
  name: string
  issuer: string
  year: string | null
  credential_url: string | null
  display_order: number
  is_active: boolean
}

interface Language {
  id: string
  name: string
  level: string
  proficiency: number
  display_order: number
  is_active: boolean
}

const tabs = [
  { id: "profile", label: "Profile", icon: FileUser },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Globe },
]

function ResumePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "profile"
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>({
    name: "",
    role: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
  })
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [languages, setLanguages] = useState<Language[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [settingsRes, experienceRes, skillsRes, educationRes, certificationsRes, languagesRes] = await Promise.all([
        fetch("/api/admin/settings/site"),
        fetch("/api/admin/experience"),
        fetch("/api/admin/skills"),
        fetch("/api/admin/education"),
        fetch("/api/admin/certifications"),
        fetch("/api/admin/languages"),
      ])
      const [settingsJson, experienceJson, skillsJson, educationJson, certificationsJson, languagesJson] = await Promise.all([
        settingsRes.json(),
        experienceRes.json(),
        skillsRes.json(),
        educationRes.json(),
        certificationsRes.json(),
        languagesRes.json(),
      ])
      if (settingsJson.data) setSettings(settingsJson.data)
      if (experienceJson.data) setExperiences(experienceJson.data)
      if (skillsJson.data) setSkills(skillsJson.data)
      if (educationJson.data) setEducation(educationJson.data)
      if (certificationsJson.data) setCertifications(certificationsJson.data)
      if (languagesJson.data) setLanguages(languagesJson.data)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await fetch("/api/admin/settings/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  const deleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return
    try {
      await fetch(`/api/admin/experience/${id}`, { method: "DELETE" })
      setExperiences((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const deleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return
    try {
      await fetch(`/api/admin/skills/${id}`, { method: "DELETE" })
      setSkills((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const deleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education?")) return
    try {
      await fetch(`/api/admin/education/${id}`, { method: "DELETE" })
      setEducation((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const deleteCertification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return
    try {
      await fetch(`/api/admin/certifications/${id}`, { method: "DELETE" })
      setCertifications((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const deleteLanguage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this language?")) return
    try {
      await fetch(`/api/admin/languages/${id}`, { method: "DELETE" })
      setLanguages((prev) => prev.filter((l) => l.id !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const getActionButton = () => {
    switch (activeTab) {
      case "profile":
        return (
          <AdminButton onClick={saveSettings} loading={saving}>
            <Save className="h-4 w-4" />
            Save Changes
          </AdminButton>
        )
      case "experience":
        return (
          <Link href="/admin/experience/new" className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600">
            <Plus className="h-4 w-4" />
            Add Experience
          </Link>
        )
      case "education":
        return (
          <Link href="/admin/education/new" className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600">
            <Plus className="h-4 w-4" />
            Add Education
          </Link>
        )
      case "skills":
        return (
          <Link href="/admin/skills/new" className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600">
            <Plus className="h-4 w-4" />
            Add Skill
          </Link>
        )
      case "certifications":
        return (
          <Link href="/admin/certifications/new" className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600">
            <Plus className="h-4 w-4" />
            Add Certification
          </Link>
        )
      case "languages":
        return (
          <Link href="/admin/languages/new" className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600">
            <Plus className="h-4 w-4" />
            Add Language
          </Link>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <AdminShell title="Resume Page" description="Manage resume/CV content">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Resume Page"
      description="Manage resume/CV content"
      actions={getActionButton()}
    >
      <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/admin/pages/resume?tab=${tab.id}`)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              <p className="text-sm text-zinc-500">Basic info shown on resume page</p>
            </AdminCardHeader>
            <AdminCardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Full Name"
                  value={settings.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="John Doe"
                  required
                />
                <AdminInput
                  label="Professional Role"
                  value={settings.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  placeholder="Full Stack Developer"
                  required
                />
              </div>
              <AdminTextarea
                label="Bio / Summary"
                value={settings.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="A brief professional summary..."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <AdminInput
                  label="Email Address"
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="hello@example.com"
                />
                <AdminInput
                  label="Phone Number"
                  value={settings.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+971 50 123 4567"
                />
              </div>
              <AdminInput
                label="Location"
                value={settings.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Dubai, UAE"
              />
            </AdminCardContent>
          </AdminCard>
        </div>
      )}

      {activeTab === "experience" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Work Experience</h3>
                  <p className="text-sm text-zinc-500">{experiences.length} entries</p>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              {experiences.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No experience added yet</p>
              ) : (
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-white">{exp.position}</h4>
                          {exp.is_current && (
                            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">Current</span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/experience/${exp.id}`} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => deleteExperience(exp.id)} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminCardContent>
          </AdminCard>
        </div>
      )}

      {activeTab === "education" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Education</h3>
                  <p className="text-sm text-zinc-500">{education.length} entries</p>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              {education.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No education added yet</p>
              ) : (
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-white">{edu.degree}</h4>
                          {!edu.is_active && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">Inactive</span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400">{edu.institution}</p>
                        {edu.start_year && (
                          <p className="text-xs text-zinc-500">{edu.start_year}{edu.end_year && edu.end_year !== edu.start_year ? ` - ${edu.end_year}` : ""}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/education/${edu.id}`} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => deleteEducation(edu.id)} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminCardContent>
          </AdminCard>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Skills</h3>
                  <p className="text-sm text-zinc-500">{skills.length} skills</p>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              {skills.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No skills added yet</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{skill.name}</h4>
                        <p className="text-xs text-zinc-500">{skill.category}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-zinc-700">
                            <div className="h-full rounded-full bg-cyan-500" style={{ width: `${skill.proficiency}%` }} />
                          </div>
                          <span className="text-xs text-zinc-400">{skill.proficiency}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <Link href={`/admin/skills/${skill.id}`} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => deleteSkill(skill.id)} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminCardContent>
          </AdminCard>
        </div>
      )}

      {activeTab === "certifications" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Certifications</h3>
                  <p className="text-sm text-zinc-500">{certifications.length} certifications</p>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              {certifications.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No certifications added yet</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-white">{cert.name}</h4>
                          {!cert.is_active && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">Inactive</span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400">{cert.issuer}</p>
                        {cert.year && <p className="text-xs text-zinc-500">{cert.year}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/certifications/${cert.id}`} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => deleteCertification(cert.id)} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminCardContent>
          </AdminCard>
        </div>
      )}

      {activeTab === "languages" && (
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Languages</h3>
                  <p className="text-sm text-zinc-500">{languages.length} languages</p>
                </div>
              </div>
            </AdminCardHeader>
            <AdminCardContent>
              {languages.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No languages added yet</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {languages.map((lang) => (
                    <div key={lang.id} className="rounded-xl border border-white/5 bg-white/5 p-4 text-center">
                      <div className="relative mx-auto mb-3 h-16 w-16">
                        <svg className="h-16 w-16 -rotate-90 transform">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-zinc-700" />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            className="text-cyan-500"
                            strokeDasharray={`${(lang.proficiency / 100) * 176} 176`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{lang.proficiency}%</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-white">{lang.name}</h4>
                      <p className="text-xs text-cyan-400">{lang.level}</p>
                      {!lang.is_active && (
                        <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">Inactive</span>
                      )}
                      <div className="mt-3 flex items-center justify-center gap-1">
                        <Link href={`/admin/languages/${lang.id}`} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => deleteLanguage(lang.id)} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminCardContent>
          </AdminCard>
        </div>
      )}
    </AdminShell>
  )
}

export default function ResumePage() {
  return (
    <Suspense fallback={
      <AdminShell title="Resume Page" description="Manage resume/CV content">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </AdminShell>
    }>
      <ResumePageContent />
    </Suspense>
  )
}
