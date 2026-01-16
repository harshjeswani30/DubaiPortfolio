import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import { BlogPostContent } from "./blog-post-content"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()
  return <BlogPostContent post={post} />
}
