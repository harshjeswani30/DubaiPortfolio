import { Metadata } from "next"
import { getBlogPosts, getFeaturedBlogPosts } from "@/lib/data"
import { BlogContent } from "./blog-content"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights about web development and technology.",
}

export const revalidate = 0

export default async function BlogPage() {
  const [posts, featuredPosts] = await Promise.all([
    getBlogPosts(),
    getFeaturedBlogPosts(),
  ])
  return <BlogContent posts={posts} featuredPosts={featuredPosts} />
}
