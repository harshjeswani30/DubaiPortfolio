import { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/server"
import { BlogContent } from "./blog-content"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights about web development and technology.",
}

async function getBlogPosts() {
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogContent posts={posts} />
}
