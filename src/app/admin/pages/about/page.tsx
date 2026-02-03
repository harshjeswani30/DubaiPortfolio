"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  AdminInput,
  AdminTextarea,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
} from "@/components/admin/form-elements"
import { Save, Plus, Trash2, MoveUp, MoveDown } from "lucide-react"

interface AboutSection {
  id?: string
  type: "center" | "column" | "lines" | "sides" | "center-tall" | "grid"
  title: string
  text: string
  images: string[]
  order: number
}

interface AboutData {
  id?: string
  hero_image: string
  main_title: string
  is_active: boolean
  sections: AboutSection[]
}

const SECTION_TYPES = [
  { value: "center", label: "Center Title" },
  { value: "column", label: "5 Column Images" },
  { value: "lines", label: "Text with Inline Images" },
  { value: "sides", label: "Side Image + Text" },
  { value: "center-tall", label: "Center Tall Image + Text" },
  { value: "grid", label: "3x3 Image Grid" },
]

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData>({
    hero_image: "",
    main_title: "",
    is_active: true,
    sections: [],
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isDefaultData, setIsDefaultData] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/settings/about")
      const json = await res.json()
      if (json.data) {
        // Check if this is default data (no ID means it's from default)
        const hasId = !!json.data.id
        setIsDefaultData(!hasId)
        
        setData({
          ...json.data,
          hero_image: json.data.hero_image || "",
          main_title: json.data.main_title || "",
          sections: (json.data.sections || []).map((section: AboutSection) => ({
            ...section,
            title: section.title || "",
            text: section.text || "",
            images: section.images || [],
          })),
        })
      }
    } catch (error) {
      console.error("Error fetching about data:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/admin/settings/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setMessage("About page updated successfully!")
        setIsDefaultData(false) // No longer using default data
        setTimeout(() => setMessage(""), 3000)
        fetchData()
      } else {
        setMessage("Error updating about page")
      }
    } catch (error) {
      setMessage("Error updating about page")
    } finally {
      setLoading(false)
    }
  }

  function addSection() {
    setData({
      ...data,
      sections: [
        ...data.sections,
        {
          type: "center",
          title: "",
          text: "",
          images: [],
          order: data.sections.length,
        },
      ],
    })
  }

  function removeSection(index: number) {
    const newSections = data.sections.filter((_, i) => i !== index)
    setData({
      ...data,
      sections: newSections.map((s, i) => ({ ...s, order: i })),
    })
  }

  function moveSection(index: number, direction: "up" | "down") {
    const newSections = [...data.sections]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return

    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    
    setData({
      ...data,
      sections: newSections.map((s, i) => ({ ...s, order: i })),
    })
  }

  function updateSection(index: number, field: keyof AboutSection, value: any) {
    const newSections = [...data.sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setData({ ...data, sections: newSections })
  }

  function updateSectionImages(index: number, imageString: string) {
    const images = imageString.split("\n").map((url) => url.trim())
    updateSection(index, "images", images)
  }

  return (
    <AdminShell title="About Page Settings" description="Manage your about page with scroll animations">
      {isDefaultData && (
        <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
              <span className="text-xs text-blue-400">ℹ</span>
            </div>
            <div>
              <p className="font-medium text-blue-400">Using Default Sample Data</p>
              <p className="mt-1 text-sm text-blue-300/70">
                The about page is currently showing sample content. Customize it below and save to create your own version.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AdminCard>
          <AdminCardHeader>
            <h2 className="text-xl font-semibold text-[#EEEEEE]">Hero Section</h2>
          </AdminCardHeader>
          <AdminCardContent>
            <div className="space-y-4">
              <AdminInput
                label="Hero Image URL"
                value={data.hero_image}
                onChange={(e) => setData({ ...data, hero_image: e.target.value })}
                placeholder="https://images.unsplash.com/photo..."
              />

              <AdminInput
                label="Main Title"
                value={data.main_title}
                onChange={(e) => setData({ ...data, main_title: e.target.value })}
                placeholder="Your Name or Brand"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.is_active}
                  onChange={(e) => setData({ ...data, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-[#393E46] bg-[#393E46]/20 text-[#00ADB5]"
                />
                <label className="text-sm text-[#EEEEEE]">Active</label>
              </div>
            </div>
          </AdminCardContent>
        </AdminCard>

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#EEEEEE]">Sections</h2>
            <AdminButton type="button" onClick={addSection}>
              <Plus className="h-4 w-4" />
              Add Section
            </AdminButton>
          </div>

          <div className="space-y-4">
            {data.sections.map((section, index) => (
              <AdminCard key={index}>
                <AdminCardHeader>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-semibold text-[#EEEEEE]">
                      Section {index + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveSection(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-[#EEEEEE]/60 hover:text-[#00ADB5] disabled:opacity-30"
                      >
                        <MoveUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(index, "down")}
                        disabled={index === data.sections.length - 1}
                        className="p-1 text-[#EEEEEE]/60 hover:text-[#00ADB5] disabled:opacity-30"
                      >
                        <MoveDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </AdminCardHeader>
                <AdminCardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#EEEEEE]">
                        Section Type
                      </label>
                      <select
                        value={section.type}
                        onChange={(e) =>
                          updateSection(index, "type", e.target.value)
                        }
                        className="w-full rounded-lg border border-[#393E46] bg-[#393E46]/20 px-4 py-2 text-[#EEEEEE] focus:border-[#00ADB5] focus:outline-none"
                      >
                        {SECTION_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(section.type === "center" || section.type === "lines") && (
                      <AdminInput
                        label={section.type === "center" ? "Title (each word on new line)" : "Text (use | for lines, {{img}} for image position)"}
                        value={section.title || ""}
                        onChange={(e) =>
                          updateSection(index, "title", e.target.value)
                        }
                        placeholder={
                          section.type === "center"
                            ? "Your Name"
                            : "Natural {{img}} Garments|Crafted with {{img}} love"
                        }
                      />
                    )}

                    {(section.type === "sides" || section.type === "center-tall") && (
                      <AdminTextarea
                        label="Text Content"
                        value={section.text || ""}
                        onChange={(e) =>
                          updateSection(index, "text", e.target.value)
                        }
                        placeholder="Your text content..."
                        rows={4}
                      />
                    )}

                    {(section.type === "column" ||
                      section.type === "lines" ||
                      section.type === "grid") && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#EEEEEE]">
                          Images (one URL per line)
                          {section.type === "column" && " - 5 images (3rd will be animated)"}
                          {section.type === "lines" && " - leave first line empty for animation, then add images"}
                          {section.type === "grid" && " - 9 images (2nd will be animated)"}
                        </label>
                        <textarea
                          value={section.images.join("\n")}
                          onChange={(e) =>
                            updateSectionImages(index, e.target.value)
                          }
                          rows={section.type === "grid" ? 9 : 5}
                          className="w-full rounded-lg border border-[#393E46] bg-[#393E46]/20 px-4 py-2 text-[#EEEEEE] focus:border-[#00ADB5] focus:outline-none"
                          placeholder={section.type === "lines" ? "(leave first line empty)\nhttps://...\nhttps://..." : "https://images.unsplash.com/..."}
                        />
                      </div>
                    )}
                  </div>
                </AdminCardContent>
              </AdminCard>
            ))}
          </div>
        </div>

        {message && (
          <div
            className={`mt-4 rounded-lg p-4 ${
              message.includes("Error")
                ? "bg-red-500/10 text-red-400"
                : "bg-green-500/10 text-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6">
          <AdminButton type="submit" disabled={loading}>
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Changes"}
          </AdminButton>
        </div>
      </form>
    </AdminShell>
  )
}
