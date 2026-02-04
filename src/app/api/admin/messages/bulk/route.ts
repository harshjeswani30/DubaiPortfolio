import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ids } = body

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    if (action === "delete") {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .in("id", ids)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: `${ids.length} message${ids.length > 1 ? 's' : ''} deleted successfully` 
      })
    }

    if (action === "mark_read") {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ is_read: true })
        .in("id", ids)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: `${ids.length} message${ids.length > 1 ? 's' : ''} marked as read` 
      })
    }

    if (action === "mark_unread") {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ is_read: false })
        .in("id", ids)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: `${ids.length} message${ids.length > 1 ? 's' : ''} marked as unread` 
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Bulk action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
