import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { calculateReadingTime, slugify } from "@/lib/utils"

export async function GET() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data || [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createAdminClient()
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const slug = body.slug || slugify(body.title || "")
  const reading_time = body.reading_time || calculateReadingTime(body.content || "")

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...body, slug, reading_time })
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}

