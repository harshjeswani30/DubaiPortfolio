/**
 * Client-side Supabase query functions.
 * These are used by React Query hooks in the admin panel.
 * They use the browser Supabase client (not the server-side one).
 *
 * Golden Rule: UI NEVER reads data directly — always via useQuery(...)
 */

import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

// ─── Projects ───────────────────────────────────────────────────────────────

export async function fetchAdminProjects() {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map((p: any) => ({
        ...p,
        tech_stack: p.tech_stack ?? [],
        images: p.images ?? [],
        challenges: p.challenges ?? [],
        solutions: p.solutions ?? [],
        results: p.results ?? [],
    }))
}

export async function fetchAdminProjectById(id: string) {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function createProject(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("projects").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateProject(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Skills ─────────────────────────────────────────────────────────────────

export async function fetchAdminSkills() {
    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchAdminSkillById(id: string) {
    const { data, error } = await supabase.from("skills").select("*").eq("id", id).single()
    if (error) throw new Error(error.message)
    return data
}

export async function createSkill(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("skills").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateSkill(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("skills")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteSkill(id: string) {
    const { error } = await supabase.from("skills").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Blog Posts ──────────────────────────────────────────────────────────────

export async function fetchAdminBlogPosts() {
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []).map((p: any) => ({ ...p, tags: p.tags ?? [] }))
}

export async function fetchAdminBlogPostById(id: string) {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()
    if (error) throw new Error(error.message)
    return data
}

export async function createBlogPost(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("blog_posts").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateBlogPost(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteBlogPost(id: string) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Services ────────────────────────────────────────────────────────────────

export async function fetchAdminServices() {
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map((s: any) => ({ ...s, skills: s.skills ?? [] }))
}

export async function fetchAdminServiceById(id: string) {
    const { data, error } = await supabase.from("services").select("*").eq("id", id).single()
    if (error) throw new Error(error.message)
    return data
}

export async function createService(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("services").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateService(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteService(id: string) {
    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Experience ──────────────────────────────────────────────────────────────

export async function fetchAdminExperience() {
    const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchAdminExperienceById(id: string) {
    const { data, error } = await supabase.from("experience").select("*").eq("id", id).single()
    if (error) throw new Error(error.message)
    return data
}

export async function createExperience(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("experience").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateExperience(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("experience")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteExperience(id: string) {
    const { error } = await supabase.from("experience").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Education ───────────────────────────────────────────────────────────────

export async function fetchAdminEducation() {
    const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map((e: any) => ({ ...e, highlights: e.highlights ?? [] }))
}

export async function fetchAdminEducationById(id: string) {
    const { data, error } = await supabase.from("education").select("*").eq("id", id).single()
    if (error) throw new Error(error.message)
    return data
}

export async function createEducation(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("education").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateEducation(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("education")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteEducation(id: string) {
    const { error } = await supabase.from("education").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Certifications ──────────────────────────────────────────────────────────

export async function fetchAdminCertifications() {
    const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchAdminCertificationById(id: string) {
    const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("id", id)
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function createCertification(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("certifications").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateCertification(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("certifications")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteCertification(id: string) {
    const { error } = await supabase.from("certifications").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Languages ───────────────────────────────────────────────────────────────

export async function fetchAdminLanguages() {
    const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchAdminLanguageById(id: string) {
    const { data, error } = await supabase.from("languages").select("*").eq("id", id).single()
    if (error) throw new Error(error.message)
    return data
}

export async function createLanguage(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("languages").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateLanguage(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("languages")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteLanguage(id: string) {
    const { error } = await supabase.from("languages").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Messages ────────────────────────────────────────────────────────────────

export async function fetchAdminMessages() {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function updateMessage(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("messages")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteMessage(id: string) {
    const { error } = await supabase.from("messages").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export async function fetchAdminSocialLinks() {
    const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function createSocialLink(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("social_links").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateSocialLink(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("social_links")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteSocialLink(id: string) {
    const { error } = await supabase.from("social_links").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Contact Info ─────────────────────────────────────────────────────────────

export async function fetchAdminContactInfo() {
    const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function createContactInfo(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from("contact_info").insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateContactInfo(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("contact_info")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

export async function deleteContactInfo(id: string) {
    const { error } = await supabase.from("contact_info").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export async function fetchAdminNavigation() {
    const { data, error } = await supabase
        .from("navigation")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function updateNavigationItem(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("navigation")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

// ─── Site Settings ───────────────────────────────────────────────────────────

export async function fetchAdminSiteSettings() {
    const { data, error } = await supabase.from("site_settings").select("*").single()
    if (error) throw new Error(error.message)
    return { ...data, hero_tags: data?.hero_tags ?? [] }
}

export async function updateSiteSettings(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

export async function fetchAdminHeroSection() {
    const { data, error } = await supabase.from("hero_section").select("*").single()
    if (error) throw new Error(error.message)
    return { ...data, rotating_texts: data?.rotating_texts ?? [] }
}

export async function updateHeroSection(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("hero_section")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

export async function fetchAdminCtaSection() {
    const { data, error } = await supabase.from("cta_section").select("*").single()
    if (error) throw new Error(error.message)
    return data
}

export async function updateCtaSection(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase
        .from("cta_section")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export async function fetchDashboardStats() {
    const [
        { count: projects },
        { count: skills },
        { count: posts },
        { count: services },
        { count: unreadMessages },
    ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("is_read", false),
    ])

    return {
        projects: projects ?? 0,
        skills: skills ?? 0,
        posts: posts ?? 0,
        services: services ?? 0,
        unreadMessages: unreadMessages ?? 0,
    }
}

export async function fetchDashboardRecentMessages() {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5)
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchDashboardRecentProjects() {
    const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, is_published, created_at")
        .order("created_at", { ascending: false })
        .limit(5)
    if (error) throw new Error(error.message)
    return data ?? []
}

// ─── Public Fetch Functions (browser client, for React Query cache) ────────────
// These are the client-side equivalents of lib/data.ts functions.
// They only return active/published records for the public portfolio.

export async function fetchPublicProjects() {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map((p: any) => ({
        ...p,
        tech_stack: p.tech_stack ?? [],
        images: p.images ?? [],
        challenges: p.challenges ?? [],
        solutions: p.solutions ?? [],
        results: p.results ?? [],
    }))
}

export async function fetchPublicSkills() {
    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchPublicBlogPosts() {
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []).map((p: any) => ({ ...p, tags: p.tags ?? [] }))
}

export async function fetchPublicServices() {
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map((s: any) => ({ ...s, skills: s.skills ?? [] }))
}

export async function fetchPublicExperience() {
    const { data, error } = await supabase
        .from("experience")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchPublicEducation() {
    const { data, error } = await supabase
        .from("education")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map((e: any) => ({ ...e, highlights: e.highlights ?? [] }))
}

export async function fetchPublicCertifications() {
    const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchPublicLanguages() {
    const { data, error } = await supabase
        .from("languages")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchPublicSocialLinks() {
    const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchPublicSiteSettings() {
    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single()
    if (error) throw new Error(error.message)
    return { ...data, hero_tags: data?.hero_tags ?? [] }
}

export async function fetchPublicContactInfo() {
    const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .order("display_order", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
}
