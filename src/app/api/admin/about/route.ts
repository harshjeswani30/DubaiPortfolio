import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from("about_content")
      .select("*")
      .single()

    if (error && error.code !== "PGRST116") throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching about:", error)
    return NextResponse.json({ error: "Failed to fetch about" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createAdminClient()

    const { data: existing } = await supabase
      .from("about_content")
      .select("id")
      .single()

    let result
    if (existing) {
      result = await supabase
        .from("about_content")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from("about_content")
        .insert(body)
        .select()
        .single()
    }

    if (result.error) throw result.error
    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error updating about:", error)
    return NextResponse.json({ error: "Failed to update about" }, { status: 500 })
  }
}
