import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("contact_page")
      .select("*")
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching contact page settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact page settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: existing } = await supabase
      .from("contact_page")
      .select("id")
      .single()

    const updateData = {
      sidebar_title: body.sidebar_title,
      sidebar_description: body.sidebar_description,
      form_title: body.form_title,
      form_description: body.form_description,
      availability_text: body.availability_text,
      availability_subtext: body.availability_subtext,
      response_times: body.response_times,
      success_title: body.success_title,
      success_message: body.success_message,
      show_response_times: body.show_response_times,
      updated_at: new Date().toISOString(),
    }

    let result
    if (existing?.id) {
      result = await supabase
        .from("contact_page")
        .update(updateData)
        .eq("id", existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from("contact_page")
        .insert(updateData)
        .select()
        .single()
    }

    if (result.error) throw result.error

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error("Error updating contact page settings:", error)
    return NextResponse.json(
      { error: "Failed to update contact page settings" },
      { status: 500 }
    )
  }
}
