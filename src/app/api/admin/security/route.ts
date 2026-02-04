import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("admin_credentials")
      .select("email")
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, currentPassword, newPassword } = body

    const supabase = await createClient()
    
    // Get current credentials
    const { data: credentials, error: fetchError } = await supabase
      .from("admin_credentials")
      .select("*")
      .single()

    if (fetchError || !credentials) {
      return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 })
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, credentials.password_hash)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (email && email !== credentials.email) {
      updateData.email = email
    }

    if (newPassword) {
      const saltRounds = 10
      updateData.password_hash = await bcrypt.hash(newPassword, saltRounds)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No changes to update" }, { status: 400 })
    }

    updateData.updated_at = new Date().toISOString()

    // Update credentials
    const { data, error: updateError } = await supabase
      .from("admin_credentials")
      .update(updateData)
      .eq("id", credentials.id)
      .select("email")
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Failed to update credentials" }, { status: 500 })
    }

    return NextResponse.json({ data, message: "Credentials updated successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
