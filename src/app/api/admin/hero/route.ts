import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from("hero_section")
      .select("*")
      .eq("is_active", true)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching hero:", error)
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 })
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
      .from("hero_section")
      .select("id")
      .eq("is_active", true)
      .single()

    let result
    if (existing) {
      result = await supabase
        .from("hero_section")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from("hero_section")
        .insert(body)
        .select()
        .single()
    }

    if (result.error) throw result.error
    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error updating hero:", error)
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 })
  }
}
