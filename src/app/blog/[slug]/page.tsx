import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogPostBySlug } from "@/lib/data"
import { BlogPostContent } from "./blog-post-content"

export const revalidate = 0

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()
  return <BlogPostContent post={post} />
}
