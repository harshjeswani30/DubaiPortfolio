import { NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const email = body?.email
    const password = body?.password

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get admin credentials from database
    const { data: credentials, error } = await supabase
      .from("admin_credentials")
      .select("*")
      .single()

    if (error || !credentials) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check email and password
    if (email.toLowerCase() !== credentials.email.toLowerCase()) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, credentials.password_hash)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await createSession("admin")
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

