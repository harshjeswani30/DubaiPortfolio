"use client"

import { useQueries } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import {
    fetchPublicProjects,
    fetchPublicSkills,
    fetchPublicBlogPosts,
    fetchPublicServices,
    fetchPublicExperience,
    fetchPublicEducation,
    fetchPublicCertifications,
    fetchPublicLanguages,
    fetchPublicSocialLinks,
    fetchPublicSiteSettings,
    fetchPublicContactInfo,
} from "@/lib/supabase-queries"

/**
 * GlobalPrefetcher — mounts invisibly in the root layout.
 * Fires all public portfolio queries in parallel on the very first page load.
 * Results are stored in React Query's in-memory cache AND persisted to
 * localStorage via PersistQueryClientProvider.
 *
 * Effect: navigating to any page after the first is instant — the page's
 * client components read data from localStorage before any network request.
 */
export function GlobalPrefetcher() {
    useQueries({
        queries: [
            {
                queryKey: queryKeys.public.projects(),
                queryFn: fetchPublicProjects,
                staleTime: 5 * 60 * 1000, // 5 min
            },
            {
                queryKey: queryKeys.public.skills(),
                queryFn: fetchPublicSkills,
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: queryKeys.public.blog(),
                queryFn: fetchPublicBlogPosts,
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: queryKeys.public.services(),
                queryFn: fetchPublicServices,
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: queryKeys.public.experience(),
                queryFn: fetchPublicExperience,
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: queryKeys.public.education(),
                queryFn: fetchPublicEducation,
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: queryKeys.public.certifications(),
                queryFn: fetchPublicCertifications,
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: queryKeys.public.languages(),
                queryFn: fetchPublicLanguages,
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: queryKeys.public.socialLinks(),
                queryFn: fetchPublicSocialLinks,
                staleTime: 5 * 60 * 1000,
            },
            {
                queryKey: queryKeys.public.siteSettings(),
                queryFn: fetchPublicSiteSettings,
                staleTime: 10 * 60 * 1000, // 10 min — settings change rarely
            },
            {
                queryKey: queryKeys.public.contactInfo(),
                queryFn: fetchPublicContactInfo,
                staleTime: 10 * 60 * 1000,
            },
        ],
    })

    // Renders nothing — purely a side-effect component
    return null
}
