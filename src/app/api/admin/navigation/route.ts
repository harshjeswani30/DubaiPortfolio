import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("navigation_menu")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createAdminClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("navigation_menu")
    .insert({
      label: body.label,
      href: body.href,
      display_order: body.display_order || 0,
      is_active: body.is_active !== undefined ? body.is_active : true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
