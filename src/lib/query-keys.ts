/**
 * Centralized query key factory.
 * Never hard-code query keys inline — always use this factory.
 * This ensures consistent invalidation after mutations.
 */
export const queryKeys = {
    projects: {
        all: ["projects"] as const,
        list: () => ["projects", "list"] as const,
        detail: (id: string) => ["projects", "detail", id] as const,
    },
    skills: {
        all: ["skills"] as const,
        list: () => ["skills", "list"] as const,
    },
    blog: {
        all: ["blog"] as const,
        list: () => ["blog", "list"] as const,
        detail: (id: string) => ["blog", "detail", id] as const,
    },
    services: {
        all: ["services"] as const,
        list: () => ["services", "list"] as const,
    },
    experience: {
        all: ["experience"] as const,
        list: () => ["experience", "list"] as const,
    },
    education: {
        all: ["education"] as const,
        list: () => ["education", "list"] as const,
    },
    certifications: {
        all: ["certifications"] as const,
        list: () => ["certifications", "list"] as const,
    },
    languages: {
        all: ["languages"] as const,
        list: () => ["languages", "list"] as const,
    },
    messages: {
        all: ["messages"] as const,
        list: () => ["messages", "list"] as const,
    },
    socialLinks: {
        all: ["social-links"] as const,
        list: () => ["social-links", "list"] as const,
    },
    siteSettings: {
        all: ["site-settings"] as const,
        detail: () => ["site-settings", "detail"] as const,
    },
    dashboard: {
        all: ["dashboard"] as const,
        stats: () => ["dashboard", "stats"] as const,
        recentMessages: () => ["dashboard", "recent-messages"] as const,
        recentProjects: () => ["dashboard", "recent-projects"] as const,
    },
    heroSection: {
        all: ["hero-section"] as const,
        detail: () => ["hero-section", "detail"] as const,
    },
    ctaSection: {
        all: ["cta-section"] as const,
        detail: () => ["cta-section", "detail"] as const,
    },
    contactInfo: {
        all: ["contact-info"] as const,
        list: () => ["contact-info", "list"] as const,
    },
    navigation: {
        all: ["navigation"] as const,
        list: () => ["navigation", "list"] as const,
    },
    aboutPage: {
        all: ["about-page"] as const,
        detail: () => ["about-page", "detail"] as const,
    },
    // Public-facing queries — separate from admin queries so they cache independently
    public: {
        projects: () => ["public", "projects"] as const,
        skills: () => ["public", "skills"] as const,
        blog: () => ["public", "blog"] as const,
        services: () => ["public", "services"] as const,
        experience: () => ["public", "experience"] as const,
        education: () => ["public", "education"] as const,
        certifications: () => ["public", "certifications"] as const,
        languages: () => ["public", "languages"] as const,
        socialLinks: () => ["public", "social-links"] as const,
        siteSettings: () => ["public", "site-settings"] as const,
        contactInfo: () => ["public", "contact-info"] as const,
    },
}
